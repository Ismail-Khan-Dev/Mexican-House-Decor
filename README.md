# Mexican House Decor — Premium E-Commerce Platform

A production-grade, full-stack e-commerce application for a premium Mexican home decor brand. Built with enterprise architecture patterns, secure authentication, local payment gateway integration, and a stunning immersive frontend experience.

## Tech Stack

| Tier | Technology |
|------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router 7 |
| **Backend** | Node.js, Express.js 5, Mongoose ODM |
| **Database** | MongoDB (with indexing, connection pooling) |
| **Auth** | JWT (jsonwebtoken + bcryptjs), Role-based access |
| **Payments** | JazzCash (Pakistan) — HMAC-SHA256 signed redirect flow |
| **UI** | Radix UI primitives, Framer Motion (via Lenis), Sonner toasts |
| **3D** | React Three Fiber, Drei, Three.js |
| **Build** | TypeScript 5.9, ESLint 9, PostCSS |

## Features & Status

| Feature | Status | Details |
|---------|--------|---------|
| **Product Catalog** | ✅ Live | 5 categories, paginated, filtered by category |
| **Shopping Cart** | ✅ Live | localStorage-persisted, real-time totals, quantity controls |
| **Authentication** | ✅ Live | JWT signup/login, profile management, role-based guards |
| **Checkout** | ✅ Live | Shipping form, order summary, payment method selection |
| **JazzCash Payments** | ✅ Live | HMAC-SHA256 signed requests, hosted redirect, webhook callback |
| **Cash on Delivery** | ✅ Live | Alternative payment method |
| **Order Management** | ✅ Live | Order history, status tracking, admin management API |
| **Payment Status** | ✅ Live | Verification page with order confirmation |
| **Admin Dashboard** | ⚠️ Backend Ready | Admin CRUD APIs for products/orders; frontend pending |
| **Stripe** | 🔧 Available | Architecture supports drop-in replacement |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite)                       │
│  React 19 ── React Router ── AuthContext ── CartContext │
│       │                 │                    │          │
│    ShopPage          LoginPage           CheckoutPage   │
│       │                 │                    │          │
│    └────────── axios ──┴────────── axios ───┘          │
│                        │                               │
└────────────────────────┬──────────────────────────────┘
                         │ HTTP/JSON
┌────────────────────────┴──────────────────────────────┐
│              Backend (Express.js 5)                    │
│  Auth ── Products ── Orders ── Payments               │
│   │         │           │           │                  │
│   │    ┌────┴────┐ ┌───┴───┐ ┌────┴─────┐            │
│   │    │MongoDB  │ │MongoDB│ │ JazzCash │            │
│   │    │Products │ │Orders │ │  HMAC    │            │
│   └────┤  Users  │ └───────┘ │ Sandbox  │            │
│        └─────────┘           └──────────┘            │
└───────────────────────────────────────────────────────┘
```

## Project Structure

```
mexican-house-decor/
├── src/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── ui/                   # 53 Radix UI primitives
│   │   ├── Navigation.tsx        # Nav with cart badge
│   │   ├── Footer.tsx
│   │   └── BlurReveal.tsx        # Scroll-triggered animation
│   ├── context/
│   │   ├── AuthContext.tsx        # JWT auth state
│   │   └── CartContext.tsx        # Cart with localStorage
│   ├── pages/
│   │   ├── HomePage.tsx          # Hero + masonry + sections
│   │   ├── ShopPage.tsx          # Product grid + filters
│   │   ├── CartPage.tsx          # Full cart management
│   │   ├── CheckoutPage.tsx      # Shipping + payment method
│   │   ├── PaymentStatusPage.tsx # Post-payment verification
│   │   ├── LoginPage.tsx         # Auth with toggle
│   │   ├── OrdersPage.tsx        # Order history
│   │   ├── InspirationPage.tsx
│   │   ├── JournalPage.tsx
│   │   ├── LookbooksPage.tsx
│   │   └── AboutPage.tsx
│   └── services/
│       └── api.ts                # Axios service layer
├── backend/
│   └── src/
│       ├── server.js             # Express app entry
│       ├── config/database.js    # MongoDB pooling
│       ├── models/               # User, Product, Order, Payment
│       ├── controllers/          # Auth, Product, Order, Payment
│       ├── routes/               # RESTful route definitions
│       ├── middleware/           # JWT auth, error handler
│       └── services/            # JazzCash HMAC gateway
├── public/images/                # Product & lifestyle imagery
├── .env                          # Environment configuration
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
MONGODB_URI=mongodb://localhost:27017/mexican-decor-db
JWT_SECRET=your-256-bit-secret
JAZZCASH_MERCHANT_ID=your_sandbox_id
JAZZCASH_PASSWORD=your_sandbox_password
JAZZCASH_INTEGRITY_SALT=your_integrity_salt
```

Install and start:

```bash
npm install
npm run dev
```

Seed sample products (optional):

```bash
node src/seed.js
```

### Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Payment Integration

### JazzCash (Sandbox)

1. Register at [JazzCash Sandbox Portal](https://sandbox.jazzcash.com.pk)
2. Get your **Merchant ID**, **Password**, and **Integrity Salt**
3. Set them in `backend/.env`
4. Default return URL: `http://localhost:5000/api/payment/jazzcash/callback`

**Flow:**

```
Checkout → POST /api/payment/jazzcash/initiate → HMAC-signed form
    → User redirected to JazzCash → pays → callback to server
    → HMAC verified → order updated → redirect to /payment/status
```

**Security:**

- HMAC-SHA256 integrity verification on every request/response
- Amount in paisa (integer) format — no floating-point ambiguity
- Server-side callback validation prevents tampering
- No card data touches your servers (PCI compliant hosted checkout)

### Supported Methods

| Method | Details |
|--------|---------|
| **JazzCash** | Redirect to JazzCash hosted checkout — cards, wallet, 1Bill |
| **COD** | Cash on Delivery — no online payment |

## API Overview

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /api/auth/signup` | — | Register |
| `POST /api/auth/login` | — | Login |
| `GET /api/auth/me` | JWT | Current user |
| `GET /api/products` | — | Product list (paginated) |
| `GET /api/products/:id` | — | Product detail |
| `POST /api/orders` | JWT | Create order |
| `GET /api/orders` | JWT | User orders |
| `POST /api/payment/jazzcash/initiate` | JWT | Start JazzCash payment |
| `POST /api/payment/jazzcash/callback` | — | JazzCash webhook |
| `GET /api/payment/status` | JWT | Payment verification |

Full API docs: [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md)

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NODE_ENV` | — | `development` | Environment mode |
| `PORT` | — | `5000` | Backend port |
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Token signing key (min 32 chars) |
| `JAZZCASH_MERCHANT_ID` | ✅ | — | JazzCash merchant ID |
| `JAZZCASH_PASSWORD` | ✅ | — | JazzCash password |
| `JAZZCASH_INTEGRITY_SALT` | ✅ | — | HMAC signing key |
| `CORS_ORIGIN` | — | `http://localhost:3000` | Allowed origin |

## Key Design Decisions

- **HMAC-SHA256 over JWT for payments** — JazzCash uses HMAC for integrity; server validates every callback to prevent replay attacks
- **Hosted checkout** — PCI-compliant: payment page hosted by JazzCash, card data never touches our servers
- **Amount in paisa** — All amounts stored as integers (paisa) to avoid floating-point precision issues
- **Cart in localStorage** — Survives page refreshes, no server round-trip for cart operations
- **Sonner toasts** — Lightweight, accessible notification system
- **Lenis smooth scroll** — Premium feel without heavy animation libraries

## Deployment

### Backend (Railway / Render / Fly.io)

```bash
# Set environment variables in your hosting dashboard
NODE_ENV=production
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_production_secret
JAZZCASH_ENVIRONMENT=production
JAZZCASH_MERCHANT_ID=your_live_id
# ... etc
```

### Frontend (Vercel / Netlify)

```bash
npm run build
# Deploy ./dist to your hosting provider
```

Set `VITE_API_URL` to your production backend URL.

## License

MIT — built for **Mexican House Decor**
