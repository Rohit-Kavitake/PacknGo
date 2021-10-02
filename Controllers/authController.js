const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
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

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'Success',
            token: token,
            data: {
                user: newUser,
            },
        });
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
        return next();
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: token,
    });
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

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Submit a Patch request with updated Password at : ${resetUrl}.\n If you haven't Submitted Reset Password Request Please Ignore this mail. `;
};

exports.resetPassword = (req, res, next) => {
    return next();
};
