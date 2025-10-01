import express from 'express';
import { showLogin, showRegister, handleLogin, handleRegister, handleLogout, showFacultyLogin, handleFacultyLogin } from '../controllers/authController';

const router = express.Router();

router.get('/login', showLogin);
router.post('/login', handleLogin);
router.get('/register', showRegister);
router.post('/register', handleRegister);
router.get('/faculty-login', showFacultyLogin);
router.post('/faculty-login', handleFacultyLogin);
router.get('/logout', handleLogout);

export default router;