import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { HTTP } from '../config/constants.js';

/**
 * @desc    Get admin dashboard stats (orders, products, users, revenue, low stock)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult,
      lowStockProducts,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({ isActive: true, stock: { $lte: 5 } })
        .select('name stock')
        .sort({ stock: 1 })
        .limit(10),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'firstName lastName email')
        .select('orderNumber status total createdAt user'),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Convert ordersByStatus array to object
    const statusCounts = {};
    ordersByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.status(HTTP.OK).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalProducts,
          totalUsers,
          revenue,
          ordersByStatus: statusCounts,
        },
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch admin stats',
    });
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      User.countDocuments(filter),
    ]);

    res.status(HTTP.OK).json({
      success: true,
      data: users,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Role must be either "user" or "admin"',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true }
    );

    if (!user) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      message: `User role updated to '${role}'`,
      data: user,
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update user role',
    });
  }
};
