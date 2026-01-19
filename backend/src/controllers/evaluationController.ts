import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Submit evaluation for a subject
// @route   POST /api/evaluations/submit
// @access  Private (Interviewer only)
export const submitEvaluation = async (req: Request, res: Response) => {
    const { interviewId, subject, marks, remarks } = req.body;

    try {
        const evaluation = await prisma.evaluation.create({
            data: {
                interviewId,
                subject,
                marks: parseInt(marks),
                remarks,
            },
        });

        // Check if all subjects (Hifz, English, General) are evaluated
        const allEvaluations = await prisma.evaluation.findMany({
            where: { interviewId }
        });

        if (allEvaluations.length >= 3) {
            const interview = await prisma.interview.findUnique({
                where: { id: interviewId },
                include: { application: true }
            });

            if (interview) {
                await prisma.application.update({
                    where: { id: interview.applicationId },
                    data: { status: 'EVALUATED' }
                });
            }
        }

        res.status(201).json(evaluation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
