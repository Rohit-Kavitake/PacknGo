

exports.getTours = (req, res) => {
    // console.log(req.body);
    res.status(200).json({
        status: 'success',
        results: 0,
        data: null,
    });
};

exports.createTour = (req, res) => {};

exports.getTour = (req, res) => {
    console.log(req.params);
};

exports.updatetour = (req, res) => {
    console.log(req.params.id);
    res.status(200).json({
        status: 'Success',
        message: 'patched',
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        message: 'Tour Deleted',
    });
};