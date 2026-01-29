import express from 'express';
import { getDashboardStats, getNotificationLogs, retryNotification } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('ADMIN', 'SUPER_ADMIN'), getDashboardStats);
router.get('/notifications', protect, authorize('ADMIN', 'SUPER_ADMIN'), getNotificationLogs);
router.post('/notifications/:id/retry', protect, authorize('ADMIN', 'SUPER_ADMIN'), retryNotification);

export default router;
