import { Router } from 'express';
import { signup, verifyOTP, resendOTP } from '../controllers/authController';

const router = Router();

// Sign up route - collects email and account type
router.post('/signup', signup);

// Verify OTP route
router.post('/verify-otp', verifyOTP);

// Resend OTP route
router.post('/resend-otp', resendOTP);

export default router;
