const User = require('./../models/userModel');

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'Success',
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
