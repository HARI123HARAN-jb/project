const twilio = require('twilio');

const sendWhatsAppUpdate = async (phone, orderId, status) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_twilio_sid') {
    console.log(`[DEV MODE] Mock WhatsApp message sent to ${phone}: Order ${orderId} is now ${status}`);
    return true;
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // Note: Twilio requires numbers to be prefixed with 'whatsapp:' and country code
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    await client.messages.create({
      body: `Sai Elite India Update 🤖\nYour order #${orderId} is currently: *${status}*. Thank you for shopping with us!`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      to: `whatsapp:${formattedPhone}`
    });
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

module.exports = {
  sendWhatsAppUpdate
};
