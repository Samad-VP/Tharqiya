import { Request, Response, NextFunction } from 'express';
import { createPendingApplication } from '../services/studentService.js';
import { triggerNotification } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const submitPublicApplication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone } = req.body;

    if (!name || !phone) {
        return next(new AppError('Please provide name and phone number', 400));
    }

    const result = await createPendingApplication(req.body);
    
    const { student } = result;

    res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully. Our team will review your application and send login details via WhatsApp/Email upon approval.',
        applicationNo: student.applicationNo
    });
});
