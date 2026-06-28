#!/bin/bash

# Mexican Home Decor Backend - Setup Script
# This script sets up the backend environment and verifies all dependencies

echo "🚀 Mexican Home Decor Backend Setup"
echo "===================================="
echo ""

# Check Node.js
echo "📋 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION installed"
echo ""

# Check npm
echo "📋 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION installed"
echo ""

# Check MongoDB
echo "📋 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found locally"
    echo "   ℹ️  You can use MongoDB Atlas instead (cloud)"
    echo "   ℹ️  Update MONGODB_URI in .env file"
fi
echo ""

# Create .env file if it doesn't exist
echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  IMPORTANT: Update JWT_SECRET in .env (must be 32+ characters)"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs
echo "✅ Logs directory ready"
echo ""

# Verify .env configuration
echo "🔐 Configuration Check"
echo "====================="
if grep -q "your_super_secret" .env; then
    echo "⚠️  WARNING: JWT_SECRET needs to be updated!"
    echo "   Please change the JWT_SECRET in .env to a random 32+ character string"
fi

if grep -q "localhost" .env; then
    echo "ℹ️  Using local MongoDB - make sure it's running"
    echo "   Start MongoDB with: mongod"
fi
echo ""

# Ready to start
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Update .env file with your settings"
echo "2. Ensure MongoDB is running: mongod"
echo "3. Seed database: node src/seed.js"
echo "4. Start server: npm run dev"
echo ""
echo "📚 Documentation: See README.md and API_DOCUMENTATION.md"
echo ""
