exports.getUsers = (req, res) => {
    // console.log(req.body);
    res.status(200).json({
        status: 'success',
        results: 0,
        data: null,
    });
};

exports.createUser = (req, res) => {};

exports.getUser = (req, res) => {
    // console.log(req.params);
};

exports.updateUser = (req, res) => {
    // console.log(req.params.id);
    res.status(200).json({
        status: 'Success',
        message: 'patched',
    });
};

exports.deleteUser = (req, res) => {
    res.status(204).json({
        message: 'Tour Deleted',
    });
};
