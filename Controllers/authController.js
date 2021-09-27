const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

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
        console.log('inccorrect password');
        return next();
    }

    res.status(200).json({
        status: 'success',
        token: token,
    });
};
