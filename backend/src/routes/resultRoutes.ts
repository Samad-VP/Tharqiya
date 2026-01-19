import express from 'express';
import { publishResult } from '../controllers/resultController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/publish', protect, authorize('ADMIN', 'SUPER_ADMIN'), publishResult);

export default router;
