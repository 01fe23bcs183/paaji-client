import express from 'express';
import { protect } from '../middleware/auth.js';
import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const router = express.Router();

// Cart Model (inline for simplicity)
const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    items: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    couponCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'carts',
    timestamps: true
});

// Sync model
Cart.sync({ alter: true });

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: [],
                couponCode: null
            });
        }

        res.json({
            success: true,
            cart: {
                items: cart.items,
                couponCode: cart.couponCode,
                lastUpdated: cart.lastUpdated
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/cart/sync
// @desc    Sync cart items from frontend to backend
// @access  Private
router.post('/sync', protect, async (req, res) => {
    try {
        const { items, couponCode } = req.body;

        let cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: items || [],
                couponCode: couponCode || null
            });
        } else {
            await cart.update({
                items: items || [],
                couponCode: couponCode || null,
                lastUpdated: new Date()
            });
        }

        res.json({
            success: true,
            cart: {
                items: cart.items,
                couponCode: cart.couponCode,
                lastUpdated: cart.lastUpdated
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
    try {
        const { productId, name, price, quantity, variant, image } = req.body;

        let cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: [],
                couponCode: null
            });
        }

        const items = [...(cart.items || [])];
        const existingIndex = items.findIndex(
            item => item.productId === productId && item.variant === variant
        );

        if (existingIndex >= 0) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({ productId, name, price, quantity, variant, image });
        }

        await cart.update({ items, lastUpdated: new Date() });

        res.json({
            success: true,
            cart: { items: cart.items, couponCode: cart.couponCode }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const { variant } = req.query;

        const cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const items = (cart.items || []).filter(
            item => !(item.productId == productId && item.variant === variant)
        );

        await cart.update({ items, lastUpdated: new Date() });

        res.json({
            success: true,
            cart: { items, couponCode: cart.couponCode }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (cart) {
            await cart.update({ items: [], couponCode: null, lastUpdated: new Date() });
        }

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/cart/coupon
// @desc    Apply coupon to cart
// @access  Private
router.post('/coupon', protect, async (req, res) => {
    try {
        const { couponCode } = req.body;

        const cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        await cart.update({ couponCode, lastUpdated: new Date() });

        res.json({
            success: true,
            cart: { items: cart.items, couponCode: cart.couponCode }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
