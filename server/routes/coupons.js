import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import sequelize from '../config/database.js';

const router = express.Router();

// Coupon model (using localStorage equivalent in DB)
const coupons = [
    {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrder: 500,
        maxDiscount: 500,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageCount: 0,
        usageLimit: 1000
    },
    {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        minOrder: 1000,
        maxDiscount: 1000,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageCount: 0,
        usageLimit: 500
    },
    {
        code: 'FLAT100',
        type: 'fixed',
        value: 100,
        minOrder: 800,
        maxDiscount: 100,
        expiryDate: new Date('2026-12-31'),
        isActive: true,
        usageCount: 0,
        usageLimit: 500
    }
];

// @route   POST /api/coupons/validate
// @desc    Validate and calculate coupon discount
// @access  Public
router.post('/validate', async (req, res) => {
    try {
        const { code, orderTotal } = req.body;

        if (!code || !orderTotal) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and order total are required'
            });
        }

        // Find coupon
        const coupon = coupons.find(
            c => c.code.toUpperCase() === code.toUpperCase() && c.isActive
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Check expiry
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired'
            });
        }

        // Check usage limit
        if (coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit reached'
            });
        }

        // Check minimum order amount
        if (orderTotal < coupon.minOrder) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrder} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (orderTotal * coupon.value) / 100;
            if (discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.value;
        }

        res.json({
            success: true,
            valid: true,
            discount: Math.round(discount),
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minOrder: coupon.minOrder,
                maxDiscount: coupon.maxDiscount
            },
            message: `Coupon applied! You saved ₹${Math.round(discount)}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        res.json({
            success: true,
            coupons: coupons.filter(c => c.isActive)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/coupons
// @desc    Create new coupon
// @access  Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { code, type, value, minOrder, maxDiscount, expiryDate, usageLimit } = req.body;

        // Check if coupon already exists
        const existingCoupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const newCoupon = {
            code: code.toUpperCase(),
            type,
            value,
            minOrder,
            maxDiscount,
            expiryDate: new Date(expiryDate),
            isActive: true,
            usageCount: 0,
            usageLimit: usageLimit || 1000
        };

        coupons.push(newCoupon);

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon: newCoupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/coupons/:code
// @desc    Delete coupon
// @access  Admin
router.delete('/:code', protect, authorize('admin'), async (req, res) => {
    try {
        const couponIndex = coupons.findIndex(
            c => c.code.toUpperCase() === req.params.code.toUpperCase()
        );

        if (couponIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        coupons[couponIndex].isActive = false;

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/coupons/:code/increment
// @desc    Increment coupon usage (called after order placement)
// @access  Private
router.patch('/:code/increment', async (req, res) => {
    try {
        const coupon = coupons.find(
            c => c.code.toUpperCase() === req.params.code.toUpperCase()
        );

        if (coupon) {
            coupon.usageCount++;
        }

        res.json({
            success: true,
            message: 'Coupon usage updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
