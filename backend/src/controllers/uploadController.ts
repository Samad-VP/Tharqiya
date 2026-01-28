import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Helper to delete asset from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string, resourceType: string = 'image') => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
    }
};

export const uploadSingleFile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    // Handle replacement if oldPublicId is provided
    const { oldPublicId, resourceType } = req.body;
    if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId, resourceType || 'image');
    }

    res.status(200).json({
        status: 'success',
        data: {
            url: (req.file as any).path,
            public_id: (req.file as any).filename,
            original_name: req.file.originalname,
            format: req.file.mimetype.split('/')[1],
            resource_type: (req.file as any).resource_type || 'image'
        }
    });
});

export const uploadMultipleFiles = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const files = req.files as any[];
    
    if (!files || files.length === 0) {
        return next(new AppError('No files uploaded', 400));
    }

    const fileData = files.map(file => ({
        url: (file as any).path,
        public_id: (file as any).filename,
        original_name: file.originalname,
        format: file.mimetype.split('/')[1],
        resource_type: (file as any).resource_type || 'image'
    }));

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: fileData
    });
});
