import { Request, Response } from 'express';
import pkg from '@prisma/client';
const { ApplicationStatus } = pkg;
import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';
import { logAction } from '../services/audit.service.js';

// @desc    Get candidates eligible for allotment
// @route   GET /api/allotments/eligible
// @access  Private (Principal, Admin)
// @desc    Get candidates eligible for allotment
// @route   GET /api/allotments/eligible
// @access  Private (Principal, Admin)
export const getEligibleForAllotment = asyncHandler(async (req: Request, res: Response) => {
    const candidates = await prisma.application.findMany({
        where: {
            // Fetch candidates who are in any stage of the allotment/admission pipeline
            status: { in: ['EVALUATED', 'ALLOTMENT_READY', 'ALLOTTED', 'ADMISSION_AUTHORIZED', 'ACCEPTED'] }
        },
        include: {
            student: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            },
            interview: {
                include: {
                    evaluations: true
                }
            },
            allotment: true
        }
    });

    res.json({
        status: 'success',
        results: candidates.length,
        data: candidates
    });
});

// @desc    Propose an allotment
// @route   POST /api/allotments/propose
// @access  Private (Principal, Admin)
export const proposeAllotment = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId, campus } = req.body;
    // Default course if not provided, assuming Post-Hifz 
    const course = req.body.course || 'Post-Hifz Programme';

    if (!applicationId || !campus) {
        throw new AppError('Application ID and Campus are required', 400);
    }


    // Check Seat Availability
    const campusData = await prisma.campus.findUnique({
        where: { name: campus }
    });

    if (campusData) {
        // Count current allotments for this campus
        const currentCount = await prisma.allotment.count({
            where: { campus: campus }
        });

        // Check if updating existing allotment
        const existingAllotment = await prisma.allotment.findUnique({
            where: { applicationId }
        });

        // If new allotment OR changing campus, check limit
        if ((!existingAllotment || existingAllotment.campus !== campus) && currentCount >= campusData.maxSeats) {
            throw new AppError(`Seat limit exceeded for ${campus}. Max capacity: ${campusData.maxSeats}`, 400);
        }
    }

    const allotment = await prisma.allotment.upsert({
        where: { applicationId },
        update: { campus, course, isFinalized: false },
        create: { applicationId, campus, course, isFinalized: false }
    });
    
    // Update Application Status to indicate provisional allotment exists?
    // Maybe keep it as ALLOTMENT_READY until finalized?
    await prisma.application.update({
        where: { id: applicationId },
        data: { 
            status: 'ALLOTMENT_READY',
            student: {
                update: {
                    status: 'ALLOTMENT_READY'
                }
            }
        }
    });

    res.status(201).json({
        status: 'success',
        data: allotment
    });
});

// @desc    Finalize and Notify Allotments
// @route   POST /api/allotments/finalize
// @access  Private (Principal)
export const finalizeAllotments = asyncHandler(async (req: Request, res: Response) => {
    const { applicationIds } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds)) {
        throw new AppError('Application IDs must be an array', 400);
    }

    const results = await Promise.all(applicationIds.map(async (appId) => {
        try {
            const allotment = await prisma.allotment.update({
                where: { applicationId: appId },
                data: { isFinalized: true }, // No finalizedAt field in schema, reliant on updated_at if exists or just isFinalized
                include: {
                    application: {
                        include: {
                            student: {
                                include: { user: true }
                            }
                        }
                    }
                }
            });

            // Update application status to ALLOTTED or ADMISSION_AUTHORIZED?
            // Design says ADMISSION_AUTHORIZED implies Principal Approved.
            await prisma.application.update({
                where: { id: appId },
                data: { 
                    status: 'ADMISSION_AUTHORIZED',
                    student: {
                        update: {
                            status: 'ADMISSION_AUTHORIZED'
                        }
                    }
                }
            });

            // Trigger Notification
            if (allotment.application.student.userId && allotment.application.student.user) {
                await triggerNotification(allotment.application.student.userId, 'ALLOTMENT_PUBLISHED', {
                    StudentName: allotment.application.student.user.name,
                    CampusName: allotment.campus
                });
            }

            return { appId, status: 'success' };
        } catch (error: any) {
            return { appId, status: 'error', message: error.message };
        }
    }));

    res.json({
        status: 'success',
        data: results
    });
});

// @desc    Run Batch Merit-Based Allotment
// @route   POST /api/allotments/batch-run
// @access  Private (Admin, Super Admin)
export const generateProvisionalAllotment = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    
    // 1. Fetch all evaluated candidates ordered by Marks
    const candidates = await prisma.result.findMany({
        where: { decision: 'PENDING' },
        orderBy: { averageMarks: 'desc' }
    });

    if (candidates.length === 0) {
        return res.json({ message: 'No candidates in evaluation pool' });
    }

    // 2. Fetch all campuses
    const campuses = await prisma.campus.findMany();

    // 3. Process Allotments
    let allotmentCount = 0;
    for (const candidate of candidates) {
        const student = await prisma.student.findUnique({
            where: { id: candidate.studentId },
            include: { application: true }
        });

        if (!student || !student.application) continue;

        // Check preferences
        const preferences = [student.firstOption, student.secondOption, student.thirdOption].filter(Boolean);
        
        let allottedCampus = null;
        for (const pref of preferences) {
            const campus = campuses.find(c => c.name === pref);
            if (campus) {
                const occupied = await prisma.allotment.count({ where: { campus: campus.name } });
                if (occupied < campus.maxSeats) {
                    allottedCampus = campus.name;
                    break;
                }
            }
        }

        if (allottedCampus) {
            await prisma.allotment.upsert({
                where: { applicationId: student.application.id },
                update: { campus: allottedCampus, course: student.firstOption || 'Tharqiya' },
                create: { applicationId: student.application.id, campus: allottedCampus, course: student.firstOption || 'Tharqiya' }
            });

            await prisma.application.update({
                where: { id: student.application.id },
                data: { 
                    status: 'ALLOTMENT_READY',
                    student: {
                        update: { status: 'ALLOTMENT_READY' }
                    }
                }
            });

            allotmentCount++;
        }
    }
    
    await logAction(adminId, 'GENERATE_ALLOTMENT_RUN', undefined, { processed: candidates.length, allotted: allotmentCount });
    res.json({ message: `Provisional allotment generated. ${allotmentCount} seats allotted.` });
});

// @desc    Submit all ready allotments to Principal for approval
// @route   POST /api/allotments/submit-approval
// @access  Private (Admin, Super Admin)
export const submitAllotmentForApproval = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    
    // Update all ALLOTMENT_READY applications to ALLOTTED
    const result = await prisma.application.updateMany({
        where: { status: 'ALLOTMENT_READY' },
        data: { status: 'ALLOTTED' }
    });

    // Also update the student status
    const applications = await prisma.application.findMany({
        where: { status: 'ALLOTTED' },
        select: { studentId: true }
    });

    await prisma.student.updateMany({
        where: { id: { in: applications.map(a => a.studentId) } },
        data: { status: 'ALLOTTED' }
    });
    
    await logAction(adminId, 'SUBMIT_ALLOTMENT_APPROVAL', undefined, { count: result.count });
    res.json({ message: `${result.count} allotments submitted to Principal for final approval` });
});
