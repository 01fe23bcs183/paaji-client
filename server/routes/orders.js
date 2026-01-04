import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../services/emailService.js';
import { sendOrderConfirmationWhatsApp, sendOrderStatusWhatsApp } from '../services/whatsappService.js';
import shiprocketService from '../services/shiprocketService.js';
import { Op } from 'sequelize';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order with Shiprocket integration
// @access  Public (guest checkout) or Private
router.post('/', async (req, res) => {
    try {
        const {
            customer,
            items,
            subtotal,
            discount,
            shippingCost,
            total,
            couponCode,
            paymentMethod,
            paymentId,
            shippingDetails
        } = req.body;

        // Generate unique order number
        const orderNumber = `JMC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Create order in database
        const order = await Order.create({
            orderNumber,
            userId: req.user?.id, // Optional if guest checkout
            customer,
            items,
            subtotal,
            discount,
            shippingCost,
            total,
            couponCode,
            paymentMethod,
            paymentId,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
            status: 'pending',
            shippingDetails
        });

        // Update product stock
        for (const item of items) {
            await Product.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId }
            });
        }

        // Send notifications (async, don't wait)
        sendOrderConfirmation(order.toJSON())
            .then(() => order.update({ emailSent: true }))
            .catch(err => console.error('Error sending order email:', err));

        sendOrderConfirmationWhatsApp(order.toJSON())
            .then(() => order.update({ whatsappSent: true }))
            .catch(err => console.error('Error sending WhatsApp:', err));

        // Create Shiprocket shipment (async)
        if (process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD) {
            createShiprocketShipment(order).catch(err =>
                console.error('Shiprocket shipment creation failed:', err)
            );
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: order.total,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Helper function to create Shiprocket shipment
async function createShiprocketShipment(order) {
    try {
        // Create shipment
        const shipment = await shiprocketService.createOrder({
            orderNumber: order.orderNumber,
            customer: order.customer,
            items: order.items.map(item => ({
                ...item,
                productId: item.productId || item.product
            })),
            subtotal: order.subtotal,
            paymentMethod: order.paymentMethod
        });

        if (shipment.success) {
            // Get available couriers
            const couriers = await shiprocketService.getCourierServices(shipment.shipmentId);

            if (couriers.success && couriers.couriers.length > 0) {
                // Select best courier (lowest rate)
                const bestCourier = couriers.couriers.sort((a, b) => a.rate - b.rate)[0];

                // Generate AWB
                const awb = await shiprocketService.generateAWB(
                    shipment.shipmentId,
                    bestCourier.courier_company_id
                );

                if (awb.success) {
                    // Update order with shipping info
                    await order.update({
                        trackingNumber: awb.awb,
                        notes: `Shiprocket Shipment ID: ${shipment.shipmentId}, Courier: ${bestCourier.courier_name}`
                    });

                    console.log(`✅ Shiprocket shipment created for order ${order.orderNumber}, AWB: ${awb.awb}`);

                    // Generate label (async)
                    shiprocketService.generateLabel(shipment.shipmentId)
                        .then(label => console.log(`📄 Shipping label: ${label.labelUrl}`))
                        .catch(err => console.error('Label generation failed:', err));

                    // Schedule pickup for tomorrow
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    shiprocketService.schedulePickup(
                        shipment.shipmentId,
                        tomorrow.toISOString().split('T')[0]
                    ).catch(err => console.error('Pickup scheduling failed:', err));
                }
            }
        }
    } catch (error) {
        console.error('Shiprocket integration error:', error);
    }
}

// @route   GET /api/orders
// @desc    Get all orders (admin) or user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let where = {};

        // If not admin, only show user's orders
        if (req.user.role !== 'admin') {
            where.userId = req.user.id;
        }

        // Filters
        if (req.query.status) {
            where.status = req.query.status;
        }

        if (req.query.search) {
            where[Op.or] = [
                { orderNumber: { [Op.like]: `%${req.query.search}%` } },
                { 'customer.email': { [Op.like]: `%${req.query.search}%` } }
            ];
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private (own order) or Admin
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization (user can only see their own orders)
        if (req.user && order.userId && order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Track order by order number (public)
// @access  Public
router.get('/track/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderNumber: req.params.orderNumber }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Admin
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, trackingNumber, note } = req.body;

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        const updates = { status };
        if (trackingNumber) {
            updates.trackingNumber = trackingNumber;
        }

        // Add to status history
        const statusHistory = order.statusHistory || [];
        statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Status updated to ${status}`
        });
        updates.statusHistory = statusHistory;

        await order.update(updates);

        // Send notifications
        sendOrderStatusUpdate(order.toJSON(), status)
            .catch(err => console.error('Error sending status email:', err));

        sendOrderStatusWhatsApp(order.toJSON(), status)
            .catch(err => console.error('Error sending WhatsApp:', err));

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/orders/export/csv
// @desc    Export orders to CSV
// @access  Admin
router.get('/export/csv', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Create CSV
        const csv = [
            ['Order Number', 'Customer Name', 'Email', 'Phone', 'Total', 'Status', 'Payment Method', 'Date'].join(','),
            ...orders.map(order => {
                const customer = order.customer;
                return [
                    order.orderNumber,
                    customer.name,
                    customer.email,
                    customer.phone,
                    order.total,
                    order.status,
                    order.paymentMethod,
                    new Date(order.createdAt).toLocaleDateString()
                ].join(',');
            })
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
