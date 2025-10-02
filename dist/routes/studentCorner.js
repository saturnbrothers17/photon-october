"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentCornerController_1 = require("../controllers/studentCornerController");
const router = express_1.default.Router();
router.get('/', studentCornerController_1.getStudentCornerPage);
router.get('/materials', studentCornerController_1.getMaterialsPage);
router.get('/tests', studentCornerController_1.getTestsPage);
router.get('/tests/:id', studentCornerController_1.getTakeTestPage);
router.post('/submit-test', studentCornerController_1.submitTestHandler);
router.get('/results/:id', studentCornerController_1.getResultPage);
router.post('/ai-solution', studentCornerController_1.getAISolution);
router.get('/results', studentCornerController_1.getResultsPage);
exports.default = router;
