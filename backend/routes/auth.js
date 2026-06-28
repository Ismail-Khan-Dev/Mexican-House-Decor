import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getCurrentUser, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/signup',
  [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email')
      .trim()
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getCurrentUser);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update profile
 * @access  Private
 */
router.put('/profile', protect, updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  changePassword
);

export default router;
