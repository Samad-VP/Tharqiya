import express from 'express';
import { getEligibleForAllotment, proposeAllotment, finalizeAllotments } from '../controllers/allotmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/eligible', authorize('PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), getEligibleForAllotment);
router.post('/propose', authorize('PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), proposeAllotment);
router.post('/finalize', authorize('PRINCIPAL', 'SUPER_ADMIN'), finalizeAllotments);

export default router;
