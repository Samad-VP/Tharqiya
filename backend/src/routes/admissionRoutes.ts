import express from 'express';
import { applyForAdmission, getMyStatus, getAllApplications } from '../controllers/admissionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/apply', protect, authorize('STUDENT'), applyForAdmission);
router.get('/my-status', protect, authorize('STUDENT'), getMyStatus);
router.get('/all', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllApplications);

export default router;
