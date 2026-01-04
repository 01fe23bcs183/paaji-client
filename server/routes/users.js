import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/users/profile
// @desc    Update user profile
// @access  Private
router.patch('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { name, phone } = req.body;

        await user.update({
            name: name || user.name,
            phone: phone || user.phone
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/users/addresses
// @desc    Add address
// @access  Private
router.post('/addresses', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        const addresses = user.addresses || [];
        const newAddress = {
            ...req.body,
            id: Date.now().toString(),
            isDefault: addresses.length === 0 // First address is default
        };

        addresses.push(newAddress);
        await user.update({ addresses });

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.patch('/addresses/:addressId', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        const addresses = user.addresses || [];
        const addressIndex = addresses.findIndex(a => a.id === req.params.addressId);

        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        addresses[addressIndex] = {
            ...addresses[addressIndex],
            ...req.body,
            id: req.params.addressId
        };

        await user.update({ addresses });

        res.json({
            success: true,
            message: 'Address updated successfully',
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private  
router.delete('/addresses/:addressId', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        const addresses = (user.addresses || []).filter(a => a.id !== req.params.addressId);
        await user.update({ addresses });

        res.json({
            success: true,
            message: 'Address deleted successfully',
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({
            success: true,
            wishlist: user.wishlist || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/users/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const wishlist = user.wishlist || [];

        if (!wishlist.includes(req.params.productId)) {
            wishlist.push(req.params.productId);
            await user.update({ wishlist });
        }

        res.json({
            success: true,
            message: 'Product added to wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const wishlist = (user.wishlist || []).filter(id => id !== req.params.productId);

        await user.update({ wishlist });

        res.json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/users (Admin only)
// @desc    Get all users
// @access  Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
