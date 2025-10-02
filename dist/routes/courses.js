"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coursesController_1 = require("../controllers/coursesController");
const router = express_1.default.Router();
router.get('/', coursesController_1.getCoursesPage);
exports.default = router;
