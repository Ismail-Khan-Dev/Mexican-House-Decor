const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ['Textiles', 'Ceramics', 'Furniture', 'Lighting', 'Decor'],
      index: true,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    thumbnail: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String, // cm or inches
    },
    weight: {
      value: Number,
      unit: String, // kg or lbs
    },
    materials: [String],
    artisan: String,
    origin: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
