import { Router } from 'express';
import { uploadSingleFile, uploadMultipleFiles } from '../controllers/uploadController.js';
import { uploadImage, uploadDoc } from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all upload routes
router.use(protect);

// Image uploads
router.post('/image', uploadImage.single('file'), uploadSingleFile);
router.post('/images', uploadImage.array('files', 5), uploadMultipleFiles);

// Document uploads (PDFs, etc.)
router.post('/document', uploadDoc.single('file'), uploadSingleFile);
router.post('/documents', uploadDoc.array('files', 5), uploadMultipleFiles);

export default router;
