import express from 'express';
import { getIndexPage } from '../controllers/indexController';

const router = express.Router();

router.get('/', getIndexPage);

export default router;