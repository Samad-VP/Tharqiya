import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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
    const logs = await prisma.notification.findMany({
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
