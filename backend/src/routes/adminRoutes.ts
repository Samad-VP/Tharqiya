import express from 'express';
import { getDashboardStats, getNotificationLogs } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('ADMIN', 'SUPER_ADMIN'), getDashboardStats);
router.get('/notifications', protect, authorize('ADMIN', 'SUPER_ADMIN'), getNotificationLogs);

export default router;
