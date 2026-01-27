import { Request, Response } from 'express';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { logAction } from '../services/audit.service.js';

const prisma = new PrismaClient();

// Verify Documents
export const verifyDocuments = async (req: Request, res: Response) => {
  const { applicationId } = req.params as { applicationId: string };
  const { isVerified, rejectionReason } = req.body;
  const adminId = (req as any).user.userId;

  try {
    if (!isVerified) {
        // Reject
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: ApplicationStatus.REJECTED } // Or keep pending with notes? Design says REJECTED or DOCS_VERIFIED
        });
        // TODO: Send Email Notification about Rejection
        await logAction(adminId, 'VERIFY_DOCS_REJECTED', applicationId, { reason: rejectionReason });
        return res.json({ message: 'Application rejected due to document issues' });
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.DOCS_VERIFIED },
    });

    await logAction(adminId, 'VERIFY_DOCS_APPROVED', applicationId);
    res.json({ message: 'Documents verified successfully', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify documents' });
  }
};

// Generate Provisional Allotment
export const generateProvisionalAllotment = async (req: Request, res: Response) => {
    const adminId = (req as any).user.userId;
    
    try {
        // 1. Fetch all evaluated candidates ordered by Marks
        // This is a simplified logic. Real logic would be complex.
        const candidates = await prisma.result.findMany({
            where: { decision: 'PENDING' }, // Or checking Application Status = EVALUATED
            orderBy: { totalMarks: 'desc' },

        });
        
        // Complex logic placeholder:
        // iterate candidates, check seat availability in Student.firstOption
        // create Allotment entries
        
        // For now, let's just mark applications as ALLOTMENT_READY
        // In a real implementation, we would create Allotment records here.
        
        await logAction(adminId, 'GENERATE_ALLOTMENT_RUN');
        res.json({ message: 'Provisional allotment generated (Mock)' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate allotment' });
    }
};

// Submit for Principal Approval
export const submitAllotmentForApproval = async (req: Request, res: Response) => {
    const adminId = (req as any).user.userId;
    try {
        // Lock the list, Update status of multiple applications
        // Notify Principal
        
        await logAction(adminId, 'SUBMIT_ALLOTMENT_APPROVAL');
        res.json({ message: 'Allotment list submitted to Principal' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit allotment' });
    }
}

// Process Final Admission (Send Credentials)
export const processAdmission = async (req: Request, res: Response) => {
    const { applicationId } = req.params as { applicationId: string };
    const adminId = (req as any).user.userId;
    
    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { student: { include: { user: true } } }
        });

        if (!application || application.status !== ApplicationStatus.ADMISSION_AUTHORIZED) {
            return res.status(400).json({ error: 'Admission not authorized by Principal yet' });
        }
        
        // Generate Credentials
        const username = `ADM${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`;
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Update User
        await prisma.user.update({
            where: { id: application.student.userId },
            data: { 
                username: username,
                // In real app, hash this password!
                password: tempPassword, // MOCK: Should be bcrypt.hash(tempPassword)
                role: 'STUDENT'
            }
        });
        
        // Update Application Status
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: ApplicationStatus.ACCEPTED }
        });
        
        // TODO: Send Email with Username/Password
        
        await logAction(adminId, 'PROCESS_ADMISSION', applicationId, { username });
        res.json({ message: 'Admission processed. Credentials sent.' });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to process admission' });
    }
}
