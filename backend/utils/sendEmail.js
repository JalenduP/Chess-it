const createTransporter = require('../config/email');

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Email templates
const getOTPEmailTemplate = (otp, type) => {
  const purpose = type === 'registration' ? 'verify your account' : 'reset your password';
  
  return {
    subject: `Your OTP Code - ${type === 'registration' ? 'Account Verification' : 'Password Reset'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .otp-box { background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
          .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>OTP Verification</h2>
          <p>Hello,</p>
          <p>You have requested to ${purpose}. Please use the following OTP code:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p class="warning">If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
      </body>
      </html>
    `,
    text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`
  };
};

module.exports = { sendEmail, getOTPEmailTemplate };