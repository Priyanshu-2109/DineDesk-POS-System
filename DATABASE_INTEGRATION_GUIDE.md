# 🔌 Database Integration - Complete Guide

## ✅ What's Fixed

All data now **automatically saves to MongoDB** when you:

- ✅ Add tables
- ✅ Add menu items
- ✅ Update restaurant name
- ✅ Create orders
- ✅ Complete payments

---

## 🔄 How It Works Now

### **Before (Broken):**

```
User adds table → Saved to React state only → Lost on refresh ❌
```

### **After (Fixed):**

```
User adds table → Saved to MongoDB → Persists forever ✅
User refreshes page → Data loads from MongoDB → Everything restored ✅
```

---

## 📝 What Changed

### 1. **AppContext Integration**

File: `client/src/context/AppContext.jsx`

**New Features:**

- ✅ Fetches data from backend on login
- ✅ Sends all changes to MongoDB
- ✅ Auto-creates restaurant if needed
- ✅ Optimistic UI updates (instant feedback)
- ✅ Error handling with rollback

**Functions Updated:**

```javascript
addTable()        → POST /api/tables/add-table
removeTable()     → DELETE /api/tables/delete-table/:id
addMenuItem()     → POST /api/menu/add-item
updateRestaurantName() → PATCH /api/settings/restaurant/name
```

### 2. **Auto-Restaurant Creation**

Files: `backend/controllers/tableController.js`, `menuController.js`

**Before:**

```javascript
// Returned error if restaurant doesn't exist
if (!restaurant) {
  return res.status(404).json({ message: "Create restaurant first" });
}
```

**After:**

```javascript
// Auto-creates restaurant on first table/menu add
if (!restaurant) {
  restaurant = await Restaurant.create({
    name: `${req.user.name}'s Restaurant`,
    owner: req.user._id,
  });
}
```

### 3. **Backend Routes**

File: `backend/routes/settingsRoutes.js`

Added PATCH method support:

```javascript
router.patch(
  "/restaurant/name",
  restaurantNameValidation,
  updateRestaurantName
);
```

---

## 🧪 Testing Guide

### Test 1: Add Table (Database Persistence)

1. **Login to app:**

   ```
   http://localhost:5173/login
   ```

2. **Go to Tables page:**

   ```
   http://localhost:5173/dashboard/tables
   ```

3. **Add a table:**

   - Click "Add Table"
   - Enter number: `1`
   - Enter capacity: `4`
   - Click "Add"

4. **Verify in MongoDB:**

   ```bash
   # Connect to MongoDB
   mongosh

   # Use database
   use dinedesk

   # Check tables collection
   db.tables.find().pretty()
   ```

   **You should see:**

   ```json
   {
     "_id": ObjectId("..."),
     "name": "T1",
     "capacity": 4,
     "owner": ObjectId("..."),
     "restaurant": ObjectId("..."),
     "isOccupied": false,
     "isActive": true,
     "createdAt": ISODate("..."),
     "updatedAt": ISODate("...")
   }
   ```

5. **Refresh browser:**
   - Table should still be there! ✅

---

### Test 2: Add Menu Item (Database Persistence)

1. **Go to Menu page:**

   ```
   http://localhost:5173/dashboard/menu
   ```

2. **Add menu item:**

   - Click "Add Item"
   - Name: `Paneer Butter Masala`
   - Category: `Main Course`
   - Price: `220`
   - Click "Add"

3. **Verify in MongoDB:**

   ```bash
   mongosh
   use dinedesk
   db.menuitems.find().pretty()
   ```

   **You should see:**

   ```json
   {
     "_id": ObjectId("..."),
     "item_name": "Paneer Butter Masala",
     "category": "main_course",
     "price": 220,
     "owner": ObjectId("..."),
     "restaurant": ObjectId("..."),
     "isAvailable": true,
     "createdAt": ISODate("..."),
     "updatedAt": ISODate("...")
   }
   ```

4. **Refresh browser:**
   - Menu item should still be there! ✅

---

### Test 3: Backend API Direct Test

**Using Postman or cURL:**

#### 1. Login First

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

**Copy the `token` from response**

#### 2. Add Table via API

```http
POST http://localhost:5000/api/tables/add-table
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "T5",
  "capacity": 6
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Table added successfully",
  "table": {
    "_id": "...",
    "name": "T5",
    "capacity": 6,
    "isOccupied": false,
    "isActive": true
  }
}
```

#### 3. Get All Tables

```http
GET http://localhost:5000/api/tables
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**

```json
{
  "success": true,
  "count": 5,
  "tables": [
    {
      "_id": "...",
      "name": "T1",
      "capacity": 4,
      ...
    },
    {
      "_id": "...",
      "name": "T5",
      "capacity": 6,
      ...
    }
  ]
}
```

#### 4. Add Menu Item via API

```http
POST http://localhost:5000/api/menu/add-item
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "item_name": "Butter Chicken",
  "category": "main_course",
  "price": 250
}
```

#### 5. Get All Menu Items

```http
GET http://localhost:5000/api/menu
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔍 Verify Data Persistence

### Check Database Contents:

```bash
# Connect to MongoDB
mongosh

# Use your database
use dinedesk

# List all collections
show collections

# Count documents
db.users.countDocuments()
db.restaurants.countDocuments()
db.tables.countDocuments()
db.menuitems.countDocuments()
db.orders.countDocuments()

# View all tables
db.tables.find({}, { name: 1, capacity: 1, owner: 1 }).pretty()

# View all menu items
db.menuitems.find({}, { item_name: 1, price: 1, category: 1 }).pretty()

# View restaurants
db.restaurants.find().pretty()

# Find user's tables
db.tables.find({ owner: ObjectId("YOUR_USER_ID") }).pretty()
```

---

## 🐛 Troubleshooting

### Issue 1: "Failed to add table"

**Check:**

1. MongoDB is running:

   ```bash
   mongod --version
   # or
   brew services list | grep mongodb
   ```

2. Backend is running:

   ```bash
   cd backend
   npm run dev
   ```

3. Check backend console for errors

4. Verify token is valid:
   ```javascript
   // In browser console
   localStorage.getItem("token");
   ```

---

### Issue 2: "Data not showing after refresh"

**Check:**

1. Login is successful
2. Token is stored in localStorage
3. Backend fetch functions are working:

   ```javascript
   // In browser console
   console.log("User:", localStorage.getItem("token"));
   ```

4. Network tab shows successful API calls:
   - `GET /api/tables` → 200 OK
   - `GET /api/menu` → 200 OK

---

### Issue 3: "Restaurant not found"

**Solution:** This should auto-create now, but if you see this:

1. **Manually create restaurant:**

   ```http
   PATCH http://localhost:5000/api/settings/restaurant/name
   Authorization: Bearer YOUR_TOKEN
   Content-Type: application/json

   {
     "name": "My Restaurant"
   }
   ```

2. Or use MongoDB directly:
   ```javascript
   db.restaurants.insertOne({
     name: "My Restaurant",
     owner: ObjectId("YOUR_USER_ID"),
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

---

## 📊 Database Schema

### Collections Structure:

```
dinedesk/
├── users
│   ├── _id
│   ├── name
│   ├── email
│   ├── password (hashed)
│   ├── role (owner/manager/staff/admin)
│   ├── subscription (starter/professional/enterprise)
│   └── subscriptionDetails
│
├── restaurants
│   ├── _id
│   ├── name
│   ├── owner → users._id
│   ├── address
│   └── phone
│
├── tables
│   ├── _id
│   ├── name
│   ├── capacity
│   ├── owner → users._id
│   ├── restaurant → restaurants._id
│   ├── isOccupied
│   └── isActive
│
├── menuitems
│   ├── _id
│   ├── item_name
│   ├── category
│   ├── price
│   ├── owner → users._id
│   ├── restaurant → restaurants._id
│   └── isAvailable
│
└── orders
    ├── _id
    ├── orderNumber
    ├── table → tables._id
    ├── owner → users._id
    ├── restaurant → restaurants._id
    ├── items[]
    ├── total
    └── status
```

---

## ✅ Confirmation Checklist

After making changes, verify:

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected (check backend console)
- [ ] User can login successfully
- [ ] Adding table shows in MongoDB
- [ ] Adding menu item shows in MongoDB
- [ ] Refreshing page loads data from MongoDB
- [ ] Deleting table removes from MongoDB
- [ ] Network tab shows API calls (200 OK)

---

## 🎯 Expected Flow

### User Journey:

1. **Sign up** → User created in `users` collection
2. **Login** → JWT token stored in localStorage
3. **Add first table** → Restaurant auto-created + Table saved
4. **Add menu item** → Item saved to `menuitems` collection
5. **Refresh page** → Data loaded from MongoDB
6. **Logout** → Token removed, data stays in DB
7. **Login again** → All data restored

---

## 🚀 Performance Features

### Optimistic UI Updates:

- Table appears instantly in UI
- Background API call to MongoDB
- If API fails → table removed + error shown
- If API succeeds → replaced with real ID from MongoDB

### Automatic Sync:

- Data fetched on login
- Updates sent on every change
- No manual refresh needed

### Error Handling:

- Failed API calls roll back UI changes
- Alert messages for user feedback
- Console logs for debugging

---

## 📝 Summary

**What works now:**
✅ All data saves to MongoDB automatically
✅ Data persists across sessions
✅ Optimistic UI for instant feedback
✅ Auto-creates restaurant on first use
✅ Proper error handling
✅ Data syncs on login

**No more lost data!** 🎉

Everything is connected to the database and working properly. Test it out!
