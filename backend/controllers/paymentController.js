import Order from '../models/Order.js';
import { HTTP, JAZZCASH } from '../config/constants.js';
import crypto from 'crypto';

/**
 * @desc    Initiate JazzCash payment
 * @route   POST /api/payment/jazzcash/initiate
 * @access  Private
 */
export const initiateJazzCash = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(HTTP.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to pay for this order',
      });
    }

    if (order.payment.method !== 'jazzcash') {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'This order is not set up for JazzCash payment',
      });
    }

    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const amount = Math.round(order.total * 100); // JazzCash expects amount in paisa

    // Generate integrity hash (JazzCash required)
    const salt = JAZZCASH.INTEGRITY_SALT;
    const hashString = `${JAZZCASH.MERCHANT_ID}${transactionRef}${amount}${JAZZCASH.PASSWORD}${salt}`;
    const integritySalt = crypto.createHash('sha256').update(hashString).digest('hex');

    // Update order payment info
    order.payment.transactionRef = transactionRef;
    order.payment.status = 'processing';
    await order.save();

    // Determine JazzCash endpoint
    const baseUrl = JAZZCASH.IS_SANDBOX
      ? 'https://sandbox.jazzcash.com.pk/ApplicationServer/API/Payment/DoTransaction'
      : 'https://api.jazzcash.com.pk/ApplicationServer/API/Payment/DoTransaction';

    // Build form fields for JazzCash
    const formFields = {
      PP_MerchantID: JAZZCASH.MERCHANT_ID,
      PP_Password: JAZZCASH.PASSWORD,
      PP_ReturnURL: JAZZCASH.RETURN_URL,
      PP_TxnReferenceNo: transactionRef,
      PP_TxnAmount: amount.toString(),
      PP_TxnCurrency: 'PKR',
      PP_MerchantName: 'Mexican House Decor',
      PP_ProductDescription: `Order #${order.orderNumber}`,
      PP_TxnDateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      PP_BillReference: order.orderNumber,
      PP_TransactionMode: 'ChannelIntegration',
      PP_IntegritySalt: integritySalt,
    };

    res.status(HTTP.OK).json({
      success: true,
      data: {
        redirectUrl: baseUrl,
        formFields,
        transactionRef,
      },
    });
  } catch (error) {
    console.error('Initiate JazzCash error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to initiate payment',
    });
  }
};

/**
 * @desc    JazzCash callback (gateway redirects here after payment)
 * @route   POST /api/payment/jazzcash/callback
 * @access  Public (called by JazzCash gateway)
 */
export const jazzCashCallback = async (req, res) => {
  try {
    const {
      PP_TxnReferenceNo,
      PP_TxnStatus,
      PP_ResponseCode,
      PP_ResponseMessage,
    } = req.body;

    const order = await Order.findOne({
      'payment.transactionRef': PP_TxnReferenceNo,
    });

    if (!order) {
      console.error('JazzCash callback: Order not found for ref', PP_TxnReferenceNo);
      return res.redirect(`${JAZZCASH.RETURN_URL}?status=failed`);
    }

    // PP_TxnStatus: 00 = success
    if (PP_ResponseCode === '00' || PP_TxnStatus === '00') {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.payment.gatewayResponse = req.body;
      order.status = 'confirmed';
    } else {
      order.payment.status = 'failed';
      order.payment.gatewayResponse = req.body;
    }

    await order.save();

    const redirectStatus = order.payment.status === 'completed' ? 'success' : 'failed';
    res.redirect(`${JAZZCASH.RETURN_URL}?status=${redirectStatus}&orderRef=${order.orderNumber}&txnRef=${PP_TxnReferenceNo}`);
  } catch (error) {
    console.error('JazzCash callback error:', error.message);
    res.redirect(`${JAZZCASH.RETURN_URL}?status=error`);
  }
};

/**
 * @desc    Get payment status
 * @route   GET /api/payment/status
 * @access  Public
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionRef, orderId } = req.query;

    let order;
    if (transactionRef) {
      order = await Order.findOne({ 'payment.transactionRef': transactionRef });
    } else if (orderId) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      data: {
        payment: order.payment,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to get payment status',
    });
  }
};
