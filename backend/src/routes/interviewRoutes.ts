import express from 'express';
import { scheduleInterview, getAssignedInterviews, getAllInterviews, batchScheduleInterviews, updateInterview, getMyProfile, updateMyProfile } from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/schedule', protect, authorize('ADMIN', 'SUPER_ADMIN'), scheduleInterview);
router.get('/assigned', protect, authorize('INTERVIEWER'), getAssignedInterviews);
router.get('/all', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllInterviews);
router.post('/batch-schedule', protect, authorize('ADMIN', 'SUPER_ADMIN'), batchScheduleInterviews);
router.patch('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateInterview);
router.get('/me', protect, authorize('INTERVIEWER'), getMyProfile);
router.patch('/me', protect, authorize('INTERVIEWER'), updateMyProfile);

export default router;
