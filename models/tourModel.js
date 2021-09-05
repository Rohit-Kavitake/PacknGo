const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'A Tour Must Have A Name'],
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price'],
    },
    duration: {
        type: Number,
        required: [true, 'A Tour must have a Duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a Group Size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a Difficulty'],
    },
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'A Tour must have Description'],
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default : Date.now()
    },
    startDates : [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
