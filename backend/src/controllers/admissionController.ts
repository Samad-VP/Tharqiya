import { Response, NextFunction } from 'express';
import pkg from '@prisma/client';
const { ApplicationStatus } = pkg;
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { generateApplicationPDF, generateResultPDF, generateAllotmentPDF, generateApplicantsListPDF } from '../services/pdfService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { triggerNotification } from '../services/notificationService.js';
import { promoteToStudentAccount } from '../services/studentService.js';
import bcrypt from 'bcryptjs';
import { logAction } from '../services/audit.service.js';

// @desc    Submit a new application
// @route   POST /api/admissions/apply
// @access  Private (Student only)
export const applyForAdmission = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { dob, address, hifzCenter, fatherName, motherName, documents, primeHifzMentor, madrasaEducation, pincode, state, country, place, district } = req.body;

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
            primeHifzMentor: primeHifzMentor || 'N/A',
            madrasaEducation: madrasaEducation || 'N/A',
            pincode,
            state,
            country: country || 'India',
            place,
            district,
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
                                        select: { name: true, email: true, phone: true, profileImageUrl: true }
                                    }
                                }
                            }
                        }
                    },
                    allotment: true
                } 
            },
            user: {
                select: {
                    profileImageUrl: true,
                    profileImagePublicId: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        },
    });

    if (!student) {
        return next(new AppError('No application found for this account', 404));
    }

    res.json({
        status: 'success',
        data: student
    });
});

// @desc    Get all applications (Admin only)
// @route   GET /api/admissions/all
// @access  Private (Admin only)
export const getAllApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { 
        status, 
        search, 
        schoolEducation, 
        dawrasCount, 
        minAge, 
        maxAge,
        state,
        country
    } = (req.query as any);

    const where: any = {};

    // Filter by Application Status
    if (status) {
        where.status = status;
    }

    // Advanced Student Filters
    const studentWhere: any = {};

    // Search by Name or Application Number
    if (search) {
        studentWhere.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { applicationNo: { contains: search as string, mode: 'insensitive' } }
        ];
    }

    // Filter by General Education (e.g., 10th)
    if (schoolEducation) {
        studentWhere.schoolEducation = { contains: schoolEducation as string, mode: 'insensitive' };
    }

    // Filter by Dawras Count
    if (dawrasCount) {
        studentWhere.dawrasCount = { contains: dawrasCount as string, mode: 'insensitive' };
    }

    // Age Filtering Logic
    if (minAge || maxAge) {
        const now = new Date();
        const ageFilter: any = {};
        
        if (minAge) {
            const minDate = new Date();
            minDate.setFullYear(now.getFullYear() - parseInt(minAge as string) - 1);
            // If they are 15, they were born at most 15 years ago
            // Actually: Age 15 means DOB is between today-16y and today-15y
            // To be at least 15, DOB must be <= today - 15 years
            const maxDob = new Date();
            maxDob.setFullYear(now.getFullYear() - parseInt(minAge as string));
            ageFilter.lte = maxDob;
        }

        if (maxAge) {
            const minDob = new Date();
            minDob.setFullYear(now.getFullYear() - parseInt(maxAge as string) - 1);
            ageFilter.gte = minDob;
        }

        studentWhere.dob = ageFilter;
    }

    // Filter by State
    if (state) {
        studentWhere.state = { contains: state as string, mode: 'insensitive' };
    }

    // Filter by Country
    if (country) {
        studentWhere.country = { contains: country as string, mode: 'insensitive' };
    }

    if (Object.keys(studentWhere).length > 0) {
        where.student = studentWhere;
    }

    const applications = await prisma.application.findMany({
        where,
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
                    },
                    evaluations: true
                }
            },
            allotment: true
        },
        orderBy: { appliedAt: 'desc' }
    });

    res.json({
        status: 'success',
        results: applications.length,
        data: applications
    });
});

// @desc    Download all applications as PDF with filtering
// @route   GET /api/admissions/applicants/pdf
// @access  Private (Admin/Principal only)
export const downloadApplicantsListPDF = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { 
        status, 
        search, 
        schoolEducation, 
        dawrasCount, 
        minAge, 
        maxAge,
        state,
        country
    } = (req.query as any);

    const where: any = {};
    if (status) where.status = status;

    const studentWhere: any = {};
    if (search) {
        studentWhere.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { applicationNo: { contains: search as string, mode: 'insensitive' } }
        ];
    }
    if (schoolEducation) studentWhere.schoolEducation = { contains: schoolEducation as string, mode: 'insensitive' };
    if (dawrasCount) studentWhere.dawrasCount = { contains: dawrasCount as string, mode: 'insensitive' };
    
    if (minAge || maxAge) {
        const now = new Date();
        const ageFilter: any = {};
        if (minAge) {
            const maxDob = new Date();
            maxDob.setFullYear(now.getFullYear() - parseInt(minAge as string));
            ageFilter.lte = maxDob;
        }
        if (maxAge) {
            const minDob = new Date();
            minDob.setFullYear(now.getFullYear() - parseInt(maxAge as string) - 1);
            ageFilter.gte = minDob;
        }
        studentWhere.dob = ageFilter;
    }
    if (state) studentWhere.state = { contains: state as string, mode: 'insensitive' };
    if (country) studentWhere.country = { contains: country as string, mode: 'insensitive' };

    if (Object.keys(studentWhere).length > 0) {
        where.student = studentWhere;
    }

    const applications = await prisma.application.findMany({
        where,
        include: {
            student: {
                include: {
                    user: { select: { name: true, email: true } }
                }
            },
            interview: {
                include: { evaluations: true }
            }
        },
        orderBy: { appliedAt: 'desc' }
    });

    let filterTitle = 'All Applicants';
    if (status) filterTitle = `Status: ${status}`;
    if (search) filterTitle += ` | Search: ${search}`;

    const pdfBytes = await generateApplicantsListPDF(applications, filterTitle);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Applicants-Roster-${new Date().getTime()}.pdf`);
    res.send(Buffer.from(pdfBytes));
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

    // Get evaluations for the application
    const application = await prisma.application.findUnique({
        where: { studentId: student.id },
        include: { interview: { include: { evaluations: true } } }
    });

    let result = await prisma.result.findUnique({
        where: { studentId: student.id }
    });

    // Fallback: If result is not explicitly published but evaluations exist, calculate it on the fly
    if (!result) {
        const evaluations = application?.interview?.evaluations || [];
        
        if (evaluations.length > 0) {
            const totalMarks = evaluations.reduce((sum, ev) => sum + ev.marks, 0);
            // Assuming max marks is 100 per subject or based on count. 
            // Better to just calculate average roughly if max marks aren't known, or just use percentage if available.
            // For now, let's assume average is just simple average of marks given.
            const averageMarks = Math.round(totalMarks / evaluations.length); 

            let decision = 'PENDING';
            if (application?.status === 'ACCEPTED' || application?.status === 'ALLOTTED' || application?.status === 'ADMISSION_AUTHORIZED') {
                decision = 'ACCEPTED';
            } else if (application?.status === 'REJECTED') {
                decision = 'REJECTED';
            }

            // Only allow download if a decision is made or at least evaluated
            if (decision !== 'PENDING' || application?.status === 'EVALUATED') {
                 result = {
                    id: 'temp-id',
                    studentId: student.id,
                    totalMarks,
                    averageMarks: parseFloat(averageMarks.toFixed(2)),
                    decision: decision === 'PENDING' ? 'UNDER REVIEW' : decision,
                    generatedAt: new Date(),
                    pdfUrl: null
                } as any;
            }
        }
    }

    if (!result) return next(new AppError('Result not available yet. Please wait for official publication.', 404));

    const evaluations = application?.interview?.evaluations || [];

    const pdfBytes = await generateResultPDF(student, result, evaluations);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Selection-Letter-${student.applicationNo}.pdf`);
    res.send(Buffer.from(pdfBytes));
});

// @desc    Download student's own allotment as PDF
// @route   GET /api/admissions/my-allotment/pdf
// @access  Private (Student only)
export const downloadAllotmentPDF = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const student = await prisma.student.findUnique({
        where: { userId: req.user.id },
        include: { 
            user: true,
            application: {
                include: { allotment: true }
            }
        }
    });

    if (!student) return next(new AppError('Student not found', 404));

    const allotment = (student.application as any)?.allotment;

    if (!allotment) return next(new AppError('No allotment records found', 404));

    const pdfBytes = await generateAllotmentPDF(student, allotment);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Allotment-${student.applicationNo}.pdf`);
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
        data: { 
            status,
            student: {
                update: {
                    status: status
                }
            }
        },
        include: {
            student: {
                include: {
                    user: true
                }
            }
        }
    });

    // Handle Status-based Notifications
    const studentAny = updatedApplication.student as any;
    if (studentAny.userId) {
        if (status === 'ACCEPTED') {
            await triggerNotification(studentAny.userId, 'ADMISSION_CONFIRMED', {
                StudentName: studentAny.name,
                CampusName: studentAny.firstOption || 'Main Campus'
            });
        } else if (status === 'REVIEWED') {
            await triggerNotification(studentAny.userId, 'APPLICATION_UNDER_REVIEW', {
                StudentName: studentAny.name
            });
        } else if (status === 'REJECTED') {
            await triggerNotification(studentAny.userId, 'APPLICATION_REJECTED', {
                StudentName: studentAny.name
            });
        } else if (status === 'DOCS_VERIFIED') { // Or whichever status means "Approved for Interview" in this flow
             await triggerNotification(studentAny.userId, 'APPLICATION_APPROVED_FOR_INTERVIEW', {
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
        phone, documents, place, district, whatsapp, primeHifzMentor, madrasaEducation,
        profileImageUrl, profileImagePublicId, documentUrl, documentPublicId,
        pincode, state, country
    } = (req.body as any);

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
            documentUrl: documentUrl !== undefined ? documentUrl : undefined,
            documentPublicId: documentPublicId !== undefined ? documentPublicId : undefined,
            place,
            district,
            whatsapp,
            primeHifzMentor,
            madrasaEducation,
            pincode,
            state,
            country
        }
    });

    // Update User details if provided
    if (phone || profileImageUrl !== undefined || profileImagePublicId !== undefined) {
        await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                phone,
                profileImageUrl: profileImageUrl !== undefined ? profileImageUrl : undefined,
                profileImagePublicId: profileImagePublicId !== undefined ? profileImagePublicId : undefined
            }
        });
    }

    res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: updatedStudent
    });
});

// @desc    Get student's own notification history
// @route   GET /api/admissions/my-notifications
// @access  Private (Student only)
export const getMyNotifications = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    const notifications = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { sentAt: 'desc' },
        include: {
           admin: {
               select: { name: true }
           }
        }
    });

    res.json({
        status: 'success',
        data: notifications
    });
});

// @desc    Mark all unread notifications as read
// @route   PATCH /api/admissions/notifications/read
// @access  Private (Student only)
export const markNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));

    await prisma.notification.updateMany({
        where: {
            userId: req.user.id,
            isRead: false
        },
        data: {
            isRead: true
        }
    });

    res.json({
        status: 'success',
        message: 'Notifications marked as read'
    });
});

// @desc    Verify student documents
// @route   PATCH /api/admissions/:applicationId/verify-docs
// @access  Private (Admin)
export const verifyDocuments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { applicationId } = req.params as { applicationId: string };
    const { isVerified, rejectionReason } = req.body;
    const adminId = req.user.id;

    if (!isVerified) {
        // Reject
        await prisma.application.update({
            where: { id: applicationId },
            data: { 
                status: 'REJECTED',
                student: {
                    update: { status: 'REJECTED' }
                }
            }
        });

        // Send Email Notification about Rejection
        const rejectedApplication = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { student: { include: { user: true } } }
        });

        if (rejectedApplication?.student?.userId) {
            await triggerNotification(rejectedApplication.student.userId, 'APPLICATION_REJECTED', {
                StudentName: rejectedApplication.student.name
            }, true);
        }

        await logAction(adminId, 'VERIFY_DOCS_REJECTED', applicationId, { reason: rejectionReason });
        return res.json({ message: 'Application rejected due to document issues' });
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { 
        status: 'DOCS_VERIFIED',
        student: {
            update: {
                status: 'DOCS_VERIFIED'
            }
        }
      },
    });

    await logAction(adminId, 'VERIFY_DOCS_APPROVED', applicationId);
    res.json({ message: 'Documents verified successfully', application });
});

// @desc    Process Final Admission (Send Credentials)
// @route   POST /api/admissions/:applicationId/process-admission
// @access  Private (Admin)
export const processAdmission = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { applicationId } = req.params as { applicationId: string };
    const adminId = req.user.id;
    
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { student: { include: { user: true } } }
    });

    if (!application || application.status !== 'ADMISSION_AUTHORIZED') {
        return next(new AppError('Admission not authorized by Principal yet', 400));
    }
    
    // Generate Credentials
    const username = `ADM${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Update User
    if (application.student.userId) {
        await prisma.user.update({
            where: { id: application.student.userId },
            data: { 
                username: username,
                password: hashedPassword,
                role: 'STUDENT',
                isFirstLogin: true // Force password change
            }
        });
    }
    
    // Update Application Status
    await prisma.application.update({
        where: { id: applicationId },
        data: { 
            status: 'ACCEPTED',
            student: {
                update: {
                    status: 'ACCEPTED'
                }
            }
        }
    });
    
    // Send Email with Username/Password
    if (application.student.userId) {
        await triggerNotification(application.student.userId, 'APPLICATION_CREDENTIALS_CREATED', {
            StudentName: application.student.name,
            Username: username,
            TempPassword: tempPassword,
            LoginUrl: process.env.FRONTEND_URL || 'https://darussalameduvillage.com/login'
        }, true);
    }
    
    await logAction(adminId, 'PROCESS_ADMISSION', applicationId, { username });
    res.json({ message: 'Admission processed. Credentials sent to student.' });
});
