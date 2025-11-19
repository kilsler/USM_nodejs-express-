import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {

    const isOperational = err.isOperational !== false;
    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500
            ? 'Internal Server Error'
            : err.message || 'Error';

    logger.error("Request failed", {
        message: err.message,
        statusCode,
        stack: err.stack,
        isOperational,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        userId: req.user?.id || null,
        validationErrors: err.errors || null,
        errorType: err.constructor.name,
    });

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
    }

    console.error('Error :', err);


    res.status(statusCode).json({
        status: "error",
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;