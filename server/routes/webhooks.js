import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../services/emailService.js';

const router = express.Router();

// @route   POST /api/webhooks/razorpay
// @desc    Handle Razorpay payment webhook
// @access  Public (but verified)
router.post('/razorpay', async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Verify webhook signature
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.log('❌ Razorpay webhook signature verification failed');
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        const event = req.body.event;
        const payment = req.body.payload.payment.entity;

        console.log(`📥 Razorpay webhook received: ${event}`);

        switch (event) {
            case 'payment.captured':
                // Payment successful
                await handlePaymentSuccess(payment.order_id, payment.id, 'razorpay');
                break;

            case 'payment.failed':
                // Payment failed
                await handlePaymentFailure(payment.order_id, 'razorpay');
                break;

            default:
                console.log(`Unhandled Razorpay event: ${event}`);
        }

        res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Razorpay webhook error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/webhooks/cashfree
// @desc    Handle Cashfree payment webhook
// @access  Public (but verified)
router.post('/cashfree', async (req, res) => {
    try {
        // Cashfree sends payment data in request body
        const { orderId, orderAmount, txStatus, txMsg, referenceId, signature } = req.body;

        // Verify signature (Cashfree specific)
        const secretKey = process.env.CASHFREE_SECRET_KEY;
        const signatureData = `${orderId}${orderAmount}${referenceId}${txStatus}${txMsg}`;

        const expectedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(signatureData)
            .digest('base64');

        if (signature !== expectedSignature) {
            console.log('❌ Cashfree webhook signature verification failed');
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        console.log(`📥 Cashfree webhook received: ${txStatus}`);

        if (txStatus === 'SUCCESS') {
            await handlePaymentSuccess(orderId, referenceId, 'cashfree');
        } else if (txStatus === 'FAILED' || txStatus === 'CANCELLED') {
            await handlePaymentFailure(orderId, 'cashfree');
        }

        res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Cashfree webhook error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/webhooks/shiprocket
// @desc    Handle Shiprocket tracking webhook
// @access  Public
router.post('/shiprocket', async (req, res) => {
    try {
        const { awb, current_status, shipment_status } = req.body;

        console.log(`📦 Shiprocket webhook: AWB ${awb} - Status: ${current_status}`);

        // Find order by tracking number (AWB)
        const order = await Order.findOne({
            where: { trackingNumber: awb }
        });

        if (!order) {
            console.log(`Order not found for AWB: ${awb}`);
            return res.json({ success: true, message: 'Order not found' });
        }

        // Map Shiprocket status to our order status
        let newStatus = order.status;

        const statusMap = {
            'PICKUP_SCHEDULED': 'processing',
            'PICKED_UP': 'processing',
            'IN_TRANSIT': 'shipped',
            'OUT_FOR_DELIVERY': 'shipped',
            'DELIVERED': 'delivered',
            'CANCELED': 'cancelled',
            'RTO_INITIATED': 'cancelled',
            'RTO_DELIVERED': 'cancelled'
        };

        newStatus = statusMap[shipment_status] || order.status;

        // Update order status
        if (newStatus !== order.status) {
            const statusHistory = order.statusHistory || [];
            statusHistory.push({
                status: newStatus,
                timestamp: new Date(),
                note: `Shiprocket update: ${current_status}`
            });

            await order.update({
                status: newStatus,
                statusHistory,
                notes: order.notes ? `${order.notes}\n${current_status}` : current_status
            });

            // Send notification to customer
            sendOrderStatusUpdate(order.toJSON(), newStatus)
                .catch(err => console.error('Error sending status email:', err));
        }

        res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Shiprocket webhook error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Helper function: Handle successful payment
async function handlePaymentSuccess(orderNumber, paymentId, gateway) {
    try {
        const order = await Order.findOne({
            where: { orderNumber }
        });

        if (!order) {
            console.log(`Order not found: ${orderNumber}`);
            return;
        }

        console.log(`✅ Payment successful for order ${orderNumber} via ${gateway}`);

        // Update order payment status
        await order.update({
            paymentStatus: 'paid',
            paymentId,
            status: 'processing'
        });

        // Send order confirmation email
        sendOrderConfirmation(order.toJSON())
            .then(() => order.update({ emailSent: true }))
            .catch(err => console.error('Error sending confirmation email:', err));

    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

// Helper function: Handle failed payment
async function handlePaymentFailure(orderNumber, gateway) {
    try {
        const order = await Order.findOne({
            where: { orderNumber }
        });

        if (!order) {
            console.log(`Order not found: ${orderNumber}`);
            return;
        }

        console.log(`❌ Payment failed for order ${orderNumber} via ${gateway}`);

        // Update order payment status
        await order.update({
            paymentStatus: 'failed',
            status: 'cancelled'
        });

    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

export default router;
