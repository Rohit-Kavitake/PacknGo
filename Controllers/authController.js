const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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
