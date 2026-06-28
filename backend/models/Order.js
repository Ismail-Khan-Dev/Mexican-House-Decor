import mongoose from 'mongoose';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  street:    { type: String, required: true, trim: true },
  city:      { type: String, required: true, trim: true },
  state:     { type: String, required: true, trim: true },
  zipCode:   { type: String, required: true, trim: true },
  country:   { type: String, required: true, trim: true, default: 'US' },
  phone:     { type: String, required: true, trim: true },
}, { _id: false });

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: PAYMENT_METHODS,
    default: 'cod',
  },
  status: {
    type: String,
    enum: PAYMENT_STATUSES,
    default: 'pending',
  },
  transactionRef: {
    type: String,
    default: '',
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (v) => v.length > 0,
      message: 'Order must have at least one item',
    },
  },
  shippingAddress: {
    type: addressSchema,
    required: true,
  },
  billingAddress: {
    type: addressSchema,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: 'pending',
  },
  payment: {
    type: paymentInfoSchema,
    default: () => ({}),
  },
  trackingNumber: {
    type: String,
    default: '',
  },
  cancelReason: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    maxlength: 500,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: formatted date
orderSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.transactionRef': 1 });

/**
 * Generate unique order number: MHDecor-YYYYMMDD-XXXX
 * @returns {string}
 */
orderSchema.statics.generateOrderNumber = function () {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MHDecor-${dateStr}-${random}`;
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
