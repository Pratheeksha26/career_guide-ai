const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOTP = async (email, otp) => {
  try {
    // Check if email config is provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('-------------------------------------------');
      console.log(`📧 MOCK EMAIL to: ${email}`);
      console.log(`🔑 Your 2-Step Verification Code: ${otp}`);
      console.log('-------------------------------------------');
      console.log('⚠️ Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env to send real emails.');
      return true;
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Career Guidance Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your 2-Step Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a90e2; text-align: center;">Security Verification</h2>
          <p>Hello,</p>
          <p>You recently tried to sign in to your Career Guidance account. To complete your sign-in, please use the following 6-digit verification code:</p>
          <div style="background-color: #f4f7f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0; border-radius: 5px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this code, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    });

    console.log(`✅ OTP email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    // In dev mode, log the OTP so the flow doesn't break entirely
    console.log(`🔑 FALLBACK OTP for ${email}: ${otp}`);
    return false;
  }
};

module.exports = {
  sendOTP,
};
