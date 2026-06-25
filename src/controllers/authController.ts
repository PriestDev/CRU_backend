import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService';

// Generate random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random password
const generatePassword = (): string => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Get client IP address
const getClientIP = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
         (req.headers['x-real-ip'] as string) || 
         req.ip || 
         'unknown';
};

// Generate JWT token
const generateJWT = (userId: number, email: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const jwtExpiry = process.env.JWT_EXPIRY || '24h';

  return jwt.sign(
    {
      id: userId,
      email,
      role,
    },
    jwtSecret,
    { expiresIn: jwtExpiry as jwt.SignOptions['expiresIn'] }
  );
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
    const validRoles = ['student', 'staff', 'driver', 'visitor'];
    if (!validRoles.includes(userRole)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user role. Must be student, staff, driver, or visitor',
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

    // Generate OTP and Password
    const otp = generateOTP();
    const password = generatePassword();
    const passwordHash = await bcryptjs.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP and hashed password
    const insertResult = await connection.execute(
      'INSERT INTO users (email, role, password_hash, verification_otp, otp_expiry, ip_address, is_verified) VALUES (?, ?, ?, ?, ?, ?, false)',
      [email, userRole, passwordHash, otp, otpExpiry, ipAddress]
    );
    
    console.log(`✅ User created successfully:`, {
      email,
      role: userRole,
      insertResult: (insertResult as any)[0],
    });

    // Send OTP via email
    const otpEmailSent = await sendOTPEmail({
      email,
      otp,
      userRole,
    });

    // Send Welcome email with password
    const welcomeEmailSent = await sendWelcomeEmail({
      email,
      password,
      userRole,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully. Check your email for OTP and temporary password.',
      data: {
        email,
        role: userRole,
        isVerified: false,
        otpEmailSent,
        welcomeEmailSent,
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

    // Send OTP via email
    try {
      await sendOTPEmail({ email, otp, userRole: user.role });
      console.log(`✅ OTP resent successfully to ${email}`);
    } catch (emailError) {
      console.error('Error sending resend OTP email:', emailError);
      // Still return success as OTP was generated and stored
    }

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

// Login handler
export const login = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
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
        message: 'Email or password is incorrect',
      });
      return;
    }

    const user = users[0] as any;

    // Check if user is verified
    if (!user.is_verified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email or password is incorrect',
      });
      return;
    }

    // Login successful
    const token = generateJWT(user.id, user.email, user.role);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const { email } = req.body;

    // Validate input
    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Check if user exists
    const [users] = await connection.execute('SELECT id, email, role FROM users WHERE email = ?', [email]);

    if (!Array.isArray(users) || users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Email not found',
      });
      return;
    }

    const user = (users[0] as any);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update user with reset token
    await connection.execute('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [
      resetToken,
      resetTokenExpiry,
      user.id,
    ]);

    // Send password reset email
    const emailSent = await sendPasswordResetEmail({
      email,
      resetToken,
    });

    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || typeof token !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Reset token is required',
      });
      return;
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Find user with valid reset token
    const [users] = await connection.execute(
      'SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (!Array.isArray(users) || users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
      return;
    }

    const user = (users[0] as any);

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update password and clear reset token
    await connection.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    connection.release();
  }
};
