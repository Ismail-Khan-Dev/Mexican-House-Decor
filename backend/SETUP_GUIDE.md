# Backend Setup & Getting Started Guide

## 🎯 Quick Start (5 minutes)

### Prerequisites Check
- [ ] Node.js v18+ installed
- [ ] npm v8+ installed  
- [ ] MongoDB (local or Atlas account)

### Step 1: Initialize Backend
```bash
cd backend
```

### Step 2: Run Setup Script
**Windows**:
```bash
setup.bat
```

**macOS/Linux**:
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Configure Environment
Edit `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
JWT_SECRET=generate-a-random-32-char-string-here
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start MongoDB
```bash
mongod
```

### Step 5: Seed Initial Data
```bash
node src/seed.js
```

Expected output:
```
✅ Seeded 8 products successfully
```

### Step 6: Start Backend Server
```bash
npm run dev
```

Expected output:
```
✅ Server running on port 5000
📍 API Documentation: http://localhost:5000/api
🏥 Health check: http://localhost:5000/health
```

---

## ✅ Verification Checklist

After startup, verify everything works:

### 1. Health Check
```bash
curl http://localhost:5000/health
```
Should return: `{"success": true, "message": "Server is running"}`

### 2. Get Products
```bash
curl http://localhost:5000/api/products
```
Should return array of products with pagination

### 3. Create Account
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
Should return JWT token

### 4. Check Logs
```bash
tail -f logs/app.log
```
Should show connection and request logs

---

## 🔌 Connecting Frontend to Backend

### Step 1: Create API Service
Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const productService = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
};

export const orderService = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string, data: any) => api.put(`/orders/${id}/cancel`, data),
};

export default api;
```

### Step 2: Install axios (if not already)
```bash
cd ..
npm install axios
```

### Step 3: Update ShopPage to Use API
In `src/pages/ShopPage.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { productService } from '../services/api'

export function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll()
        setProducts(response.data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    // Use products from API instead of hardcoded data
  )
}
```

### Step 4: Update HomePage to Use API
Similar approach for featured products:

```typescript
useEffect(() => {
  const fetchFeaturedProducts = async () => {
    const response = await productService.getFeatured()
    setCollectionItems(response.data.data)
  }
  fetchFeaturedProducts()
}, [])
```

### Step 5: Create Auth Context (optional but recommended)
Create `src/context/AuthContext.tsx`:

```typescript
import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Verify token and get user data
      authService.getCurrentUser()
        .then(res => setUser(res.data.user))
        .catch(() => {
          setToken(null)
          localStorage.removeItem('token')
        })
    }
  }, [token])

  const login = async (email, password) => {
    const res = await authService.login({ email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
  }

  const signup = async (data) => {
    const res = await authService.signup(data)
    setToken(res.data.token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Step 6: Wrap App with Provider
In `src/main.tsx`:

```typescript
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

---

## 📊 Common API Responses

### Successful Product Fetch
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Oaxacan Wool Rug",
      "price": 485,
      "category": "Textiles",
      "stock": 15,
      "rating": 4.9
    }
  ],
  "pagination": {
    "total": 24,
    "pages": 2,
    "currentPage": 1,
    "limit": 12
  }
}
```

### Login Success
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": []
}
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- [ ] Ensure MongoDB is running: `mongod`
- [ ] Check MONGODB_URI in .env is correct
- [ ] For MongoDB Atlas, ensure IP is whitelisted

### "Invalid JWT Secret"
- [ ] Update JWT_SECRET in .env (must be 32+ characters)
- [ ] Restart server after changing

### "CORS Error in Browser"
- [ ] Verify CORS_ORIGIN in .env matches frontend URL
- [ ] Default is `http://localhost:3000`
- [ ] If frontend on different port, update .env

### "Port 5000 already in use"
- [ ] Change PORT in .env to 5001
- [ ] Or kill process: `lsof -ti:5000 | xargs kill` (macOS/Linux)

### "Module not found"
- [ ] Run `npm install` in backend directory
- [ ] Check all file paths are correct
- [ ] Ensure src/ directory exists

---

## 📈 Next: Integrate Shopping Cart

1. Create Cart context/state management
2. Add items to cart in ShopPage
3. Create cart endpoint in backend
4. Connect checkout to Order API

## 📱 Frontend Integration Checklist

- [ ] Install axios for API calls
- [ ] Create API service file
- [ ] Set up Auth context
- [ ] Connect ShopPage to products API
- [ ] Connect HomePage to featured products
- [ ] Implement login/signup flows
- [ ] Add product details page
- [ ] Create shopping cart functionality
- [ ] Implement checkout flow
- [ ] Add order history page

---

**You're ready! 🚀 The backend is production-ready and waiting for frontend integration!**
