// Analytics data service for admin dashboard

/**
 * Get sales analytics data
 */
export async function getSalesAnalytics(period = '7d') {
    // In production, this would fetch from API
    // For now, generate sample data

    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const salesData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic-looking data
        const baseValue = 15000 + Math.random() * 10000;
        const dayOfWeek = date.getDay();
        const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;

        salesData.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.round(baseValue * weekendMultiplier),
            orders: Math.floor(5 + Math.random() * 15),
            visitors: Math.floor(200 + Math.random() * 300),
        });
    }

    // Calculate totals
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const totalVisitors = salesData.reduce((sum, d) => sum + d.visitors, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (vs previous period)
    const halfPoint = Math.floor(salesData.length / 2);
    const recentRevenue = salesData.slice(halfPoint).reduce((sum, d) => sum + d.revenue, 0);
    const previousRevenue = salesData.slice(0, halfPoint).reduce((sum, d) => sum + d.revenue, 0);
    const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
        period,
        dailyData: salesData,
        summary: {
            totalRevenue,
            totalOrders,
            totalVisitors,
            avgOrderValue: Math.round(avgOrderValue),
            conversionRate: totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0,
            revenueGrowth: revenueGrowth.toFixed(1),
        },
    };
}

/**
 * Get top products analytics
 */
export async function getTopProducts(limit = 5) {
    // Sample data - would come from API
    return [
        { id: 1, name: 'Centella Reversa Night Cream', sales: 156, revenue: 233844, trend: 'up' },
        { id: 2, name: 'Lemon Facewash', sales: 142, revenue: 56658, trend: 'up' },
        { id: 3, name: 'Skin Tint SPF 30', sales: 98, revenue: 117502, trend: 'stable' },
        { id: 4, name: 'Vitamin C Serum', sales: 87, revenue: 130413, trend: 'up' },
        { id: 5, name: 'Hydrating Moisturizer', sales: 76, revenue: 75924, trend: 'down' },
    ].slice(0, limit);
}

/**
 * Get customer analytics
 */
export async function getCustomerAnalytics() {
    return {
        totalCustomers: 2847,
        newCustomers: 234,
        returningCustomers: 156,
        customerGrowth: 12.5,
        avgLifetimeValue: 4250,
        topLocations: [
            { city: 'Mumbai', customers: 456 },
            { city: 'Delhi', customers: 389 },
            { city: 'Bangalore', customers: 312 },
            { city: 'Hyderabad', customers: 245 },
            { city: 'Chennai', customers: 198 },
        ],
        ageGroups: [
            { group: '18-24', percentage: 15 },
            { group: '25-34', percentage: 42 },
            { group: '35-44', percentage: 28 },
            { group: '45-54', percentage: 12 },
            { group: '55+', percentage: 3 },
        ],
    };
}

/**
 * Get order status distribution
 */
export async function getOrderStatusDistribution() {
    return [
        { status: 'pending', count: 12, percentage: 8 },
        { status: 'processing', count: 28, percentage: 18 },
        { status: 'shipped', count: 45, percentage: 30 },
        { status: 'delivered', count: 58, percentage: 38 },
        { status: 'cancelled', count: 7, percentage: 5 },
        { status: 'returned', count: 2, percentage: 1 },
    ];
}

/**
 * Get inventory alerts
 */
export async function getInventoryAlerts() {
    return {
        lowStock: [
            { id: 1, name: 'Vitamin C Serum', stock: 5, threshold: 10 },
            { id: 2, name: 'Night Cream 50ml', stock: 8, threshold: 15 },
        ],
        outOfStock: [
            { id: 3, name: 'Limited Edition Set', stock: 0, expectedRestock: '2026-01-10' },
        ],
        overstocked: [
            { id: 4, name: 'Summer Sunscreen', stock: 150, optimalStock: 50 },
        ],
    };
}

/**
 * Get marketing analytics
 */
export async function getMarketingAnalytics() {
    return {
        sources: [
            { source: 'Organic Search', visitors: 1245, orders: 89, revenue: 178456 },
            { source: 'Instagram', visitors: 856, orders: 56, revenue: 112340 },
            { source: 'Facebook', visitors: 432, orders: 28, revenue: 56120 },
            { source: 'Direct', visitors: 687, orders: 45, revenue: 90230 },
            { source: 'Email', visitors: 234, orders: 34, revenue: 68450 },
        ],
        campaigns: [
            { name: 'New Year Sale', impressions: 45000, clicks: 2340, orders: 156, revenue: 312450, roi: 4.2 },
            { name: 'Winter Skincare', impressions: 32000, clicks: 1560, orders: 98, revenue: 196340, roi: 3.8 },
        ],
        emailMetrics: {
            subscribers: 8456,
            openRate: 24.5,
            clickRate: 3.8,
            unsubscribeRate: 0.2,
        },
    };
}

/**
 * Get real-time stats
 */
export async function getRealTimeStats() {
    return {
        activeVisitors: Math.floor(20 + Math.random() * 30),
        cartsOpen: Math.floor(5 + Math.random() * 10),
        ordersToday: Math.floor(8 + Math.random() * 12),
        revenueToday: Math.floor(15000 + Math.random() * 25000),
        topPageNow: '/product/centella-night-cream',
    };
}

/**
 * Get performance metrics
 */
export async function getPerformanceMetrics() {
    return {
        averageLoadTime: 1.8,
        bounceRate: 42.5,
        avgSessionDuration: 245, // seconds
        pagesPerSession: 3.4,
        mobileTraffic: 68,
        cartAbandonmentRate: 72.5,
        checkoutCompletionRate: 27.5,
    };
}

/**
 * Get skin quiz analytics
 */
export async function getQuizAnalytics() {
    return {
        totalCompletions: 1234,
        completionRate: 78,
        skinTypes: [
            { type: 'Oily', count: 345, percentage: 28 },
            { type: 'Dry', count: 287, percentage: 23 },
            { type: 'Combination', count: 356, percentage: 29 },
            { type: 'Normal', count: 148, percentage: 12 },
            { type: 'Sensitive', count: 98, percentage: 8 },
        ],
        conversionAfterQuiz: 34.5,
    };
}

/**
 * Export analytics data to CSV
 */
export function exportToCSV(data, filename) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

export default {
    getSalesAnalytics,
    getTopProducts,
    getCustomerAnalytics,
    getOrderStatusDistribution,
    getInventoryAlerts,
    getMarketingAnalytics,
    getRealTimeStats,
    getPerformanceMetrics,
    getQuizAnalytics,
    exportToCSV,
};
