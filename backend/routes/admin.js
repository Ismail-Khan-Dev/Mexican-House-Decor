import { Router } from 'express';
import { body } from 'express-validator';
import { getAdminStats, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard stats
 * @access  Private/Admin
 */
router.get('/stats', getAdminStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/users', getAllUsers);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put(
  '/users/:id/role',
  [
    body('role')
      .isIn(['user', 'admin'])
      .withMessage('Role must be either "user" or "admin"'),
  ],
  updateUserRole
);

export default router;
