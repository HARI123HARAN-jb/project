const Order = require('../models/Order');
const { generateInvoicePDF } = require('../utils/generateInvoice');
const { sendWhatsAppUpdate } = require('../services/whatsappService');
const { createShippingWaybill } = require('../services/shippingService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    // Asynchronously dispatch WhatsApp order confirmation
    sendWhatsAppUpdate(req.user.phone, createdOrder._id, 'Confirmed & Being Processed').catch(console.error);

    // Generate Shipping Waybill
    const shippingData = await createShippingWaybill(
      createdOrder._id, 
      createdOrder.shippingAddress, 
      createdOrder.totalPrice
    );

    res.status(201).json({
      ...createdOrder.toObject(),
      shippingWaybill: shippingData.success ? shippingData.waybillNumber : null,
      courier: shippingData.success ? shippingData.provider : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download GST Invoice for order
// @route   GET /api/orders/:id/invoice
// @access  Private
const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this invoice' });
      }

      generateInvoicePDF(order, res);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  downloadInvoice,
};
