const emailService = require("../utils/emailService");

// Send bill via email
const sendBillEmail = async (req, res) => {
  try {
    const { customerEmail, customerMobile, billData, pdfBase64 } = req.body;

    if (!customerEmail && !customerMobile) {
      return res.status(400).json({
        message: "Please provide either email or mobile number",
      });
    }

    if (!billData) {
      return res.status(400).json({
        message: "Bill data is required",
      });
    }

    // Prepare email content
    const emailSubject = `Your Bill from ${
      billData.restaurantName || "Our Restaurant"
    }`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #cc6600 0%, #b35500 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">${
            billData.restaurantName || "Restaurant"
          }</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Order Receipt</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #3b1a0b; margin-top: 0;">Order Details</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${
              billData.orderNumber || "N/A"
            }</p>
            <p style="margin: 5px 0;"><strong>Table:</strong> ${
              billData.tableName || "N/A"
            }</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${
              billData.orderDate
                ? new Date(billData.orderDate).toLocaleString()
                : new Date().toLocaleString()
            }</p>
          </div>
          
          <h3 style="color: #3b1a0b; margin-top: 25px;">Items Ordered</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                <th style="padding: 12px; text-align: left; color: #495057;">Item</th>
                <th style="padding: 12px; text-align: center; color: #495057;">Qty</th>
                <th style="padding: 12px; text-align: right; color: #495057;">Price</th>
                <th style="padding: 12px; text-align: right; color: #495057;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${billData.orderItems
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #e9ecef;">
                  <td style="padding: 12px;">${item.name}</td>
                  <td style="padding: 12px; text-align: center;">${
                    item.quantity
                  }</td>
                  <td style="padding: 12px; text-align: right;">₹${
                    item.price
                  }</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">₹${
                    item.price * item.quantity
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f8f9fa; border-top: 2px solid #dee2e6;">
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px; color: #3b1a0b;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #cc6600;">₹${billData.totalAmount.toFixed(
                  2
                )}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%); padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
            <p style="margin: 0; font-size: 18px; color: #3b1a0b; font-weight: 600;">Thank you for dining with us! 🍽️</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">We hope to see you again soon!</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
          <p style="margin: 0;">This is an automated email from ${
            billData.restaurantName || "our restaurant"
          }.</p>
          <p style="margin: 5px 0 0 0;">Powered by DineDesk POS System</p>
        </div>
      </div>
    `;

    // Prepare attachments if PDF is provided
    const attachments = pdfBase64
      ? [
          {
            filename: `Bill_${billData.orderNumber || Date.now()}.pdf`,
            content: pdfBase64,
            encoding: "base64",
          },
        ]
      : [];

    // Send email
    if (customerEmail) {
      await emailService.sendEmail(
        customerEmail,
        emailSubject,
        "Your order bill is attached.",
        emailHtml,
        attachments
      );

      return res.status(200).json({
        success: true,
        message: `Bill sent successfully to ${customerEmail}`,
      });
    }

    // For mobile, we would need SMS integration (not implemented here)
    if (customerMobile) {
      return res.status(200).json({
        success: true,
        message: "SMS sending is not yet implemented. Please provide email.",
      });
    }
  } catch (error) {
    console.error("Error sending bill:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send bill. Please try again.",
      error: error.message,
    });
  }
};

module.exports = {
  sendBillEmail,
};
