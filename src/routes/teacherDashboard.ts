import express from 'express';
import { getTeacherDashboardPage, getCreateTestPage, createTestHandler, getMaterialsPage, uploadMaterialHandler, uploadMiddleware, getStudentManagementPage, getPerformanceAnalyticsPage, getTestPerformanceData } from '../controllers/teacherDashboardController';
import { requireAuth } from '../controllers/authController';

const router = express.Router();

router.get('/', getTeacherDashboardPage);
router.get('/create-test', requireAuth, getCreateTestPage);
router.post('/create-test', requireAuth, createTestHandler);
router.get('/materials', requireAuth, getMaterialsPage);
router.post('/materials/upload', requireAuth, uploadMiddleware, uploadMaterialHandler);
router.get('/students', requireAuth, getStudentManagementPage);
router.get('/performance', requireAuth, getPerformanceAnalyticsPage);
router.get('/performance/test/:testId', requireAuth, getTestPerformanceData);

export default router;