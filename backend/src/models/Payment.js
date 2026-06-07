const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gateway: {
    type: String,
    enum: ['jazzcash', 'easypaisa', 'cod'],
    default: 'jazzcash',
  },
  transactionRef: {
    type: String,
    unique: true,
    sparse: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'PKR',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
  redirectUrl: {
    type: String,
  },
  paidAt: Date,
}, {
  timestamps: true,
});

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ transactionRef: 1 });
paymentSchema.index({ userId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
