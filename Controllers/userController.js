exports.getUsers = (req, res) => {
    // console.log(req.body);
    res.status(200).json({
        status: 'success',
        results: 0,
        data: null,
    });
};



exports.deleteUser = (req, res) => {
    res.status(204).json({
        message: 'Tour Deleted',
    });
};
