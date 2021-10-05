const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt,
            role: req.body.role,
        });

        createSendToken(user, 200, res);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Invalid Data or User Already Exists',
            err: err,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Please Provide email and password');
        return next();
    }

    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        console.log('inccorrect password or email');
        return res
            .status(400)
            .json({ message: 'invalid password or email', status: 'Fail' });
    }

    createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        // console.log(token);
    }
    if (!token) {
        return res.status(401).json({
            status: 'failed',
            message: 'you are unauthorizeed',
        });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({
            status: 'failed',
            message: 'User Doesnt Exist',
        });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
            status: 'failed',
            message: 'User Changed the password recently. Please Login Again!',
        });
    }

    //Grant Access
    req.user = currentUser;
    console.log(req.user);
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles))
            return res.status(403).json({
                status: 'Forbidden',
                message: 'Access denied',
            });
        next();
    };
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(404).json({
            status: 'Fail',
            message: 'User not Found',
        });

    const resetToken = await user.createPasswordResetToken();
    // console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/user/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Submit a Patch request with updated Password at : ${resetUrl}.\n If you haven't Submitted Reset Password Request Please Ignore this mail. `;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Reset password Link (valid for 10mins)',
            message,
        });

        res.status(200).json({
            message:
                'Your reset password token has been sent to email (token valid for 10 mins)',
            status: 'success',
        });
    } catch (err) {
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res
            .status(500)
            .json({ message: 'There was error sending the mail', status: 'Fail' });
    }
};

exports.resetPassword = async (req, res, next) => {
    const HashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: HashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            status: 'fail',
            message: 'Token Expired or Invalid Token',
        });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    createSendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id }).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        console.log('inccorrect password or email');
        return res
            .status(400)
            .json({ message: 'invalid password or email', status: 'Fail' });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
};
