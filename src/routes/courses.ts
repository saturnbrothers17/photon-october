import express from 'express';
import { getCoursesPage } from '../controllers/coursesController';

const router = express.Router();

router.get('/', getCoursesPage);

export default router;