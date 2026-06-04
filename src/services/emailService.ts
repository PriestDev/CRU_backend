import nodemailer from 'nodemailer';
import { generateOTPEmail, generateWelcomeEmail, generatePasswordResetEmail } from './emailTemplates';

const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPassword = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
const smtpHost = process.env.SMTP_HOST || process.env.GMAIL_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || (smtpHost.includes('gmail') ? '587' : '465'), 10);
const smtpSecure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : smtpPort === 465;

if (!smtpUser || !smtpPassword) {
  console.error('❌ SMTP configuration error: missing SMTP_USER/SMTP_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD environment variables');
}

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPassword ? { user: smtpUser, pass: smtpPassword } : undefined,
  requireTLS: !smtpSecure,
  ignoreTLS: false,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const isSmtpConfigured = Boolean(smtpUser && smtpPassword);

const assertSmtpConfig = (): boolean => {
  if (!isSmtpConfigured) {
    console.error('❌ SMTP configuration error: missing SMTP_USER/SMTP_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD environment variables');
    return false;
  }
  return true;
};

// Verify connection configuration only when credentials are present
if (isSmtpConfigured) {
  transporter.verify((error, _success) => {
    if (error) {
      console.log('❌ SMTP configuration error:', error);
    } else {
      console.log('✅ SMTP server is ready to send emails');
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
  if (!assertSmtpConfig()) {
    return false;
  }

  try {
    const htmlContent = generateOTPEmail(otp, userRole);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${smtpUser}>`,
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
  if (!assertSmtpConfig()) {
    return false;
  }

  try {
    const htmlContent = generateWelcomeEmail(email, password, userRole);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${smtpUser}>`,
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
  if (!assertSmtpConfig()) {
    return false;
  }

  try {
    const htmlContent = generatePasswordResetEmail(resetToken);

    const mailOptions = {
      from: `"Campus Ride Uniport" <${smtpUser}>`,
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
