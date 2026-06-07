# Mexican Home Decor - Backend API Documentation

## Overview

This is a production-grade Express.js + MongoDB backend API for the Mexican Home Decor e-commerce application. Built following FAANG standards with enterprise-level security, scalability, and performance.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator
- **Logging**: Morgan + Custom Logger

## Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your settings:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
JWT_SECRET=your-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

### Start Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will start on `http://localhost:5000`

### Seed Database

Populate with initial products:
```bash
node src/seed.js
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Sign Up
- **POST** `/api/auth/signup`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### 2. Login
- **POST** `/api/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response**: `200 OK` (same as signup)

#### 3. Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

#### 4. Update Profile
- **PUT** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### 5. Change Password
- **POST** `/api/auth/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

#### 6. Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`

---

### Products Routes (`/api/products`)

#### 1. Get All Products
- **GET** `/api/products`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12)
  - `category`: Filter by category (Textiles, Ceramics, Furniture, Lighting, Decor)
  - `search`: Search by name/description
  - `sort`: Sort option (price-low, price-high, rating, newest)

- **Example**:
```
GET /api/products?page=1&category=Ceramics&sort=price-low
```

- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Talavera Bowl",
      "price": 89,
      "category": "Ceramics",
      "stock": 25,
      "rating": 4.8,
      "reviews": 36
    }
  ],
  "pagination": {
    "total": 100,
    "pages": 9,
    "currentPage": 1,
    "limit": 12
  }
}
```

#### 2. Get Product by ID
- **GET** `/api/products/:id`
- **Response**: `200 OK`

#### 3. Get Featured Products
- **GET** `/api/products/featured`
- **Response**: `200 OK` (returns array of featured products)

#### 4. Get Products by Category
- **GET** `/api/products/category/:category`
- **Response**: `200 OK`

#### 5. Create Product (Admin Only)
- **POST** `/api/products`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**:
```json
{
  "name": "New Product",
  "description": "Product description...",
  "price": 99.99,
  "category": "Ceramics",
  "stock": 20,
  "images": [
    {
      "url": "image_url",
      "alt": "Image description"
    }
  ],
  "materials": ["Ceramic"],
  "origin": "Mexico",
  "isFeatured": true
}
```

#### 6. Update Product (Admin Only)
- **PUT** `/api/products/:id`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**: (partial update)

#### 7. Delete Product (Admin Only)
- **DELETE** `/api/products/:id`
- **Headers**: `Authorization: Bearer <admin-token>`

---

### Orders Routes (`/api/orders`)

#### 1. Create Order
- **POST** `/api/orders`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "credit_card"
}
```

- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-1718456789-1",
    "userId": "...",
    "items": [...],
    "total": 199.99,
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

#### 2. Get User Orders
- **GET** `/api/orders`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### 3. Get Order by ID
- **GET** `/api/orders/:id`
- **Headers**: `Authorization: Bearer <token>`

#### 4. Cancel Order
- **PUT** `/api/orders/:id/cancel`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "cancelReason": "Changed my mind"
}
```

#### 5. Get All Orders (Admin Only)
- **GET** `/api/orders/admin/all`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by status (pending, confirmed, shipped, delivered, cancelled)

#### 6. Update Order Status (Admin Only)
- **PUT** `/api/orders/admin/:id/status`
- **Headers**: `Authorization: Bearer <admin-token>`
- **Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "TRACKING123"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "msg": "Validation error message",
      "param": "fieldName"
    }
  ]
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Product.js          # Product schema
│   │   └── Order.js            # Order schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── productController.js # Product logic
│   │   └── orderController.js  # Order logic
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── products.js         # Product routes
│   │   └── orders.js           # Order routes
│   ├── utils/
│   │   ├── logger.js           # Logging utility
│   │   └── validators.js       # Input validation
│   ├── seed.js                 # Database seeding
│   └── server.js               # Main server file
├── logs/                        # Application logs
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json
```

---

## Security Features

✅ **Implemented**:
- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Error handling (no stack traces in production)
- MongoDB injection protection (via Mongoose)
- Rate limiting ready (can add)

✅ **Best Practices**:
- Environment variable management
- Async/await error handling
- Connection pooling
- Indexed database queries
- Middleware-based architecture
- Clean separation of concerns

---

## Future Enhancements

1. **Payment Integration**
   - Stripe integration
   - PayPal support
   - Multiple payment methods

2. **Advanced Features**
   - Email notifications
   - SMS alerts
   - Push notifications

3. **Performance**
   - Redis caching
   - Database query optimization
   - CDN integration

4. **Analytics**
   - Sales reports
   - User behavior tracking
   - Performance monitoring

5. **Admin Dashboard**
   - Advanced filtering
   - Bulk operations
   - Inventory management

---

## Support & Contributing

For issues or suggestions, please contact the development team.

---

**Built with ❤️ by FAANG Expert Developers**
**Last Updated**: June 2026
