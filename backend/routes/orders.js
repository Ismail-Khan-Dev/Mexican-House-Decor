import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (Admin)
 * @access  Private/Admin
 */
router.get('/admin/all', protect, authorize('admin'), getAllOrders);

/**
 * @route   PUT /api/orders/admin/:id/status
 * @desc    Update order status (Admin)
 * @access  Private/Admin
 */
router.put(
  '/admin/:id/status',
  protect,
  authorize('admin'),
  [
    body('status')
      .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  updateOrderStatus
);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
    body('paymentMethod')
      .optional()
      .isIn(['jazzcash', 'cod'])
      .withMessage('Payment method must be jazzcash or cod'),
  ],
  createOrder
);

/**
 * @route   GET /api/orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/', protect, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 * @access  Private (own order) or Admin
 */
router.get('/:id', protect, getOrderById);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private (own order)
 */
router.put('/:id/cancel', protect, cancelOrder);

export default router;
