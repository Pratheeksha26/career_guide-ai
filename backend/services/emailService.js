const axios = require('axios');

const sendOTP = async (email, otp) => {
  try {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER_EMAIL) {
      console.log('-------------------------------------------');
      console.log(`📧 MOCK EMAIL to: ${email}`);
      console.log(`🔑 Your 2-Step Verification Code: ${otp}`);
      console.log('-------------------------------------------');
      console.log('⚠️ Set SENDGRID_API_KEY and SENDGRID_SENDER_EMAIL in .env to send real emails.');
      return true;
    }

    const payload = {
      personalizations: [
        {
          to: [
            { email: email }
          ],
          subject: 'Your 2-Step Verification Code'
        }
      ],
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: 'Career Guidance'
      },
      content: [
        {
          type: 'text/html',
          value: `
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
          `
        }
      ]
    };

    await axios.post('https://api.sendgrid.com/v3/mail/send', payload, {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ OTP email sent to: ${email} (via SendGrid)`);
    return true;

  } catch (error) {
    console.error('❌ Email send error:', error.response?.data || error.message);
    // In dev mode, log the OTP so the flow doesn't break entirely
    console.log(`🔑 FALLBACK OTP for ${email}: ${otp}`);
    return false;
  }
};

module.exports = {
  sendOTP,
};
