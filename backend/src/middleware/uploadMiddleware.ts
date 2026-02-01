import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// 1. Profile Image Storage (300KB, 600x600, WebP)
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (async (req: any, file: any) => {
    const identifier = req.user?.id || req.query.email || req.body.email || 'anonymous';
    const roleForFolder = (req.user?.role || 'anonymous').toLowerCase();
    return {
      folder: `tharqiya/profiles/${roleForFolder}/${identifier}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 600, height: 600, crop: 'limit' },
        { quality: 'auto:low' },
        { fetch_format: 'webp' }
      ],
    };
  }) as any,
});

// 2. Student Document Storage (500KB, PDF/Images)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (async (req: any, file: any) => {
    // Try to get identifier from various places
    const identifier = req.user?.id || req.query.email || req.body.email || 'anonymous';
    const subfolder = req.query.docType || 'documents';
    return {
      folder: `tharqiya/documents/${identifier}/${subfolder}`,
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
      resource_type: 'auto',
    };
  }) as any,
});

// 3. Faculty Photo Storage (300KB)
const facultyPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (async (req: any, file: any) => {
    return {
      folder: 'tharqiya/faculty',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 600, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ],
    };
  }) as any,
});

// 4. Alumni Photo Storage (300KB)
const alumniPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (async (req: any, file: any) => {
    return {
      folder: 'tharqiya/alumni',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 600, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ],
    };
  }) as any,
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
  limits: { fileSize: 500 * 1024 }, // 500 KB Limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Image documents (JPG, PNG) are allowed'), false);
    }
  }
});

export const facultyPhotoUpload = multer({
  storage: facultyPhotoStorage,
  limits: { fileSize: 300 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

export const alumniPhotoUpload = multer({
  storage: alumniPhotoStorage,
  limits: { fileSize: 300 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});
