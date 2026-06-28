import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../config/constants.js';

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
}, { _id: false });

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    maxlength: 500,
    trim: true,
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: null,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: PRODUCT_CATEGORIES,
      message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
    },
  },
  thumbnail: {
    type: String,
    default: '/images/placeholder.jpg',
  },
  images: {
    type: [imageSchema],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  materials: {
    type: [String],
    default: [],
  },
  artisan: {
    type: String,
    trim: true,
    default: '',
  },
  origin: {
    type: String,
    trim: true,
    default: '',
  },
  ratings: {
    type: [ratingSchema],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: average rating (computed from ratings array)
productSchema.virtual('rating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Virtual: total reviews count
productSchema.virtual('reviews').get(function () {
  return this.ratings ? this.ratings.length : 0;
});

// Indexes for fast queries
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
