import express from 'express';
import { getPendingApprovals, approveAllotment, overrideAllotment, getPrincipalStats, getPrincipalInsights } from '../controllers/principal.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are for PRINCIPAL only
router.use(protect);
router.use(authorize('PRINCIPAL', 'SUPER_ADMIN'));

router.get('/approvals', getPendingApprovals);
router.get('/dashboard-stats', getPrincipalStats);
router.get('/insights', getPrincipalInsights);

router.post('/approve-allotment', approveAllotment);
router.post('/override-allotment', overrideAllotment);

export default router;
