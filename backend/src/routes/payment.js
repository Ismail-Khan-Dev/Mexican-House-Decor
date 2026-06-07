const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

router.post('/jazzcash/initiate', authMiddleware, paymentController.initiateJazzCashPayment);

router.post('/jazzcash/callback', paymentController.jazzCashCallback);

router.get('/status', authMiddleware, paymentController.getPaymentStatus);

module.exports = router;
