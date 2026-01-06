# Payment Integration Testing Guide

## Overview

JMC Skincare platform supports multiple payment gateways:

- **Razorpay** - UPI, Cards, Netbanking, Wallets
- **Cashfree** - UPI, Cards, Netbanking, Wallets  
- **Cash on Delivery (COD)** - Pay on delivery

---

## ✅ Payment Integration Status

### Razorpay

- ✅ SDK Integration (`payments.js`)
- ✅ Frontend checkout flow
- ✅ Webhook handler with signature verification
- ✅ Payment capture and failure handling
- ✅ Order status updates

### Cashfree

- ✅ SDK Integration (`payments.js`)
- ✅ Frontend checkout flow
- ✅ Webhook handler with signature verification
- ✅ Payment session handling
- ✅ Order status updates

### COD

- ✅ Basic implementation
- ✅ Order creation flow

---

## 🔧 Setup Instructions

### 1. Razorpay Setup

```bash
# Add to server/.env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Steps:**

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Setup webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Copy webhook secret
5. Add to `.env` file

---

### 2. Cashfree Setup

```bash
# Add to server/.env
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_TEST_MODE=true
```

**Steps:**

1. Create account at [cashfree.com](https://cashfree.com)
2. Get credentials from Dashboard → Developers → Credentials
3. Setup webhook URL: `https://yourdomain.com/api/webhooks/cashfree`
4. Enable test mode for development
5. Add to `.env` file

---

## 🧪 Testing Procedures

### Test 1: Razorpay Integration

#### Prerequisites

- Razorpay test credentials configured
- Backend server running
- Frontend running

#### Steps:

1. Add products to cart
2. Proceed to checkout
3. Fill shipping information
4.Select "Razorpay" as payment method
4. Click "Place Order"
5. Razorpay checkout opens in modal
6. Use test card: `4111 1111 1111 1111`
7. CVV: Any 3 digits, Expiry: Future date
8. Complete payment

#### Expected Results

- ✅ Payment success callback triggered
- ✅ Order status updated to "processing"
- ✅ Payment ID stored in database
- ✅ Webhook received and processed
- ✅ Customer redirected to success page
- ✅ Email notification sent (check logs)

#### Test Card Numbers

```
Success: 4111 1111 1111 1111
Failure: 4000 0000 0000 0002
```

---

### Test 2: Cashfree Integration

#### Steps

1. Add products to cart
2. Proceed to checkout
3. Fill shipping information
4. Select "Cashfree" as payment method
5. Click "Place Order"
6. Cashfree checkout opens
7. Use test UPI: `success@upi`
8. Complete payment

#### Expected Results

- ✅ Payment session created
- ✅ Payment successful
- ✅ Order updated
- ✅ Webhook processed
- ✅ Success page shown

#### Test UPI IDs

```
Success: success@upi
Failure: failure@upi
```

---

### Test 3: COD Flow

#### Steps

1. Add products to cart
2. Proceed to checkout
3. Fill shipping information
4. Select "Cash on Delivery"
5. Click "Place Order"

#### Expected Results

- ✅ Order created with "pending" status
- ✅ Payment method set to "COD"
- ✅ No payment processing
- ✅ Success page shown
- ✅ Order confirmation email sent

---

### Test 4: Webhook Verification

#### Razorpay Webhook Test

```bash
# Simulate Razorpay webhook
curl -X POST http://localhost:5000/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: YOUR_SIGNATURE" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "order_id": "JMC-TEST-123",
          "id": "pay_test123",
          "status": "captured"
        }
      }
    }
  }'
```

#### Cashfree Webhook Test

```bash
# Simulate Cashfree webhook
curl -X POST http://localhost:5000/api/webhooks/cashfree \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "JMC-TEST-123",
    "orderAmount": "1500",
    "txStatus": "SUCCESS",
    "txMsg": "Transaction successful",
    "referenceId": "ref123",
    "signature": "YOUR_SIGNATURE"
  }'
```

---

## 🔍 Validation Checklist

### Security

- [ ] Webhook signatures verified
- [ ] HTTPS in production
- [ ] API keys in environment variables (not hardcoded)
- [ ] Payment verification on backend
- [ ] No sensitive data in frontend logs

### Functionality

- [ ] Payment modal opens correctly
- [ ] Test cards work
- [ ] Success flow completes
- [ ] Failure flow handled gracefully
- [ ] Order status updates correctly
- [ ] Payment IDs stored
- [ ] Webhooks processed

### Error Handling

- [ ] Network errors shown to user
- [ ] Payment failures handled
- [ ] Webhook failures logged
- [ ] Retry mechanism for failed webhooks
- [ ] User-friendly error messages

### Notifications

- [ ] Order confirmation email sent
- [ ] Payment success email sent
- [ ] WhatsApp notifications (if enabled)
- [ ] Admin notifications

---

## 🐛 Common Issues & Solutions

### Issue 1: Razorpay Modal Not Opening

**Cause:** Script not loaded
**Solution:**

```javascript
// Check if script loaded
if (!window.Razorpay) {
    console.error('Razorpay SDK not loaded');
}
```

### Issue 2: Webhook Signature Mismatch

**Cause:** Incorrect secret or body format
**Solution:**

- Verify webhook secret in `.env`
- Ensure raw body is used for signature
- Check signature algorithm (SHA256)

### Issue 3: Payment Success But Order Not Updated

**Cause:** Webhook not reaching server
**Solution:**

- Check webhook URL configuration
- Verify server is accessible
- Check firewall/CORS settings
- Test with ngrok for local development

---

## 📊 Production Checklist

### Before Going Live

- [ ] Switch to production API keys
- [ ] Update webhook URLs to production domain
- [ ] Enable SSL/HTTPS
- [ ] Test with real payment gateways
- [ ] Setup proper error logging
- [ ] Configure email notifications
- [ ] Test refund flow
- [ ] Setup payment reconciliation
- [ ] Add transaction logging
- [ ] Implement rate limiting

---

## 🔐 Security Best Practices

1. **Never expose API secrets** - Always use environment variables
2. **Verify webhooks** - Always validate signatures
3. **Use HTTPS** - Encrypt all payment data
4. **Validate amounts** - Server-side validation only
5. **Log everything** - Track all payment attempts
6. **PCI compliance** - Never store card details
7. **Regular audits** - Review payment logs

---

## 📞 Support & Resources

### Razorpay

- Docs: [razorpay.com/docs](https://razorpay.com/docs)
- Support: [razorpay.com/support](https://razorpay.com/support)
- Webhooks: [razorpay.com/docs/webhooks](https://razorpay.com/docs/webhooks)

### Cashfree

- Docs: [docs.cashfree.com](https://docs.cashfree.com)
- Support: <support@cashfree.com>
- Webhooks: [docs.cashfree.com/docs/webhooks](https://docs.cashfree.com/docs/webhooks)

---

## ✅ Testing Status

| Test Case | Status | Notes |
|-----------|--------|-------|
| Razorpay Integration | ✅ Implemented | Needs live testing |
| Cashfree Integration | ✅ Implemented | Needs live testing |
| COD Flow | ✅ Working | Fully functional |
| Razorpay Webhook | ✅ Implemented | Signature verified |
| Cashfree Webhook | ✅ Implemented | Signature verified |
| Order Status Updates | ✅ Working | Via webhooks |
| Email Notifications | ⚠️ Mock | Needs real SMTP |
| WhatsApp Notifications | ⚠️ Mock | Needs integration |

---

**All payment flows are implemented and ready for testing with live credentials.** 🎉
