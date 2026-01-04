// Email Templates for JMC Skincare
// HTML email templates for various notifications

export const emailStyles = `
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Montserrat', Arial, sans-serif;
      color: #333;
      background: #fff;
    }
    .email-header {
      background: linear-gradient(135deg, #C4A77D 0%, #E8D5B7 100%);
      padding: 30px;
      text-align: center;
    }
    .email-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 32px;
      color: #fff;
      margin: 0;
      letter-spacing: 4px;
    }
    .email-body {
      padding: 40px 30px;
    }
    .email-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px;
      color: #333;
      margin: 0 0 20px;
      text-align: center;
    }
    .email-text {
      font-size: 16px;
      line-height: 1.6;
      color: #555;
      margin-bottom: 20px;
    }
    .email-button {
      display: inline-block;
      background: #C4A77D;
      color: #fff !important;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .email-button:hover {
      background: #A68A5A;
    }
    .product-card {
      display: flex;
      align-items: center;
      padding: 15px;
      background: #FDFBF7;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 15px;
      background: #E8D5B7;
    }
    .product-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    .product-price {
      color: #C4A77D;
      font-weight: 600;
    }
    .discount-banner {
      background: linear-gradient(135deg, #C4A77D 0%, #E8D5B7 100%);
      padding: 25px;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;
    }
    .discount-code {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .discount-text {
      color: #fff;
      font-size: 14px;
    }
    .email-footer {
      background: #FDFBF7;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #C4A77D;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #eee;
      margin: 30px 0;
    }
    .order-summary {
      background: #FDFBF7;
      padding: 20px;
      border-radius: 8px;
    }
    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .order-total {
      font-size: 20px;
      font-weight: 700;
      color: #C4A77D;
    }
  </style>
`;

/**
 * Cart Abandonment Email Template
 */
export function cartAbandonmentEmail({
    customerName,
    items,
    totalValue,
    discountCode,
    discountPercent,
    recoveryUrl,
}) {
    const productsList = items.map(item => `
    <div class="product-card">
      <img src="${item.image || 'https://jmcskincare.com/placeholder.jpg'}" alt="${item.name}" class="product-image" />
      <div>
        <div class="product-name">${item.name}</div>
        <div class="product-price">₹${item.price.toLocaleString()} × ${item.quantity}</div>
      </div>
    </div>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background: #f5f5f5;">
      <div class="email-container">
        <div class="email-header">
          <h1 class="email-logo">JMC</h1>
        </div>
        
        <div class="email-body">
          <h2 class="email-title">Your Cart Misses You! 💕</h2>
          
          <p class="email-text">
            Hi${customerName ? ` ${customerName}` : ''},
          </p>
          
          <p class="email-text">
            We noticed you left some amazing skincare products in your cart. 
            Your skin deserves the best, and we don't want you to miss out!
          </p>
          
          ${productsList}
          
          ${discountCode ? `
            <div class="discount-banner">
              <div class="discount-text">Use code</div>
              <div class="discount-code">${discountCode}</div>
              <div class="discount-text">to get ${discountPercent}% off your order!</div>
            </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${recoveryUrl}" class="email-button">
              Complete Your Order
            </a>
          </div>
          
          <p class="email-text" style="text-align: center; color: #888; font-size: 14px;">
            Your cart total: <strong>₹${totalValue.toLocaleString()}</strong>
          </p>
        </div>
        
        <div class="email-footer">
          <div class="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
          <p>JMC Skincare • Premium Luxury Skincare</p>
          <p>
            <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a> | 
            <a href="https://jmcskincare.com/privacy" style="color: #888;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Order Confirmation Email Template
 */
export function orderConfirmationEmail({
    customerName,
    orderNumber,
    items,
    subtotal,
    discount,
    shipping,
    total,
    shippingAddress,
    estimatedDelivery,
    trackingUrl,
}) {
    const productsList = items.map(item => `
    <div class="order-row">
      <span>${item.name} × ${item.quantity}</span>
      <span>₹${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background: #f5f5f5;">
      <div class="email-container">
        <div class="email-header">
          <h1 class="email-logo">JMC</h1>
        </div>
        
        <div class="email-body">
          <h2 class="email-title">Thank You for Your Order! 🎉</h2>
          
          <p class="email-text">
            Hi ${customerName},
          </p>
          
          <p class="email-text">
            Your order has been confirmed and is being prepared with care. 
            Here's your order summary:
          </p>
          
          <div style="background: #FDFBF7; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 14px; color: #888;">Order Number</div>
            <div style="font-size: 20px; font-weight: 700; color: #C4A77D;">${orderNumber}</div>
          </div>
          
          <div class="order-summary">
            ${productsList}
            
            <div class="divider"></div>
            
            <div class="order-row">
              <span>Subtotal</span>
              <span>₹${subtotal.toLocaleString()}</span>
            </div>
            ${discount > 0 ? `
              <div class="order-row" style="color: #22c55e;">
                <span>Discount</span>
                <span>-₹${discount.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="order-row">
              <span>Shipping</span>
              <span>${shipping > 0 ? `₹${shipping.toLocaleString()}` : 'FREE'}</span>
            </div>
            <div class="order-row" style="font-size: 18px; font-weight: 700;">
              <span>Total</span>
              <span class="order-total">₹${total.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <h3 style="margin-bottom: 10px;">Shipping Address</h3>
          <p class="email-text" style="background: #FDFBF7; padding: 15px; border-radius: 8px;">
            ${shippingAddress}
          </p>
          
          ${estimatedDelivery ? `
            <p class="email-text" style="text-align: center;">
              <strong>Estimated Delivery:</strong> ${estimatedDelivery}
            </p>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${trackingUrl || '#'}" class="email-button">
              Track Your Order
            </a>
          </div>
        </div>
        
        <div class="email-footer">
          <p>Need help? Reply to this email or contact us at support@jmcskincare.com</p>
          <div class="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
          <p>JMC Skincare • Premium Luxury Skincare</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Welcome Email Template
 */
export function welcomeEmail({
    customerName,
    discountCode = 'WELCOME10',
    discountPercent = 10,
}) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background: #f5f5f5;">
      <div class="email-container">
        <div class="email-header">
          <h1 class="email-logo">JMC</h1>
        </div>
        
        <div class="email-body">
          <h2 class="email-title">Welcome to JMC Skincare! ✨</h2>
          
          <p class="email-text">
            Hi ${customerName || 'Beautiful'},
          </p>
          
          <p class="email-text">
            Thank you for joining the JMC family! We're thrilled to have you. 
            Get ready to discover skincare that truly transforms.
          </p>
          
          <div class="discount-banner">
            <div class="discount-text">Your exclusive welcome gift</div>
            <div class="discount-code">${discountCode}</div>
            <div class="discount-text">${discountPercent}% off your first order!</div>
          </div>
          
          <p class="email-text" style="text-align: center;">
            Here's what awaits you:
          </p>
          
          <ul class="email-text">
            <li>🌿 Premium, science-backed formulas</li>
            <li>✨ Expert skincare tips & routines</li>
            <li>🎁 Exclusive member offers</li>
            <li>📦 Free shipping on orders ₹999+</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://jmcskincare.com/skin-quiz" class="email-button">
              Find Your Perfect Routine
            </a>
          </div>
          
          <p class="email-text" style="text-align: center; font-size: 14px; color: #888;">
            Not sure where to start? Take our 2-minute skin quiz!
          </p>
        </div>
        
        <div class="email-footer">
          <div class="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
          <p>JMC Skincare • Premium Luxury Skincare</p>
          <p>
            <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Shipping Update Email Template
 */
export function shippingUpdateEmail({
    customerName,
    orderNumber,
    status,
    trackingNumber,
    trackingUrl,
    carrierName,
    estimatedDelivery,
}) {
    const statusMessages = {
        shipped: 'Your order is on its way! 📦',
        out_for_delivery: 'Your order is out for delivery! 🚚',
        delivered: 'Your order has been delivered! 🎉',
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background: #f5f5f5;">
      <div class="email-container">
        <div class="email-header">
          <h1 class="email-logo">JMC</h1>
        </div>
        
        <div class="email-body">
          <h2 class="email-title">${statusMessages[status] || 'Shipping Update'}</h2>
          
          <p class="email-text">
            Hi ${customerName},
          </p>
          
          <p class="email-text">
            Great news about your order #${orderNumber}!
          </p>
          
          <div style="background: #FDFBF7; padding: 20px; border-radius: 8px; text-align: center;">
            ${trackingNumber ? `
              <div style="margin-bottom: 10px;">
                <div style="font-size: 14px; color: #888;">Tracking Number</div>
                <div style="font-size: 18px; font-weight: 700;">${trackingNumber}</div>
              </div>
            ` : ''}
            ${carrierName ? `
              <div style="margin-bottom: 10px;">
                <div style="font-size: 14px; color: #888;">Carrier</div>
                <div style="font-weight: 600;">${carrierName}</div>
              </div>
            ` : ''}
            ${estimatedDelivery ? `
              <div>
                <div style="font-size: 14px; color: #888;">Expected Delivery</div>
                <div style="font-weight: 600; color: #C4A77D;">${estimatedDelivery}</div>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center;">
            <a href="${trackingUrl || '#'}" class="email-button">
              Track Your Package
            </a>
          </div>
        </div>
        
        <div class="email-footer">
          <p>Questions? Contact us at support@jmcskincare.com</p>
          <p>JMC Skincare • Premium Luxury Skincare</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Quiz Results Email Template
 */
export function quizResultsEmail({
    customerName,
    skinType,
    primaryConcern,
    skinScore,
    morningRoutine,
    eveningRoutine,
    recommendedProducts,
}) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 0; background: #f5f5f5;">
      <div class="email-container">
        <div class="email-header">
          <h1 class="email-logo">JMC</h1>
        </div>
        
        <div class="email-body">
          <h2 class="email-title">Your Personalized Skin Analysis ✨</h2>
          
          <p class="email-text">
            Hi ${customerName || 'there'},
          </p>
          
          <p class="email-text">
            Thanks for taking our skin quiz! Here's your personalized analysis 
            and recommended routine.
          </p>
          
          <div style="background: linear-gradient(135deg, #C4A77D 0%, #E8D5B7 100%); padding: 25px; border-radius: 8px; text-align: center; color: white; margin-bottom: 20px;">
            <div style="font-size: 48px; font-weight: 700;">${skinScore}/100</div>
            <div>Your Skin Health Score</div>
          </div>
          
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1; background: #FDFBF7; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 14px; color: #888;">Skin Type</div>
              <div style="font-weight: 600; text-transform: capitalize;">${skinType}</div>
            </div>
            <div style="flex: 1; background: #FDFBF7; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 14px; color: #888;">Main Concern</div>
              <div style="font-weight: 600; text-transform: capitalize;">${primaryConcern}</div>
            </div>
          </div>
          
          <h3>☀️ Morning Routine</h3>
          <ul class="email-text">
            ${morningRoutine.map(step => `<li>${step}</li>`).join('')}
          </ul>
          
          <h3>🌙 Evening Routine</h3>
          <ul class="email-text">
            ${eveningRoutine.map(step => `<li>${step}</li>`).join('')}
          </ul>
          
          <div style="text-align: center;">
            <a href="https://jmcskincare.com/" class="email-button">
              Shop Your Routine
            </a>
          </div>
        </div>
        
        <div class="email-footer">
          <p>Skincare questions? Reply to this email!</p>
          <p>JMC Skincare • Premium Luxury Skincare</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
    cartAbandonmentEmail,
    orderConfirmationEmail,
    welcomeEmail,
    shippingUpdateEmail,
    quizResultsEmail,
};
