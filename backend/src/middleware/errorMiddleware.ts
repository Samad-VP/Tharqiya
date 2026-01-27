import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

const handlePrismaError = (err: any) => {
    // Prisma common errors
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field';
        return new AppError(`Duplicate value for ${field}. Please use another value.`, 400);
    }
    if (err.code === 'P2025') {
        return new AppError('Record not found', 404);
    }
    return err;
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;

    // Handle Prisma specific errors
    if (err.name === 'PrismaClientKnownRequestError') {
        error = handlePrismaError(err);
    }

    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stack: err.stack,
            error: err
        });
    } else {
        // Production: Don't leak internals
        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message
            });
        } else {
            console.error('ERROR 💥', err);
            // DEBUG: Temporarily exposing error details in production to solve the 500 error
            res.status(500).json({
                status: 'error',
                message: err.message || 'Something went very wrong!',
                error: err,
                stack: err.stack
            });
        }
    }
};
