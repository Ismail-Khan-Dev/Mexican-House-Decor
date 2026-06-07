const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { orderValidators, validate } = require('../utils/validators');

/**
 * User routes
 */
router.post(
  '/',
  authMiddleware,
  orderValidators.create,
  validate,
  orderController.createOrder
);

router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

/**
 * Admin routes
 */
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put(
  '/admin/:id/status',
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
