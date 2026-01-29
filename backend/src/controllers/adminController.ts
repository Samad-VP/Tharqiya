import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail, sendWhatsApp } from '../services/notificationService.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin/Super Admin only)
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // 1. Total Applications
    const totalApplications = await prisma.application.count();

    // 2. Pending Review
    const pendingReview = await prisma.application.count({
        where: { status: 'PENDING' }
    });

    // 3. Interviews Scheduled
    const interviewsScheduled = await prisma.interview.count();

    // 4. Average Score (from Evaluations)
    const aggregateScore = await prisma.evaluation.aggregate({
        _avg: {
            marks: true
        }
    });
    const averageScore = aggregateScore._avg.marks ? (aggregateScore._avg.marks / 10).toFixed(1) : '0.0';

    // 5. Recent Activities (Latest 5 Applications)
    const recentApplications = await prisma.application.findMany({
        take: 5,
        orderBy: {
            appliedAt: 'desc'
        },
        include: {
            student: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        }
    });

    const recentActivities = recentApplications.map(app => ({
        type: 'APPLICATION_RECEIVED',
        title: 'New application received',
        subtitle: `Student: ${app.student.user?.name || app.student.name} • ID: ${app.student.applicationNo}`,
        timestamp: app.appliedAt
    }));

    // 6. Application Trends (Groups by day for last 7 days as a starting point)
    // For simplicity, we'll return some static labels for now until we implement real time-series aggregation if needed
    const stats = {
        totalApplications,
        pendingReview,
        interviewsScheduled,
        averageScore,
        recentActivities
    };

    res.status(200).json({
        status: 'success',
        data: stats
    });
});

// @desc    Get notification logs
// @route   GET /api/admin/notifications
// @access  Private (Admin/Super Admin only)
export const getNotificationLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.query;
    
    const where: any = {};
    if (userId) {
        where.userId = userId as string;
    }

    const logs = await prisma.notification.findMany({
        where,
        orderBy: {
            sentAt: 'desc'
        },
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        take: 100 // Limit to last 100 logs
    });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: logs
    });
});

// @desc    Retry a failed notification
// @route   POST /api/admin/notifications/:id/retry
// @access  Private (Admin/Super Admin only)
export const retryNotification = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const adminId = req.user?.id;

    const notification = await prisma.notification.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!notification) {
        return next(new AppError('Notification log not found', 404));
    }

    // Security Rule: Credential emails can only be retried if they haven't been successfully sent/retried before
    // Wait, the requirement says "Sent only once. If failed, allow ONE manual retry. After that, use password reset flow."
    // This implies we should check if THIS specific log has already been retried, or check if any success exists?
    // "Capture triggered automatically or manually" -> logNotification handles this.
    
    if (notification.event === 'APPLICATION_CREDENTIALS_CREATED') {
        // Find if any SUCCESSFUL credential email exists for this user
        const successExists = await prisma.notification.findFirst({
            where: {
                userId: notification.userId,
                event: 'APPLICATION_CREDENTIALS_CREATED',
                status: 'SENT'
            }
        });

        if (successExists && notification.status !== 'SENT') {
            return next(new AppError('Credential email has already been successfully delivered. Use password reset for security.', 400));
        }

        // If this specific log was already retried manually, prevent further retries
        if (notification.triggeredBy === 'ADMIN' && notification.status === 'FAILED') {
             return next(new AppError('Manual retry limit reached for credentials. Please use the password reset flow.', 400));
        }
    }

    let result: { success: boolean, error?: string, message?: string, sender?: string };
    let dataToUse: any;

    if (notification.data) {
        dataToUse = notification.data;
    } else {
        try {
            // Attempt fallback if data is missing but message might be JSON
            dataToUse = JSON.parse(notification.message);
        } catch (e) {
            console.error(`[RETRY ERROR] Log ${id} missing structured data and message is not JSON`);
            return next(new AppError('Incompatible notification format for retry. This log lacks the necessary structured data for resending.', 400));
        }
    }

    const notificationAny = notification as any;

    if (notification.type === 'EMAIL') {
        const email = notificationAny.user?.email || (dataToUse.SupportEmail); 
        if (!email) return next(new AppError('No recipient email found', 400));
        result = await sendEmail(email, notification.event, dataToUse);
    } else if (notification.type === 'WHATSAPP') {
        // Security Rule: WhatsApp: Never send credentials
        if (notification.event === 'APPLICATION_CREDENTIALS_CREATED') {
            return next(new AppError('Security Rule: Credentials cannot be sent via WhatsApp.', 400));
        }
        const phone = notificationAny.user?.phone || notificationAny.user?.whatsapp || (dataToUse.Phone);
        if (!phone) return next(new AppError('No recipient phone found', 400));
        result = await sendWhatsApp(phone, notification.event, dataToUse);
    } else {
        return next(new AppError('Unsupported notification type', 400));
    }

    // Update the notification log with ADMIN attribution
    await prisma.notification.update({
        where: { id },
        data: {
            status: result.success ? 'SENT' : 'FAILED',
            error: result.error || null,
            message: (result.message || notification.message).substring(0, 5000),
            sentAt: new Date(),
            triggeredBy: 'ADMIN',
            adminId: adminId,
            senderEmail: result.sender || notification.senderEmail
        }
    });

    if (!result.success) {
        return next(new AppError(`Retry failed: ${result.error}`, 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'Notification retried successfully'
    });
});
