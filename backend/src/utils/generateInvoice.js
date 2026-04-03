const PDFDocument = require('pdfkit');

const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Invoice_${order._id}.pdf`
  );

  doc.pipe(res);

  // Header
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('SAI ELITE INDIA', 50, 57)
    .fontSize(10)
    .text('123 Robotics Park, Industrial Estate', 200, 50, { align: 'right' })
    .text('Chennai, Tamil Nadu 600001, India', 200, 65, { align: 'right' })
    .text('GSTIN: 33AAAAA0000A1Z5', 200, 80, { align: 'right' })
    .moveDown();

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

  // Invoice details
  doc
    .fontSize(15)
    .text('TAX INVOICE', 50, 130)
    .fontSize(10)
    .text(`Order ID: ${order._id}`, 50, 150)
    .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 50, 165)
    .text(`Payment Status: ${order.isPaid ? 'PAID' : 'PENDING'}`, 50, 180)
    .text(`Delivery Method: ${order.paymentMethod}`, 50, 195);

  // Shipping details
  doc
    .text('Billed To:', 300, 130)
    .text(order.user?.name || 'Customer', 300, 150)
    .text(order.shippingAddress.address, 300, 165)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 300, 180)
    .text(order.shippingAddress.country, 300, 195);

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 220).lineTo(550, 220).stroke();

  // Item Table Header
  const tableTop = 250;
  doc
    .fontSize(10)
    .text('Item Description', 50, tableTop)
    .text('Quantity', 280, tableTop, { width: 90, align: 'right' })
    .text('Unit Price', 370, tableTop, { width: 90, align: 'right' })
    .text('Line Total', 470, tableTop, { width: 80, align: 'right' });

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 265).lineTo(550, 265).stroke();

  // Render Items
  let position = 280;
  order.orderItems.forEach((item, i) => {
    doc
      .fontSize(10)
      .text(item.name, 50, position)
      .text(item.qty.toString(), 280, position, { width: 90, align: 'right' })
      .text(`Rs. ${item.price.toFixed(2)}`, 370, position, { width: 90, align: 'right' })
      .text(`Rs. ${(item.price * item.qty).toFixed(2)}`, 470, position, { width: 80, align: 'right' });
    position += 20;
  });

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, position + 10).lineTo(550, position + 10).stroke();

  // Totals Breakdown
  const subtotalPosition = position + 30;
  
  // Calculate Base Price vs GST strictly for B2B/India Tax (assuming 18% standard IGST/CGST)
  const gstRate = 0.18;
  const taxableValue = order.itemsPrice / (1 + gstRate);
  const gstAmount = order.itemsPrice - taxableValue;

  doc.font('Helvetica-Bold');
  doc
    .text('Taxable Value:', 350, subtotalPosition, { width: 90, align: 'right' })
    .text(`Rs. ${taxableValue.toFixed(2)}`, 450, subtotalPosition, { width: 100, align: 'right' });

  doc
    .text('IGST (18%):', 350, subtotalPosition + 15, { width: 90, align: 'right' })
    .text(`Rs. ${gstAmount.toFixed(2)}`, 450, subtotalPosition + 15, { width: 100, align: 'right' });
    
  doc
    .text('Shipping:', 350, subtotalPosition + 30, { width: 90, align: 'right' })
    .text(`Rs. ${order.shippingPrice.toFixed(2)}`, 450, subtotalPosition + 30, { width: 100, align: 'right' });

  doc
    .fontSize(12)
    .text('Grand Total:', 350, subtotalPosition + 50, { width: 90, align: 'right' })
    .text(`Rs. ${order.totalPrice.toFixed(2)}`, 450, subtotalPosition + 50, { width: 100, align: 'right' });

  doc.font('Helvetica');

  doc
    .fontSize(9)
    .text('This is a computer generated invoice and requires no physical signature.', 50, 700, { align: 'center' });

  doc.end();
};

module.exports = { generateInvoicePDF };
