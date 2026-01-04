import express from 'express';
import shiprocket from '../services/shiprocket.js';
import Order from '../models/Order.js';

const router = express.Router();

// Check pincode serviceability
router.get('/serviceability/:pincode', async (req, res) => {
    try {
        const result = await shiprocket.checkServiceability(req.params.pincode);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available couriers for shipment
router.post('/couriers', async (req, res) => {
    try {
        const { pickupPincode, deliveryPincode, weight, cod } = req.body;
        const couriers = await shiprocket.getAvailableCouriers(
            pickupPincode || process.env.SHIPROCKET_PICKUP_PINCODE,
            deliveryPincode,
            weight || 0.5,
            cod
        );
        res.json(couriers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create shipment for order
router.post('/create', async (req, res) => {
    try {
        const { orderId } = req.body;

        // Get order details
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Create Shiprocket order
        const result = await shiprocket.createOrder({
            orderId: order.id,
            customerName: order.shippingAddress.name,
            email: order.email,
            phone: order.phone,
            address: {
                line1: order.shippingAddress.address,
                line2: order.shippingAddress.address2,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                pincode: order.shippingAddress.pincode,
                country: 'India',
            },
            items: JSON.parse(order.items),
            subtotal: order.total,
            paymentMethod: order.paymentMethod,
        });

        // Update order with Shiprocket IDs
        await order.update({
            shiprocketOrderId: result.shiprocketOrderId,
            shipmentId: result.shipmentId,
            shippingStatus: 'processing',
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate AWB
router.post('/awb', async (req, res) => {
    try {
        const { shipmentId, courierId } = req.body;
        const result = await shiprocket.generateAWB(shipmentId, courierId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Schedule pickup
router.post('/pickup', async (req, res) => {
    try {
        const { shipmentId, pickupDate } = req.body;
        const result = await shiprocket.schedulePickup(shipmentId, pickupDate);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track shipment by AWB
router.get('/track/:awb', async (req, res) => {
    try {
        const result = await shiprocket.trackShipment(req.params.awb);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track by order ID
router.get('/track/order/:orderId', async (req, res) => {
    try {
        const result = await shiprocket.trackByOrderId(req.params.orderId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get shipping label
router.get('/label/:shipmentId', async (req, res) => {
    try {
        const result = await shiprocket.getLabel(req.params.shipmentId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get invoice
router.get('/invoice/:orderId', async (req, res) => {
    try {
        const result = await shiprocket.getInvoice(req.params.orderId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel shipment
router.post('/cancel', async (req, res) => {
    try {
        const { awbCodes } = req.body;
        const result = await shiprocket.cancelShipment(awbCodes);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create return
router.post('/return', async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const result = await shiprocket.createReturn(orderId, reason);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get NDR shipments
router.get('/ndr', async (req, res) => {
    try {
        const result = await shiprocket.getNDRShipments();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
