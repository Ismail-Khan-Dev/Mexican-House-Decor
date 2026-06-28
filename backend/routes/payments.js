import { Router } from 'express';
import {
  initiateJazzCash,
  jazzCashCallback,
  getPaymentStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/payment/jazzcash/initiate
 * @desc    Initiate JazzCash payment
 * @access  Private
 */
router.post('/jazzcash/initiate', protect, initiateJazzCash);

/**
 * @route   POST /api/payment/jazzcash/callback
 * @desc    JazzCash callback after payment
 * @access  Public (called by JazzCash gateway)
 */
router.post('/jazzcash/callback', jazzCashCallback);

/**
 * @route   GET /api/payment/status
 * @desc    Get payment status
 * @access  Public
 */
router.get('/status', getPaymentStatus);

export default router;
