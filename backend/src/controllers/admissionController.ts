import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateApplicationPDF, generateResultPDF } from '../services/pdfService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';
import { promoteToStudentAccount } from '../services/studentService.js';

// @desc    Submit a new application
// @route   POST /api/admissions/apply
// @access  Private (Student only)
export const applyForAdmission = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { dob, address, hifzCenter, fatherName, motherName, documents } = req.body;

    if (!req.user) {
        return next(new AppError('User not found in request', 401));
    }

    // Generate Application Number: TQ-2026-XXXX
    const count = await prisma.student.count();
    const applicationNo = `TQ-2026-${(count + 1).toString().padStart(4, '0')}`;

    const student = await prisma.student.create({
        data: {
            userId: req.user.id,
            applicationNo,
            name: req.user.name,
            dob: dob ? new Date(dob) : new Date(),
            address: address || 'N/A',
            hifzCenter: hifzCenter || 'N/A',
            fatherName: fatherName || 'N/A',
            motherName: motherName || 'N/A',
            documents: documents || {},
        },
    });

    await prisma.application.create({
        data: {
            studentId: student.id,
            status: 'PENDING',
        },
    });

    // Trigger Notification
    await triggerNotification(req.user.id, 'APPLICATION_RECEIVED', {
        StudentName: req.user.name,
        ApplicationID: applicationNo
    });

    // Internal Admin Alert
    await triggerNotification('SYSTEM_ADMIN_PLACEHOLDER', 'ADMIN_ALERT', {
        RescheduleReason: `New Tharqiya Application Received: ${applicationNo} from ${req.user.name}`
    });

    res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        student,
    });
});

// @desc    Get student's own application status
// @route   GET /api/admissions/my-status
// @access  Private (Student only)
export const getMyStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('User not found in request', 401));
    }

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { 
            application: {
                include: {
                    interview: {
                        include: {
                            interviewer: {
                                include: {
                                    user: {
                                        select: { name: true, email: true, phone: true }
                                    }
                                }
                            }
                        }
                    }
                } 
            },
        },
    });

    if (!student) {
        return next(new AppError('No application found', 404));
    }

    res.json({
        status: 'success',
        data: student
    });
});

// @desc    Get all applications (Admin only)
// @route   GET /api/admissions/all
// @access  Private (Admin only)
export const getAllApplications = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const applications = await prisma.application.findMany({
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
                    interviewer: {
                        include: {
                            user: { select: { name: true } }
                        }
                    }
                }
            }
        }
    });
    res.json({
        status: 'success',
        results: applications.length,
        data: applications
    });
});

// @desc    Download student's own application as PDF
// @route   GET /api/admissions/my-application/pdf
// @access  Private (Student only)
export const downloadApplicationPDF = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { user: true }
    });

    if (!student) return next(new AppError('Student not found', 404));

    const pdfBytes = await generateApplicationPDF(student);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Application-${student.applicationNo}.pdf`);
    res.send(Buffer.from(pdfBytes));
});

// @desc    Download student's own result as PDF
// @route   GET /api/admissions/my-result/pdf
// @access  Private (Student only)
export const downloadResultPDF = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { user: true }
    });

    if (!student) return next(new AppError('Student not found', 404));

    const result = await prisma.result.findUnique({
        where: { studentId: student.id }
    });

    if (!result) return next(new AppError('Result not published yet', 404));

    // Get evaluations for the application
    const application = await prisma.application.findUnique({
        where: { studentId: student.id },
        include: { interview: { include: { evaluations: true } } }
    });

    const evaluations = application?.interview?.evaluations || [];

    const pdfBytes = await generateResultPDF(student, result, evaluations);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Result-${student.applicationNo}.pdf`);
    res.send(Buffer.from(pdfBytes));
});
// @desc    Update application status
// @route   PATCH /api/admissions/:id/status
// @access  Private (Admin only)
export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const id = req.params.id as string;

    const application = await prisma.application.findUnique({
        where: { id }
    });

    if (!application) {
        return next(new AppError('Application not found', 404));
    }

    const updatedApplication = await prisma.application.update({
        where: { id },
        data: { status },
        include: {
            student: {
                include: {
                    user: true
                }
            }
        }
    });

    // Handle Status-based Notifications
    if (status === 'ACCEPTED') {
        const studentAny = updatedApplication.student as any;
        await triggerNotification(studentAny.userId!, 'ADMISSION_CONFIRMED', {
            StudentName: studentAny.name,
            CampusName: studentAny.firstOption || 'Main Campus',
            Username: studentAny.user?.username || 'N/A',
            TempPassword: 'Check your confirmation email'
        });
    } else if (status === 'REVIEWED') {
        const studentAny = updatedApplication.student as any;
        if (studentAny.userId) {
            await triggerNotification(studentAny.userId, 'APPLICATION_UNDER_REVIEW', {
                StudentName: studentAny.name
            });
        }
    }

    res.json({
        status: 'success',
        data: updatedApplication
    });
});
// @desc    Update student's own profile
// @route   PATCH /api/admissions/my-profile
// @access  Private (Student only)
export const updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const { 
        dob, address, hifzCenter, fatherName, motherName, 
        phone, documents, place, district, whatsapp 
    } = req.body;

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id }
    });

    if (!student) return next(new AppError('Student profile not found', 404));

    // Update Student details
    const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: {
            dob: dob ? new Date(dob) : undefined,
            address,
            hifzCenter,
            fatherName,
            motherName,
            documents: documents || undefined,
            place,
            district,
            whatsapp
        }
    });

    // Update User phone if provided
    if (phone) {
        await prisma.user.update({
            where: { id: req.user.id },
            data: { phone }
        });
    }

    res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: updatedStudent
    });
});
