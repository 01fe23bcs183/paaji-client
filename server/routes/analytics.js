import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get dashboard overview stats
// @access  Admin
router.get('/overview', protect, authorize('admin'), async (req, res) => {
    try {
        // Get date range (default: last 30 days)
        const daysAgo = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // Total revenue
        const revenueResult = await Order.findOne({
            attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']],
            where: {
                paymentStatus: 'paid',
                createdAt: { [Op.gte]: startDate }
            }
        });
        const totalRevenue = parseFloat(revenueResult.dataValues.totalRevenue) || 0;

        // Total orders
        const totalOrders = await Order.count({
            where: {
                createdAt: { [Op.gte]: startDate }
            }
        });

        // Total customers
        const totalCustomers = await User.count({
            where: {
                role: 'customer',
                createdAt: { [Op.gte]: startDate }
            }
        });

        // Total products
        const totalProducts = await Product.count({
            where: { isActive: true }
        });

        // Pending orders
        const pendingOrders = await Order.count({
            where: { status: 'pending' }
        });

        // Low stock products (stock < 10)
        const lowStockProducts = await Product.count({
            where: {
                stock: { [Op.lt]: 10 },
                isActive: true
            }
        });

        // Average order value
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        // Revenue trend (last 7 days)
        const revenueTrend = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
            ],
            where: {
                paymentStatus: 'paid',
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });

        // Top selling products
        const topProducts = await sequelize.query(`
      SELECT 
        p.id, 
        p.name, 
        p.price,
        COUNT(o.id) as orders_count,
        SUM(JSON_EXTRACT(o.items, '$[0].quantity')) as total_sold
      FROM products p
      LEFT JOIN orders o ON JSON_SEARCH(o.items, 'one', p.id, NULL, '$[*].productId') IS NOT NULL
      WHERE o.paymentStatus = 'paid'
      GROUP BY p.id
      ORDER BY orders_count DESC
      LIMIT 5
    `, { type: sequelize.QueryTypes.SELECT });

        res.json({
            success: true,
            data: {
                revenue: Math.round(totalRevenue),
                orders: totalOrders,
                customers: totalCustomers,
                products: totalProducts,
                pendingOrders,
                lowStockProducts,
                avgOrderValue: Math.round(avgOrderValue),
                ordersByStatus,
                revenueTrend,
                topProducts
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/sales
// @desc    Get sales analytics
// @access  Admin
router.get('/sales', protect, authorize('admin'), async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        const where = {
            paymentStatus: 'paid'
        };

        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        // Group by day, week, or month
        let dateFormat;
        switch (groupBy) {
            case 'week':
                dateFormat = 'YEARWEEK';
                break;
            case 'month':
                dateFormat = 'YEAR-MONTH';
                break;
            default:
                dateFormat = 'DATE';
        }

        const salesData = await Order.findAll({
            attributes: [
                [sequelize.fn(dateFormat, sequelize.col('createdAt')), 'period'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
                [sequelize.fn('SUM', sequelize.col('total')), 'revenue'],
                [sequelize.fn('AVG', sequelize.col('total')), 'avgOrderValue']
            ],
            where,
            group: [sequelize.fn(dateFormat, sequelize.col('createdAt'))],
            order: [[sequelize.fn(dateFormat, sequelize.col('createdAt')), 'ASC']]
        });

        res.json({
            success: true,
            data: salesData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/products
// @desc    Get product performance analytics
// @access  Admin
router.get('/products', protect, authorize('admin'), async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: [
                'id',
                'name',
                'price',
                'stock',
                'averageRating',
                'numReviews'
            ],
            where: { isActive: true },
            order: [['numReviews', 'DESC']],
            limit: 20
        });

        // Get total revenue per product
        const productsWithRevenue = await Promise.all(
            products.map(async (product) => {
                const orders = await Order.findAll({
                    where: {
                        paymentStatus: 'paid'
                    }
                });

                let totalSold = 0;
                let revenue = 0;

                orders.forEach(order => {
                    const items = order.items || [];
                    items.forEach(item => {
                        if (item.productId === product.id) {
                            totalSold += item.quantity;
                            revenue += item.price * item.quantity;
                        }
                    });
                });

                return {
                    ...product.toJSON(),
                    totalSold,
                    revenue
                };
            })
        );

        res.json({
            success: true,
            data: productsWithRevenue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/customers
// @desc    Get customer analytics
// @access  Admin
router.get('/customers', protect, authorize('admin'), async (req, res) => {
    try {
        // New customers over time
        const newCustomers = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                role: 'customer',
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });

        // Top customers by order value
        const topCustomers = await Order.findAll({
            attributes: [
                'userId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
                [sequelize.fn('SUM', sequelize.col('total')), 'totalSpent']
            ],
            where: {
                userId: { [Op.ne]: null },
                paymentStatus: 'paid'
            },
            group: ['userId'],
            order: [[sequelize.fn('SUM', sequelize.col('total')), 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });

        res.json({
            success: true,
            data: {
                newCustomers,
                topCustomers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/analytics/reviews
// @desc    Get review analytics
// @access  Admin
router.get('/reviews', protect, authorize('admin'), async (req, res) => {
    try {
        // Average rating distribution
        const ratingDistribution = await Review.findAll({
            attributes: [
                'rating',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { isApproved: true },
            group: ['rating'],
            order: [['rating', 'DESC']]
        });

        // Recent reviews
        const recentReviews = await Review.findAll({
            where: { isApproved: true },
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Product,
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // Total reviews
        const totalReviews = await Review.count({
            where: { isApproved: true }
        });

        // Average rating
        const avgRating = await Review.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
            where: { isApproved: true }
        });

        res.json({
            success: true,
            data: {
                totalReviews,
                averageRating: parseFloat(avgRating.dataValues.avgRating).toFixed(1),
                ratingDistribution,
                recentReviews
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
