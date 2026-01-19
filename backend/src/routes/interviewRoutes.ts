import express from 'express';
import { scheduleInterview, getAssignedInterviews } from '../controllers/interviewController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/schedule', protect, authorize('ADMIN', 'SUPER_ADMIN'), scheduleInterview);
router.get('/assigned', protect, authorize('INTERVIEWER'), getAssignedInterviews);

export default router;
