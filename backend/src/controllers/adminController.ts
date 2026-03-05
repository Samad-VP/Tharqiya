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

    // 4. Average Score (from Results)
    const aggregateScore = await prisma.result.aggregate({
        _avg: {
            averageMarks: true
        }
    });
    const averageScore = aggregateScore._avg.averageMarks ? aggregateScore._avg.averageMarks.toFixed(1) : '0.0';

    // 5. Finalized Seats
    const finalizedSeats = await prisma.allotment.count({
        where: { isFinalized: true }
    });

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

    // 6. Application Trends (Last 30 days, grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawTrends: any[] = await prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "appliedAt") AS day, COUNT(*)::int AS count
        FROM "Application"
        WHERE "appliedAt" >= ${thirtyDaysAgo}
        GROUP BY day
        ORDER BY day ASC
    `;

    // Fill in missing days with zero counts for a smooth chart
    const trendMap = new Map<string, number>();
    rawTrends.forEach(r => {
        const key = new Date(r.day).toISOString().split('T')[0];
        trendMap.set(key, r.count);
    });

    const trendData: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        trendData.push({ date: label, count: trendMap.get(key) || 0 });
    }

    const stats = {
        totalApplications,
        pendingReview,
        interviewsScheduled,
        averageScore,
        finalizedSeats,
        recentActivities,
        trendData
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
    let dataToUse: any = null;

    // 1. Try to get structured data from the 'data' field
    if (notification.data && typeof notification.data === 'object' && Object.keys(notification.data).length > 0) {
        dataToUse = notification.data;
    } 
    
    // 2. Fallback: Check if 'message' contains stringified JSON (common in failed attempts)
    if (!dataToUse && notification.message) {
        try {
            const parsed = JSON.parse(notification.message);
            if (parsed && typeof parsed === 'object') {
                dataToUse = parsed;
            }
        } catch (e) {
            // 2b. Regex Fallback: If it's HTML, try to scrape specific fields like passwords or names
            const msg = notification.message;
            if (msg.includes('Temporary Password') || msg.includes('OTP')) {
                const passMatch = msg.match(/(?:Temporary Password|OTP|Password):?\s*<\/strong>\s*<code[^>]*>(.*?)<\/code>/i) || 
                                 msg.match(/(?:Temporary Password|OTP|Password):?\s*(?:<\/strong>)?\s*([A-Za-z0-9]{4,10})/i);
                
                if (passMatch && passMatch[1]) {
                    dataToUse = dataToUse || {};
                    dataToUse.TempPassword = passMatch[1].trim();
                    console.log(`[RETRY] Scraped credential from HTML: ${dataToUse.TempPassword}`);
                }
            }
        }
    }

    // 3. Fallback: Reconstruct from User Record (If userId exists)
    if ((!dataToUse || Object.keys(dataToUse).length === 0) && notification.userId) {
        console.log(`[RETRY] Attempting to reconstruct data for user ${notification.userId}`);
        const user = notification.user;
        if (user) {
            dataToUse = {
                StudentName: user.name,
                Username: user.username || user.email,
                Email: user.email,
                Phone: user.phone || user.whatsapp
            };
            
            // If we have a student record, get application details
            const student = await prisma.student.findUnique({ where: { userId: user.id } });
            if (student) {
                dataToUse.ApplicationID = student.applicationNo;
            }
        }
    }

    // 4. Final Fallback: Literal Message (For simple alerts)
    if ((!dataToUse || Object.keys(dataToUse).length === 0) && notification.message) {
        console.log(`[RETRY] Using literal message fallback for event: ${notification.event}`);
        dataToUse = {
            RescheduleReason: notification.message, // Used by ADMIN_ALERT
            StudentName: 'Admin/System',
            Metadata: notification.message
        };
    }

    // 4. Final Check: Validation
    if (!dataToUse || Object.keys(dataToUse).length === 0) {
        console.error(`[RETRY ERROR] Log ${id} (Event: ${notification.event}) lacks data. UserID: ${notification.userId}. Msg present: ${!!notification.message}`);
        return next(new AppError(`The "${notification.event}" notification lacks the data for resending. If this is an OTP or credential email, please trigger a new one.`, 400));
    }

    const notificationAny = notification as any;

    if (notification.type === 'EMAIL') {
        // Find recipient: User email, or data override, or default Admin if it's a system alert
        let email = notificationAny.user?.email || dataToUse.Email; 
        
        if (!email && notification.event === 'ADMIN_ALERT') {
            email = process.env.EMAIL_ADMIN || 'admin@darussalameduvillage.com';
        }

        if (!email) {
            return next(new AppError('No recipient email found for this notification.', 400));
        }

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

// @desc    Clear all notification logs
// @route   DELETE /api/admin/notifications/clear
// @access  Private (Admin/Super Admin only)
export const clearNotificationLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.notification.deleteMany();

    res.status(200).json({
        status: 'success',
        message: 'All notification logs cleared successfully'
    });
});

// @desc    Trigger credential notifications for pending applicants
// @route   POST /api/admin/notifications/trigger-pending-credentials
// @access  Private (Admin/Super Admin only)
export const triggerPendingCredentials = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pendingStudents = await prisma.student.findMany({
        where: {
            status: 'PENDING',
            userId: { not: null }
        },
        include: {
            user: true
        }
    });

    const results = {
        total: pendingStudents.length,
        success: 0,
        failed: 0,
        errors: [] as any[]
    };

    const loginUrl = `${process.env.FRONTEND_URL || 'https://darussalameduvillage.com'}/login`;

    const { generateTemporaryPassword } = await import('../services/studentService.js');
    const { triggerNotification } = await import('../services/notificationService.js');

    for (const student of pendingStudents) {
        if (!student.user) continue;

        try {
            const tempPassword = generateTemporaryPassword(student.whatsapp || student.user.phone || '');
            
            // Trigger in background to avoid browser timeout during bulk processing
            triggerNotification(student.user.id, 'APPLICATION_CREDENTIALS_CREATED', {
                StudentName: student.name,
                Username: student.user.username || student.user.email,
                TempPassword: tempPassword,
                LoginUrl: loginUrl
            }, true);

            results.success++;
        } catch (error: any) {
            results.failed++;
            results.errors.push({ studentId: student.id, error: error.message });
        }
    }

    res.status(200).json({
        status: 'success',
        data: results
    });
});
