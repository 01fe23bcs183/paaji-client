import axios from 'axios';

// Send WhatsApp message using Twilio
export const sendWhatsAppMessage = async (to, message) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log('⚠️ WhatsApp not configured, skipping message');
            return false;
        }

        const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

        const response = await axios.post(url,
            new URLSearchParams({
                From: process.env.TWILIO_WHATSAPP_FROM,
                To: `whatsapp:+${to.replace(/\D/g, '')}`,
                Body: message
            }),
            {
                auth: {
                    username: process.env.TWILIO_ACCOUNT_SID,
                    password: process.env.TWILIO_AUTH_TOKEN
                }
            }
        );

        console.log(`✅ WhatsApp message sent to ${to}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
        return false;
    }
};

// Send order confirmation via WhatsApp
export const sendOrderConfirmationWhatsApp = async (order) => {
    try {
        const message = `
🎉 *Order Confirmed!*

Hi ${order.customer.name},

Your order *${order.orderNumber}* has been confirmed!

📦 *Total:* ₹${order.total}
📍 *Delivery to:* ${order.customer.city}, ${order.customer.state}

You'll receive updates as your order is processed and shipped.

Track your order: ${process.env.FRONTEND_URL}/track-order?orderId=${order.orderNumber}

Thank you for choosing JMC Skincare! ✨
    `.trim();

        await sendWhatsAppMessage(order.customer.phone, message);
        return true;
    } catch (error) {
        console.error('❌ Error sending WhatsApp order confirmation:', error);
        return false;
    }
};

// Send order status update via WhatsApp
export const sendOrderStatusWhatsApp = async (order, newStatus) => {
    try {
        const statusEmojis = {
            processing: '⏳',
            shipped: '🚚',
            delivered: '✅',
            cancelled: '❌'
        };

        const statusMessages = {
            processing: 'Your order is being processed',
            shipped: 'Your order has been shipped!',
            delivered: 'Your order has been delivered',
            cancelled: 'Your order has been cancelled'
        };

        const message = `
${statusEmojis[newStatus] || '📦'} *Order Update*

Hi ${order.customer.name},

${statusMessages[newStatus] || 'Status updated'}

Order: *${order.orderNumber}*
${order.trackingNumber ? `Tracking: *${order.trackingNumber}*` : ''}

Track your order: ${process.env.FRONTEND_URL}/track-order?orderId=${order.orderNumber}
    `.trim();

        await sendWhatsAppMessage(order.customer.phone, message);
        return true;
    } catch (error) {
        console.error('❌ Error sending WhatsApp status update:', error);
        return false;
    }
};
