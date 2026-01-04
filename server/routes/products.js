import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const where = { isActive: true };

        // Search
        if (req.query.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${req.query.search}%` } },
                { description: { [Op.like]: `%${req.query.search}%` } }
            ];
        }

        // Category filter
        if (req.query.category) {
            where.category = req.query.category;
        }

        // Featured filter
        if (req.query.featured === 'true') {
            where.featured = true;
        }

        const products = await Product.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { slug: req.params.slug }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create product
// @access  Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/products/:id
// @desc    Update product
// @access  Admin
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update(req.body);
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
