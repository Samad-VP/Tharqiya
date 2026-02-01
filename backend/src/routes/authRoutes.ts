import express from 'express';
import { registerUser, loginUser, createUser, getUsers, updateUser, deleteUser, updateProfile, updatePassword, forgotPassword, resetPassword, updateNotificationPreferences } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/users', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), createUser);
router.get('/users', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getUsers);
router.put('/users/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), updateUser);
router.delete('/users/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), deleteUser);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/notification-preferences', protect, updateNotificationPreferences);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
