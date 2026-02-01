import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';

export const createFaculty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, position, category, department, photoUrl, photoPublicId, order } = req.body;
    
    try {
        const faculty = await prisma.faculty.create({
            data: {
                name,
                position,
                category,
                department,
                photoUrl: photoUrl || null,
                photoPublicId: photoPublicId || null,
                order: order ? parseInt(order.toString()) : 0
            }
        });

        res.status(201).json({
            status: 'success',
            data: faculty
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Create Faculty Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const getFaculties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faculties = await prisma.faculty.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: faculties
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Get Faculties Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const updateFaculty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, position, category, department, photoUrl, photoPublicId, oldPublicId, order } = req.body;

    try {
        // Delete old photo from Cloudinary if a new one is uploaded
        if (oldPublicId && photoPublicId && oldPublicId !== photoPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (err) {
                console.error('Cloudinary deletion failed:', err);
            }
        }

        const faculty = await prisma.faculty.update({
            where: { id: id as string },
            data: {
                name,
                position,
                category,
                department,
                photoUrl: photoUrl || null,
                photoPublicId: photoPublicId || null,
                order: order !== undefined ? parseInt(order.toString()) : undefined
            }
        });

        res.status(200).json({
            status: 'success',
            data: faculty
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Update Faculty Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const deleteFaculty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const faculty = await prisma.faculty.findUnique({ where: { id: id as string } });
        
        if (!faculty) {
            return next(new AppError('Faculty member not found', 404));
        }

        if (faculty.photoPublicId) {
            try {
                await cloudinary.uploader.destroy(faculty.photoPublicId);
            } catch (err) {
                console.error('Cloudinary deletion failed:', err);
            }
        }

        await prisma.faculty.delete({ where: { id: id as string } });

        res.status(200).json({
            status: 'success',
            message: 'Faculty deleted successfully'
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Delete Faculty Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});
