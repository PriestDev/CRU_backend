import { Request, Response } from 'express';
import pool from '../config/database';

// Generate random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get client IP address
const getClientIP = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
         (req.headers['x-real-ip'] as string) || 
         req.ip || 
         'unknown';
};

// Signup handler - collects email and account type
export const signup = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { email, userRole } = req.body;
    const ipAddress = getClientIP(req);

    // Validate input
    if (!email || !userRole) {
      res.status(400).json({
        success: false,
        message: 'Email and user role are required',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
      return;
    }

    // Validate user role
    const validRoles = ['student', 'staff', 'visitor'];
    if (!validRoles.includes(userRole)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user role. Must be student, staff, or visitor',
      });
      return;
    }

    // Check if user already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP
    await connection.execute(
      'INSERT INTO users (email, role, verification_otp, otp_expiry, ip_address, is_verified) VALUES (?, ?, ?, ?, ?, false)',
      [email, userRole, otp, otpExpiry, ipAddress]
    );

    // TODO: Send OTP via email here
    console.log(`OTP for ${email}: ${otp}`); // For development only

    res.status(201).json({
      success: true,
      message: 'User created successfully. Check your email for OTP.',
      data: {
        email,
        role: userRole,
        isVerified: false,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Verify OTP handler
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
      return;
    }

    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const user = users[0] as any;

    // Check if already verified
    if (user.is_verified) {
      res.status(400).json({
        success: false,
        message: 'User is already verified',
      });
      return;
    }

    // Validate OTP
    if (user.verification_otp !== otp) {
      res.status(401).json({
        success: false,
        message: 'Invalid OTP',
      });
      return;
    }

    // Check OTP expiry
    if (!user.otp_expiry || new Date() > new Date(user.otp_expiry)) {
      res.status(401).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    // Mark user as verified
    await connection.execute(
      'UPDATE users SET is_verified = true, verification_otp = NULL, otp_expiry = NULL WHERE email = ?',
      [email]
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during OTP verification',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

// Resend OTP handler
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const user = users[0] as any;

    if (user.is_verified) {
      res.status(400).json({
        success: false,
        message: 'User is already verified',
      });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await connection.execute(
      'UPDATE users SET verification_otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email]
    );

    // TODO: Send OTP via email here
    console.log(`New OTP for ${email}: ${otp}`); // For development only

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully. Check your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resending OTP',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
