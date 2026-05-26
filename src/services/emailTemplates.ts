export const generateOTPEmail = (otp: string, userRole: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Campus Ride - OTP Verification</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        
        .header-logo {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .content {
          padding: 40px;
          text-align: center;
        }
        
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .role-badge {
          display: inline-block;
          background-color: #f0f0f0;
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 24px;
        }
        
        .description {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        
        .otp-section {
          background: linear-gradient(135deg, #f5f7ff 0%, #f0f0ff 100%);
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 32px;
        }
        
        .otp-label {
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .otp-code {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #667eea;
          font-family: 'Courier New', monospace;
          word-spacing: 10px;
          margin-bottom: 16px;
        }
        
        .otp-expiry {
          font-size: 12px;
          color: #d9534f;
          font-weight: 600;
        }
        
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 13px;
          color: #856404;
        }
        
        .warning-title {
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .security-tips {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 13px;
          color: #666;
          line-height: 1.8;
        }
        
        .security-tips-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        
        .security-tips ul {
          margin-left: 20px;
        }
        
        .security-tips li {
          margin-bottom: 8px;
        }
        
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        
        .footer-link {
          color: #667eea;
          text-decoration: none;
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
        
        .divider {
          margin: 24px 0;
          border: none;
          border-top: 1px solid #eee;
        }
        
        .support-text {
          font-size: 12px;
          color: #999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-logo">🚗 Campus Ride</div>
          <div class="header-subtitle">Safe Transit for the University Community</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Welcome to Campus Ride!</div>
          <div class="role-badge">${userRole}</div>
          
          <div class="description">
            Your account verification is almost complete. Enter the code below to confirm your email address and get started.
          </div>
          
          <!-- OTP Section -->
          <div class="otp-section">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp.split('').join(' ')}</div>
            <div class="otp-expiry">⏱️ Expires in 10 minutes</div>
          </div>
          
          <!-- Warning -->
          <div class="warning">
            <div class="warning-title">⚠️ Important Security Notice</div>
            <p>Never share this code with anyone. Campus Ride support will never ask for your OTP code.</p>
          </div>
          
          <!-- Security Tips -->
          <div class="security-tips">
            <div class="security-tips-title">🔒 Security Tips:</div>
            <ul>
              <li>Only enter this code on the official Campus Ride website or app</li>
              <li>Check that the website URL starts with https://</li>
              <li>Delete this email after completing verification</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
          </div>
          
          <hr class="divider" />
          
          <div class="support-text">
            Need help? <a href="mailto:support@campusride.uniport.edu" class="footer-link">Contact Support</a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>© 2026 Campus Ride Uniport. All rights reserved.</p>
          <p style="margin-top: 12px; font-size: 11px;">
            This email was sent because an account was created with this email address.
            <br>
            <a href="https://campusride.uniport.edu/privacy" class="footer-link">Privacy Policy</a> | 
            <a href="https://campusride.uniport.edu/terms" class="footer-link">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateWelcomeEmail = (
  userEmail: string,
  tempPassword: string,
  userRole: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Campus Ride - Welcome to Your Account</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        
        .header-logo {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .content {
          padding: 40px;
          text-align: center;
        }
        
        .greeting {
          font-size: 24px;
          color: #333;
          margin-bottom: 12px;
          font-weight: 700;
        }
        
        .role-badge {
          display: inline-block;
          background-color: #f0f0f0;
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 24px;
        }
        
        .description {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        
        .credentials-section {
          background: linear-gradient(135deg, #f5f7ff 0%, #f0f0ff 100%);
          padding: 24px;
          border-radius: 10px;
          margin-bottom: 24px;
          text-align: left;
        }
        
        .credentials-title {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .credential-item {
          margin-bottom: 16px;
        }
        
        .credential-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .credential-value {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          font-family: 'Courier New', monospace;
          word-break: break-all;
          background-color: #fff;
          padding: 10px;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        
        .next-steps {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 13px;
          color: #666;
          line-height: 1.8;
        }
        
        .next-steps-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }
        
        .next-steps ol {
          margin-left: 20px;
        }
        
        .next-steps li {
          margin-bottom: 8px;
        }
        
        .security-note {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 24px;
          font-size: 13px;
          color: #856404;
        }
        
        .security-note-title {
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
        
        .footer-link {
          color: #667eea;
          text-decoration: none;
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
        
        .divider {
          margin: 24px 0;
          border: none;
          border-top: 1px solid #eee;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-logo">🎉 Welcome to Campus Ride!</div>
          <div class="header-subtitle">Your Account is Ready</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hello!</div>
          <div class="role-badge">${userRole}</div>
          
          <div class="description">
            Your Campus Ride account has been successfully created. We've generated a temporary password for you to get started. Please use the credentials below to log in.
          </div>
          
          <!-- Credentials Section -->
          <div class="credentials-section">
            <div class="credentials-title">🔐 Your Login Credentials</div>
            <div class="credential-item">
              <div class="credential-label">Email Address</div>
              <div class="credential-value">${userEmail}</div>
            </div>
            <div class="credential-item">
              <div class="credential-label">Temporary Password</div>
              <div class="credential-value">${tempPassword}</div>
            </div>
          </div>
          
          <!-- Security Note -->
          <div class="security-note">
            <div class="security-note-title">⚠️ Important Security Notice</div>
            <p>For your security, we strongly recommend that you change this temporary password immediately after your first login. Never share your password with anyone.</p>
          </div>
          
          <!-- Next Steps -->
          <div class="next-steps">
            <div class="next-steps-title">📋 Next Steps:</div>
            <ol>
              <li><strong>Verify your email:</strong> Complete the email verification process using the OTP sent in a separate email</li>
              <li><strong>Log in to your account:</strong> Use the email and temporary password above</li>
              <li><strong>Change your password:</strong> Go to settings and create a strong, personal password</li>
              <li><strong>Complete your profile:</strong> Add your profile information and preferences</li>
              <li><strong>Start booking rides:</strong> Enjoy safe transit across campus</li>
            </ol>
          </div>
          
          <a href="https://campusride.uniport.edu/login" class="cta-button">Go to Login Page</a>
          
          <hr class="divider" />
          
          <div style="font-size: 12px; color: #999; margin-top: 20px;">
            Questions? <a href="mailto:support@campusride.uniport.edu" class="footer-link">Contact our support team</a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>© 2026 Campus Ride Uniport. All rights reserved.</p>
          <p style="margin-top: 12px; font-size: 11px;">
            This email was sent because an account was created with this email address.
            <br>
            <a href="https://campusride.uniport.edu/privacy" class="footer-link">Privacy Policy</a> | 
            <a href="https://campusride.uniport.edu/terms" class="footer-link">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generatePasswordResetEmail = (resetToken: string): string => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>We received a request to reset your Campus Ride password. Click below to reset (link valid for 30 minutes):</p>
          <center><a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Reset Your Password</a></center>
          <p style="font-size: 12px; color: #666; word-break: break-all;">Or visit: ${resetLink}</p>
          <p style="background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107;">If you didn't request this, please ignore this email. Your account is safe.</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p style="margin: 0;">© 2026 Campus Ride Uniport. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
