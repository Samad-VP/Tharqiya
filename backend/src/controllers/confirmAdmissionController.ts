import { Response } from 'express';
import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Confirm admission after allotment
// @route   POST /api/admissions/confirm
// @access  Private (Student only)
export const confirmAdmission = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { 
            application: { 
                include: { allotment: true } 
            } 
        }
    });

    if (!student || !student.application) {
        throw new AppError('Application not found', 404);
    }

    if (!['ALLOTTED', 'ADMISSION_AUTHORIZED', 'ALLOTMENT_READY'].includes(student.application.status)) {
        throw new AppError('No active allotment found to confirm', 400);
    }

    // Update application status to ACCEPTED (Final Admission)
    await prisma.application.update({
        where: { id: student.application.id },
        data: { status: 'ACCEPTED' }
    });

    // Update student overall status
    await prisma.student.update({
        where: { id: student.id },
        data: { status: 'ACCEPTED' }
    });

    // Trigger Final Credentials Notification
    await triggerNotification(req.user.id, 'ADMISSION_CONFIRMED', {
        StudentName: req.user.name,
        CampusName: student.application.allotment?.campus || 'Darussalam',
        Username: req.user.email,
        TempPassword: 'Check your initial registration email or use "Forgot Password"'
    });

    res.json({
        status: 'success',
        message: 'Admission confirmed successfully. Welcome to Darussalam!'
    });
});
