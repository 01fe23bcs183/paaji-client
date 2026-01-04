import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: {
                productId: req.params.productId,
                isApproved: true
            },
            include: [{
                model: User,
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { productId, rating, title, comment, images } = req.body;

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            where: {
                productId,
                userId: req.user.id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Check if user purchased this product (optional but recommended)
        const hasPurchased = await Order.findOne({
            where: {
                userId: req.user.id,
                status: 'delivered'
            }
        });

        // Create review
        const review = await Review.create({
            productId,
            userId: req.user.id,
            rating,
            title,
            comment,
            images: images || [],
            verified: hasPurchased ? true : false,
            isApproved: false // Requires admin approval
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will be published after approval.',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/reviews/:id
// @desc    Update a review
// @access  Private (own review)
router.patch('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { rating, title, comment, images } = req.body;

        await review.update({
            rating: rating || review.rating,
            title: title || review.title,
            comment: comment || review.comment,
            images: images || review.images,
            isApproved: false // Reset approval status
        });

        res.json({
            success: true,
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (own review) or Admin
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check authorization
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await review.destroy();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/reviews/admin
// @desc    Get all reviews (pending approval)
// @access  Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const where = {};

        if (req.query.status === 'pending') {
            where.isApproved = false;
        } else if (req.query.status === 'approved') {
            where.isApproved = true;
        }

        const reviews = await Review.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Product,
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/reviews/:id/approve
// @desc    Approve a review
// @access  Admin
router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.update({ isApproved: true });

        res.json({
            success: true,
            message: 'Review approved successfully',
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PATCH /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
router.patch('/:id/helpful', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.increment('helpful');

        res.json({
            success: true,
            message: 'Thank you for your feedback'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
