import { Request, Response } from 'express';
import prisma from '../config/db';
import { sendNotification } from '../utils/notifications';

// @desc    Publish final results for a student
// @route   POST /api/results/publish
// @access  Private (Admin/Super Admin only)
export const publishResult = async (req: Request, res: Response) => {
    const { studentId, decision } = req.body;

    try {
        const evaluations = await prisma.evaluation.findMany({
            where: {
                interview: {
                    application: {
                        studentId: studentId
                    }
                }
            }
        });

        const totalMarks = evaluations.reduce((sum, e) => sum + e.marks, 0);
        const averageMarks = totalMarks / (evaluations.length || 1);

        const result = await prisma.result.upsert({
            where: { studentId },
            update: { totalMarks, averageMarks, decision, generatedAt: new Date() },
            create: {
                studentId,
                totalMarks,
                averageMarks,
                decision,
            }
        });

        // Update Student Status
        await prisma.student.update({
            where: { id: studentId },
            data: { status: decision === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED' }
        });

        // Send Notification
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });

        if (student) {
            await sendNotification(
                student.userId,
                'WHATSAPP',
                'RESULT_PUBLISHED',
                `Assalamu Alaikum ${student.user.name}, your result for the Post-Hifz admission at Darussalam Tharqiya College has been published. Status: ${decision}.`
            );
        }

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
