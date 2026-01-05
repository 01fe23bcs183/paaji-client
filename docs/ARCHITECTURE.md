# JMC Skincare - Architecture Documentation

## Overview

JMC Skincare is a luxury e-commerce platform built with React + Vite. The project has two data persistence modes:

1. **Demo Mode (IndexedDB/localStorage)** - For local development and demos
2. **Production Mode (Backend API)** - For production with persistent database

## Project Structure

```
paaji-client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   │   ├── AdminContext.jsx    # Admin state (products, orders, coupons)
│   │   ├── AuthContext.jsx     # Customer authentication
│   │   ├── CartContext.jsx     # Shopping cart state
│   │   └── SettingsContext.jsx # Site settings
│   ├── pages/          # Route components
│   │   ├── admin/      # Admin panel pages
│   │   └── ...         # Customer-facing pages
│   ├── services/       # Business logic & API calls
│   │   ├── api.js      # Axios-based API client (production)
│   │   ├── storage.js  # IndexedDB/localStorage (demo mode)
│   │   ├── payments.js # Payment gateway integration
│   │   └── ...
│   ├── data/           # Static/seed data
│   └── utils/          # Helper functions
├── server/             # Express.js backend (separate deployment)
└── public/             # Static assets
```

## Data Layer

### Demo Mode (`src/services/storage.js`)

Used for local development without a backend. Data is stored in:
- **IndexedDB**: Products, orders, coupons, shipping zones, media
- **localStorage**: Admin auth, cart, settings, payment config

**Limitations:**
- Data is per-device (not synced across devices)
- Data can be cleared by browser
- Not suitable for production with real payments

### Production Mode (`src/services/api.js`)

Axios-based API client that connects to the Express backend:
- Base URL configured via `VITE_API_URL` environment variable
- Automatic token injection via request interceptor
- 401 handling with automatic logout

**Available API modules:**
- `authAPI` - Customer authentication
- `productsAPI` - Product catalog
- `ordersAPI` - Order management
- `usersAPI` - User profiles, addresses, wishlist
- `reviewsAPI` - Product reviews
- `couponsAPI` - Coupon validation
- `analyticsAPI` - Admin analytics

## Authentication

### Customer Auth (`AuthContext.jsx`)
- Uses backend API (`authAPI`)
- JWT token stored in localStorage
- Automatic token refresh on app load

### Admin Auth (`storage.js`)
- Currently uses localStorage-based auth (demo mode)
- **TODO:** Migrate to backend API for production

## Payment Integration

Supports multiple payment gateways (`src/services/payments.js`):
- **Razorpay** - Primary gateway
- **Cashfree** - Alternative gateway
- **COD** - Cash on delivery

**Note:** Payment verification is currently mocked. For production, implement server-side verification via webhooks.

## Environment Variables

See `.env.example` for required variables:
- `VITE_API_URL` - Backend API base URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay public key
- `VITE_CASHFREE_APP_ID` - Cashfree app ID
- `VITE_GA_TRACKING_ID` - Google Analytics (optional)
- `VITE_SENTRY_DSN` - Sentry error tracking (optional)

## Backend Server

The `server/` directory contains a complete Express.js backend:
- MySQL database with migrations
- JWT authentication
- Shiprocket shipping integration
- Email/WhatsApp notification services
- Webhook handlers for payment verification

See `server/README.md` for backend setup instructions.

## Migration Path: Demo to Production

1. Deploy the backend server with MySQL database
2. Set `VITE_API_URL` to point to deployed backend
3. Update `AdminContext.jsx` to use API instead of `storage.js`
4. Implement payment webhook verification
5. Configure real email/WhatsApp services
