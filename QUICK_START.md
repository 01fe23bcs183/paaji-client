# 🚀 Quick Start Guide - JMC E-commerce Backend

## ⚡ Get Backend Running in 5 Minutes

### **Step 1: Install MongoDB**

**Windows:**

```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start MongoDB
mongod
```

**Mac:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Or use MongoDB Atlas (Cloud - Recommended):**

1. Go to <https://www.mongodb.com/cloud/atlas>
2. Create free account
3. Create cluster
4. Get connection string

---

### **Step 2: Setup Backend**

```bash
cd server
npm install
```

---

### **Step 3: Configure Environment**

```bash
# Copy example env file
cp .env.example .env
```

**Edit `.env` file - Minimum Required:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jmc-ecommerce
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

**Optional (for full features):**

```env
# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=JMC Skincare <noreply@jmcskincare.com>

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

### **Step 4: Start Backend**

```bash
npm run dev
```

✅ **Server should now be running on <http://localhost:5000>**

---

## 🧪 Test the API

### **Health Check:**

```bash
curl http://localhost:5000/api/health
```

Should return:

```json
{
  "status": "ok",
  "timestamp": "2026-01-04...",
  "environment": "development"
}
```

### **Create Test User:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

### **Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔗 Frontend Integration

### **Update Frontend to Use Backend:**

1. **Install axios in frontend:**

```bash
cd ..  # Back to main folder
npm install axios
```

1. **Create API service** (`src/services/api.js`):

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data)
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data)
};

export default api;
```

1. **Update Checkout to use backend:**

Replace the order creation in `src/pages/Checkout.jsx`:

```javascript
import { orderAPI } from '../services/api';

// In handlePlaceOrder function:
const result = await orderAPI.create(orderData);

if (result.data.success) {
  clearCart();
  navigate(`/order-success?orderId=${result.data.order.orderNumber}`);
}
```

---

## 📧 Email Setup (Optional but Recommended)

### **Gmail App Password:**

1. Go to <https://myaccount.google.com/security>
2. Enable 2-Step Verification
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password
6. Add to `.env`:

```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Remove spaces
```

---

## 💬 WhatsApp Setup (Optional)

### **Twilio WhatsApp Sandbox:**

1. Sign up at <https://www.twilio.com>
2. Go to Console
3. Navigate to Messaging → Try it out → Send a WhatsApp message
4. Follow instructions to join sandbox
5. Get credentials:
   - Account SID
   - Auth Token
6. Add to `.env`

---

## 🐛 Troubleshooting

### **MongoDB Connection Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:** Make sure MongoDB is running (`mongod` command)

### **Port Already in Use:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:** Change PORT in `.env` to 5001 or kill process on port 5000

### **CORS Error:**

```
Access to fetch has been blocked by CORS policy
```

**Fix:** Check `FRONTEND_URL` in `.env` matches your frontend URL

---

## 📊 What You Can Do Now

✅ **User Registration & Login**
✅ **Create Orders with Backend**
✅ **Track Orders via API**
✅ **Receive Email Notifications** (if configured)
✅ **Receive WhatsApp Notifications** (if configured)
✅ **Admin Order Management**

---

## 🎯 Next Steps

1. Start both servers:
   - Frontend: `npm run dev` (port 5173)
   - Backend: `cd server && npm run dev` (port 5000)

2. Test the integration:
   - Register a new user
   - Create an order
   - Check MongoDB for saved data
   - Check terminal for email/WhatsApp logs

3. Implement remaining features:
   - Product reviews
   - User profiles
   - Advanced analytics

---

## 🔥 Pro Tips

- **Use MongoDB Compass** to view your database visually
- **Use Thunder Client** (VS Code extension) to test APIs
- **Enable nodemon** for auto-restart on file changes (already configured)
- **Check server logs** for detailed error messages

---

**You're all set! Both frontend and backend are ready to work together! 🚀**
