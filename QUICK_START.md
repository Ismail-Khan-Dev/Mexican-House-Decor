# 🚀 How to Run the Project Locally

## Complete Setup in 5 Minutes

This guide walks you through starting the entire Mexican Home Decor e-commerce application.

---

## Prerequisites ✅

Before starting, make sure you have:
- **Node.js** 18+ installed ([download](https://nodejs.org/))
- **MongoDB** installed locally OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **npm** or **yarn** (comes with Node.js)
- A terminal/command prompt window

---

## Step-by-Step Setup

### Step 1: Open Terminal in Project Root

```bash
# Navigate to the project
cd c:\Users\Wajiz.pk\Downloads\Kimi_Agent_Premium\ Mexican\ Home\ Decor\ App\mexican\ house\ decor

# You should see:
# - backend/ folder
# - src/ folder
# - package.json
# etc.
```

---

### Step 2: Start MongoDB

**Option A: Local MongoDB** (Recommended for first time)
```bash
# Make sure MongoDB is installed
# Then in a separate terminal window, run:
mongod

# You should see: "waiting for connections on port 27017"
```

**Option B: MongoDB Atlas** (Cloud - no local installation)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Copy connection string
4. In `backend/.env`, replace:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mexican-decor-db
   ```

---

### Step 3: Start Backend Server

Open a **new terminal window** and run:

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start development server with auto-reload
npm run dev
```

**Expected output:**
```
[nodemon] restarting due to changes...
Server running on port 5000
MongoDB connected successfully
```

✅ **Backend is running at http://localhost:5000**

---

### Step 4: Seed Sample Products (Optional but Recommended)

Open a **new terminal window** and run:

```bash
cd backend

# This creates 8 sample products in database
node src/seed.js
```

**Expected output:**
```
Connected to MongoDB
✓ Cleared existing products
✓ Added 8 sample products
✓ Database seeded successfully
```

---

### Step 5: Start Frontend Server

Open a **new terminal window** and run:

```bash
# Make sure you're in the project root (mexican house decor folder)
cd .  # (if already here)

# Install dependencies (first time only)
npm install

# Start frontend development server
npm run dev
```

**Expected output:**
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

✅ **Frontend is running at http://localhost:3000**

---

### Step 6: Open in Browser

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see:
   - Beautiful homepage with hero section
   - Featured products loading from database
   - Navigation menu
   - Shop link

---

## 📱 Testing the Integration

### Homepage Test
1. Open http://localhost:3000
2. Scroll down to "The Collection" section
3. Should see 6 featured products loading from API
4. Products show: image, category, rating, name

### Shop Test
1. Click "Shop" or "Explore the Collection" button
2. Should see all products (or 8 if you just seeded)
3. Test category filters - click "Textiles", "Ceramics", etc.
4. Each filter should make API request
5. Products should update in real-time

### API Health Check
1. Open new terminal
2. Run: `curl http://localhost:5000/health`
3. Should return: `{"status":"ok"}`

---

## 🎯 What You Should See

### Frontend (localhost:3000)
```
┌────────────────────────────────────────┐
│         Mexican Home Decor             │
│  ✨ Beautiful hero image               │
│  🏡 Featured products (loading...)     │
│  📦 Products from database             │
│  ⭐ Ratings & prices displayed         │
└────────────────────────────────────────┘
```

### Shop Page
```
┌────────────────────────────────────────┐
│  🏪 Shop                               │
│  Filter: [All] [Textiles] [Ceramics]  │
│  ────────────────────────────────────  │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ Rug  │  │ Bowl │  │Table │         │
│  │$485  │  │$89   │  │$1200 │         │
│  └──────┘  └──────┘  └──────┘         │
└────────────────────────────────────────┘
```

---

## 🛠️ Terminal Setup (Advanced)

### Running All Services in One Terminal (Windows)

Create a file `start-all.bat`:

```batch
@echo off
echo Starting MongoDB...
start mongod

timeout /t 2

echo Starting Backend...
start cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Frontend...
start cmd /k "npm run dev"

echo All services starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
pause
```

Then run:
```bash
start-all.bat
```

---

## 📊 Service Status Check

### Is MongoDB running?
```bash
mongosh
# Or if using MongoDB locally:
mongo
# Should open MongoDB shell
```

### Is Backend running?
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Is Frontend running?
```bash
# Just open http://localhost:3000 in browser
```

### Check Backend Logs
```bash
cd backend
tail -f logs/app.log
# (Shows real-time server logs)
```

---

## 🔧 Common Issues & Solutions

### "Cannot find module"
```bash
# Solution: Install dependencies
cd backend
npm install

cd ..
npm install
```

### "Port 5000 already in use"
```bash
# Solution: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env:
PORT=5001
```

### "MongoDB connection failed"
```bash
# Solution: Start MongoDB first
# Make sure mongod is running in separate terminal
mongod

# Or check MongoDB URI in backend/.env
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
```

### "CORS error in browser console"
```bash
# Solution: Backend must have correct CORS setting
# In backend/.env:
CORS_ORIGIN=http://localhost:3000

# Then restart backend
```

### "Products not loading"
```bash
# Solution 1: Seed database
cd backend
node src/seed.js

# Solution 2: Check MongoDB connection
mongosh
use mexican-decor-db
db.products.find()

# Solution 3: Check backend logs
tail -f logs/app.log
```

---

## 🗂️ File Locations

### Frontend Files
```
src/
├── services/api.ts              ← API calls
├── context/AuthContext.tsx      ← Auth state
├── pages/
│   ├── HomePage.tsx             ← Featured products
│   └── ShopPage.tsx             ← All products
```

### Backend Files
```
backend/src/
├── server.js                    ← Entry point
├── config/database.js           ← MongoDB
├── models/                      ← Data schemas
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── controllers/                 ← API logic
│   └── productController.js
├── routes/                      ← API routes
│   └── products.js
```

---

## 📝 Environment Configuration

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

---

## ✅ Complete Startup Checklist

Before you start, make sure:
- [ ] Node.js 18+ installed
- [ ] MongoDB installed OR Atlas account created
- [ ] You're in the project root directory
- [ ] You have 3 terminal windows open (or tabs)

Terminal 1 - MongoDB:
- [ ] `mongod` running and ready

Terminal 2 - Backend:
- [ ] `cd backend && npm run dev`
- [ ] Showing "Server running on port 5000"
- [ ] Showing "MongoDB connected successfully"

Terminal 3 - Frontend:
- [ ] `npm run dev`
- [ ] Showing "Local: http://localhost:3000"

Browser:
- [ ] Open http://localhost:3000
- [ ] See homepage with products
- [ ] Test Shop page
- [ ] Test category filters

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Homepage loads with 6 featured products
2. ✅ Shop page shows all products
3. ✅ Category filters work
4. ✅ Product images display
5. ✅ Loading spinner shows briefly
6. ✅ No console errors (yellow warnings are OK)
7. ✅ Network requests show in DevTools

---

## 🚀 What's Next?

Once the app is running:
1. Explore all pages
2. Try the filters
3. Check browser DevTools → Network tab to see API calls
4. Look at the console logs
5. Review INTEGRATION_GUIDE.md for more details

---

## 📞 Help & Documentation

- **Integration Guide**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Phase 1 Complete**: [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md)
- **Backend README**: [backend/README.md](./backend/README.md)
- **API Reference**: [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🎯 Summary

```
┌─────────────────────────────────────────────────────┐
│              QUICK START SUMMARY                    │
├─────────────────────────────────────────────────────┤
│ 1. mongod (Terminal 1)                              │
│ 2. cd backend && npm run dev (Terminal 2)           │
│ 3. npm run dev (Terminal 3)                         │
│ 4. Open http://localhost:3000 in browser           │
│ 5. Enjoy! 🎉                                        │
└─────────────────────────────────────────────────────┘
```

**Total time: ~5 minutes**

Happy coding! 🚀
