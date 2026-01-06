# 🚀 Shiprocket Setup Guide

Complete guide to integrate Shiprocket shipping with your JMC Skincare platform.

---

## 📋 Prerequisites

- Active Shiprocket account
- Node.js backend running
- MySQL database configured

---

## Step 1: Create Shiprocket Account

1. Go to [https://app.shiprocket.in/register](https://app.shiprocket.in/register)
2. Fill in your business details
3. Complete KYC verification
4. Add your pickup address

---

## Step 2: Create API User

1. **Login** to your Shiprocket dashboard
2. Navigate to: **Settings → API → Add New API User**
3. Click **"Create API User"**
4. Enter:
   - **Unique email address** (different from your login email)
   - **Select modules** you want to access
   - **Buyer's Details Access**: Choose "Allowed" or "Not Allowed"
5. Click **"Create User"**
6. Check your **registered email** (not API user email) for the password

---

## Step 3: Configure Environment Variables

Update your `server/.env` file:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=api-user@yourdomain.com
SHIPROCKET_PASSWORD=password-from-email
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_CHANNEL_ID=
SHIPROCKET_PICKUP_PINCODE=400001
```

### How to Get Channel ID

1. Login to Shiprocket
2. Go to **Settings → Channels**
3. Click on your channel
4. Copy the Channel ID from the URL or page

### Pickup Location

- Use the pickup location name you created
- Default is usually "Primary"
- Find in: **Settings → Company Profile → Pickup Locations**

---

## Step 4: Test Authentication

Start your backend server and test authentication:

```bash
cd server
npm run dev
```

The Shiprocket service will auto-authenticate on first API call.

---

## Step 5: Shipping Workflow

### 1. Customer Places Order

Order is created in your database with status `pending`

### 2. Admin Ships Order

```javascript
// From Admin → Shipping page
POST /api/shiprocket/create
{
  "orderId": "ORD-001"
}
```

**What happens:**

- Creates order in Shiprocket
- Gets `shiprocketOrderId` and `shipmentId`
- Saves to your database

### 3. Generate AWB

```javascript
POST /api/shiprocket/awb
{
  "shipmentId": "12345",
  "courierId": "23" // Optional, auto-selected if not provided
}
```

**What happens:**

- Assigns courier
- Generates AWB (tracking number)
- Returns AWB code

### 4. Schedule Pickup

```javascript
POST /api/shiprocket/pickup
{
  "shipmentId": "12345",
  "pickupDate": "2026-01-07"
}
```

**What happens:**

- Schedules courier pickup
- Returns pickup token
- Updates pickup status

### 5. Track Shipment

```javascript
GET /api/shiprocket/track/:awbCode
```

**Returns:**

- Current status
- Tracking history
- Courier details
- Delivery updates

---

## 📦 Order Creation Requirements

When creating a Shiprocket order, these fields are **mandatory**:

### Customer Info

- `billing_customer_name` ✅
- `billing_address` ✅
- `billing_city` ✅
- `billing_pincode` ✅
- `billing_state` ✅
- `billing_country` (default: India)
- `billing_email` ✅
- `billing_phone` ✅

### Order Info

- `order_id` (your order ID) ✅
- `order_date` (YYYY-MM-DD format) ✅
- `pickup_location` ✅
- `channel_id` (optional, but recommended)

### Items

Each item needs:

- `name` ✅
- `sku` ✅
- `units` (quantity) ✅
- `selling_price` ✅
- `discount` (optional)
- `tax` (optional)
- `hsn` (default: 330499 for cosmetics)

### Package Dimensions

- `length` (cm)
- `breadth` (cm)
- `height` (cm)
- `weight` (kg)

**Defaults in our implementation:**

- Length: 20cm
- Breadth: 15cm
- Height: 10cm
- Weight: 0.5kg

---

## 🔍 Testing

### 1. Check Pincode Serviceability

```bash
GET /api/shiprocket/serviceability/400001
```

### 2. Get Available Couriers

```bash
POST /api/shiprocket/couriers
{
  "pickupPincode": "400001",
  "deliveryPincode": "110001",
  "weight": 0.5,
  "cod": false
}
```

### 3. Create Test Order

Use the admin panel:

1. Go to **Admin → Shipping**
2. Find a pending order
3. Click **"Ship"** button
4. Monitor console for API responses

---

## 🛠️ Troubleshooting

### Error: "Unauthorized"

- ✅ Check email/password in `.env`
- ✅ Verify API user is created
- ✅ Token might be expired (auto-refreshes)

### Error: "Invalid pincode"

- ✅ Check pincode format (no spaces)
- ✅ Verify pincode is serviceable
- ✅ Use 6-digit Indian pincode

### Error: "Channel not found"

- ✅ Add `SHIPROCKET_CHANNEL_ID` to `.env`
- ✅ Or remove it from order creation

### Error: "Pickup location not found"

- ✅ Check spelling of pickup location
- ✅ Verify it exists in Shiprocket dashboard
- ✅ Create one if missing

### Error: "Weight limit exceeded"

- ✅ Shiprocket has courier-specific weight limits
- ✅ Adjust package weight
- ✅ Split into multiple shipments

---

## 📊 Rate Limiting

Shiprocket API has rate limits:

- **Authentication:** Unlimited
- **Other APIs:** Check your plan

Our service:

- ✅ Auto-caches JWT token for 9 days
- ✅ Reuses same token for all requests
- ✅ Auto-refreshes before expiry

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**

   ```bash
   # Already in .gitignore
   server/.env
   ```

2. **Use environment variables in production**
   - Railway: Add in dashboard
   - Render: Add in settings
   - Heroku: Use config vars

3. **Rotate API credentials regularly**

---

## 📥 Webhooks (Optional)

For real-time tracking updates:

### Setup in Shiprocket

1. Go to **Settings → API → Webhooks**
2. Add your webhook URL:

   ```
   https://your-backend.com/api/webhooks/shiprocket
   ```

3. Add security token (optional)
4. Enable toggle

### In Your Code

The webhook route is already set up in:
`server/routes/webhooks.js`

---

## 🎯 Production Checklist

Before going live:

- [ ] Shiprocket account verified
- [ ] API user created
- [ ] Credentials added to production `.env`
- [ ] Pickup location configured
- [ ] Weight/dimensions configured per product
- [ ] Test order placed
- [ ] Label generated successfully
- [ ] Tracking working
- [ ] Webhooks set up (optional)

---

## 📞 Support

- **Shiprocket Support:** [help.shiprocket.in](https://help.shiprocket.in)
- **API Docs:** [apidocs.shiprocket.in](https://apidocs.shiprocket.in)
- **Email:** <support@shiprocket.com>

---

## 💡 Pro Tips

1. **Use Test Mode First**
   - Create test orders
   - Don't schedule real pickups
   - Cancel test shipments

2. **Monitor Costs**
   - Check courier rates
   - Compare different couriers
   - Use weight optimization

3. **Auto-select Courier**
   - Let Shiprocket choose best courier
   - Based on price and delivery time

4. **Bulk Operations**
   - Process multiple orders together
   - Use batch APIs for efficiency

---

**You're all set!** 🎉

Your Shiprocket integration is complete and ready to ship orders!
