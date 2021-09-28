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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        trim: true,
        minlength: 8,
        select: false,
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
    passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
    //run only if pass is modified
    if (!this.isModified('password')) return next();
    console.log('Pass Check');

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
