import { Router } from 'express';
import { uploadSingleFile, uploadMultipleFiles } from '../controllers/uploadController.js';
import { profileImageUpload, documentUpload } from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * Public Uploads (Admission Registration)
 * These allow applicants to upload documents before creating an account.
 */
router.post('/image', profileImageUpload.single('file'), uploadSingleFile);
router.post('/document', documentUpload.single('file'), uploadSingleFile);

/**
 * Protected Uploads
 */
router.use(protect);

// Multiple file uploads (Remaining protected)
router.post('/images', profileImageUpload.array('files', 5), uploadMultipleFiles);
router.post('/documents', documentUpload.array('files', 5), uploadMultipleFiles);

// Specific profile image update (protected)
router.post('/profile', profileImageUpload.single('file'), uploadSingleFile);

export default router;
