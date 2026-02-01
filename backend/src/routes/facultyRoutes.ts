import express from 'express';
import { createFaculty, getFaculties, updateFaculty, deleteFaculty } from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/auth.js';
import { facultyPhotoUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Basic routes
router.get('/', getFaculties);

// Admin only routes
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), createFaculty);
router.patch('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), updateFaculty);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), deleteFaculty);

// Specific upload route for faculty photo
router.post('/upload-photo', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), facultyPhotoUpload.single('file'), (req, res) => {
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
