# 📧 Email Testing Guide for DineDesk POS System

## 🔧 Email Service Configuration

### Email Type: **Gmail with Nodemailer**

The application uses **Nodemailer** with Gmail SMTP service to send professional HTML emails.

### Required Setup:

1. **Gmail Account**: You need a Gmail account
2. **App Password**: Must create a Google App Password (NOT your regular Gmail password)

---

## 📝 How to Create Gmail App Password

### Step-by-Step Instructions:

1. Go to your Google Account: [https://myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security** section
3. Enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step Verification, go to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Select App: **Mail**
6. Select Device: **Other** (give it a name like "DineDesk")
7. Click **Generate**
8. Copy the **16-digit password** (without spaces)
9. Use this password in your `.env` file

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Other configurations
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Important**: Use the 16-digit App Password, NOT your regular Gmail password!

---

## 🧪 Testing Emails with Postman

### 1. Test Email Endpoint

**Endpoint**: `POST http://localhost:5000/api/payment/test-email`

**Purpose**: Send a test subscription confirmation email

**Headers**:

```json
Content-Type: application/json
```

**Request Body** (Starter Plan):

```json
{
  "email": "test@example.com",
  "planId": "starter"
}
```

**Request Body** (Professional Plan):

```json
{
  "email": "test@example.com",
  "planId": "professional"
}
```

**Request Body** (Enterprise Plan):

```json
{
  "email": "test@example.com",
  "planId": "enterprise"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Test email sent successfully! Check your inbox.",
  "details": {
    "to": "test@example.com",
    "plan": "Professional",
    "messageId": "<unique-message-id>"
  }
}
```

**Error Response** (Email not configured):

```json
{
  "success": false,
  "message": "Failed to send test email",
  "error": "Missing credentials",
  "details": "Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env file"
}
```

---

## 📬 Postman Collection for Email Testing

### Import this cURL into Postman:

**Test Starter Plan Email**:

```bash
curl --location 'http://localhost:5000/api/payment/test-email' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "your-email@gmail.com",
  "planId": "starter"
}'
```

**Test Professional Plan Email**:

```bash
curl --location 'http://localhost:5000/api/payment/test-email' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "your-email@gmail.com",
  "planId": "professional"
}'
```

**Test Enterprise Plan Email**:

```bash
curl --location 'http://localhost:5000/api/payment/test-email' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "your-email@gmail.com",
  "planId": "enterprise"
}'
```

---

## 🎯 Full API Endpoints List

### Authentication Endpoints

1. **Sign Up**

   - URL: `POST http://localhost:5000/api/auth/signup`
   - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

2. **Login**

   - URL: `POST http://localhost:5000/api/auth/login`
   - Body: `{ "email": "john@example.com", "password": "password123" }`

3. **Get Current User**
   - URL: `GET http://localhost:5000/api/auth/me`
   - Headers: `Authorization: Bearer <your-token>`

### Payment Endpoints

1. **Get Subscription Plans**

   - URL: `GET http://localhost:5000/api/payment/plans`

2. **Create Payment Order** (Protected)

   - URL: `POST http://localhost:5000/api/payment/create-order`
   - Headers: `Authorization: Bearer <your-token>`
   - Body: `{ "plan": "professional" }`

3. **Verify Payment** (Protected)

   - URL: `POST http://localhost:5000/api/payment/verify`
   - Headers: `Authorization: Bearer <your-token>`
   - Body:

   ```json
   {
     "razorpay_order_id": "order_xxx",
     "razorpay_payment_id": "pay_xxx",
     "razorpay_signature": "signature_xxx",
     "plan": "professional"
   }
   ```

4. **Test Email** (Public - for testing)
   - URL: `POST http://localhost:5000/api/payment/test-email`
   - Body: `{ "email": "test@example.com", "planId": "professional" }`

---

## 📧 Email Features

### What the Email Contains:

1. **Professional HTML Design**

   - Gradient header with company branding
   - Success icon and checkmark
   - Responsive design for all devices

2. **Subscription Details**

   - Plan name and tier
   - Amount and billing period
   - Start date and renewal date
   - Subscription status

3. **Plan Features List**

   - All features included in the plan
   - Formatted with checkmarks

4. **Call-to-Action**

   - Direct link to dashboard
   - Support contact information

5. **Footer**
   - Company information
   - Social media links
   - Unsubscribe information

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check Console Logs**:

   ```bash
   # You should see:
   Creating transporter for subscription email: your-email@gmail.com
   Verifying SMTP connection...
   ✅ SMTP connection verified successfully
   Subscription email sent successfully: <message-id>
   ```

2. **Common Issues**:

   - ❌ **"Missing credentials"**: EMAIL_USER or EMAIL_PASSWORD not set in .env
   - ❌ **"Invalid login"**: Using regular password instead of App Password
   - ❌ **"Connection refused"**: Wrong EMAIL_HOST or EMAIL_PORT
   - ❌ **"Less secure app access"**: Need to use App Password with 2FA

3. **Gmail Specific**:

   - Must have 2-Step Verification enabled
   - Must use App Password (16 digits)
   - App Password doesn't work with regular account password

4. **Check Spam Folder**: Sometimes emails land in spam initially

---

## 📊 Testing Workflow

### Complete Test Flow:

1. **Setup Email Configuration**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Gmail credentials
   ```

2. **Start Backend Server**

   ```bash
   npm run dev
   ```

3. **Test Email Endpoint**

   - Open Postman
   - Send POST request to test-email endpoint
   - Check your email inbox

4. **Test Complete Flow**
   - Sign up a new user
   - Login with that user
   - Subscribe to a plan
   - Complete payment
   - Check email for subscription confirmation

---

## 📝 Example Successful Email

When everything is configured correctly, you'll receive an email that looks like:

**Subject**: 🎉 Welcome to DineDesk Professional Plan!

**Content**:

- Welcome message with success icon
- Plan details (Professional Plan - ₹1999/month)
- Subscription dates (Start: Today, Renewal: Next Month)
- List of features included
- Button: "Access Your Dashboard"
- Support contact information

---

## 🔐 Security Notes

1. **Never commit** `.env` file to Git
2. **Use App Passwords** - never use your main Gmail password
3. **Rotate passwords** regularly
4. **Use different credentials** for production
5. **Enable 2FA** on your Gmail account

---

## 💡 Tips

1. Use a **dedicated Gmail account** for sending emails
2. Keep track of your **App Passwords** securely
3. Test emails with **different plans** to see variations
4. Check **both inbox and spam** folder
5. Gmail has **sending limits** (500 emails/day for free accounts)

---

## 🎉 Success Indicators

✅ Console shows "SMTP connection verified successfully"
✅ Console shows "Subscription email sent successfully"
✅ Email appears in inbox within 1-2 minutes
✅ Email is properly formatted with HTML
✅ All links work correctly

---

For more help, check the application logs in the backend console!
