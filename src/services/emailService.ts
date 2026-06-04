import nodemailer from 'nodemailer';
import { generateOTPEmail, generateWelcomeEmail, generatePasswordResetEmail } from './emailTemplates';

const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;
const gmailHost = process.env.GMAIL_HOST || 'smtp.gmail.com';
const gmailPort = parseInt(process.env.GMAIL_PORT || '465', 10);
const gmailSecure = process.env.GMAIL_SECURE ? process.env.GMAIL_SECURE === 'true' : true;

if (!gmailUser || !gmailPassword) {
  console.error('❌ Gmail configuration error: missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
}

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  host: gmailHost,
  port: gmailPort,
  secure: gmailSecure,
  auth: gmailUser && gmailPassword ? { user: gmailUser, pass: gmailPassword } : undefined,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
});

const isGmailConfigured = Boolean(gmailUser && gmailPassword);

const assertGmailConfig = (): boolean => {
  if (!isGmailConfigured) {
    console.error('❌ Gmail configuration error: missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
    return false;
  }
  return true;
};

// Verify connection configuration only when credentials are present
if (isGmailConfigured) {
  transporter.verify((error, _success) => {
    if (error) {
      console.log('❌ Gmail configuration error:', error);
    } else {
      console.log('✅ Gmail SMTP server is ready to send emails');
    }
  });
}

interface SendOTPEmailOptions {
  email: string;
  otp: string;
  userRole: string;
}

export const sendOTPEmail = async ({
  email,
  otp,
  userRole,
}: SendOTPEmailOptions): Promise<boolean> => {
  if (!assertGmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generateOTPEmail(otp, userRole);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🔐 Your Campus Ride OTP Verification Code',
      html: htmlContent,
      text: `Your OTP is: ${otp}. This code expires in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    return false;
  }
};

interface SendWelcomeEmailOptions {
  email: string;
  password: string;
  userRole: string;
}

export const sendWelcomeEmail = async ({
  email,
  password,
  userRole,
}: SendWelcomeEmailOptions): Promise<boolean> => {
  if (!assertGmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generateWelcomeEmail(email, password, userRole);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Campus Ride - Your Account is Ready!',
      html: htmlContent,
      text: `Welcome to Campus Ride! Your temporary password is: ${password}. Please log in and change your password for security.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    return false;
  }
};

interface SendPasswordResetEmailOptions {
  email: string;
  resetToken: string;
}

export const sendPasswordResetEmail = async ({
  email,
  resetToken,
}: SendPasswordResetEmailOptions): Promise<boolean> => {
  if (!assertGmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generatePasswordResetEmail(resetToken);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset Request for Campus Ride',
      html: htmlContent,
      text: `Reset your password here: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}. This link expires in 30 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error);
    return false;
  }
};
