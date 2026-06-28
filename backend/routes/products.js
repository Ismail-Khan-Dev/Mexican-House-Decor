import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addRating,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

const router = Router();

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', getFeaturedProducts);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @route   GET /api/products
 * @desc    Get all products (with pagination, filtering, search)
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create product (Admin)
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .isIn(PRODUCT_CATEGORIES)
      .withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin)
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteProduct);

/**
 * @route   POST /api/products/:id/rating
 * @desc    Add rating to product
 * @access  Private
 */
router.post(
  '/:id/rating',
  protect,
  [
    body('score')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('review')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Review cannot exceed 500 characters'),
  ],
  addRating
);

export default router;
