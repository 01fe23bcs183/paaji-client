# 🚚 Shiprocket Integration Guide

## 📦 Complete Shipping Automation with Shiprocket

Shiprocket is India's leading shipping aggregator that provides access to multiple courier partners (Delhivery, BlueDart, DTDC, etc.) with a single integration.

---

## ✨ Features Implemented

✅ **Automated Order Shipping**

- Create shipments automatically when orders are placed
- Generate AWB (Air Waybill) numbers
- Print shipping labels
- Schedule pickups

✅ **Real-time Tracking**

- Track shipments by Shiprocket ID
- Track by AWB number
-

Get delivery status updates

✅ **Multi-Courier Support**

- Access 17+ courier partners
- Get best rates automatically
- Choose courier based on serviceability

✅ **Complete Automation**

- Automatic order sync
- Label generation
- Manifest creation
- Return management

---

## 🚀 Setup Shiprocket

### **Step 1: Create Shiprocket Account**

1. Go to [https://www.shiprocket.in](https://www.shiprocket.in)
2. Click **"Sign Up"**
3. Complete registration
4. Verify your email
5. Complete KYC (business documents)

### **Step 2: Add Pickup Address**

1. Login to Shiprocket dashboard
2. Go to **Settings** → **Pickup Addresses**
3. Click **"Add Pickup Address"**
4. Fill in your warehouse/store details:
   - Name: `Primary` (or your preferred name)
   - Complete address with pincode
   - Phone number
   - Email
5. **Save** the address

### **Step 3: Get API Credentials**

Your credentials are simply your Shiprocket login email and password!

```env
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_LOCATION=Primary
```

### **Step 4: Configure Backend**

Add to `server/.env`:

```env
# Shiprocket Integration
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=YourPassword123
SHIPROCKET_PICKUP_LOCATION=Primary
```

---

## 💡 How It Works

### **1. Automatic Order Creation**

```javascript
// When customer places order
import shiprocketService from './services/shiprocketService.js';

const result = await shiprocketService.createOrder({
  orderNumber: 'JMC-12345',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  },
  items: [
    {
      name: 'Lemon Facewash',
      productId: '1',
      quantity: 2,
      price: 299
    }
  ],
  subtotal: 598,
  paymentMethod: 'prepaid'
});

console.log('Shiprocket Order ID:', result.shiprocketOrderId);
console.log('Shipment ID:', result.shipmentId);
```

### **2. Generate AWB & Book Courier**

```javascript
// Get available couriers
const couriers = await shiprocketService.getCourierServices(shipmentId);

// Select best courier (lowest rate, fastest delivery)
const bestCourier = couriers.couriers[0];

// Generate AWB
const awb = await shiprocketService.generateAWB(
  shipmentId,
  bestCourier.courier_company_id
);

console.log('AWB Number:', awb.awb);
```

### **3. Print Shipping Label**

```javascript
const label = await shiprocketService.generateLabel(shipmentId);
console.log('Label URL:', label.labelUrl);
// Download and print this label
```

### **4. Schedule Pickup**

```javascript
const pickup = await shiprocketService.schedulePickup(
  shipmentId,
  '2026-01-05' // Tomorrow
);
```

### **5. Track Shipment**

```javascript
// Track by Shipment ID
const tracking = await shiprocketService.trackShipment(shipmentId);

// OR track by AWB
const tracking = await shiprocketService.trackByAWB('AWB123456');

console.log('Current Status:', tracking.tracking.current_status);
```

---

## 🔄 Complete Order Flow

Here's the complete automated flow:

```
1. Customer places order on website
   ↓
2. Backend creates Shiprocket order
   ↓
3. Get available courier services
   ↓
4. Auto-select best courier (lowest rate)
   ↓
5. Generate AWB number
   ↓
6. Generate shipping label
   ↓
7. Schedule pickup for next day
   ↓
8. Send label PDF to admin email
   ↓
9. Update order with tracking number
   ↓
10. Send tracking link to customer
```

### **Implementation in Orders Route:**

```javascript
// server/routes/orders.js
import shiprocketService from '../services/shiprocketService.js';

router.post('/', async (req, res) => {
  // 1. Create order in database
  const order = await Order.create(orderData);
  
  // 2. Create Shiprocket shipment
  const shipment = await shiprocketService.createOrder(order);
  
  if (shipment.success) {
    // 3. Get courier options
    const couriers = await shiprocketService.getCourierServices(
      shipment.shipmentId
    );
    
    // 4. Select cheapest/fastest courier
    const bestCourier = couriers.couriers.sort((a, b) => 
      a.rate - b.rate
    )[0];
    
    // 5. Generate AWB
    const awb = await shiprocketService.generateAWB(
      shipment.shipmentId,
      bestCourier.courier_company_id
    );
    
    // 6. Update order with tracking
    await order.update({
      shiprocketShipmentId: shipment.shipmentId,
      trackingNumber: awb.awb,
      courierName: bestCourier.courier_name
    });
    
    // 7. Generate label (async)
    shiprocketService.generateLabel(shipment.shipmentId)
      .then(label => {
        // Email label to admin
        console.log('Label: ', label.labelUrl);
      });
    
    //8. Schedule pickup for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    shiprocketService.schedulePickup(
      shipment.shipmentId,
      tomorrow.toISOString().split('T')[0]
    );
  }
  
  res.json({ success: true, order });
});
```

---

## 📊 Shiprocket Dashboard Features

### **Available in Your Dashboard:**

1. **Orders Management**
   - View all orders
   - Quick ship orders
   - Bulk actions

2. **Shipments Tracking**
   - Real-time tracking
   - Delivery updates
   - NDR management

3. **Courier Selection**
   - Compare rates
   - Check serviceability
   - Performance metrics

4. **Reports & Analytics**
   - Shipping costs
   - Delivery performance
   - Zone-wise analysis

5. **Returns Management**
   - Create return orders
   - Track returns
   - Refund processing

---

## 💰 Pricing & Rates

### **How Shiprocket Charges:**

- **Platform Fee:** ₹20-30 per shipment (varies by plan)
- **Courier Charges:** Actual courier rates (discounted)
- **COD Charges:** 2% of order value (if COD)
- **Weight Slabs:** 0.5kg, 1kg, 2kg, 5kg+

### **Example Rates (approx):**

| Zone | Weight | Rate |
|------|--------|------|
| Local (same city) | 0.5kg | ₹40-50 |
| Metro to Metro | 0.5kg | ₹50-70 |
| Rest of India | 0.5kg | ₹60-90 |

*Rates vary by courier and negotiated discounts*

---

## 🔔 Webhooks (Advanced)

Enable real-time updates:

```javascript
// server/routes/webhooks.js
router.post('/shiprocket', async (req, res) => {
  const event = req.body;
  
  switch (event.status) {
    case 'DELIVERED':
      // Update order status
      await Order.update(
        { status: 'delivered' },
        { where: { trackingNumber: event.awb } }
      );
      
      // Send delivery confirmation email
      sendDeliveryEmail(order);
      break;
      
    case 'OUT_FOR_DELIVERY':
      // Notify customer
      sendWhatsApp(order.customer.phone, 
        `Your order is out for delivery!`
      );
      break;
  }
  
  res.json({ success: true });
});
```

**Configure in Shiprocket:**

1. Go to Settings → API
2. Add Webhook URL: `https://yourdomain.com/api/webhooks/shiprocket`
3. Select events to track

---

## 🎯 Best Practices

### **1. Test Mode First**

Use Shiprocket's test environment:

- Create test orders
- Verify integration
- Check label generation

### **2. Error Handling**

```javascript
try {
  const result = await shiprocketService.createOrder(order);
  
  if (!result.success) {
    // Log error
    console.error('Shiprocket error:', result.error);
    
    // Notify admin
    sendAdminAlert(`Shiprocket failed for ${order.orderNumber}`);
    
    // Fallback: Manual shipping
    await order.update({ requiresManualShipping: true });
  }
} catch (error) {
  // Handle network errors
  console.error('Shiprocket API error:', error);
}
```

### **3. Rate Limiting**

Shiprocket has API rate limits:

- **120 requests/minute** for most endpoints
- Use queuing for bulk operations

### **4. Pickup Schedule**

- Schedule pickups in morning (9 AM - 11 AM)
- Ensure warehouse is open during pickup window
- Have labels printed and packages ready

---

## 📱 Admin Features to Add

### **Shipping Management Panel:**

```jsx
// Admin component
function ShippingPanel({ order }) {
  const [awb, setAwb] = useState(null);
  const [label, setLabel] = useState(null);
  
  const handleShipOrder = async () => {
    // Create shipment
    const shipment = await shiprocketService.createOrder(order);
    
    // Generate AWB
    const awbResult = await shiprocketService.generateAWB(
      shipment.shipmentId,
      selectedCourier
    );
    setAwb(awbResult.awb);
    
    // Get label
    const labelResult = await shiprocketService.generateLabel(
      shipment.shipmentId
    );
    setLabel(labelResult.labelUrl);
  };
  
  return (
    <div>
      <button onClick={handleShipOrder}>Ship Order</button>
      {awb && <p>AWB: {awb}</p>}
      {label && <a href={label}>Download Label</a>}
    </div>
  );
}
```

---

## ✅ Integration Checklist

- [ ] Shiprocket account created
- [ ] KYC completed
- [ ] Pickup address added
- [ ] Credentials added to `.env`
- [ ] Test order created successfully
- [ ] AWB generated
- [ ] Label downloaded and printed
- [ ] Pickup scheduled
- [ ] Tracking working
- [ ] Webhooks configured (optional)

---

## 🆘 Troubleshooting

### **Error: "Authentication failed"**

**Fix:** Check email/password in `.env` file

### **Error: "Pickup location not found"**

**Fix:** Ensure `SHIPROCKET_PICKUP_LOCATION` matches the name in dashboard

### **Error: "No courier available"**

**Fix:** Check pincode serviceability in Shiprocket dashboard

### **Error: "Insufficient funds"**

**Fix:** Recharge your Shiprocket wallet

---

## 🎉 You're All Set

Your e-commerce platform now has **professional shipping automation** powered by Shiprocket!

**Benefits:**
✅ Save time - No manual data entry
✅ Save money - Access to discounted courier rates
✅ Professional - Automated labels and tracking
✅ Scalable - Handle 1000s of orders effortlessly

**Happy Shipping! 🚚📦**
