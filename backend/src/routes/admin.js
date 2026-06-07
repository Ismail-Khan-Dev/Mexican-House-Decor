const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.put('/users/:id/toggle-status', authMiddleware, adminMiddleware, adminController.toggleUserStatus);

module.exports = router;
