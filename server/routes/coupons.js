import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// @route   POST /api/coupons/validate
// @desc    Validate and calculate coupon discount
// @access  Public
router.post('/validate', async (req, res) => {
    try {
        const { code, orderTotal, productIds = [] } = req.body;

        if (!code || !orderTotal) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and order total are required'
            });
        }

        // Find active coupon by code
        const coupon = await Coupon.findOne({
            where: {
                code: code.toUpperCase(),
                isActive: true
            }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Validate coupon using instance method
        const validation = coupon.isValid(orderTotal, null, productIds);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // Calculate discount
        const discount = coupon.calculateDiscount(orderTotal);

        res.json({
            success: true,
            valid: true,
            discount: Math.round(discount * 100) / 100,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minOrderValue: coupon.minOrderValue,
                maxDiscount: coupon.maxDiscount,
                isFreeShipping: coupon.type === 'freeShipping'
            },
            message: coupon.type === 'freeShipping'
                ? 'Free shipping applied!'
                : `Coupon applied! You saved ₹${Math.round(discount)}`
        });
    } catch (error) {
        console.error('Coupon validation error:', error);
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
        const coupons = await Coupon.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            coupons
        });
    } catch (error) {
        console.error('Get coupons error:', error);
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
        const { code, type, value, minOrderValue, maxDiscount, expiryDate, usageLimit, description } = req.body;

        // Check if coupon already exists
        const existingCoupon = await Coupon.findOne({
            where: { code: code.toUpperCase() }
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const newCoupon = await Coupon.create({
            code: code.toUpperCase(),
            type,
            value,
            minOrderValue: minOrderValue || 0,
            maxDiscount: maxDiscount || null,
            expiryDate: new Date(expiryDate),
            usageLimit: usageLimit || null,
            description: description || null,
            isActive: true,
            usedCount: 0
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon: newCoupon
        });
    } catch (error) {
        console.error('Create coupon error:', error);
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
        const coupon = await Coupon.findOne({
            where: { code: req.params.code.toUpperCase() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Soft delete by setting isActive to false
        await coupon.update({ isActive: false });

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
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
        const coupon = await Coupon.findOne({
            where: { code: req.params.code.toUpperCase() }
        });

        if (coupon) {
            await coupon.incrementUsage();
        }

        res.json({
            success: true,
            message: 'Coupon usage updated'
        });
    } catch (error) {
        console.error('Increment coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
