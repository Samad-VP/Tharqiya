import express from 'express';
import { applyForAdmission, getMyStatus, getAllApplications, downloadApplicationPDF, downloadResultPDF, updateApplicationStatus, updateMyProfile, getMyNotifications } from '../controllers/admissionController.js';
import { submitPublicApplication } from '../controllers/publicAdmissionController.js';
import { confirmAdmission } from '../controllers/confirmAdmissionController.js';
import { verifyDocuments, generateProvisionalAllotment, submitAllotmentForApproval, processAdmission } from '../controllers/admissions.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/public/apply', submitPublicApplication);
router.post('/apply', protect, authorize('STUDENT'), applyForAdmission);
router.get('/my-status', protect, authorize('STUDENT'), getMyStatus);
router.get('/my-notifications', protect, authorize('STUDENT'), getMyNotifications);
router.get('/my-application/pdf', protect, authorize('STUDENT'), downloadApplicationPDF);
router.get('/my-result/pdf', protect, authorize('STUDENT'), downloadResultPDF);
router.post('/confirm', protect, authorize('STUDENT'), confirmAdmission);
router.patch('/my-profile', protect, authorize('STUDENT'), updateMyProfile);

// Admin Routes
router.get('/all', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getAllApplications);
router.patch('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateApplicationStatus);

// Internal Admin Operations
router.patch('/:applicationId/verify-docs', protect, authorize('ADMIN', 'SUPER_ADMIN'), verifyDocuments);
router.post('/generate-allotment', protect, authorize('ADMIN', 'SUPER_ADMIN'), generateProvisionalAllotment);
router.post('/submit-allotment', protect, authorize('ADMIN', 'SUPER_ADMIN'), submitAllotmentForApproval);
router.post('/:applicationId/process-admission', protect, authorize('ADMIN', 'SUPER_ADMIN'), processAdmission);


export default router;
