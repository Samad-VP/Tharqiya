import express from 'express';
import { submitEvaluation } from '../controllers/evaluationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', protect, authorize('INTERVIEWER'), submitEvaluation);

export default router;
