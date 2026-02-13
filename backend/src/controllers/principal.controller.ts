import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logAction } from '../services/audit.service.js';
import { AppError } from '../utils/AppError.js';

// @desc    Get Pending Approvals
// @route   GET /api/principal/approvals
// @access  Private (Principal)
export const getPendingApprovals = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pendingAllotments = await prisma.allotment.findMany({
        where: { isFinalized: false },
        include: { 
            application: { 
                include: { 
                    student: {
                        include: {
                            user: {
                                select: { name: true, email: true, profileImageUrl: true }
                            }
                        }
                    },
                    interview: {
                        include: {
                            evaluations: true,
                            interviewer: {
                                include: {
                                    user: {
                                        select: { name: true }
                                    }
                                }
                            }
                        }
                    }
                } 
            } 
        }
    });
    
    res.json({
        status: 'success',
        results: pendingAllotments.length,
        data: pendingAllotments
    });
});

// @desc    Approve Allotment batch
// @route   POST /api/principal/approve-allotment
// @access  Private (Principal)
export const approveAllotment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { allotmentIds } = req.body;
    if (!allotmentIds || !Array.isArray(allotmentIds)) {
        return next(new AppError('Please provide an array of allotment IDs', 400));
    }

    const principalId = req.user.id;
    
    // Update Allotments to Finalized
    await prisma.allotment.updateMany({
        where: { id: { in: allotmentIds } },
        data: { isFinalized: true }
    });
    
    const allotments = await prisma.allotment.findMany({
        where: { id: { in: allotmentIds } },
        select: { applicationId: true }
    });
    
    const appIds = allotments.map(a => a.applicationId);
    
    await prisma.application.updateMany({
        where: { id: { in: appIds } },
        data: { status: 'ADMISSION_AUTHORIZED' }
    });
    
    await logAction(principalId, 'APPROVE_ALLOTMENT_BATCH', undefined, { count: allotmentIds.length });
    
    res.json({ 
        status: 'success',
        message: 'Allotments approved successfully' 
    });
});

// @desc    Manual Override Allotment
// @route   POST /api/principal/override-allotment
// @access  Private (Principal)
export const overrideAllotment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { allotmentId, newCourse, newCampus, reason } = req.body;
    if (!allotmentId || !newCampus) {
        return next(new AppError('Allotment ID and new campus are required', 400));
    }

    const principalId = req.user.id;
    
    const oldAllotment = await prisma.allotment.findUnique({ where: { id: allotmentId } });
    if (!oldAllotment) {
        return next(new AppError('Allotment not found', 404));
    }
    
    await prisma.allotment.update({
        where: { id: allotmentId },
        data: { course: newCourse || oldAllotment.course, campus: newCampus }
    });
    
    await logAction(principalId, 'OVERRIDE_ALLOTMENT', allotmentId, { 
        reason, 
        previous: { course: oldAllotment.course, campus: oldAllotment.campus },
        new: { course: newCourse || oldAllotment.course, campus: newCampus }
    });
    
    res.json({ 
        status: 'success',
        message: 'Allotment overridden successfully' 
    });
});

// @desc    Get Principal Dashboard Stats
// @route   GET /api/principal/dashboard-stats
// @access  Private (Principal/Super Admin)
export const getPrincipalStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [totalApplications, resultAgg, pendingReview, finalizedSeats, recentLogs] = await Promise.all([
        prisma.application.count(),
        prisma.result.aggregate({ _avg: { averageMarks: true } }),
        prisma.application.count({ 
            where: { 
                status: { in: ['EVALUATED', 'ALLOTMENT_READY'] } 
            } 
        }),
        prisma.allotment.count({ where: { isFinalized: true } }),
        prisma.auditLog.findMany({
            where: {
                action: {
                    in: ['APPROVE_ALLOTMENT_BATCH', 'OVERRIDE_ALLOTMENT', 'APPROVE_ALLOTMENT']
                }
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true }
                }
            }
        })
    ]);

    const recentActivities = recentLogs.map(log => ({
        id: log.id,
        action: log.action,
        actor: log.user.name,
        timestamp: log.createdAt,
        metadata: typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata
    }));

    res.json({
        status: 'success',
        data: {
            totalApplications,
            averageScore: resultAgg._avg.averageMarks?.toFixed(1) || '0.0',
            pendingReview,
            finalizedSeats,
            recentActivities
        }
    });
});

// @desc    Get Principal Performance Insights
// @route   GET /api/principal/insights
// @access  Private (Principal/Super Admin)
export const getPrincipalInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
    // 1. Campus Utilization (Real-time capacity tracking)
    const campuses = await prisma.campus.findMany({
        orderBy: { name: 'asc' }
    });

    const finalizedAllotments = await prisma.allotment.groupBy({
        where: { isFinalized: true },
        by: ['campus'],
        _count: { _all: true }
    });

    const campusUtilization = campuses.map(c => {
        const matchingAllotment = finalizedAllotments.find(a => a.campus === c.name);
        return {
            campus: c.name,
            currentCount: matchingAllotment?._count._all || 0,
            maxSeats: c.maxSeats
        };
    });

    // 2. Evaluation Performance Profile
    // 2a. Subject-wise Averages
    const subjectMetrics = await prisma.evaluation.groupBy({
        by: ['subject'],
        _avg: { marks: true },
        _count: { marks: true }
    });

    const formattedSubjectPerformance = subjectMetrics.map(m => ({
        subject: m.subject,
        average: m._avg.marks ? parseFloat(m._avg.marks.toFixed(1)) : 0,
        count: m._count.marks
    }));

    // 2b. Score Distribution (Buckets)
    // Priority: Results (Finalized scores)
    const allResults = await prisma.result.findMany({
        select: { averageMarks: true }
    });

    const buckets = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        'Below 60': 0
    };

    if (allResults.length > 0) {
        allResults.forEach(r => {
            const score = r.averageMarks;
            if (score >= 90) buckets['90-100']++;
            else if (score >= 80) buckets['80-89']++;
            else if (score >= 70) buckets['70-79']++;
            else if (score >= 60) buckets['60-69']++;
            else buckets['Below 60']++;
        });
    } else {
        // Fallback: Calculate provisional averages from evaluations
        const interviewScores = await prisma.evaluation.groupBy({
            by: ['interviewId'],
            _avg: { marks: true }
        });

        interviewScores.forEach(s => {
            const score = s._avg.marks || 0;
            if (score >= 90) buckets['90-100']++;
            else if (score >= 80) buckets['80-89']++;
            else if (score >= 70) buckets['70-79']++;
            else if (score >= 60) buckets['60-69']++;
            else buckets['Below 60']++;
        });
    }

    // 3. Admission Funnel (Aggregated success path)
    const statusCounts = await prisma.application.groupBy({
        by: ['status'],
        _count: { _all: true }
    });

    const getCount = (statuses: string[]) => 
        statusCounts
            .filter(s => statuses.includes(s.status))
            .reduce((acc, curr) => acc + curr._count._all, 0);

    const aggregatedFunnel = [
        { status: 'REGISTRATIONS', label: 'Registrations', count: getCount(['PENDING', 'DOCS_VERIFIED', 'REVIEWED']) },
        { status: 'EVALUATION', label: 'Evaluation Phase', count: getCount(['INTERVIEW_SCHEDULED']) },
        { status: 'MERIT_LIST', label: 'Merit List Ready', count: getCount(['EVALUATED', 'ALLOTMENT_READY']) },
        { status: 'ALLOTTED', label: 'Seat Assigned', count: getCount(['ALLOTTED']) },
        { status: 'AUTHORIZED', label: 'Principal Authorized', count: getCount(['ADMISSION_AUTHORIZED']) },
        { status: 'ENROLLED', label: 'Enrollment Confirmed', count: getCount(['ACCEPTED']) }
    ];

    res.json({
        status: 'success',
        data: {
            campusDistribution: campusUtilization,
            scoreDistribution: buckets,
            subjectPerformance: formattedSubjectPerformance,
            funnel: aggregatedFunnel
        }
    });
});
