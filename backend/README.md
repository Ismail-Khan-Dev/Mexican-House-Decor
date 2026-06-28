# Mexican Home Decor Backend API

A production-grade Express.js REST API for the Mexican Home Decor e-commerce platform, built with enterprise-level architecture and security standards.

## 🚀 Features

- ✅ **Authentication System** - JWT-based user authentication with role-based access control
- ✅ **Product Management** - Complete CRUD operations for products with filtering and search
- ✅ **Order Processing** - Full order lifecycle management with inventory tracking
- ✅ **Security** - Helmet, CORS, bcryptjs password hashing, input validation
- ✅ **Database** - MongoDB with Mongoose ODM and connection pooling
- ✅ **Error Handling** - Centralized error handler with comprehensive logging
- ✅ **API Validation** - express-validator for strict input validation
- ✅ **Admin Panel Ready** - Role-based authorization for administrative functions
- ✅ **Production Ready** - Environment-based configuration and performance optimized

## 📋 Prerequisites

- Node.js v18.0.0 or higher
- MongoDB v4.4+ (local installation or MongoDB Atlas)
- npm v8.0.0 or higher

## 🔧 Installation

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Setup environment variables**:
```bash
cp .env.example .env
```

4. **Configure MongoDB** in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
```

   Or use MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mexican-decor-db
```

5. **Generate JWT Secret**:
```bash
# Update JWT_SECRET in .env (minimum 32 characters)
JWT_SECRET=your_super_secure_random_string_min_32_chars_here
```

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will be available at: `http://localhost:5000`

### Seed Sample Data
```bash
node src/seed.js
```

This populates the database with 8 sample Mexican decor products.

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive endpoint documentation.

### Quick API Examples

**Sign Up**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Get Products**:
```bash
curl http://localhost:5000/api/products?page=1&category=Ceramics
```

**Create Order** (requires token):
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "ID", "quantity": 1}],
    "shippingAddress": {...}
  }'
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection setup
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication & authorization
│   │   └── errorHandler.js  # Global error handler
│   ├── models/              # MongoDB schemas
│   │   ├── User.js          # User model with password hashing
│   │   ├── Product.js       # Product catalog model
│   │   └── Order.js         # Order management model
│   ├── controllers/         # Business logic
│   │   ├── authController.js   # Authentication logic
│   │   ├── productController.js # Product operations
│   │   └── orderController.js  # Order operations
│   ├── routes/              # API route definitions
│   │   ├── auth.js          # Auth endpoints
│   │   ├── products.js      # Product endpoints
│   │   └── orders.js        # Order endpoints
│   ├── utils/               # Utility functions
│   │   ├── logger.js        # Logging system
│   │   └── validators.js    # Input validation rules
│   ├── seed.js              # Database seeding
│   └── server.js            # Main application entry
├── logs/                    # Application logs (auto-created)
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── API_DOCUMENTATION.md     # Full API docs
├── package.json             # Dependencies
└── README.md               # This file
```

## 🔐 Authentication Flow

1. User signs up or logs in
2. Server returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server validates token for protected routes
5. Token expires after 7 days (configurable)

## 💾 Database Models

### User
- Email (unique, indexed)
- Hashed password
- First & last name
- Phone number
- Shipping/billing address
- Role (user/admin)
- Last login timestamp

### Product
- Name & description
- Price (with optional original price)
- Category (Textiles, Ceramics, Furniture, Lighting, Decor)
- Images & thumbnail
- Rating & review count
- Stock availability
- SKU (unique identifier)
- Dimensions & weight
- Materials & artisan info
- Origin location

### Order
- Order number (unique)
- User reference
- Order items with pricing
- Shipping & billing addresses
- Subtotal, tax, shipping cost, total
- Status tracking (pending → shipped → delivered)
- Payment method & status
- Tracking number

## 🔒 Security Features

- ✅ **Password Security**: Bcryptjs with salt rounds of 10
- ✅ **JWT Authentication**: Tokens with 7-day expiration
- ✅ **Input Validation**: express-validator for all inputs
- ✅ **CORS Protection**: Whitelist frontend URL only
- ✅ **Helmet Security**: HTTP security headers
- ✅ **Injection Protection**: Mongoose prevents MongoDB injection
- ✅ **Error Handling**: No sensitive data in error messages
- ✅ **Database Indexing**: Optimized queries for performance

## 📊 API Response Format

All responses follow a consistent structure:

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Field validation error",
      "param": "fieldName"
    }
  ]
}
```

## 🛠️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | development | Environment mode |
| PORT | Yes | 5000 | Server port |
| MONGODB_URI | Yes | localhost | Database connection |
| JWT_SECRET | Yes | - | Secret key for JWT signing (32+ chars) |
| JWT_EXPIRE | No | 7d | Token expiration time |
| CORS_ORIGIN | Yes | http://localhost:3000 | Allowed frontend URL |
| LOG_LEVEL | No | debug | Logging verbosity |

## 📝 Logging

Application logs are stored in `logs/app.log` and include:
- Timestamps for each entry
- Log level (INFO, ERROR, WARN, DEBUG)
- Detailed error messages in development mode
- No sensitive data (passwords, tokens) logged

## 🧪 Testing with cURL

### 1. Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Get All Products
```bash
curl http://localhost:5000/api/products
```

### 3. Get Admin Orders
```bash
curl http://localhost:5000/api/orders/admin/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env is correct
- Verify network access if using MongoDB Atlas

**JWT Token Expired**
- Log in again to get a new token
- Tokens expire after 7 days

**Port Already in Use**
- Change PORT in .env to another port (e.g., 5001)
- Or kill process: `lsof -ti:5000 | xargs kill`

**Validation Errors**
- Check request body matches API documentation
- Email must be valid format
- Password must be 8+ characters

## 🚀 Deployment

Ready for deployment on:
- Heroku
- AWS EC2
- DigitalOcean
- Railway.app
- Render
- Vercel (serverless)

Ensure to:
1. Set proper environment variables
2. Use production MongoDB (Atlas)
3. Set `NODE_ENV=production`
4. Configure CORS for your domain
5. Use HTTPS in production

## 📧 API Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-06-07T20:30:00.000Z"
}
```

## 🤝 Contributing

Backend improvements welcome! Follow the established patterns:
- Use async/await for promises
- Add error handling to all functions
- Validate all inputs
- Log important operations
- Test with cURL or Postman

## 📄 License

ISC License - See package.json

## 👨‍💻 Author

Built by FAANG Expert Developers
- Production-grade architecture
- Enterprise security standards
- Scalable and maintainable code

---

**Ready for production! 🎉**

For more details, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
