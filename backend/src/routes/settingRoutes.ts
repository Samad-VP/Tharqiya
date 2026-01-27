import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateSettings);

export default router;
