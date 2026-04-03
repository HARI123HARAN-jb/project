const twilio = require('twilio');

const sendOtp = async (phone, otp) => {
  // Format to standard Indian E.164 for Twilio if it purely 10 digits
  const formattedPhone = phone.length === 10 ? `+91${phone}` : phone;

  // If no credentials, simulate SMS delivery successfully for testing
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_twilio_sid') {
    console.log(`\n================================`);
    console.log(`[DEV MODE] 📱 SMS SIMULATION`);
    console.log(`To: ${formattedPhone}`);
    console.log(`Message: Your Sai Elite India login OTP is: ${otp}`);
    console.log(`================================\n`);
    return true;
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your Sai Elite India login OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP via Twilio:', error);
    return false;
  }
};

module.exports = {
  sendOtp
};
