# 🎯 Quick Reference - JMC Skincare Platform

## 🚀 Start Development

```bash
# Frontend
cd "c:\Users\iamje\OneDrive\Documents\jeevan personal projects\paaji client"
npm run dev
# → http://localhost:5173

# Backend
cd server
npm run dev
# → http://localhost:5000
```

---

## 🔑 Admin Login

```
URL: http://localhost:5173/admin/login
Default: Check AdminContext for hardcoded admin
```

---

## 📊 Key Features

### Customer-Facing

- ✅ Homepage with AI-generated images
- ✅ Product catalog with filtering
- ✅ Shopping cart & checkout
- ✅ Campaign banners (dynamic)
- ✅ Blog system
- ✅ Skin quiz
- ✅ Order tracking

### Admin Panel

- ✅ Dashboard with real-time stats
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Campaign management
- ✅ Shipping with Shiprocket
- ✅ Coupon management
- ✅ Settings configuration

---

## 🔌 API Endpoints

### Campaign Management

```
GET    /api/campaigns/active     # Get active campaigns
GET    /api/campaigns            # Get all campaigns (admin)
POST   /api/campaigns            # Create campaign
PUT    /api/campaigns/:id        # Update campaign
DELETE /api/campaigns/:id        # Delete campaign
PATCH  /api/campaigns/:id/toggle # Toggle active status
```

### Shiprocket

```
GET  /api/shiprocket/serviceability/:pincode  # Check pincode
POST /api/shiprocket/create                   # Create shipment
POST /api/shiprocket/awb                      # Generate AWB
POST /api/shiprocket/pickup                   # Schedule pickup
GET  /api/shiprocket/track/:awb               # Track shipment
GET  /api/shiprocket/label/:shipmentId        # Get label
GET  /api/shiprocket/invoice/:orderId         # Get invoice
```

### Core APIs

```
GET  /api/products       # Products
GET  /api/orders         # Orders
GET  /api/users          # Users
GET  /api/coupons        # Coupons
GET  /api/analytics      # Analytics data
```

---

## Environment Setup

### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:5000
```

### Backend `server/.env`

```env
# Database
DB_NAME=jmc_ecommerce
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Shiprocket (for shipping)
SHIPROCKET_EMAIL=api-user@domain.com
SHIPROCKET_PASSWORD=your-password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_CHANNEL_ID=your-channel-id
SHIPROCKET_PICKUP_PINCODE=400001
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project readme |
| `NEW_FEATURES.md` | New features documentation |
| `INTEGRATION_STATUS.md` | Admin integration details |
| `SHIPROCKET_SETUP.md` | Shiprocket setup guide |
| `NETLIFY_DEPLOY.md` | Deployment instructions |
| `ADMIN_INTEGRATION_SUMMARY.md` | Complete integration summary |

---

## 🎨 Key Technologies

### Frontend

- React 18
- React Router
- Context API (state management)
- Vite (build tool)
- React Icons

### Backend

- Node.js + Express
- MySQL + Sequelize ORM
- JWT authentication
- Shiprocket API integration

### Styling

- Vanilla CSS with design tokens
- Glassmorphism effects
- Responsive design
- Premium UI components

---

## 🛠️ Common Tasks

### Create Campaign

1. Go to Admin → Campaigns
2. Click "New Campaign"
3. Fill details and preview
4. Set schedule and activate

### Ship Order

1. Go to Admin → Shipping
2. Find pending order
3. Click "Ship"
4. System creates Shiprocket shipment
5. Generate AWB and schedule pickup

### Add Product

1. Go to Admin → Products
2. Click "Add Product"
3. Fill details and upload image
4. Save

### Update Settings

1. Go to Admin → Settings
2. Modify site name, colors, social links
3. Save

---

## 🧪 Testing

### Run Frontend Build

```bash
npm run build
# Output: dist/
```

### Check API Health

```
GET http://localhost:5000/api/health
```

### View Campaign

```
http://localhost:5173/
# Should show campaign banner if active
```

---

## 🚀 Deploy

### Frontend (Netlify)

```bash
git push origin main
# Auto-deploys if connected to Netlify
```

### Backend (Railway/Render/Heroku)

1. Create new project
2. Connect GitHub repo
3. Set environment variables
4. Deploy

---

## 📞 Support Resources

- **Shiprocket API:** [apidocs.shiprocket.in](https://apidocs.shiprocket.in)
- **React Docs:** [react.dev](https://react.dev)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)

---

## ✅ Status

- Frontend: ✅ Running
- Backend: ✅ Running
- Database: ✅ Connected
- Campaigns: ✅ Functional
- Shipping: ✅ Integrated (needs Shiprocket account)
- Deployment: ✅ Ready

---

**Everything is ready to go!** 🎉
