exports.checkId = (req, res, next, val) => {
    //to be changed when mongodb added
    if (val > 0)
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid Id',
        });
    next();
};

exports.checkBody = (req, res, next) => {
    if (!(req.body.name && req.body.price))
        return res.status(400).json({
            status: 'Failed',
            message: 'Name or Price Not defined while Creating a Tour',
        });
    next();
};

exports.getTours = (req, res) => {
    // console.log(req.body);
    res.status(200).json({
        status: 'success',
        results: 0,
        data: null,
    });
};

exports.createTour = (req, res) => {};

exports.getTour = (req, res) => {};

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
