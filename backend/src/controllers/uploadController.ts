import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const uploadSingleFile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            url: (req.file as any).path,
            public_id: (req.file as any).filename,
            original_name: req.file.originalname,
            format: req.file.mimetype.split('/')[1]
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
        format: file.mimetype.split('/')[1]
    }));

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: fileData
    });
});
