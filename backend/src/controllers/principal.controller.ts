import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAction } from '../services/audit.service.js';

const prisma = new PrismaClient();

// Get Pending Approvals
export const getPendingApprovals = async (req: Request, res: Response) => {
    try {
        // Fetch Allotments that are not finalized? 
        // Or Applications in status ALLOTMENT_READY?
        
        const pendingAllotments = await prisma.allotment.findMany({
            where: { isFinalized: false },
            include: { application: { include: { student: true } } }
        });
        
        res.json(pendingAllotments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch approvals' });
    }
};

// Approve Allotment
export const approveAllotment = async (req: Request, res: Response) => {
    const { allotmentIds } = req.body; // Array of Allotment IDs to approve
    const principalId = (req as any).user.userId;
    
    try {
        // Update Allotments to Finalized
        await prisma.allotment.updateMany({
            where: { id: { in: allotmentIds } },
            data: { isFinalized: true }
        });
        
        // Update Applications to ADMISSION_AUTHORIZED or ALLOTTED?
        // Design says ALLOTMENT_PUBLISHED (Notification) -> Then Student Accepts -> Then Admin Processes
        // Let's set status to ALLOTTED
        
        // We need to find the applications related to these allotments
        const allotments = await prisma.allotment.findMany({
            where: { id: { in: allotmentIds } },
            select: { applicationId: true }
        });
        
        const appIds = allotments.map(a => a.applicationId);
        
        await prisma.application.updateMany({
            where: { id: { in: appIds } },
            data: { status: 'ADMISSION_AUTHORIZED' } // Skipping the student accept step for now to simplify based on "Admission Authorized" status usage
        });
        
        await logAction(principalId, 'APPROVE_ALLOTMENT_BATCH', undefined, { count: allotmentIds.length });
        res.json({ message: 'Allotments approved successfully' });
    } catch (error) {
         res.status(500).json({ error: 'Failed to approve allotments' });
    }
};

// Manual Override
export const overrideAllotment = async (req: Request, res: Response) => {
    const { allotmentId, newCourse, newCampus, reason } = req.body;
    const principalId = (req as any).user.userId;
    
    try {
        const oldAllotment = await prisma.allotment.findUnique({ where: { id: allotmentId } });
        
        await prisma.allotment.update({
            where: { id: allotmentId },
            data: { course: newCourse, campus: newCampus }
        });
        
        await logAction(principalId, 'OVERRIDE_ALLOTMENT', allotmentId, { 
            reason, 
            previous: { course: oldAllotment?.course, campus: oldAllotment?.campus },
            new: { course: newCourse, campus: newCampus }
        });
        
        res.json({ message: 'Allotment overridden successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to override allotment' });
    }
};

// Dashboard Stats
export const getPrincipalStats = async (req: Request, res: Response) => {
    try {
        const totalApplications = await prisma.application.count();
        
        // Average Interview Score
        const resultAgg = await prisma.result.aggregate({
            _avg: { averageMarks: true }
        });

        // Pending Review (Applications that are EVALUATED but not yet ALLOTTED/AUTHORIZED)
        const pendingReview = await prisma.application.count({
            where: { status: 'EVALUATED' }
        });

        res.json({
            status: 'success',
            data: {
                totalApplications,
                averageScore: resultAgg._avg.averageMarks?.toFixed(1) || '0.0',
                pendingReview
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch principal stats' });
    }
};
