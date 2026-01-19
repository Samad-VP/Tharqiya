import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

// @desc    Submit a new application
// @route   POST /api/admissions/apply
// @access  Private (Student only)
export const applyForAdmission = async (req: AuthRequest, res: Response) => {
    const { dob, address, hifzCenter, fatherName, motherName, documents } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found in request' });
        }

        // Generate Application Number: TQ-2026-XXXX
        const count = await prisma.student.count();
        const applicationNo = `TQ-2026-${(count + 1).toString().padStart(4, '0')}`;

        const student = await prisma.student.create({
            data: {
                userId: req.user.id,
                applicationNo,
                dob: new Date(dob),
                address,
                hifzCenter,
                fatherName,
                motherName,
                documents: documents || {},
            },
        });

        await prisma.application.create({
            data: {
                studentId: student.id,
                status: 'PENDING',
            },
        });

        res.status(201).json({
            message: 'Application submitted successfully',
            student,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's own application status
// @route   GET /api/admissions/my-status
// @access  Private (Student only)
export const getMyStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found in request' });
        }

        const student = await prisma.student.findUnique({
            where: { userId: req.user.id },
            include: { application: true },
        });

        if (!student) {
            return res.status(404).json({ message: 'No application found' });
        }

        res.json(student);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/admissions/all
// @access  Private (Admin only)
export const getAllApplications = async (_req: AuthRequest, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            include: {
                student: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
