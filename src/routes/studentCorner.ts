import express from 'express';
import { getStudentCornerPage, getMaterialsPage, getTestsPage, getTakeTestPage, submitTestHandler, getResultPage, getAISolution, getResultsPage } from '../controllers/studentCornerController';

const router = express.Router();

router.get('/', getStudentCornerPage);
router.get('/materials', getMaterialsPage);
router.get('/tests', getTestsPage);
router.get('/tests/:id', getTakeTestPage);
router.post('/submit-test', submitTestHandler);
router.get('/results/:id', getResultPage);
router.post('/ai-solution', getAISolution);
router.get('/results', getResultsPage);

export default router;