/**
 * Application constants
 */

export const PRODUCT_CATEGORIES = ['Textiles', 'Ceramics', 'Furniture', 'Lighting', 'Wall Decor'];

export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export const PAYMENT_STATUSES = ['pending', 'processing', 'completed', 'failed', 'refunded'];

export const PAYMENT_METHODS = ['jazzcash', 'cod'];

export const ROLES = ['user', 'admin'];

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * JWT configuration
 */
export const JWT = {
  EXPIRES_IN: '7d',
  SECRET: process.env.JWT_SECRET || 'mexican-house-decor-fallback-secret-change-me',
};

/**
 * JazzCash sandbox config
 */
export const JAZZCASH = {
  MERCHANT_ID: process.env.JAZZCASH_MERCHANT_ID || '',
  PASSWORD: process.env.JAZZCASH_PASSWORD || '',
  RETURN_URL: process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment/status',
  CALLBACK_URL: process.env.JAZZCASH_CALLBACK_URL || 'http://localhost:5000/api/payment/jazzcash/callback',
  INTEGRITY_SALT: process.env.JAZZCASH_INTEGRITY_SALT || '',
  IS_SANDBOX: process.env.JAZZCASH_SANDBOX === 'true',
};

/**
 * HTTP status codes
 */
export const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};
