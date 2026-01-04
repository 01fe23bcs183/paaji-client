import { createTransport } from 'nodemailer';

// Create email transporter only if credentials are provided
let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  console.log('✅ Email service configured');
} else {
  console.log('⚠️  Email service not configured (credentials missing)');
}

// Send order confirmation email
export const sendOrderConfirmation = async (order) => {
  if (!transporter) {
    console.log('⚠️  Skipping email - service not configured');
    return false;
  }

  try {
    const itemsList = order.items.map(item =>
      `<tr>
        <td>${item.name}${item.variant ? ` (${item.variant})` : ''}</td>
        <td>×${item.quantity}</td>
        <td>₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #C4A77D, #A88B5F); color: white; padding: 30px; text-align: center; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .total { font-size: 1.2em; font-weight: bold; color: #C4A77D; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
          .button { display: inline-block; padding: 12px 30px; background: #C4A77D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${order.customer.name}!</h2>
            <p>Your order <strong>${order.orderNumber}</strong> has been confirmed and is being processed.</p>
            
            <h3>Order Details:</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>

            <table>
              <tr><td>Subtotal:</td><td>₹${order.subtotal}</td></tr>
              ${order.discount > 0 ? `<tr><td>Discount:</td><td style="color: #5B8C5A;">-₹${order.discount}</td></tr>` : ''}
              <tr><td>Shipping:</td><td>₹${order.shippingCost}</td></tr>
              <tr class="total"><td>Total:</td><td>₹${order.total}</td></tr>
            </table>

            <h3>Shipping Address:</h3>
            <p>
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}<br>
              Phone: ${order.customer.phone}
            </p>

            <a href="${process.env.FRONTEND_URL}/track-order?orderId=${order.orderNumber}" class="button">
              Track Your Order
            </a>

            <p>You'll receive a shipping confirmation email when your order ships.</p>
          </div>
          <div class="footer">
            <p>JMC Skincare | Luxury Skincare for Radiant Skin</p>
            <p>Questions? Contact us at ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.customer.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

// Send order status update email
export const sendOrderStatusUpdate = async (order, newStatus) => {
  if (!transporter) {
    console.log('⚠️  Skipping email - service not configured');
    return false;
  }

  try {
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped!',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled'
    };

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #C4A77D, #A88B5F); color: white; padding: 30px; text-align: center; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 30px; background: #C4A77D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusMessages[newStatus] || 'Order Status Updated'}</h1>
          </div>
          <div class="content">
            <p>Hi ${order.customer.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong>${newStatus}</strong></p>
            
            ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
            
            <a href="${process.env.FRONTEND_URL}/track-order?orderId=${order.orderNumber}" class="button">
              Track Your Order
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.customer.email,
      subject: `Order Update - ${order.orderNumber}`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${order.customer.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  if (!transporter) {
    console.log('⚠️  Skipping email - service not configured');
    return false;
  }

  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #C4A77D, #A88B5F); color: white; padding: 30px; text-align: center; }
          .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 30px; background: #C4A77D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to JMC Skincare! 🌟</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Thank you for joining the JMC Skincare family!</p>
            <p>We're excited to have you on board. Explore our collection of luxury skincare products designed for radiant, healthy skin.</p>
            
            <p><strong>Your Welcome Gift:</strong><br>
            Use code <strong>WELCOME10</strong> for 10% off your first order!</p>
            
            <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
            
            <p>If you have any questions, feel free to reach out to us anytime.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to JMC Skincare!',
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};
