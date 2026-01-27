import { Request, Response, NextFunction } from 'express';
import { createStudentAccount } from '../services/studentService.js';
import { triggerNotification } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const submitPublicApplication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone } = req.body;

    if (!name || !phone) {
        return next(new AppError('Please provide name and phone number', 400));
    }

    const result = await createStudentAccount(req.body);
    
    const { user, student, tempPassword } = result;

    // Send Notifications
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    
    await triggerNotification(user.id, 'ADMISSION_CONFIRMED', {
        StudentName: name,
        Username: user.username || undefined,
        TempPassword: tempPassword,
        LoginUrl: loginUrl
    });

    res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully. Credentials sent to your mobile and email.',
        applicationNo: student.applicationNo,
        username: user.username
    });
});
