"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherDashboardController_1 = require("../controllers/teacherDashboardController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/', teacherDashboardController_1.getTeacherDashboardPage);
router.get('/create-test', authController_1.requireAuth, teacherDashboardController_1.getCreateTestPage);
router.post('/create-test', authController_1.requireAuth, teacherDashboardController_1.createTestHandler);
// New chunked upload endpoints - use API-specific auth middleware
router.post('/api/create-test-init', authController_1.requireAuthAPI, teacherDashboardController_1.createTestInitHandler);
router.post('/api/add-question', authController_1.requireAuthAPI, teacherDashboardController_1.addQuestionHandler);
router.post('/api/finalize-test', authController_1.requireAuthAPI, teacherDashboardController_1.finalizeTestHandler);
router.get('/materials', authController_1.requireAuth, teacherDashboardController_1.getMaterialsPage);
router.post('/materials/upload', authController_1.requireAuth, teacherDashboardController_1.uploadMiddleware, teacherDashboardController_1.uploadMaterialHandler);
router.get('/students', authController_1.requireAuth, teacherDashboardController_1.getStudentManagementPage);
router.get('/performance', authController_1.requireAuth, teacherDashboardController_1.getPerformanceAnalyticsPage);
router.get('/performance/test/:testId', authController_1.requireAuth, teacherDashboardController_1.getTestPerformanceData);
exports.default = router;
