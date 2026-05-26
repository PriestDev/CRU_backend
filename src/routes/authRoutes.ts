import { Router } from 'express';
import { signup, verifyOTP, resendOTP, login, forgotPassword, resetPassword } from '../controllers/authController';

const router = Router();

// Sign up route - collects email and account type
router.post('/signup', signup);

// Verify OTP route
router.post('/verify-otp', verifyOTP);

// Resend OTP route
router.post('/resend-otp', resendOTP);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

export default router;
