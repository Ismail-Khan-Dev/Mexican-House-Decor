const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Product = require('../models/Product');
const jazzcash = require('../services/jazzcash');
const logger = require('../utils/logger');

exports.initiateJazzCashPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
    }

    const existingPayment = await Payment.findOne({ orderId, status: { $in: ['pending', 'processing'] } });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: 'Payment already initiated',
        data: {
          paymentId: existingPayment._id,
          redirectUrl: existingPayment.redirectUrl,
          formFields: existingPayment.gatewayResponse?.formFields,
          transactionRef: existingPayment.transactionRef,
        },
      });
    }

    const result = await jazzcash.initiatePayment({
      amount: order.total,
      orderRef: order.orderNumber,
      description: `Order ${order.orderNumber}`,
    });

    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user.userId,
      gateway: 'jazzcash',
      transactionRef: result.transactionRef,
      amount: order.total,
      redirectUrl: result.redirectUrl,
      gatewayResponse: { formFields: result.formFields },
    });

    await Order.findByIdAndUpdate(order._id, { paymentStatus: 'processing' });

    logger.info(`Payment initiated: ${result.transactionRef} for order ${order.orderNumber}`);

    res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: {
        paymentId: payment._id,
        redirectUrl: result.redirectUrl,
        formFields: result.formFields,
        transactionRef: result.transactionRef,
      },
    });
  } catch (error) {
    logger.error('Initiate payment error:', error.message);
    next(error);
  }
};

exports.jazzCashCallback = async (req, res, next) => {
  try {
    const params = req.body;
    const verification = jazzcash.verifyPayment(params);

    if (!verification.valid) {
      logger.error('JazzCash callback verification failed');
      return res.status(400).json({ success: false, message: verification.message });
    }

    const payment = await Payment.findOne({ transactionRef: verification.transactionRef });
    if (!payment) {
      logger.error(`Payment not found for ref: ${verification.transactionRef}`);
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const order = await Order.findById(payment.orderId);
    if (!order) {
      logger.error(`Order not found for payment: ${payment._id}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (verification.success) {
      payment.status = 'completed';
      payment.paidAt = new Date();
      await payment.save();

      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();

      logger.info(`Payment completed: ${verification.transactionRef} for order ${order.orderNumber}`);
    } else {
      payment.status = 'failed';
      payment.gatewayResponse = { ...payment.gatewayResponse?.toObject?.() || payment.gatewayResponse, callbackResponse: params };
      await payment.save();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }

      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();

      logger.warn(`Payment failed: ${verification.transactionRef} for order ${order.orderNumber}`);
    }

    const redirectStatus = verification.success ? 'success' : 'failure';
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/payment/status?status=${redirectStatus}&orderRef=${order.orderNumber}&txnRef=${verification.transactionRef}`);
  } catch (error) {
    logger.error('JazzCash callback error:', error.message);
    next(error);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { transactionRef, orderId } = req.query;

    let payment;
    if (transactionRef) {
      payment = await Payment.findOne({ transactionRef });
    } else if (orderId) {
      payment = await Payment.findOne({ orderId }).sort({ createdAt: -1 });
    }

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const order = await Order.findById(payment.orderId);

    res.status(200).json({
      success: true,
      data: {
        payment: {
          _id: payment._id,
          transactionRef: payment.transactionRef,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          gateway: payment.gateway,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt,
        },
        order: order ? {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
        } : null,
      },
    });
  } catch (error) {
    logger.error('Get payment status error:', error.message);
    next(error);
  }
};
