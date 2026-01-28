import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';

// @desc    Approve final results (Super Admin only)
// @route   POST /api/results/approve
// @access  Private (Super Admin)
export const approveResult = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { studentId, decision } = req.body;

    const evaluations = await prisma.evaluation.findMany({
        where: {
            interview: {
                application: {
                    studentId: studentId
                }
            }
        }
    });

    const totalMarks = evaluations.reduce((sum, e) => sum + e.marks, 0);
    const averageMarks = totalMarks / (evaluations.length || 1);

    const result = await prisma.result.upsert({
        where: { studentId },
        update: { totalMarks, averageMarks, decision, generatedAt: new Date() },
        create: {
            studentId,
            totalMarks,
            averageMarks,
            decision,
        }
    });

    res.status(200).json({
        status: 'success',
        data: result
    });
});

// @desc    Publish final results and trigger notifications (Admin only)
// @route   POST /api/results/publish
// @access  Private (Admin/Super Admin)
export const publishResult = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { studentId } = req.body;

    const result = await prisma.result.findUnique({
        where: { studentId }
    });

    if (!result) {
        return next(new AppError('Result not found. Please approve it first.', 404));
    }

    // Update Student Status based on approved decision
    await prisma.student.update({
        where: { id: studentId },
        data: { status: result.decision === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED' }
    });

    // Send Notification
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { user: true }
    });

    if (student && student.userId && student.user) {
        // 1. Trigger Marks Published notification
        await triggerNotification(student.userId, 'INTERVIEW_MARKS_PUBLISHED', {
            StudentName: student.user.name,
            TotalMarks: result.totalMarks.toString()
        });

        // 2. Trigger Allotment Result if Accepted
        if (result.decision === 'ACCEPTED') {
            await triggerNotification(student.userId, 'ALLOTMENT_RESULT', {
                StudentName: student.user.name,
                CampusName: student.firstOption || 'Main Campus'
            });
        }
    }

    res.status(200).json({
        status: 'success',
        message: 'Result published successfully'
    });
});
