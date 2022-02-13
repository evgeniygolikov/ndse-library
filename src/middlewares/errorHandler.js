const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
    }

    res.status(err.code).json({
        message: err.message,
    });
};

module.exports = errorHandler;
