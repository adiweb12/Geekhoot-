# Geekhoot — Premium Custom Merch

A full-stack e-commerce platform for custom merchandise.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (via Prisma)

---

## 🚀 Setup

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev
```

---

## 🔐 Admin Credentials
- **Email**: `admin@geekhoot.com`
- **Password**: `asdfghjkl`

---

## ✨ Features
- 🎨 Animated splash screen (shows once per session)
- 🔒 Persistent login — no re-login on page refresh
- 📱 Fully responsive with mobile drawer navigation
- 🛒 Cart with WhatsApp ordering
- 👤 User profiles with order tracking
- 🎛️ Admin dashboard — products, orders, users, analytics
- 🌙 Dark mode support
- ⚡ Framer Motion animations throughout

---

## 📦 Admin Adds Products
The database seeds **only the admin user** — no dummy products.
Admin logs in and adds real products via the Admin Panel → Products.

Built by **WEBSINARO WB**
