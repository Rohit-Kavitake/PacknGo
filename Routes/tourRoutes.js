const express = require('express');
const tourController = require('./../Controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkId);

router
    .route('/')
    .get(tourController.getTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updatetour)
    .delete(tourController.deleteTour);

module.exports = router;
