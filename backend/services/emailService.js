const { google } = require('googleapis');

const createTransporter = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const sendOTP = async (email, otp) => {
  try {
    // Check if email config is provided
    if (!process.env.EMAIL_USER || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.log('-------------------------------------------');
      console.log(`📧 MOCK EMAIL to: ${email}`);
      console.log(`🔑 Your 2-Step Verification Code: ${otp}`);
      console.log('-------------------------------------------');
      console.log('⚠️ Set EMAIL_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN in .env to send real emails.');
      return true;
    }

    const gmail = createTransporter();

    const subject = 'Your 2-Step Verification Code';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: "Career Guidance Assistant" <${process.env.EMAIL_USER}>`,
      `To: ${email}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      `
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
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('✅ Email sent:', res.data.id);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    // In dev mode, we still return true so the flow doesn't break, but log the OTP
    console.log(`🔑 FALLBACK OTP for ${email}: ${otp}`);
    return false;
  }
};

module.exports = {
  sendOTP,
};
