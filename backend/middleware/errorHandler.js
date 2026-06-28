import { HTTP } from '../config/constants.js';

/**
 * 404 Not Found handler — catches undefined routes
 */
export const notFound = (req, res, _next) => {
  res.status(HTTP.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global error handler — catches all unhandled errors
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || HTTP.INTERNAL_ERROR;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP.BAD_REQUEST;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for '${field}' — already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = HTTP.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP.UNAUTHORIZED;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * Custom API Error class
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
