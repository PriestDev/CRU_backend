import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { generateOTPEmail, generateWelcomeEmail, generatePasswordResetEmail, getEmailAppUrl } from './emailTemplates';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPassword = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
const smtpHost = process.env.SMTP_HOST || process.env.GMAIL_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || (smtpHost.includes('gmail') ? '587' : '465'), 10);
const smtpSecure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : smtpPort === 465;
const sendgridFromValue = process.env.SENDGRID_FROM || smtpUser || 'no-reply@campusride.com';
const sendgridReplyToValue = process.env.SENDGRID_REPLY_TO || sendgridFromValue;

const parseSender = (value: string) => {
  const trimmed = value.trim();
  const displayRegex = /^(?:(?:"?([^\"]*)"?)\s*)?<([^>]+)>$/;
  const match = trimmed.match(displayRegex);

  if (match) {
    const name = match[1]?.trim();
    const email = match[2].trim();
    return { email, name: name || undefined };
  }

  return { email: trimmed };
};

const defaultSender = parseSender(sendgridFromValue);
const defaultReplyTo = parseSender(sendgridReplyToValue);
const sendgridFrom = defaultSender.name
  ? { email: defaultSender.email, name: defaultSender.name }
  : defaultSender.email;
const sendgridReplyTo = defaultReplyTo.name
  ? { email: defaultReplyTo.email, name: defaultReplyTo.name }
  : defaultReplyTo.email;

const useSendgrid = Boolean(sendgridApiKey);
const isSmtpConfigured = Boolean(smtpUser && smtpPassword);

if (useSendgrid) {
  sgMail.setApiKey(sendgridApiKey as string);
  console.log('✅ SendGrid configured, using SendGrid to send emails');
} else if (isSmtpConfigured) {
  console.log('✅ SMTP configured, using SMTP transporter to send emails');
} else {
  console.error('❌ Email configuration error: missing SENDGRID_API_KEY or SMTP_USER/SMTP_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD environment variables');
}

// Configure SMTP transporter only when SMTP settings exist
const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPassword },
      requireTLS: !smtpSecure,
      ignoreTLS: false,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })
  : undefined;

const assertEmailConfig = (): boolean => {
  if (useSendgrid) {
    return true;
  }

  if (isSmtpConfigured) {
    return true;
  }

  console.error('❌ Email configuration error: missing SENDGRID_API_KEY or SMTP_USER/SMTP_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD environment variables');
  return false;
};

// Verify SMTP only when configured
if (isSmtpConfigured && transporter) {
  transporter.verify((error, _success) => {
    if (error) {
      console.log('❌ SMTP configuration error:', error);
    } else {
      console.log('✅ SMTP server is ready to send emails');
    }
  });
}

type MailSender = string | { email: string; name?: string };

const normalizeMailSender = (sender: MailSender) =>
  typeof sender === 'string'
    ? sender
    : sender.name
    ? { name: sender.name, address: sender.email }
    : sender.email;

const sendEmail = async (mailOptions: {
  from: MailSender;
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  if (useSendgrid) {
    const message = {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
      replyTo: sendgridReplyTo,
      headers: {
        'X-SendGrid-Category': 'campus-ride',
      },
    };

    const [response] = await sgMail.send(message);
    return response;
  }

  if (!transporter) {
    throw new Error('SMTP transporter is not configured');
  }

  const transporterOptions = {
    ...mailOptions,
    from: normalizeMailSender(mailOptions.from),
    replyTo: normalizeMailSender(sendgridReplyTo),
  };

  return transporter.sendMail(transporterOptions);
};

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
  if (!assertEmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generateOTPEmail(otp, userRole);

    const mailOptions = {
      from: sendgridFrom,
      to: email,
      subject: 'Your Campus Ride verification code',
      html: htmlContent,
      text: `Your OTP is: ${otp}. This code expires in 10 minutes.`,
    };

    await sendEmail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
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
  if (!assertEmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generateWelcomeEmail(email, password, userRole);

    const mailOptions = {
      from: sendgridFrom,
      to: email,
      subject: 'Welcome to Campus Ride - Your account is ready',
      html: htmlContent,
      text: `Welcome to Campus Ride! Your temporary password is: ${password}. Please log in and change your password for security.`,
    };

    await sendEmail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
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
  if (!assertEmailConfig()) {
    return false;
  }

  try {
    const htmlContent = generatePasswordResetEmail(resetToken);

    const mailOptions = {
      from: sendgridFrom,
      to: email,
      subject: 'Campus Ride password reset request',
      html: htmlContent,
      text: `Reset your password here: ${getEmailAppUrl(`/reset-password?token=${encodeURIComponent(resetToken)}`)}. This link expires in 30 minutes.`,
    };

    await sendEmail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error);
    return false;
  }
};
