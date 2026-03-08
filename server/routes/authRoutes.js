import express from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { signupValidation, loginValidation, validate } from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
