const { body, param, query, validationResult } = require('express-validator');
const validator = require('validator');

/**
 * Centralized validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Auth validators
 */
const authValidators = {
  signup: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

/**
 * Product validators
 */
const productValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Product name must be at least 3 characters'),
    body('description')
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a valid number greater than 0'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Product name must be at least 3 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a valid number greater than 0'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],
};

/**
 * Order validators
 */
const orderValidators = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('shippingAddress.street')
      .notEmpty()
      .withMessage('Street is required'),
    body('shippingAddress.city')
      .notEmpty()
      .withMessage('City is required'),
    body('shippingAddress.zipCode')
      .notEmpty()
      .withMessage('Zip code is required'),
  ],
};

module.exports = {
  validate,
  authValidators,
  productValidators,
  orderValidators,
};
