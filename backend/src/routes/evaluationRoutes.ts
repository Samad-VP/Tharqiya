import express from 'express';
import { submitEvaluation } from '../controllers/evaluationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/submit', protect, authorize('INTERVIEWER'), submitEvaluation);

export default router;
