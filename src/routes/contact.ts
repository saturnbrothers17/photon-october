import express from 'express';
import { getContactPage } from '../controllers/contactController';

const router = express.Router();

router.get('/', getContactPage);
router.post('/', getContactPage);

export default router;