import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Oaxacan Handwoven Zapotec Rug',
    description: 'A stunning handwoven rug from the Zapotec weavers of Oaxaca. Made with natural dyes and traditional techniques passed down through generations. Each piece tells a story of Mexican heritage.',
    price: 285,
    originalPrice: 340,
    category: 'Textiles',
    thumbnail: '/images/masonry-textiles-rug.jpg',
    images: [{ url: '/images/masonry-textiles-rug.jpg', alt: 'Zapotec Rug' }],
    stock: 12,
    materials: ['Wool', 'Natural Dyes'],
    artisan: 'Maria Lopez',
    origin: 'Oaxaca, Mexico',
    isFeatured: true,
    soldCount: 24,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Absolutely beautiful craftsmanship' },
      { userId: new mongoose.Types.ObjectId(), score: 4, review: 'Gorgeous colors' },
    ],
  },
  {
    name: 'Talavera Ceramic Planter',
    description: 'Hand-painted Talavera planter from Puebla. Features traditional blue and white patterns with terracotta base. Perfect for succulents and indoor plants.',
    price: 65,
    category: 'Ceramics',
    thumbnail: '/images/masonry-ceramics-planter.jpg',
    images: [{ url: '/images/masonry-ceramics-planter.jpg', alt: 'Talavera Planter' }],
    stock: 25,
    materials: ['Ceramic', 'Lead-free Glaze'],
    artisan: 'Carlos Hernandez',
    origin: 'Puebla, Mexico',
    isFeatured: true,
    soldCount: 56,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Love the traditional patterns' },
    ],
  },
  {
    name: 'Carved Wooden Console Table',
    description: 'Solid mesquite wood console table with hand-carved geometric patterns. A statement piece that brings warmth and artisanal character to any entryway.',
    price: 890,
    originalPrice: 1100,
    category: 'Furniture',
    thumbnail: '/images/masonry-furniture-table.jpg',
    images: [{ url: '/images/masonry-furniture-table.jpg', alt: 'Console Table' }],
    stock: 4,
    materials: ['Mesquite Wood', 'Natural Finish'],
    artisan: 'Roberto Diaz',
    origin: 'San Miguel de Allende',
    isFeatured: true,
    soldCount: 8,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Masterpiece of woodworking' },
    ],
  },
  {
    name: 'Wrought Iron Pendant Light',
    description: 'Hand-forged wrought iron pendant with amber glass shade. Creates warm, ambient lighting reminiscent of hacienda courtyards.',
    price: 175,
    category: 'Lighting',
    thumbnail: '/images/masonry-lighting-pendant.jpg',
    images: [{ url: '/images/masonry-lighting-pendant.jpg', alt: 'Pendant Light' }],
    stock: 8,
    materials: ['Wrought Iron', 'Amber Glass'],
    artisan: 'Fernando Ruiz',
    origin: 'San Miguel de Allende',
    isFeatured: true,
    soldCount: 18,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 4, review: 'Beautiful warm glow' },
    ],
  },
  {
    name: 'Handwoven Palm Fiber Basket',
    description: 'Traditional palm fiber basket from Chiapas. Perfect for storage, display, or as a decorative accent. Each basket is uniquely woven by hand.',
    price: 45,
    category: 'Wall Decor',
    thumbnail: '/images/masonry-decor-basket.jpg',
    images: [{ url: '/images/masonry-decor-basket.jpg', alt: 'Palm Basket' }],
    stock: 30,
    materials: ['Palm Fiber'],
    artisan: 'Ana Martinez',
    origin: 'Chiapas, Mexico',
    isFeatured: false,
    soldCount: 42,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Perfect for my living room' },
    ],
  },
  {
    name: 'Mexican Ceramic Serving Bowl',
    description: 'Large hand-painted ceramic bowl with traditional Talavera motifs. Ideal for serving or as a stunning centerpiece.',
    price: 55,
    category: 'Ceramics',
    thumbnail: '/images/masonry-ceramics-bowl.jpg',
    images: [{ url: '/images/masonry-ceramics-bowl.jpg', alt: 'Ceramic Bowl' }],
    stock: 18,
    materials: ['Ceramic', 'Lead-free Glaze'],
    artisan: 'Patricia Vargas',
    origin: 'Puebla, Mexico',
    isFeatured: true,
    soldCount: 35,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 4, review: 'Stunning craftsmanship' },
    ],
  },
  {
    name: 'Hand-Embroidered Throw Pillow',
    description: 'Colorful embroidered pillow from Oaxaca. Features traditional Tenango embroidery with vibrant floral motifs on cotton.',
    price: 78,
    category: 'Textiles',
    thumbnail: '/images/masonry-textiles-pillow.jpg',
    images: [{ url: '/images/masonry-textiles-pillow.jpg', alt: 'Embroidered Pillow' }],
    stock: 22,
    materials: ['Cotton', 'Embroidery Thread'],
    artisan: 'Sofia Cruz',
    origin: 'Oaxaca, Mexico',
    isFeatured: false,
    soldCount: 48,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'So colorful and well-made' },
    ],
  },
  {
    name: 'Woven Cotton Throw Blanket',
    description: 'Lightweight cotton throw blanket with traditional Mexican stripe pattern. Perfect for couches, beds, or outdoor lounging.',
    price: 120,
    originalPrice: 145,
    category: 'Textiles',
    thumbnail: '/images/masonry-textiles-throw.jpg',
    images: [{ url: '/images/masonry-textiles-throw.jpg', alt: 'Cotton Throw' }],
    stock: 15,
    materials: ['100% Cotton'],
    artisan: 'Guerrero Weavers Co-op',
    origin: 'Guerrero, Mexico',
    isFeatured: false,
    soldCount: 28,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 4, review: 'Soft and beautiful pattern' },
    ],
  },
  {
    name: 'Talavera Wall Tile Set (4pc)',
    description: 'Set of 4 hand-painted Talavera tiles. Mix and match patterns for a stunning wall display or tabletop arrangement.',
    price: 92,
    category: 'Wall Decor',
    thumbnail: '/images/masonry-ceramics-vase.jpg',
    images: [{ url: '/images/masonry-ceramics-vase.jpg', alt: 'Talavera Tiles' }],
    stock: 20,
    materials: ['Ceramic', 'Lead-free Glaze'],
    artisan: 'Taller La Tolita',
    origin: 'Puebla, Mexico',
    isFeatured: false,
    soldCount: 32,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Authentic Talavera beauty' },
    ],
  },
  {
    name: 'Copper Lantern with Colored Glass',
    description: 'Hand-hammered copper lantern with colored glass panels. Creates magical light patterns. Use with candles or LED.',
    price: 135,
    category: 'Lighting',
    thumbnail: '/images/masonry-lighting-lantern.jpg',
    images: [{ url: '/images/masonry-lighting-lantern.jpg', alt: 'Copper Lantern' }],
    stock: 10,
    materials: ['Copper', 'Colored Glass'],
    artisan: 'Jesus Morales',
    origin: 'Santa Clara del Cobre',
    isFeatured: false,
    soldCount: 15,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Magical ambient light' },
    ],
  },
  {
    name: 'Carved Wooden Bench',
    description: 'Solid wood bench with hand-carved floral motifs. Seats 2-3 people. Perfect for entryways, patios, or gardens.',
    price: 650,
    category: 'Furniture',
    thumbnail: '/images/masonry-furniture-bench.jpg',
    images: [{ url: '/images/masonry-furniture-bench.jpg', alt: 'Carved Bench' }],
    stock: 3,
    materials: ['Pine Wood', 'Natural Finish'],
    artisan: 'Miguel Angel Torres',
    origin: 'Oaxaca, Mexico',
    isFeatured: false,
    soldCount: 6,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 5, review: 'Heirloom quality piece' },
    ],
  },
  {
    name: 'Woven Jute Table Runner',
    description: 'Natural jute table runner with terracotta accent stripes. Adds rustic Mexican charm to any dining table.',
    price: 48,
    category: 'Wall Decor',
    thumbnail: '/images/masonry-decor-runner.jpg',
    images: [{ url: '/images/masonry-decor-runner.jpg', alt: 'Jute Runner' }],
    stock: 35,
    materials: ['Jute', 'Cotton'],
    artisan: 'Textiles del Sur Co-op',
    origin: 'Chiapas, Mexico',
    isFeatured: false,
    soldCount: 52,
    ratings: [
      { userId: new mongoose.Types.ObjectId(), score: 4, review: 'Exactly what I was looking for' },
    ],
  },
];

const seedAdmin = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@mexicandecor.com',
  password: 'admin12345',
  role: 'admin',
};

/**
 * Seed database with sample products and admin user
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({ email: seedAdmin.email });

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create(seedAdmin);
    console.log(`   ✅ Admin: ${admin.email} / ${seedAdmin.password}`);

    // Create products
    console.log('📦 Creating sample products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`   ✅ ${products.length} products created\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('Admin Login:');
    console.log('  Email:    admin@mexicandecor.com');
    console.log('  Password: admin12345');
    console.log('');
    console.log(`Products: ${products.length} created`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
