# 🚀 Mexican Home Decor Backend - Quick Reference Card

## ⚡ Essential Commands

```bash
# Setup (first time only)
cd backend
npm install
node src/seed.js

# Start Server
npm run dev              # Development (auto-reload)
npm start               # Production

# Database
mongod                  # Start MongoDB

# Check Health
curl http://localhost:5000/health
```

---

## 📍 Key URLs

| Purpose | URL |
|---------|-----|
| API Base | `http://localhost:5000/api` |
| Health | `http://localhost:5000/health` |
| Frontend | `http://localhost:3000` |

---

## 🔐 Authentication

### Get Token (Login)
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Use Token in Requests
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📦 API Endpoints Quick Reference

### Products
```
GET    /api/products                    # All products
GET    /api/products/featured           # Featured items
GET    /api/products/:id                # Single product
POST   /api/products                    # Create (admin)
PUT    /api/products/:id                # Update (admin)
DELETE /api/products/:id                # Delete (admin)
```

### Orders
```
POST   /api/orders                      # Create order
GET    /api/orders                      # My orders
GET    /api/orders/:id                  # Order details
PUT    /api/orders/:id/cancel           # Cancel order
GET    /api/orders/admin/all            # All (admin)
PUT    /api/orders/admin/:id/status     # Update (admin)
```

### Auth
```
POST   /api/auth/signup                 # Register
POST   /api/auth/login                  # Login
GET    /api/auth/me                     # Current user
PUT    /api/auth/profile                # Update profile
POST   /api/auth/change-password        # Change password
POST   /api/auth/logout                 # Logout
```

---

## 🗂️ File Structure

```
backend/
├── src/
│   ├── config/          Database setup
│   ├── middleware/      Auth & error handling
│   ├── models/          Schemas (User, Product, Order)
│   ├── controllers/     Business logic
│   ├── routes/          API endpoints
│   ├── utils/           Helpers & validators
│   └── server.js        Main file
├── logs/                Application logs
├── .env                 Configuration
└── package.json         Dependencies
```

---

## 🔧 Environment Setup

### .env File
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
JWT_SECRET=change-me-to-random-32-chars
CORS_ORIGIN=http://localhost:3000
```

### Required Changes
- [ ] Update JWT_SECRET (32+ characters)
- [ ] Set MONGODB_URI (local or Atlas)
- [ ] Update CORS_ORIGIN if needed

---

## 🧪 Test API with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test1234",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"productId":"ID","quantity":1}],
    "shippingAddress":{...}
  }'
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to MongoDB | Start `mongod` command |
| Port 5000 in use | Change PORT in .env |
| JWT errors | Update JWT_SECRET in .env |
| CORS errors | Check CORS_ORIGIN in .env |
| Module not found | Run `npm install` |
| Token expired | Login again to get new token |

---

## 📊 Database Models

### User
- email, password (hashed)
- firstName, lastName
- phone, address
- role (user/admin)
- timestamps

### Product
- name, description, price
- category, stock, rating
- images, materials
- dimensions, weight
- artisan, origin

### Order
- orderNumber (auto)
- userId, items
- addresses (shipping/billing)
- total, tax, shipping
- status, paymentStatus
- timestamps

---

## 🔄 Request/Response Format

### Success (200)
```json
{
  "success": true,
  "data": {...},
  "pagination": {...}
}
```

### Error (400/500)
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| user | View products, place orders, manage own orders |
| admin | Manage all products, view all orders, update status |

---

## 🔑 Important Notes

⚠️ **Security**
- Never commit .env file
- Always use HTTPS in production
- Keep JWT_SECRET secret
- Validate all inputs

⚠️ **Database**
- Use MongoDB Atlas for production
- Regular backups essential
- Index important fields

⚠️ **Deployment**
- Set NODE_ENV=production
- Use strong JWT_SECRET
- Enable HTTPS
- Set up monitoring

---

## 📚 Full Documentation

- **README.md** - Setup guide
- **API_DOCUMENTATION.md** - Endpoint reference
- **SETUP_GUIDE.md** - Integration guide
- **COMPLETION_SUMMARY.md** - Project overview

---

## 💡 Quick Tips

1. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Check Server Status**
   ```bash
   curl http://localhost:5000/health
   ```

3. **View Logs**
   ```bash
   tail -f logs/app.log
   ```

4. **Seed Database**
   ```bash
   node src/seed.js
   ```

5. **Test API**
   - Use Postman_Collection.json
   - Or use cURL commands
   - Or use browser for GET requests

---

## 📞 Support Resources

Need help? Check:
- README.md - General questions
- API_DOCUMENTATION.md - API questions
- SETUP_GUIDE.md - Setup issues
- logs/app.log - Error details

---

**Backend Status**: ✅ Production Ready  
**Last Updated**: June 7, 2026  
**Version**: 1.0.0

Keep this card handy! 📌
