import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';

// @desc    Get candidates eligible for allotment
// @route   GET /api/allotments/eligible
// @access  Private (Principal, Admin)
// @desc    Get candidates eligible for allotment
// @route   GET /api/allotments/eligible
// @access  Private (Principal, Admin)
export const getEligibleForAllotment = asyncHandler(async (req: Request, res: Response) => {
    const candidates = await prisma.application.findMany({
        where: {
            // Fetch candidates who are evaluated or ready for allotment
            status: { in: ['EVALUATED', 'ALLOTMENT_READY', 'ALLOTTED'] }
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
