const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { authValidators, validate } = require('../utils/validators');

/**
 * Public routes
 */
router.post('/signup', authValidators.signup, validate, authController.signup);
router.post('/login', authValidators.login, validate, authController.login);

/**
 * Protected routes
 */
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
