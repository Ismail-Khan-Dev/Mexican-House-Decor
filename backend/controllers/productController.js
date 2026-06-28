import Product from '../models/Product.js';
import { HTTP, PAGINATION, PRODUCT_CATEGORIES } from '../config/constants.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get all products (with pagination, filtering, sorting, search)
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artisan: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Build sort
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'name') sortOption = { name: 1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { soldCount: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(HTTP.OK).json({
      success: true,
      data: products,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Get products error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

/**
 * @desc    Get featured products (isFeatured=true)
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(HTTP.OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get featured products error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch featured products',
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    if (!PRODUCT_CATEGORIES.includes(category)) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: `Invalid category. Must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
      });
    }

    const products = await Product.find({
      category,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(HTTP.OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get products by category error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to fetch products by category',
    });
  }
};

/**
 * @desc    Create new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const product = await Product.create(req.body);

    res.status(HTTP.CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to create product',
    });
  }
};

/**
 * @desc    Update product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(HTTP.OK).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update product',
    });
  }
};

/**
 * @desc    Delete product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete: set isActive to false
    product.isActive = false;
    await product.save();

    res.status(HTTP.OK).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

/**
 * @desc    Add rating to product
 * @route   POST /api/products/:id/rating
 * @access  Private
 */
export const addRating = async (req, res) => {
  try {
    const { score, review } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (existingRating) {
      // Update existing rating
      existingRating.score = score;
      if (review) existingRating.review = review;
    } else {
      // Add new rating
      product.ratings.push({
        userId: req.user._id,
        score,
        review,
      });
    }

    await product.save();

    res.status(HTTP.OK).json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        rating: product.rating,
        reviews: product.reviews,
      },
    });
  } catch (error) {
    console.error('Add rating error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to add rating',
    });
  }
};
