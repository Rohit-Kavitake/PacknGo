const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = Obj[el];
    });
    return newObj;
};

exports.getUsers = (req, res) => {
    // console.log(req.body);
    res.status(200).json({
        status: 'success',
        results: 0,
        data: null,
    });
};

exports.updateMe = async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
            message: 'This route is not for password Update',
            status: 'Fail',
        });
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updateduser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        validate: true,
        new: true,
    });

    res.status(200).json({
        status: 'Success',
        user: updateduser,
    });
};

exports.deleteUser = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        message: 'User Deleted',
    });
};
