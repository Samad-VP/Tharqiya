import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';

// @desc    Schedule an interview
// @route   POST /api/interviews/schedule
// @access  Private (Admin only)
export const scheduleInterview = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId, interviewerId, scheduledAt, location } = req.body;

    console.log('Attempting to schedule interview:', { applicationId, interviewerId, scheduledAt, location });

    if (!applicationId || !interviewerId || !scheduledAt) {
        throw new AppError('Application ID, Interviewer ID, and Schedule Time are required', 400);
    }

    try {
        const interview = await prisma.interview.create({
            data: {
                applicationId,
                interviewerId,
                scheduledAt: new Date(scheduledAt),
                location: location || 'Darussalam Tharqiya College',
            },
        });

        // Update application status
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: 'INTERVIEW_SCHEDULED' },
        });

        res.status(201).json({
            status: 'success',
            data: interview
        });
    } catch (error: any) {
        console.error('Prisma Error in scheduleInterview:', error);
        if (error.code === 'P2002') {
            throw new AppError('This student already has an interview scheduled', 400);
        }
        if (error.code === 'P2003') {
            throw new AppError('Invalid Application or Interviewer ID', 400);
        }
        throw error;
    }
});

// @desc    Get assigned interviews for an interviewer
// @route   GET /api/interviews/assigned
// @access  Private (Interviewer only)
export const getAssignedInterviews = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('User not found in request', 401));
    }

    const interviewer = await prisma.interviewer.findUnique({
        where: { userId: req.user.id }
    });

    if (!interviewer) {
        return next(new AppError('Interviewer profile not found', 404));
    }

    const interviews = await prisma.interview.findMany({
        where: { interviewerId: interviewer.id },
        include: {
            application: {
                include: {
                    student: {
                        include: {
                            user: { select: { name: true } }
                        }
                    }
                }
            },
            evaluations: true
        }
    });

    res.json({
        status: 'success',
        results: interviews.length,
        data: interviews
    });
});
// @desc    Get all interviews (Admin only)
// @route   GET /api/interviews/all
// @access  Private (Admin only)
export const getAllInterviews = asyncHandler(async (_req: Request, res: Response) => {
    const interviews = await prisma.interview.findMany({
        include: {
            application: {
                include: {
                    student: {
                        include: {
                            user: { select: { name: true } }
                        }
                    }
                }
            },
            interviewer: {
                include: {
                    user: { select: { name: true } }
                }
            }
        },
        orderBy: { scheduledAt: 'asc' }
    });

    res.json({
        status: 'success',
        results: interviews.length,
        data: interviews
    });
});

// @desc    Batch schedule interviews
// @route   POST /api/interviews/batch-schedule
// @access  Private (Admin only)
export const batchScheduleInterviews = asyncHandler(async (req: Request, res: Response) => {
    const { applicationIds, interviewerId, scheduledAt, location } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds)) {
        throw new AppError('Application IDs must be an array', 400);
    }

    const scheduledDate = new Date(scheduledAt);
    const interviewer = await prisma.interviewer.findUnique({
        where: { id: interviewerId },
        include: { user: { select: { name: true } } }
    });

    if (!interviewer) {
        throw new AppError('Interviewer not found', 404);
    }

    const results = await Promise.all(applicationIds.map(async (appId) => {
        try {
            // Create interview
            const interview = await prisma.interview.create({
                data: {
                    applicationId: appId,
                    interviewerId,
                    scheduledAt: scheduledDate,
                    location: location || 'Darussalam Edu Village',
                },
            });

            // Update application status
            const application = await prisma.application.update({
                where: { id: appId },
                data: { status: 'INTERVIEW_SCHEDULED' },
                include: { student: { include: { user: true } } }
            });

            // Trigger Professional Notifications (Optional)
            if (req.body.sendNotifications && application.student.userId && application.student.user) {
                await triggerNotification(application.student.userId, 'INTERVIEW_SCHEDULED', {
                    StudentName: application.student.user.name,
                    InterviewDate: scheduledDate.toLocaleDateString(),
                    InterviewTime: scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    Location: location || 'Darussalam Edu Village'
                });
            }

            return { appId, status: 'success', interviewId: interview.id };
        } catch (error: any) {
            return { appId, status: 'error', message: error.message };
        }
    }));

    res.json({
        status: 'success',
        data: results
    });
});

// @desc    Update an interview (Reschedule)
// @route   PATCH /api/interviews/:id
// @access  Private (Admin only)
export const updateInterview = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { interviewerId, scheduledAt, location, sendNotifications, rescheduleReason } = req.body;

    const scheduledDate = new Date(scheduledAt);
    
    // 1. Update the interview record
    const interview = await prisma.interview.update({
        where: { id },
        data: {
            interviewerId,
            scheduledAt: scheduledDate,
            location: location || 'Darussalam Edu Village',
        }
    });

    // 2. Trigger Professional Notifications if requested
    if (sendNotifications) {
        // Fetch full details with relations for notification
        const interviewWithDetails = await prisma.interview.findUnique({
            where: { id },
            include: {
                application: { include: { student: { include: { user: true } } } },
                interviewer: { include: { user: { select: { name: true } } } }
            }
        });

        if (interviewWithDetails && interviewWithDetails.application.student.userId && interviewWithDetails.application.student.user) {
            await triggerNotification(interviewWithDetails.application.student.userId, 'INTERVIEW_RESCHEDULED', {
                StudentName: interviewWithDetails.application.student.user.name,
                InterviewDate: scheduledDate.toLocaleDateString(),
                InterviewTime: scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                Location: location || 'Darussalam Edu Village',
                RescheduleReason: rescheduleReason
            });
        }
    }

    res.json({
        status: 'success',
        data: interview
    });
});
// @desc    Get interviewer's own profile
// @route   GET /api/interviews/me
// @access  Private (Interviewer only)
export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const interviewer = await prisma.interviewer.findUnique({
        where: { userId: req.user.id },
        include: { user: { select: { name: true, email: true, phone: true } } }
    });

    if (!interviewer) return next(new AppError('Interviewer profile not found', 404));

    res.json({
        status: 'success',
        data: interviewer
    });
});

// @desc    Update interviewer's own profile
// @route   PATCH /api/interviews/me
// @access  Private (Interviewer only)
export const updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const { speciality, phone, name } = req.body;

    const interviewer = await prisma.interviewer.findUnique({
        where: { userId: req.user.id }
    });

    if (!interviewer) return next(new AppError('Interviewer profile not found', 404));

    // Update Interviewer details
    const updatedInterviewer = await prisma.interviewer.update({
        where: { id: interviewer.id },
        data: { speciality }
    });

    // Update User details
    await prisma.user.update({
        where: { id: req.user.id },
        data: { 
            phone,
            name // Allow name update too
        }
    });

    res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
            ...updatedInterviewer,
            user: { ...req.user, phone, name }
        }
    });
});
