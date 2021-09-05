const Tour = require('./../models/tourModel');
const mongoose = require('mongoose');

// exports.checkId = (req, res, next, val) => {
//     //to be changed when mongodb added
//     if (val > 0)
//         return res.status(404).json({
//             status: 'Failed',
//             message: 'Invalid Id',
//         });
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if (!(req.body.name && req.body.price))
//         return res.status(400).json({
//             status: 'Failed',
//             message: 'Name or Price Not defined while Creating a Tour',
//         });
//     next();
// };

exports.getTours = async (req, res) => {
    // console.log(req.body);
    try {
        const TourData = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: TourData.length,
            data: TourData,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'Failed',
            message: 'Invalid Data Sent!',
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        // console.log(req.body);
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        // console.log(err);
        res.status(400).json({
            status: 'Failed',
            message: err,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(201).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: 'Invalid Data Sent!',
        });
    }
};

exports.updatetour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: 'Tour Deleted',
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err,
        });
    }
};
