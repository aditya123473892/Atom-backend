const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack,
        });
    } else {
        res.status(err.statusCode).json({
            success: false,
            error: {
                statusCode: err.statusCode,
                message: err.message,
            },
        });
    }
};

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    // Remove the unused variable if not needed
    // let error = { ...err }

    err.message = err.message;

    // wrong mongoose object id error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // handling mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message);
        err = new ErrorHandler(message, 400);
    }
}
