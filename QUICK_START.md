# ⚡ Quick Start Guide - DineDesk POS System

## 🚀 Get Everything Working in 5 Minutes

### Step 1: Configure Email (2 minutes)

1. **Create Gmail App Password**:

   - Go to: https://myaccount.google.com/apppasswords
   - Create a new App Password
   - Copy the 16-digit password

2. **Update Backend .env**:

   ```bash
   cd backend
   ```

   Create `.env` file with:

   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/dinedesk
   JWT_SECRET=your-secret-key-here

   # Email (REQUIRED for subscription emails)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587

   # Frontend
   FRONTEND_URL=http://localhost:5173

   # Razorpay
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### Step 2: Start Backend (1 minute)

```powershell
cd backend
npm install
npm run dev
```

You should see:

```
Server running on port 5000
✅ SMTP connection verified successfully
```

### Step 3: Start Frontend (1 minute)

```powershell
cd client
npm install
npm run dev
```

### Step 4: Test Email (1 minute)

**Using Postman or cURL**:

```bash
POST http://localhost:5000/api/payment/test-email
Content-Type: application/json

{
  "email": "your-email@gmail.com",
  "planId": "professional"
}
```

**Check your email inbox!**

---

## ✅ What's New for New Users

### No More Dummy Data!

When you sign up with a new account, you'll see:

**Tables Page**:

```
┌─────────────────────────────────┐
│         No Tables Yet           │
│   👥                            │
│   Get started by adding your    │
│   first table                   │
│   [Add Your First Table]        │
└─────────────────────────────────┘
```

**Menu Page**:

```
┌─────────────────────────────────┐
│       No Menu Items Yet         │
│   🔍                            │
│   Start building your menu      │
│   [Add Your First Item]         │
└─────────────────────────────────┘
```

**Orders Page**:

```
┌─────────────────────────────────┐
│    No Tables Available          │
│   🛒                            │
│   Please add tables first       │
│   [Go to Tables]                │
└─────────────────────────────────┘
```

---

## 📧 Email Features

### When You Subscribe to a Plan:

1. **Email Sent Automatically** ✅
2. **Professional HTML Template** ✅
3. **Includes**:
   - Plan name (Starter/Professional/Enterprise)
   - Amount and billing period
   - Start and end dates
   - Features list
   - Link to dashboard

### Email Preview:

```
┌───────────────────────────────────┐
│  🎉 Welcome to DineDesk!          │
│     Professional Plan              │
├───────────────────────────────────┤
│  Amount: ₹1,999/month             │
│  Status: Active                   │
│  Start: May 20, 2025              │
│  Renewal: June 20, 2025           │
├───────────────────────────────────┤
│  Features:                        │
│  ✓ Advanced table management      │
│  ✓ Inventory tracking            │
│  ✓ Staff management              │
│  ✓ Email support                 │
├───────────────────────────────────┤
│  [Access Your Dashboard]          │
└───────────────────────────────────┘
```

---

## 🎯 Subscription Display in Dashboard

Navigate to **Dashboard > Overview** to see:

```
┌───────────────────────────────────┐
│  Your Subscription                │
├───────────────────────────────────┤
│  Plan: Professional Plan          │
│  Amount: ₹1,999                   │
│  Billing: Monthly                 │
│  Start: May 20, 2025              │
│  Renewal: June 20, 2025           │
│                                   │
│  ⏰ 31 days remaining             │
│  (Active - Green indicator)       │
└───────────────────────────────────┘
```

**Color Indicators**:

- 🟢 Green: > 30 days remaining
- 🟡 Yellow: 7-30 days remaining
- 🔴 Red: < 7 days remaining (renew soon!)

---

## 🧪 Testing Everything

### Test 1: New User Experience

```powershell
# 1. Clear browser data
localStorage.clear()

# 2. Sign up with new account
Email: test@example.com
Password: Test123!

# 3. Verify empty states
- Dashboard/Tables: Shows "No Tables Yet"
- Dashboard/Menu: Shows "No Menu Items Yet"
- Dashboard/Orders: Shows "No Tables Available"

# 4. Add data
- Add first table
- Add first menu item
- Refresh page - data should persist
```

### Test 2: Subscription Purchase

```powershell
# 1. Login to your account
# 2. Go to /pricing page
# 3. Select a plan
# 4. Complete payment (use Razorpay test mode)
# 5. Check email inbox for confirmation
# 6. Go to Dashboard > Overview
# 7. Verify subscription details appear
```

### Test 3: Email System

```powershell
# Option 1: Using Postman
POST http://localhost:5000/api/payment/test-email
Body: {
  "email": "your-email@gmail.com",
  "planId": "professional"
}

# Option 2: Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/payment/test-email" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"your-email@gmail.com","planId":"professional"}'
```

---

## 📱 All Features Working

### ✅ Authentication

- Sign up with email validation
- Login with JWT tokens
- Protected routes
- Auto-redirect to login

### ✅ Subscription Management

- View all plans (Starter/Professional/Enterprise)
- Toggle monthly/yearly pricing
- Purchase with Razorpay
- Track subscription in database
- Display subscription details

### ✅ Email Notifications

- Professional HTML templates
- Subscription confirmation emails
- Gmail SMTP integration
- Test endpoint for debugging

### ✅ Dashboard

- Overview with subscription info
- Tables management (empty state ready)
- Menu management (empty state ready)
- Orders management (empty state ready)
- Settings page

### ✅ UI/UX

- No brown borders ✓
- Smooth transitions ✓
- Empty states with guidance ✓
- Success messages instead of alerts ✓
- Responsive design ✓

---

## 🐛 Troubleshooting

### Email Not Received?

**Check 1**: SMTP Connection

```bash
# You should see in backend console:
✅ SMTP connection verified successfully
```

**Check 2**: Environment Variables

```bash
cd backend
cat .env
# Verify EMAIL_USER and EMAIL_PASSWORD are set
```

**Check 3**: Spam Folder

- Check spam/junk folder
- Add sender to contacts

**Check 4**: App Password

- Must use App Password (16 digits)
- NOT your regular Gmail password
- Create at: https://myaccount.google.com/apppasswords

### Dummy Data Still Showing?

**Solution**: Clear browser cache

```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Backend API Errors?

**Check MongoDB**:

```powershell
# Ensure MongoDB is running
mongod --version
```

**Check Port**:

```powershell
# Backend should be on port 5000
netstat -an | findstr 5000
```

---

## 📚 Documentation

All guides are in your project root:

1. **SUMMARY_ALL_FIXES.md** - Complete overview of all changes
2. **EMAIL_TESTING_GUIDE.md** - Detailed email setup and testing
3. **FIXING_ISSUES_GUIDE.md** - Backend integration guide
4. **backend/.env.example** - Environment configuration template

---

## 🎉 You're All Set!

Your DineDesk POS System is now:

- ✅ Free of dummy data
- ✅ Sending professional emails
- ✅ Displaying subscriptions
- ✅ Production ready

**Start the app**:

```powershell
# Terminal 1 - Backend
cd backend; npm run dev

# Terminal 2 - Frontend
cd client; npm run dev
```

**Open**: http://localhost:5173

**Enjoy!** 🚀
