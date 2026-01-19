import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

// @desc    Schedule an interview
// @route   POST /api/interviews/schedule
// @access  Private (Admin only)
export const scheduleInterview = async (req: Request, res: Response) => {
    const { applicationId, interviewerId, scheduledAt, location } = req.body;

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

        res.status(201).json(interview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assigned interviews for an interviewer
// @route   GET /api/interviews/assigned
// @access  Private (Interviewer only)
export const getAssignedInterviews = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found in request' });
        }

        const interviewer = await prisma.interviewer.findUnique({
            where: { userId: req.user.id }
        });

        if (!interviewer) {
            return res.status(404).json({ message: 'Interviewer profile not found' });
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

        res.json(interviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
