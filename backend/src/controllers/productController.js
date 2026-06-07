const Product = require('../models/Product');
const logger = require('../utils/logger');

/**
 * Get all products with pagination and filtering
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, sort } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    logger.error('Get all products error:', error.message);
    next(error);
  }
};

/**
 * Get single product by ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Get product error:', error.message);
    next(error);
  }
};

/**
 * Create new product (Admin only)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    logger.info(`Product created: ${product.name}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    logger.error('Create product error:', error.message);
    next(error);
  }
};

/**
 * Update product (Admin only)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    logger.info(`Product updated: ${product.name}`);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    logger.error('Update product error:', error.message);
    next(error);
  }
};

/**
 * Delete product (Admin only)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    logger.info(`Product deleted: ${product.name}`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error('Delete product error:', error.message);
    next(error);
  }
};

/**
 * Get featured products
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    }).limit(6);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error('Get featured products error:', error.message);
    next(error);
  }
};

/**
 * Get products by category
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 12 } = req.query;

    const products = await Product.find({
      category,
      isActive: true,
    }).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error('Get products by category error:', error.message);
    next(error);
  }
};
