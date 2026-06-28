import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { HTTP, PAGINATION } from '../config/constants.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Validate and fetch products
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'One or more products are invalid or unavailable',
      });
    }

    // Build order items with current prices
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}" — only ${product.stock} available`,
          HTTP.BAD_REQUEST
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    // Calculate costs
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderNumber: Order.generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      payment: {
        method: paymentMethod || 'cod',
        status: paymentMethod === 'jazzcash' ? 'pending' : 'pending',
      },
    });

    // Decrease stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Populate user info
    await order.populate('user', 'firstName lastName email');

    res.status(HTTP.CREATED).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    const statusCode = error.statusCode || HTTP.INTERNAL_ERROR;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
};

/**
 * @desc    Get current user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'firstName lastName email'),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.status(HTTP.OK).json({
      success: true,
      data: orders,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Get my orders error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (own order) or Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'firstName lastName email'
    );

    if (!order) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check ownership or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(HTTP.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (own order)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(HTTP.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: `Cannot cancel order with status '${order.status}'`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason || 'Cancelled by user';
    await order.save();

    res.status(HTTP.OK).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to cancel order',
    });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'firstName lastName email'),
      Order.countDocuments(filter),
    ]);

    res.status(HTTP.OK).json({
      success: true,
      data: orders,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/admin/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    // If cancelling from admin, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
    }
    await order.save();

    await order.populate('user', 'firstName lastName email');

    res.status(HTTP.OK).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};
