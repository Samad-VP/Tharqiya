import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'STUDENT',
        },
    });

    res.status(201).json({
        status: 'success',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            profileImagePublicId: user.profileImagePublicId,
            token: generateToken(user.id),
        }
    });
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password, role, whatsapp, phone } = req.body;
    const requesterRole = req.user?.role;

    // RBAC Hierarchy Check
    if (role === 'ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return next(new AppError('Only Super Admin can create Admins', 403));
    }

    if (role === 'INTERVIEWER' && requesterRole !== 'SUPER_ADMIN' && requesterRole !== 'ADMIN' && requesterRole !== 'PRINCIPAL') {
        return next(new AppError('Only Admins/Principal can create Interviewers', 403));
    }

    if (role === 'SUPER_ADMIN') {
        return next(new AppError('Cannot create Super Admin via API', 403));
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role,
            whatsapp,
            phone,
            profileImageUrl: req.body.profileImageUrl,
            profileImagePublicId: req.body.profileImagePublicId
        },
    });

    // If creating interviewer, also create Interviewer profile
    if (role === 'INTERVIEWER') {
        await prisma.interviewer.create({
            data: {
                userId: user.id
            }
        });
    }

    res.status(201).json({
        status: 'success',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            profileImagePublicId: user.profileImagePublicId
        }
    });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { role } = req.query;

    const users = await prisma.user.findMany({
        where: role ? { role: role as any } : {},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            whatsapp: true,
            createdAt: true,
            interviewer: {
                select: { id: true }
            }
        },
    });

    res.json({
        status: 'success',
        results: users.length,
        data: users
    });
});

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: email }
            ]
        }
    });

    if (user && (await comparePassword(password, user.password))) {
        res.json({
            status: 'success',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                whatsapp: user.whatsapp,
                phone: user.phone,
                profileImageUrl: user.profileImageUrl,
                profileImagePublicId: user.profileImagePublicId,
                emailNotificationsEnabled: user.emailNotificationsEnabled,
                whatsappNotificationsEnabled: user.whatsappNotificationsEnabled,
                token: generateToken(user.id),
            }
        });
    } else {
        return next(new AppError('Invalid credentials', 401));
    }
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, email, phone, whatsapp, role, password } = req.body;
    const requesterRole = req.user?.role;

    const user = await prisma.user.findUnique({ where: { id: id as string } });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Hierarchy checks
    if (role && role === 'ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return next(new AppError('Only Super Admin can promote to Admin', 403));
    }
    
    if (user.role === 'SUPER_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return next(new AppError('Only Super Admin can edit another Super Admin', 403));
    }

    const data: any = {
        name: name || user.name,
        email: email || user.email,
        phone: phone !== undefined ? phone : user.phone,
        whatsapp: whatsapp !== undefined ? whatsapp : user.whatsapp,
        role: role || user.role,
    };

    if (password) {
        data.password = await hashPassword(password);
    }

    // Check email uniqueness if changed
    if (email && email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return next(new AppError('Email already in use', 400));
    }

    const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data,
        select: { id: true, name: true, email: true, role: true, phone: true, whatsapp: true }
    });

    res.json({
        status: 'success',
        data: updatedUser
    });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const requesterRole = req.user?.role;

    const user = await prisma.user.findUnique({ where: { id: id as string } });
    if (!user) return next(new AppError('User not found', 404));

    if (user.role === 'SUPER_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
        return next(new AppError('Only Super Admin can delete a Super Admin', 403));
    }

    // Handle role-specific cleanup
    await prisma.$transaction(async (tx) => {
        // 1. Delete Interviews conducted by this user (if they were an interviewer)
        // We first need to find the interviewer record ID
        const interviewer = await tx.interviewer.findUnique({
            where: { userId: id as string },
            select: { id: true }
        });

        if (interviewer) {
            // Delete Evaluations for these interviews
            const interviews = await tx.interview.findMany({
                where: { interviewerId: interviewer.id },
                select: { id: true }
            });
            const interviewIds = interviews.map(i => i.id);
            
            await tx.evaluation.deleteMany({
                where: { interviewId: { in: interviewIds } }
            });

            // Delete the interviews themselves
            await tx.interview.deleteMany({
                where: { interviewerId: interviewer.id }
            });

            // Delete the interviewer profile
            await tx.interviewer.delete({
                where: { id: interviewer.id }
            });
        }

        // 2. Delete Notifications where user is the recipient
        await tx.notification.deleteMany({ where: { userId: id as string } });

        // 3. Delete Notifications where user is the admin (adminId)
        await tx.notification.deleteMany({ where: { adminId: id as string } });

        // 4. Delete AuditLogs created by this user
        await tx.auditLog.deleteMany({ where: { actorId: id as string } });

        // 5. Delete Student profile if exists
        await tx.student.deleteMany({ where: { userId: id as string } });

        // 6. Finally delete the User
        await tx.user.delete({ where: { id: id as string } });
    });

    res.json({
        status: 'success',
        message: 'User deleted successfully'
    });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, whatsapp, phone, profileImageUrl, profileImagePublicId } = req.body;
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
            return next(new AppError('Email already in use', 400));
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name: name || user.name,
            email: email || user.email,
            whatsapp: whatsapp !== undefined ? whatsapp : user.whatsapp,
            phone: phone !== undefined ? phone : user.phone,
            profileImageUrl: profileImageUrl !== undefined ? profileImageUrl : user.profileImageUrl,
            profileImagePublicId: profileImagePublicId !== undefined ? profileImagePublicId : user.profileImagePublicId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            whatsapp: true,
            profileImageUrl: true,
            profileImagePublicId: true
        }
    });

    res.json({
        status: 'success',
        data: updatedUser
    });
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError('Incorrect current password', 401));
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { 
            password: hashedPassword,
            isFirstLogin: false
        },
    });

    res.json({ 
        status: 'success',
        message: 'Password updated successfully' 
    });
});

export const updateNotificationPreferences = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { emailNotificationsEnabled, whatsappNotificationsEnabled } = req.body;
    const userId = req.user?.id;

    if (!userId) return next(new AppError('Unauthorized', 401));

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            emailNotificationsEnabled: emailNotificationsEnabled !== undefined ? emailNotificationsEnabled : undefined,
            whatsappNotificationsEnabled: whatsappNotificationsEnabled !== undefined ? whatsappNotificationsEnabled : undefined
        },
        select: {
            id: true,
            emailNotificationsEnabled: true,
            whatsappNotificationsEnabled: true
        }
    });

    res.json({
        status: 'success',
        message: 'Notification preferences updated',
        data: updatedUser
    });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        // Security: Don't reveal if user exists.
        return res.json({ status: 'success', message: 'If account exists, OTP sent.' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpires }
    });

    const { triggerNotification } = await import('../services/notificationService.js');
    triggerNotification(user.id, 'PASSWORD_RESET_OTP', {
        StudentName: user.name,
        TempPassword: otp // Reusing field for OTP
    });

    res.json({ status: 'success', message: 'OTP sent to email' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findFirst({ 
        where: { 
            email,
            otp,
            otpExpires: { gt: new Date() }
        } 
    });

    if (!user) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpires: null
        }
    });

    res.json({ status: 'success', message: 'Password reset successfully. Please login.' });
});
