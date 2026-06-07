const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { productValidators, validate } = require('../utils/validators');

/**
 * Public routes
 */
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

/**
 * Admin routes
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  productValidators.create,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productValidators.update,
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
