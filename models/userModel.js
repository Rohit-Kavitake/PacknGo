const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User must have a Name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Every user must have E-mail'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide A Valid Email'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        trim: true,
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password Required'],
        trim: true,
        minlength: 8,
        //This only works on Save and Create
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not Same',
        },
    },
});

userSchema.pre('save', async function (next) {
    //run only if pass is modified
    if (!this.isModified('password')) return next();
    console.log('Pass Check');

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
