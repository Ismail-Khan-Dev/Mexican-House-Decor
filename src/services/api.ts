import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'

/**
 * API Configuration
 * Connects frontend to backend at localhost:5000 (or production URL)
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Create Axios instance with default config
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: Add JWT token to all requests
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

/**
 * Response interceptor: Handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message)

    return Promise.reject(error)
  }
)

/**
 * Authentication Service
 */
export const authService = {
  /**
   * User registration
   */
  signup: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => api.post('/auth/signup', data),

  /**
   * User login
   */
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  /**
   * Get current user
   */
  getCurrentUser: () => api.get('/auth/me'),

  /**
   * Update user profile
   */
  updateProfile: (data: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }) => api.put('/auth/profile', data),

  /**
   * Change password
   */
  changePassword: (data: {
    currentPassword: string
    newPassword: string
  }) => api.post('/auth/change-password', data),

  /**
   * Logout (client-side)
   */
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

/**
 * Product Service
 */
export const productService = {
  /**
   * Get all products with pagination and filtering
   */
  getAll: (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
  }) => api.get('/products', { params }),

  /**
   * Get single product by ID
   */
  getById: (id: string) => api.get(`/products/${id}`),

  /**
   * Get featured products
   */
  getFeatured: () => api.get('/products/featured'),

  /**
   * Get products by category
   */
  getByCategory: (category: string, limit?: number) =>
    api.get(`/products/category/${category}`, {
      params: limit ? { limit } : {},
    }),

  /**
   * Create product (Admin only)
   */
  create: (data: any) => api.post('/products', data),

  /**
   * Update product (Admin only)
   */
  update: (id: string, data: any) => api.put(`/products/${id}`, data),

  /**
   * Delete product (Admin only)
   */
  delete: (id: string) => api.delete(`/products/${id}`),
}

/**
 * Order Service
 */
export const orderService = {
  /**
   * Create new order
   */
  create: (data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: {
      firstName: string
      lastName: string
      street: string
      city: string
      state: string
      zipCode: string
      country: string
      phone: string
    }
    billingAddress?: {
      firstName: string
      lastName: string
      street: string
      city: string
      state: string
      zipCode: string
    }
    paymentMethod: string
  }) => api.post('/orders', data),

  /**
   * Get user's orders
   */
  getMyOrders: (params?: { page?: number; limit?: number }) =>
    api.get('/orders', { params }),

  /**
   * Get single order by ID
   */
  getById: (id: string) => api.get(`/orders/${id}`),

  /**
   * Cancel order
   */
  cancel: (id: string, reason: string) =>
    api.put(`/orders/${id}/cancel`, { cancelReason: reason }),

  /**
   * Get all orders (Admin only)
   */
  getAllOrders: (params?: {
    page?: number
    limit?: number
    status?: string
  }) => api.get('/orders/admin/all', { params }),

  /**
   * Update order status (Admin only)
   */
  updateStatus: (id: string, status: string, trackingNumber?: string) =>
    api.put(`/orders/admin/${id}/status`, {
      status,
      trackingNumber,
    }),
}

/**
 * Type definitions for responses
 */
export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'user' | 'admin'
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: 'Textiles' | 'Ceramics' | 'Furniture' | 'Lighting' | 'Decor'
  images: Array<{ url: string; alt: string }>
  thumbnail: string
  rating: number
  reviews: number
  stock: number
  materials?: string[]
  artisan?: string
  origin?: string
  isFeatured?: boolean
}

export interface Order {
  _id: string
  orderNumber: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
    subtotal: number
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  pagination?: {
    total: number
    pages: number
    currentPage: number
    limit: number
  }
  errors?: Array<{ msg: string; param: string }>
}

export default api
