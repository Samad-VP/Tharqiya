import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { Request } from 'express';

// Configure storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tharqiya/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req: any, file: any) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  } as any,
});

// Configure storage for documents (PDFs, docs)
const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tharqiya/documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: (req: any, file: any) => `${Date.now()}-${file.originalname.split('.')[0]}`,
    resource_type: 'raw', // Critical for non-image files
  } as any,
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadDoc = multer({ storage: docStorage });
