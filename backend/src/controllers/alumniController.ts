import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';

export const createAlumni = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, photoUrl, photoPublicId, place, status, institution, university, position, organization, order } = req.body;
    
    try {
        const alumni = await prisma.alumni.create({
            data: {
                name,
                photoUrl: photoUrl || null,
                photoPublicId: photoPublicId || null,
                place,
                status,
                institution: institution || null,
                university: university || null,
                position: position || null,
                organization: organization || null,
                order: order ? parseInt(order.toString()) : 0
            }
        });

        res.status(201).json({
            status: 'success',
            data: alumni
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Create Alumni Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const getAlumnis = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const alumnis = await prisma.alumni.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: alumnis
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Get Alumni Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const updateAlumni = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, photoUrl, photoPublicId, oldPublicId, place, status, institution, university, position, organization, order } = req.body;

    try {
        if (oldPublicId && photoPublicId && oldPublicId !== photoPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (err) {
                console.error('Cloudinary deletion failed:', err);
            }
        }

        const alumni = await prisma.alumni.update({
            where: { id: id as string },
            data: {
                name,
                photoUrl: photoUrl || null,
                photoPublicId: photoPublicId || null,
                place,
                status,
                institution: institution || null,
                university: university || null,
                position: position || null,
                organization: organization || null,
                order: order !== undefined ? parseInt(order.toString()) : undefined
            }
        });

        res.status(200).json({
            status: 'success',
            data: alumni
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Update Alumni Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});

export const deleteAlumni = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try {
        const alumni = await prisma.alumni.findUnique({ where: { id: id as string } });
        
        if (!alumni) {
            return next(new AppError('Alumni record not found', 404));
        }

        if (alumni.photoPublicId) {
            try {
                await cloudinary.uploader.destroy(alumni.photoPublicId);
            } catch (err) {
                console.error('Cloudinary deletion failed:', err);
            }
        }

        await prisma.alumni.delete({ where: { id: id as string } });

        res.status(200).json({
            status: 'success',
            message: 'Alumni deleted successfully'
        });
    } catch (error: any) {
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Delete Alumni Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
});
