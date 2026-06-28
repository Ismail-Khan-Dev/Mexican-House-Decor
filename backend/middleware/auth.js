import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT, HTTP } from '../config/constants.js';

/**
 * Protect routes — verify JWT token from Authorization header
 * Attaches user object to req.user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT.SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized — user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized — invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized — token expired',
      });
    }
    return res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HTTP.FORBIDDEN).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

/**
 * Generate JWT token for a user
 * @param {string} userId
 * @returns {string}
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT.SECRET, {
    expiresIn: JWT.EXPIRES_IN,
  });
};
