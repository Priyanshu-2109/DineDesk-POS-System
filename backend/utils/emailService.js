const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate HTML receipt template
const generateReceiptHTML = (order) => {
  const { orderNumber, table, restaurant, items, totalAmount, totalItems, orderDate, completedAt } = order;
  
  const itemsHTML = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 8px; text-align: left;">${item.item_name}</td>
      <td style="padding: 12px 8px; text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: 600;">₹${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - ${orderNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .order-info { background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .info-row:last-child { margin-bottom: 0; }
        .label { font-weight: 600; color: #555; }
        .value { color: #333; }
        .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
        .items-table th { background-color: #667eea; color: white; padding: 15px 8px; text-align: left; font-weight: 600; }
        .items-table th:nth-child(2), .items-table th:nth-child(3) { text-align: center; }
        .items-table th:nth-child(4) { text-align: right; }
        .total-section { background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin-top: 25px; }
        .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .total-row:last-child { margin-bottom: 0; padding-top: 10px; border-top: 2px solid #667eea; font-size: 20px; font-weight: 700; color: #667eea; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .thank-you { color: #667eea; font-size: 18px; font-weight: 600; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Order Receipt</h1>
          <p>Thank you for dining with us!</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Order Information -->
          <div class="order-info">
            <div class="info-row">
              <span class="label">Order Number:</span>
              <span class="value">${orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Restaurant:</span>
              <span class="value">${restaurant?.name || 'DineDesk Restaurant'}</span>
            </div>
            <div class="info-row">
              <span class="label">Table:</span>
              <span class="value">${table?.name || 'N/A'} (${table?.capacity || 0} seats)</span>
            </div>
            <div class="info-row">
              <span class="label">Order Date:</span>
              <span class="value">${new Date(orderDate).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Completed At:</span>
              <span class="value">${new Date(completedAt).toLocaleString()}</span>
            </div>
          </div>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Total Section -->
          <div class="total-section">
            <div class="total-row">
              <span>Total Items:</span>
              <span>${totalItems}</span>
            </div>
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${totalAmount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div class="total-row">
              <span>Grand Total:</span>
              <span>₹${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="thank-you">Thank you for choosing us!</div>
          <p>We hope you enjoyed your dining experience. Please visit us again soon!</p>
          <p style="margin-top: 15px; font-size: 12px; color: #999;">
            This is an automated receipt from DineDesk POS System.<br>
            For any queries, please contact the restaurant directly.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order receipt email
const sendOrderReceipt = async (order, customerEmail) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
    }

    console.log('Creating transporter for email:', process.env.EMAIL_USER);
    const transporter = createTransporter();
    
    // Verify transporter configuration
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    
    const mailOptions = {
      from: {
        name: order.restaurant?.name || 'DineDesk Restaurant',
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: `Order Receipt - ${order.orderNumber} | ${order.restaurant?.name || 'DineDesk'}`,
      html: generateReceiptHTML(order),
      text: `
Order Receipt
=============

Order Number: ${order.orderNumber}
Restaurant: ${order.restaurant?.name || 'DineDesk Restaurant'}
Table: ${order.table?.name || 'N/A'}
Date: ${new Date(order.orderDate).toLocaleString()}
Completed: ${new Date(order.completedAt).toLocaleString()}

Items:
${order.items.map(item => 
  `- ${item.item_name} x${item.quantity} @ ₹${item.price} = ₹${item.subtotal}`
).join('\n')}

Total Items: ${order.totalItems}
Grand Total: ₹${order.totalAmount.toFixed(2)}

Thank you for dining with us!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Receipt email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Receipt sent successfully'
    };
    
  } catch (error) {
    console.error('Error sending receipt email:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send receipt email'
    };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderReceipt,
  testEmailConfig
};