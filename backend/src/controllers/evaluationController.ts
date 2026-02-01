import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';

// @desc    Submit evaluation for a subject
// @route   POST /api/evaluations/submit
// @access  Private (Interviewer only)
export const submitEvaluation = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { interviewId, subject, marks, remarks } = req.body;

    const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
        include: { interviewer: true }
    });

    if (!interview) {
        return next(new AppError('Interview not found', 404));
    }

    // Only the assigned interviewer or Super Admin can submit
    if (interview.interviewer.userId !== req.user?.id && req.user?.role !== 'SUPER_ADMIN') {
        return next(new AppError('Not authorized to evaluate this interview', 403));
    }

    // Check if evaluation for this subject already exists
    const existingEvaluation = await prisma.evaluation.findFirst({
        where: {
            interviewId,
            subject
        }
    });

    let evaluation;
    if (existingEvaluation) {
        evaluation = await prisma.evaluation.update({
            where: { id: existingEvaluation.id },
            data: {
                marks: parseInt(marks),
                remarks
            }
        });
    } else {
        evaluation = await prisma.evaluation.create({
            data: {
                interviewId,
                subject,
                marks: parseInt(marks),
                remarks,
            },
        });
    }

    // Check if all subjects (Hifz, English, General) are evaluated
    const allEvaluations = await prisma.evaluation.findMany({
        where: { interviewId }
    });
    
    // Count unique subjects
    const uniqueSubjects = new Set(allEvaluations.map(e => e.subject));

    if (uniqueSubjects.has('Hifz') && uniqueSubjects.has('English') && uniqueSubjects.has('General')) {
        await prisma.application.update({
            where: { id: interview.applicationId },
            data: { status: 'EVALUATED' }
        });

        // Trigger Notification
        const student = await prisma.student.findFirst({
            where: { application: { id: interview.applicationId } },
            include: { user: true }
        });
        
        if (student && student.userId && student.user) {
            await triggerNotification(student.userId, 'INTERVIEW_ATTENDED', {
                StudentName: student.user.name
            });
        }
    }

    res.status(201).json({
        status: 'success',
        data: evaluation
    });
});
