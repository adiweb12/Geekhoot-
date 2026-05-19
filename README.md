# Geekhoot E-Commerce Platform 🛒⚡

> Modern tech-gear e-commerce with WhatsApp-based ordering — built on Next.js 15, Express/TypeScript, Prisma ORM, and PostgreSQL.

---

## ⚠️ TEST CREDENTIALS — CHANGE IN PRODUCTION

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@geekhoot.com     | asdfghjkl  |

**These are FOR TESTING ONLY. Change immediately before going live.**

---

## 📁 Project Structure

```
geekhoot/
├── frontend/          # Next.js 15 + TypeScript + Tailwind
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/
│       ├── store/     # Zustand state
│       ├── lib/       # API client, utilities
│       └── types/
├── backend/           # Express + TypeScript
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── products/
│       ├── cart/
│       ├── orders/
│       ├── tracking/
│       ├── admin/
│       └── common/    # Guards, middleware, utils
│   └── prisma/        # Schema + seed
├── render.yaml        # Render deployment config
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Render free tier)
- Cloudinary account (free)
- npm or pnpm

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/geekhoot.git
cd geekhoot

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Configure Environment Variables

#### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://testbase_oy8e_user:dt9U75rHmIkONpsVwRwpTrOGRHJVYgT0@dpg-d85tuonavr4c73d9abt0-a/testbase_oy8e
JWT_SECRET="your-super-secret-key-minimum-32-characters-change-this"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
WHATSAPP_ADMIN_NUMBER=8138872364
LOG_LEVEL=info
```

#### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=8138872364
NEXT_PUBLIC_APP_NAME="Geekhoot"
```

---

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database (creates admin + sample products)
npm run prisma:seed
```

---

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 4000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deployment on Render

### Step 1 — Create a Render account

Sign up at [render.com](https://render.com)

### Step 2 — Create PostgreSQL Database

1. Dashboard → **New** → **PostgreSQL**
2. Name: `geekhoot-db`
3. Plan: Free
4. Click **Create Database**
5. Copy the **External Database URL**

### Step 3 — Deploy Backend

1. Dashboard → **New** → **Web Service**
2. Connect your GitHub repo
3. Set Root Directory: `backend`
4. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables:
   ```
   DATABASE_URL      = (paste from Step 2)
   JWT_SECRET        = (generate a 64-char random string)
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY    = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   FRONTEND_URL      = https://your-frontend.vercel.app
   WHATSAPP_ADMIN_NUMBER = 919XXXXXXXXX
   NODE_ENV          = production
   ```

### Step 4 — Seed the Database on Render

After deploy, open the Render Shell for your backend service:
```bash
npm run prisma:seed
```

### Step 5 — Deploy Frontend on Vercel (Recommended)

```bash
cd frontend
npx vercel --prod
```

Or via Vercel Dashboard:
1. Import GitHub repo
2. Framework: Next.js
3. Root Directory: `frontend`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL              = https://your-backend.onrender.com/api
   NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER = 919XXXXXXXXX
   ```
5. Deploy!

---

## 🔒 Security Features

| Feature                   | Implementation                        |
|---------------------------|---------------------------------------|
| Password hashing          | bcrypt (12 rounds)                   |
| Authentication            | JWT (15min access + 7d refresh)      |
| Token storage             | HTTP-only secure cookies             |
| Token rotation            | Refresh token rotation on each use   |
| API protection            | Helmet, CORS, rate limiting          |
| Input validation          | express-validator + Zod (frontend)   |
| SQL injection             | Prisma ORM (parameterized queries)   |
| XSS prevention            | CSP headers via Helmet               |
| Role-based access         | Admin guard middleware                |
| Order privacy             | Users can only view own orders       |
| Rate limiting             | 10 auth attempts / 15 min            |

---

## 📱 Features

### Customer Features
- 🛍️ Browse & search products with filters/sorting
- 📦 Product details with image gallery, reviews, similar products
- 🛒 Cart with quantity management and total calculation
- 💚 Order via WhatsApp (auto-fills name, address, product details)
- 📍 Real-time order tracking timeline
- ❤️ Wishlist management
- 👤 Profile management with address editing
- 🔐 Secure login with email or phone number
- 📱 GPS location capture during signup
- 🌙 Dark/Light mode

### Admin Features
- 📊 Dashboard with revenue, user, and order analytics
- ➕ Add/edit/delete products with Cloudinary image upload
- 📋 Manage all orders — update status, add tracking ID, courier
- 👥 View and search all users
- 🔄 Tracking update timeline per order
- 🔐 Role-based access control

### Technical Features
- ⚡ Next.js 15 App Router with server components
- 🎨 Tailwind CSS + Framer Motion animations
- 📱 Fully mobile-responsive (mobile-first)
- 🔄 React Query for data fetching and caching
- 🐻 Zustand for client state (auth + cart)
- 📦 Skeleton loading states everywhere
- 🚫 404, error, and empty state pages

---

## 📲 WhatsApp Order Flow

1. Customer clicks **Buy via WhatsApp** on product page (or **Order via WhatsApp** in cart)
2. WhatsApp opens with a pre-filled message containing:
   - Customer name, phone, email, full address
   - Product name, quantity, unit price, total
   - Shipping charge (FREE for Kerala, ₹99 elsewhere)
3. Customer sends the message to admin
4. Admin receives the order and manually creates it in the Admin Panel
5. Admin updates the status (Confirmed → Packed → Shipped → Delivered)
6. Customer can track order progress in real-time

---

## 🗄️ Database Schema

```
User         — id, name, phone, email, password, address, role
Product      — id, name, slug, description, price, images, stock, rating
Cart         — id, userId, productId, quantity
Order        — id, userId, productId, quantity, status, trackingId, courier
TrackingUpdate — id, orderId, status, description, location
Review       — id, userId, productId, rating, comment
Wishlist     — id, userId, productId
RefreshToken — id, token, userId, expiresAt
```

---

## 🧪 API Endpoints

### Auth
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login with email/phone + password
- `POST /api/auth/logout` — Logout (clears cookies)
- `POST /api/auth/refresh` — Refresh access token
- `GET  /api/auth/me` — Get current user

### Products
- `GET  /api/products` — List products (pagination, filter, sort)
- `GET  /api/products/search?q=` — Search products
- `GET  /api/products/categories` — List categories
- `GET  /api/products/:slug` — Product detail + similar
- `POST /api/products/:id/reviews` — Add review (auth required)

### Cart (auth required)
- `GET    /api/cart` — View cart
- `POST   /api/cart` — Add item
- `PATCH  /api/cart/:id` — Update quantity
- `DELETE /api/cart/:id` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders (auth required)
- `GET /api/orders` — User's orders
- `GET /api/orders/:id` — Order detail

### Tracking (auth required)
- `GET /api/tracking/:orderId` — Track order (own only)

### Users (auth required)
- `GET   /api/users/profile` — Get profile
- `PATCH /api/users/profile` — Update profile
- `POST  /api/users/change-password` — Change password
- `GET   /api/users/wishlist` — Get wishlist
- `POST  /api/users/wishlist/:productId` — Add to wishlist
- `DELETE /api/users/wishlist/:productId` — Remove from wishlist

### Admin (admin role required)
- `GET  /api/admin/analytics` — Dashboard data
- `GET/POST /api/admin/products` — List/create products
- `PUT/DELETE /api/admin/products/:id` — Update/deactivate
- `GET/POST /api/admin/orders` — List/create orders
- `PATCH /api/admin/orders/:id/status` — Update status + tracking
- `GET  /api/admin/users` — List users

---

## 🔧 Production Checklist

Before going live:

- [ ] Change admin password (admin@geekhoot.com / asdfghjkl)
- [ ] Set a strong JWT_SECRET (64+ random characters)
- [ ] Configure real Cloudinary credentials
- [ ] Set correct WHATSAPP_ADMIN_NUMBER
- [ ] Set FRONTEND_URL to your actual frontend domain
- [ ] Enable HTTPS (Render/Vercel handle this automatically)
- [ ] Run `npx prisma migrate deploy` on production DB
- [ ] Run seed script for initial data

---

## 📞 Support

For any issues, open a WhatsApp message to the admin number configured in your `.env`.

---

*Built with ❤️ for Geekhoot — Tech gear you love, delivered.*
