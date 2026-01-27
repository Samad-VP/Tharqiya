import express from 'express';
import { registerUser, loginUser, createUser, getUsers, updateProfile, updatePassword, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/users', protect, createUser);
router.get('/users', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getUsers);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
