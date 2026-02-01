import express from 'express';
import { createAlumni, getAlumnis, updateAlumni, deleteAlumni } from '../controllers/alumniController.js';
import { protect, authorize } from '../middleware/auth.js';
import { alumniPhotoUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Basic routes
router.get('/', getAlumnis);

// Admin only routes
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), createAlumni);
router.patch('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), updateAlumni);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), deleteAlumni);

// Specific upload route for alumni photo
router.post('/upload-photo', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), alumniPhotoUpload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const file = req.file as any;
    res.status(200).json({
        success: true,
        data: {
            url: file.path,
            public_id: file.filename
        }
    });
});

export default router;
