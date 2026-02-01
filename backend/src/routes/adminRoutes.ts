import express from 'express';
import { getDashboardStats, getNotificationLogs, retryNotification, clearNotificationLogs, triggerPendingCredentials } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getDashboardStats);
router.get('/notifications', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getNotificationLogs);
router.delete('/notifications/clear', protect, authorize('ADMIN', 'SUPER_ADMIN'), clearNotificationLogs);
router.post('/notifications/:id/retry', protect, authorize('ADMIN', 'SUPER_ADMIN'), retryNotification);
router.post('/notifications/trigger-pending-credentials', protect, authorize('ADMIN', 'SUPER_ADMIN'), triggerPendingCredentials);

export default router;
