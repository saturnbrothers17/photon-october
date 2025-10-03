import express from 'express';
import { getTeacherDashboardPage, getCreateTestPage, createTestHandler, getMaterialsPage, uploadMaterialHandler, uploadMiddleware, getStudentManagementPage, getPerformanceAnalyticsPage, getTestPerformanceData, createTestInitHandler, addQuestionHandler, finalizeTestHandler } from '../controllers/teacherDashboardController';
import { requireAuth, requireAuthAPI } from '../controllers/authController';

const router = express.Router();

router.get('/', getTeacherDashboardPage);
router.get('/create-test', requireAuth, getCreateTestPage);
router.post('/create-test', requireAuth, createTestHandler);

// New chunked upload endpoints - use API-specific auth middleware
router.post('/api/create-test-init', requireAuthAPI, createTestInitHandler);
router.post('/api/add-question', requireAuthAPI, addQuestionHandler);
router.post('/api/finalize-test', requireAuthAPI, finalizeTestHandler);

router.get('/materials', requireAuth, getMaterialsPage);
router.post('/materials/upload', requireAuth, uploadMiddleware, uploadMaterialHandler);
router.get('/students', requireAuth, getStudentManagementPage);
router.get('/performance', requireAuth, getPerformanceAnalyticsPage);
router.get('/performance/test/:testId', requireAuth, getTestPerformanceData);

export default router;