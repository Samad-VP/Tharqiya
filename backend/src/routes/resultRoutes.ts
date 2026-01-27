import express from 'express';
import { publishResult, approveResult } from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/approve', protect, authorize('SUPER_ADMIN'), approveResult);
router.post('/publish', protect, authorize('ADMIN', 'SUPER_ADMIN'), publishResult);

export default router;
