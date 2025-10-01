import express from 'express';
import { getAIExtractorPage, uploadImage, processImage } from '../controllers/aiExtractorController';
import { requireAuth } from '../controllers/authController';

const router = express.Router();

router.get('/', requireAuth, getAIExtractorPage);
router.post('/upload', requireAuth, uploadImage, processImage);

export default router;