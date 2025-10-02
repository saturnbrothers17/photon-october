"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiExtractorController_1 = require("../controllers/aiExtractorController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/', authController_1.requireAuth, aiExtractorController_1.getAIExtractorPage);
router.post('/upload', authController_1.requireAuth, aiExtractorController_1.uploadImage, aiExtractorController_1.processImage);
exports.default = router;
