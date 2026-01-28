import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// 1. Profile Image Storage (300KB, 600x600, WebP)
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tharqiya/users/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 600, height: 600, crop: 'limit' },
      { quality: 'auto:low' },
      { fetch_format: 'webp' }
    ],
  } as any,
});

// 2. Student Document Storage (2MB, PDF only)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tharqiya/students/documents',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  } as any,
});

// Strict Multer Uploads
export const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 300 * 1024 }, // 300 KB
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpg, jpeg, png, webp)'), false);
    }
  }
});

export const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed'), false);
    }
  }
});
