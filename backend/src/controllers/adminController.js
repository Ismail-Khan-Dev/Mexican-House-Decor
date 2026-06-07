const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Product.find({ stock: { $lte: 5 }, isActive: true })
        .select('name stock sku')
        .sort({ stock: 1 })
        .limit(10)
        .lean(),
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const ordersByPayment = await Order.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalProducts,
          totalUsers,
          revenue: Math.round(revenue * 100) / 100,
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        ordersByPayment: ordersByPayment.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error.message);
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, pages: Math.ceil(total / limit), currentPage: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    logger.error('Get all users error:', error.message);
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });
    }

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`User ${user.isActive ? 'activated' : 'deactivated'}: ${user.email}`);

    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    logger.error('Toggle user status error:', error.message);
    next(error);
  }
};
