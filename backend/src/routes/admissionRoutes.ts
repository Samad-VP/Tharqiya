import express from 'express';
import { applyForAdmission, getMyStatus, getAllApplications, downloadApplicationPDF, downloadResultPDF, downloadAllotmentPDF, downloadApplicantsListPDF, updateApplicationStatus, updateMyProfile, getMyNotifications, markNotificationsRead, deleteApplication } from '../controllers/admissionController.js';
import { submitPublicApplication } from '../controllers/publicAdmissionController.js';
import { confirmAdmission } from '../controllers/confirmAdmissionController.js';
import { verifyDocuments, generateProvisionalAllotment, submitAllotmentForApproval, processAdmission } from '../controllers/admissions.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/public/apply', submitPublicApplication);
router.post('/apply', protect, authorize('STUDENT'), applyForAdmission);
router.get('/my-status', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), getMyStatus);
router.get('/my-notifications', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), getMyNotifications);
router.patch('/notifications/read', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), markNotificationsRead);
router.get('/my-application/pdf', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), downloadApplicationPDF);
router.get('/my-result/pdf', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), downloadResultPDF);
router.get('/my-allotment/pdf', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), downloadAllotmentPDF);
router.post('/confirm', protect, authorize('STUDENT'), confirmAdmission);
router.patch('/my-profile', protect, authorize('STUDENT', 'PRINCIPAL', 'ADMIN', 'SUPER_ADMIN'), updateMyProfile);

// Admin Routes
router.get('/all', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), getAllApplications);
router.get('/applicants/pdf', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PRINCIPAL'), downloadApplicantsListPDF);
router.patch('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateApplicationStatus);

// Internal Admin Operations
router.patch('/:applicationId/verify-docs', protect, authorize('ADMIN', 'SUPER_ADMIN'), verifyDocuments);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteApplication);
router.post('/generate-allotment', protect, authorize('ADMIN', 'SUPER_ADMIN'), generateProvisionalAllotment);
router.post('/submit-allotment', protect, authorize('ADMIN', 'SUPER_ADMIN'), submitAllotmentForApproval);
router.post('/:applicationId/process-admission', protect, authorize('ADMIN', 'SUPER_ADMIN'), processAdmission);


export default router;
