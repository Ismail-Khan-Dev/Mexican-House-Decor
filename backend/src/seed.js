/**
 * Seed initial products into database
 * Run: node src/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const logger = require('./utils/logger');

const products = [
  {
    name: 'Oaxacan Wool Rug',
    description: 'Hand-woven traditional Oaxacan rug featuring vibrant geometric patterns. Each piece is unique and crafted by skilled artisans. Perfect for adding authentic Mexican charm to any room.',
    price: 485,
    category: 'Textiles',
    images: [
      {
        url: '/images/masonry-textiles-rug.jpg',
        alt: 'Oaxacan Wool Rug',
      },
    ],
    thumbnail: '/images/masonry-textiles-rug.jpg',
    rating: 4.9,
    reviews: 24,
    stock: 15,
    sku: 'OWR-001',
    materials: ['Wool'],
    artisan: 'Traditional Oaxacan Artisans',
    origin: 'Oaxaca, Mexico',
    isFeatured: true,
  },
  {
    name: 'Talavera Serving Bowl Set',
    description: 'Set of 3 authentic Talavera ceramic bowls with traditional hand-painted designs. These colorful bowls are perfect for serving or decorating.',
    price: 89,
    category: 'Ceramics',
    images: [
      {
        url: '/images/masonry-ceramics-bowl.jpg',
        alt: 'Talavera Serving Bowl Set',
      },
    ],
    thumbnail: '/images/masonry-ceramics-bowl.jpg',
    rating: 4.8,
    reviews: 36,
    stock: 25,
    sku: 'TSB-001',
    materials: ['Ceramic'],
    artisan: 'Talavera Master Potters',
    origin: 'Puebla, Mexico',
    isFeatured: true,
  },
  {
    name: 'Carved Mesquite Bench',
    description: 'Solid mesquite wood bench with traditional carved details. Handcrafted piece that makes a stunning statement in any entryway or garden.',
    price: 1200,
    category: 'Furniture',
    images: [
      {
        url: '/images/masonry-furniture-bench.jpg',
        alt: 'Carved Mesquite Bench',
      },
    ],
    thumbnail: '/images/masonry-furniture-bench.jpg',
    rating: 5.0,
    reviews: 12,
    stock: 5,
    sku: 'CMB-001',
    dimensions: {
      length: 150,
      width: 50,
      height: 80,
      unit: 'cm',
    },
    weight: {
      value: 45,
      unit: 'kg',
    },
    materials: ['Mesquite Wood'],
    artisan: 'Master Woodcarvers',
    origin: 'Jalisco, Mexico',
    isFeatured: true,
  },
  {
    name: 'Hammered Copper Pendant',
    description: 'Handcrafted copper pendant lamp with hammered finish. Perfect for creating ambient lighting in kitchens or dining areas.',
    price: 340,
    category: 'Lighting',
    images: [
      {
        url: '/images/masonry-lighting-pendant.jpg',
        alt: 'Hammered Copper Pendant',
      },
    ],
    thumbnail: '/images/masonry-lighting-pendant.jpg',
    rating: 4.7,
    reviews: 18,
    stock: 12,
    sku: 'HCP-001',
    materials: ['Copper'],
    artisan: 'Copper Artisans Cooperative',
    origin: 'Santa Clara del Cobre, Mexico',
    isFeatured: false,
  },
  {
    name: 'Palm Leaf Wall Basket Set',
    description: 'Set of 3 decorative palm leaf baskets in various sizes. Woven by hand using traditional techniques. Great for wall display or storage.',
    price: 65,
    category: 'Decor',
    images: [
      {
        url: '/images/masonry-decor-basket.jpg',
        alt: 'Palm Leaf Wall Basket Set',
      },
    ],
    thumbnail: '/images/masonry-decor-basket.jpg',
    rating: 4.6,
    reviews: 42,
    stock: 30,
    sku: 'PLB-001',
    materials: ['Palm Leaves'],
    artisan: 'Basket Weavers Guild',
    origin: 'Oaxaca, Mexico',
    isFeatured: true,
  },
  {
    name: 'Zapotec Woven Pillow',
    description: 'Authentic Zapotec woven pillow with intricate geometric patterns. Made from high-quality cotton with a canvas back. Each pillow tells a story.',
    price: 78,
    category: 'Textiles',
    images: [
      {
        url: '/images/masonry-textiles-pillow.jpg',
        alt: 'Zapotec Woven Pillow',
      },
    ],
    thumbnail: '/images/masonry-textiles-pillow.jpg',
    rating: 4.8,
    reviews: 29,
    stock: 40,
    sku: 'ZWP-001',
    materials: ['Cotton', 'Canvas'],
    artisan: 'Zapotec Weavers Collective',
    origin: 'Oaxaca, Mexico',
    isFeatured: false,
  },
  {
    name: 'Barro Negro Vase',
    description: 'Handmade vase from Barro Negro (black clay) from Oaxaca. Polished to a glossy finish. Perfect for displaying flowers or as a standalone art piece.',
    price: 156,
    category: 'Ceramics',
    images: [
      {
        url: '/images/masonry-ceramics-vase.jpg',
        alt: 'Barro Negro Vase',
      },
    ],
    thumbnail: '/images/masonry-ceramics-vase.jpg',
    rating: 4.9,
    reviews: 15,
    stock: 18,
    sku: 'BNV-001',
    dimensions: {
      height: 35,
      unit: 'cm',
    },
    materials: ['Barro Negro Clay'],
    artisan: 'Black Clay Artisans',
    origin: 'San Bartolo Coyotepec, Oaxaca',
    isFeatured: false,
  },
  {
    name: 'Wrought Iron Side Table',
    description: 'Handforged wrought iron side table with a rustic design. Features intricate metalwork details. Pair with tile top for authentic Mexican style.',
    price: 420,
    category: 'Furniture',
    images: [
      {
        url: '/images/masonry-furniture-table.jpg',
        alt: 'Wrought Iron Side Table',
      },
    ],
    thumbnail: '/images/masonry-furniture-table.jpg',
    rating: 4.7,
    reviews: 21,
    stock: 8,
    sku: 'WIT-001',
    dimensions: {
      length: 60,
      width: 60,
      height: 70,
      unit: 'cm',
    },
    materials: ['Wrought Iron'],
    artisan: 'Iron Smiths',
    origin: 'Tlaxcala, Mexico',
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexican-decor-db');

    // Clear existing products
    await Product.deleteMany({});
    logger.info('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    logger.info(`✅ Seeded ${createdProducts.length} products successfully`);

    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
