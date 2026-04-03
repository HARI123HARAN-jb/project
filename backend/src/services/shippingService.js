const axios = require('axios');

// Mock function for Delhivery/BlueDart Shipping API Integration
const createShippingWaybill = async (orderId, shippingDetails, amount) => {
  console.log(`[SHIPPING] Attempting to generate Waybill for Order: ${orderId}`);
  
  // Real Delhivery Integration requires hitting their /cmu/push/json endpoint
  // with a specific bulky JSON payload containing pickup & drop coordinates.
  if (!process.env.DELHIVERY_API_KEY || process.env.DELHIVERY_API_KEY === 'your_delhivery_api_key') {
    console.log(`[SHIPPING DEV MODE] Mocking Delhivery Waybill Generation.`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return a mocked successful response structure expected by our architecture
    return {
      success: true,
      waybillNumber: `SAI-AWB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      provider: 'Delhivery',
      estimatedDeliveryDays: 4,
      routingDetails: 'HUB-CHN-BLR'
    };
  }

  // The actual production logic would look like this:
  try {
    const payload = {
      format: 'json',
      data: {
        pickup_location: { name: "Sai Elite HQ", add: "Chennai", pin: "600001" },
        shipments: [
          {
            name: shippingDetails.name,
            add: shippingDetails.address,
            pin: shippingDetails.postalCode,
            city: shippingDetails.city,
            country: shippingDetails.country,
            phone: shippingDetails.phone,
            order: orderId,
            payment_mode: "Pre-paid", // Or COD based on logic
            total_amount: amount
          }
        ]
      }
    };

    const response = await axios.post(
      'https://track.delhivery.com/api/cmu/create.json',
      `format=json&data=${JSON.stringify(payload)}`,
      {
        headers: {
          'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      waybillNumber: response.data.packages[0].waybill,
      provider: 'Delhivery',
      estimatedDeliveryDays: response.data.packages[0].sort_code ? 3 : 5
    };
  } catch (error) {
    console.error('[SHIPPING ERROR]', error.response?.data || error.message);
    return { success: false, message: 'Failed to generate shipping waybill' };
  }
};

module.exports = {
  createShippingWaybill
};
