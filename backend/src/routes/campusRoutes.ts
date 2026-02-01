
import express from 'express';
import { getCampuses, updateCampusCapacity, seedCampuses } from '../controllers/campusController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('ADMIN', 'PRINCIPAL', 'SUPER_ADMIN'), getCampuses);
router.put('/:id', protect, authorize('PRINCIPAL', 'SUPER_ADMIN'), updateCampusCapacity);
router.post('/seed', protect, authorize('PRINCIPAL', 'SUPER_ADMIN'), seedCampuses);

export default router;
