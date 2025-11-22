const nodemailer = require("nodemailer");

// Create transporter for sending emails
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn(
      "⚠️ Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file"
    );
    console.warn(
      "For Gmail: Use App Password from https://myaccount.google.com/apppasswords"
    );
  }

  return nodemailer.createTransport({
    service: "gmail", // Using Gmail service (you can change this)
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
    tls: {
      rejectUnauthorized: false, // For development only
    },
  });
};

// Generate HTML receipt template
const generateReceiptHTML = (order) => {
  const {
    orderNumber,
    table,
    restaurant,
    items,
    totalAmount,
    totalItems,
    orderDate,
    completedAt,
  } = order;

  const itemsHTML = items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 8px; text-align: left;">${item.item_name}</td>
      <td style="padding: 12px 8px; text-align: center;">₹${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: 600;">₹${item.subtotal.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

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
              <span class="value">${
                restaurant?.name || "DineDesk Restaurant"
              }</span>
            </div>
            <div class="info-row">
              <span class="label">Table:</span>
              <span class="value">${table?.name || "N/A"} (${
    table?.capacity || 0
  } seats)</span>
            </div>
            <div class="info-row">
              <span class="label">Order Date:</span>
              <span class="value">${new Date(orderDate).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Completed At:</span>
              <span class="value">${new Date(
                completedAt
              ).toLocaleString()}</span>
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
      throw new Error(
        "Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file"
      );
    }

    console.log("Creating transporter for email:", process.env.EMAIL_USER);
    const transporter = createTransporter();

    // Verify transporter configuration
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");

    const mailOptions = {
      from: {
        name: order.restaurant?.name || "DineDesk Restaurant",
        address: process.env.EMAIL_USER,
      },
      to: customerEmail,
      subject: `Order Receipt - ${order.orderNumber} | ${
        order.restaurant?.name || "DineDesk"
      }`,
      html: generateReceiptHTML(order),
      text: `
Order Receipt
=============

Order Number: ${order.orderNumber}
Restaurant: ${order.restaurant?.name || "DineDesk Restaurant"}
Table: ${order.table?.name || "N/A"}
Date: ${new Date(order.orderDate).toLocaleString()}
Completed: ${new Date(order.completedAt).toLocaleString()}

Items:
${order.items
  .map(
    (item) =>
      `- ${item.item_name} x${item.quantity} @ ₹${item.price} = ₹${item.subtotal}`
  )
  .join("\n")}

Total Items: ${order.totalItems}
Grand Total: ₹${order.totalAmount.toFixed(2)}

Thank you for dining with us!
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Receipt email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Receipt sent successfully",
    };
  } catch (error) {
    console.error("Error sending receipt email:", error);

    return {
      success: false,
      error: error.message,
      message: "Failed to send receipt email",
    };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("Email configuration error:", error);
    return { success: false, error: error.message };
  }
};

// Generate Subscription Confirmation Email HTML
const generateSubscriptionEmailHTML = (subscriptionData) => {
  const {
    userName,
    planName,
    amount,
    currency,
    interval,
    startDate,
    endDate,
    features,
  } = subscriptionData;

  const featuresHTML =
    features
      ?.map(
        (feature) => `
    <li style="padding: 8px 0; color: #333;">
      <span style="color: #10b981; font-weight: bold; margin-right: 8px;">✓</span>${feature}
    </li>
  `
      )
      .join("") || "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmation - DineDesk</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #cc6600 0%, #b35500 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 16px; }
        .content { padding: 40px 30px; }
        .success-icon { text-align: center; margin-bottom: 20px; }
        .success-icon svg { width: 80px; height: 80px; fill: #10b981; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .plan-box { background: linear-gradient(135deg, #fff4ef 0%, #ffe8db 100%); border: 2px solid #cc6600; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .plan-name { font-size: 28px; font-weight: 700; color: #cc6600; margin-bottom: 15px; text-align: center; }
        .plan-price { font-size: 36px; font-weight: 700; color: #3b1a0b; text-align: center; margin-bottom: 10px; }
        .plan-price span { font-size: 18px; font-weight: normal; color: #666; }
        .plan-period { text-align: center; color: #666; font-size: 16px; margin-bottom: 20px; }
        .subscription-details { background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #555; }
        .detail-value { color: #333; }
        .features-section { margin: 25px 0; }
        .features-title { font-size: 20px; font-weight: 600; color: #3b1a0b; margin-bottom: 15px; }
        .features-list { list-style: none; padding: 0; margin: 0; }
        .features-list li { padding: 8px 0; color: #333; }
        .cta-button { display: inline-block; background-color: #cc6600; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; text-align: center; }
        .cta-button:hover { background-color: #b35500; }
        .footer { background-color: #f8f9fa; padding: 30px 20px; text-align: center; color: #666; font-size: 14px; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #cc6600; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Welcome to DineDesk!</h1>
          <p>Your subscription is now active</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
          </div>

          <p class="greeting">Dear ${userName},</p>
          
          <p style="color: #333; line-height: 1.6;">
            Thank you for subscribing to DineDesk! We're thrilled to have you on board. Your subscription has been successfully activated, and you now have access to all the powerful features of your chosen plan.
          </p>

          <!-- Plan Details Box -->
          <div class="plan-box">
            <div class="plan-name">${planName} Plan</div>
            <div class="plan-price">${
              currency === "INR" ? "₹" : "$"
            }${amount.toLocaleString()}<span>/${interval}</span></div>
            <div class="plan-period">
              ${interval === "year" ? "Billed annually" : "Billed monthly"}
            </div>
          </div>

          <!-- Subscription Details -->
          <div class="subscription-details">
            <div class="detail-row">
              <span class="detail-label">Subscription Start:</span>
              <span class="detail-value">${new Date(
                startDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Next Billing Date:</span>
              <span class="detail-value">${new Date(endDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value" style="color: #10b981; font-weight: 600;"> Active ✓</span>
            </div>
          </div>

          <!-- Features -->
          ${
            features && features.length > 0
              ? `
          <div class="features-section">
            <h3 class="features-title">Your Plan Includes:</h3>
            <ul class="features-list">
              ${featuresHTML}
            </ul>
          </div>
          `
              : ""
          }

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }/dashboard" class="cta-button">
              Access Your Dashboard →
            </a>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            <strong>Need help getting started?</strong><br>
            Our support team is here to help! Contact us at <a href="mailto:${
              process.env.EMAIL_USER
            }" style="color: #cc6600;">${
    process.env.EMAIL_USER
  }</a> or visit our help center.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0 0 15px 0; font-weight: 600; color: #333;">DineDesk - Modern POS for Restaurants</p>
          <p style="margin: 0 0 15px 0;">Streamline your restaurant operations with ease</p>
          
          <div class="social-links">
            <a href="#">Twitter</a> •
            <a href="#">Facebook</a> •
            <a href="#">Instagram</a>
          </div>

          <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
            You're receiving this email because you subscribed to DineDesk.<br>
            © ${new Date().getFullYear()} DineDesk. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send Subscription Confirmation Email
const sendSubscriptionEmail = async (userEmail, subscriptionData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email credentials not configured");
      return {
        success: false,
        message: "Email service not configured",
      };
    }

    console.log(
      "Creating transporter for subscription email:",
      process.env.EMAIL_USER
    );
    const transporter = createTransporter();

    // Verify transporter configuration
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");

    const mailOptions = {
      from: {
        name: "DineDesk",
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: `🎉 Welcome to DineDesk ${subscriptionData.planName} Plan!`,
      html: generateSubscriptionEmailHTML(subscriptionData),
      text: `
Welcome to DineDesk!
====================

Dear ${subscriptionData.userName},

Thank you for subscribing to the ${subscriptionData.planName} Plan!

Plan Details:
- Plan: ${subscriptionData.planName}
- Amount: ${subscriptionData.currency === "INR" ? "₹" : "$"}${
        subscriptionData.amount
      }/${subscriptionData.interval}
- Start Date: ${new Date(subscriptionData.startDate).toLocaleDateString()}
- Next Billing: ${new Date(subscriptionData.endDate).toLocaleDateString()}
- Status: Active

${
  subscriptionData.features
    ? `Your Plan Includes:\n${subscriptionData.features
        .map((f) => `- ${f}`)
        .join("\n")}`
    : ""
}

Access your dashboard: ${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/dashboard

Need help? Contact us at ${process.env.EMAIL_USER}

Thank you for choosing DineDesk!

---
DineDesk - Modern POS for Restaurants
© ${new Date().getFullYear()} DineDesk. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Subscription email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Subscription confirmation email sent successfully",
    };
  } catch (error) {
    console.error("Error sending subscription email:", error);

    return {
      success: false,
      error: error.message,
      message: "Failed to send subscription confirmation email",
    };
  }
};

module.exports = {
  sendOrderReceipt,
  sendSubscriptionEmail,
  testEmailConfig,
};
