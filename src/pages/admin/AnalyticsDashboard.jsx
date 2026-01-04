import { useState, useEffect } from 'react';
import {
    FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp,
    FiPackage, FiAlertCircle, FiDownload, FiRefreshCw,
    FiActivity, FiPieChart, FiBarChart2, FiEye
} from 'react-icons/fi';
import {
    getSalesAnalytics,
    getTopProducts,
    getCustomerAnalytics,
    getOrderStatusDistribution,
    getInventoryAlerts,
    getRealTimeStats,
    getPerformanceMetrics,
    getQuizAnalytics,
    exportToCSV,
} from '../../services/analytics';

const AnalyticsDashboard = () => {
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [orderStatus, setOrderStatus] = useState([]);
    const [inventory, setInventory] = useState(null);
    const [realTime, setRealTime] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, [period]);

    // Real-time updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            const stats = await getRealTimeStats();
            setRealTime(stats);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [sales, products, customers, orders, inv, rt, perf, quiz] = await Promise.all([
                getSalesAnalytics(period),
                getTopProducts(5),
                getCustomerAnalytics(),
                getOrderStatusDistribution(),
                getInventoryAlerts(),
                getRealTimeStats(),
                getPerformanceMetrics(),
                getQuizAnalytics(),
            ]);

            setSalesData(sales);
            setTopProducts(products);
            setCustomerData(customers);
            setOrderStatus(orders);
            setInventory(inv);
            setRealTime(rt);
            setPerformance(perf);
            setQuizData(quiz);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
        setLoading(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const StatCard = ({ icon: Icon, label, value, subValue, trend, color = 'primary' }) => (
        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{label}</p>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{value}</h3>
                    {subValue && (
                        <p style={{
                            color: trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-error)' : 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {subValue}
                        </p>
                    )}
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: `var(--color-${color}-light, rgba(196, 167, 125, 0.1))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={24} color={`var(--color-${color})`} />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Analytics Dashboard</h1>
                </div>
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-md)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: '4px' }}>Analytics Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Track your store performance</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="form-select"
                        style={{ minWidth: '120px' }}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button onClick={loadAnalytics} className="btn btn-outline">
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                    <button
                        onClick={() => exportToCSV(salesData?.dailyData || [], 'sales_report')}
                        className="btn btn-primary"
                    >
                        <FiDownload size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Real-time Stats Bar */}
            {realTime && (
                <div className="card" style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    marginBottom: 'var(--spacing-lg)',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    color: 'white',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: '#22c55e', animation: 'pulse 2s infinite'
                            }} />
                            <span style={{ fontWeight: '600' }}>Live</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
                            <div>
                                <span style={{ opacity: 0.8, marginRight: '8px' }}>Active Visitors:</span>
                                <strong>{realTime.activeVisitors}</strong>
                            </div>
                            <div>
                                <span style={{ opacity: 0.8, marginRight: '8px' }}>Open Carts:</span>
                                <strong>{realTime.cartsOpen}</strong>
                            </div>
                            <div>
                                <span style={{ opacity: 0.8, marginRight: '8px' }}>Orders Today:</span>
                                <strong>{realTime.ordersToday}</strong>
                            </div>
                            <div>
                                <span style={{ opacity: 0.8, marginRight: '8px' }}>Revenue Today:</span>
                                <strong>{formatCurrency(realTime.revenueToday)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <StatCard
                    icon={FiDollarSign}
                    label="Total Revenue"
                    value={formatCurrency(salesData?.summary?.totalRevenue || 0)}
                    subValue={`${salesData?.summary?.revenueGrowth || 0}% vs prev period`}
                    trend={parseFloat(salesData?.summary?.revenueGrowth) > 0 ? 'up' : 'down'}
                />
                <StatCard
                    icon={FiShoppingCart}
                    label="Total Orders"
                    value={salesData?.summary?.totalOrders || 0}
                    subValue={`Avg: ${formatCurrency(salesData?.summary?.avgOrderValue || 0)}`}
                />
                <StatCard
                    icon={FiUsers}
                    label="Total Visitors"
                    value={salesData?.summary?.totalVisitors?.toLocaleString() || 0}
                    subValue={`${salesData?.summary?.conversionRate || 0}% conversion`}
                    trend="stable"
                />
                <StatCard
                    icon={FiTrendingUp}
                    label="New Customers"
                    value={customerData?.newCustomers || 0}
                    subValue={`+${customerData?.customerGrowth || 0}% growth`}
                    trend="up"
                />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                {/* Sales Chart */}
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiBarChart2 /> Revenue Trend
                        </h3>
                    </div>
                    <div className="card-body">
                        <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: 'var(--spacing-md) 0' }}>
                            {salesData?.dailyData?.slice(-14).map((day, i) => {
                                const maxRevenue = Math.max(...salesData.dailyData.map(d => d.revenue));
                                const height = (day.revenue / maxRevenue) * 200;
                                return (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: `${height}px`,
                                                background: 'linear-gradient(to top, var(--color-primary), var(--color-accent))',
                                                borderRadius: '4px 4px 0 0',
                                                minHeight: '20px',
                                            }}
                                            title={`${day.date}: ${formatCurrency(day.revenue)}`}
                                        />
                                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Status */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiPieChart /> Order Status
                        </h3>
                    </div>
                    <div className="card-body">
                        {orderStatus.map((status, i) => (
                            <div key={i} style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{status.status}</span>
                                    <span style={{ fontWeight: '600' }}>{status.count}</span>
                                </div>
                                <div style={{
                                    height: '8px',
                                    background: 'var(--color-border)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${status.percentage}%`,
                                        background: status.status === 'delivered' ? 'var(--color-success)' :
                                            status.status === 'cancelled' ? 'var(--color-error)' :
                                                status.status === 'shipped' ? 'var(--color-primary)' :
                                                    'var(--color-accent)',
                                        borderRadius: '4px',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products & Customers Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                {/* Top Products */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiPackage /> Top Products
                        </h3>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Product</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Sales</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>Revenue</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{product.name}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>{product.sales}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>{formatCurrency(product.revenue)}</td>
                                        <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                                            <span style={{
                                                color: product.trend === 'up' ? 'var(--color-success)' :
                                                    product.trend === 'down' ? 'var(--color-error)' : 'var(--color-text-muted)'
                                            }}>
                                                {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Demographics */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiUsers /> Customer Insights
                        </h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ background: 'var(--color-background-alt)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{customerData?.totalCustomers?.toLocaleString()}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Customers</div>
                            </div>
                            <div style={{ background: 'var(--color-background-alt)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{formatCurrency(customerData?.avgLifetimeValue || 0)}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Avg. Lifetime Value</div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)' }}>Top Cities</h4>
                        {customerData?.topLocations?.slice(0, 3).map((loc, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{loc.city}</span>
                                <span style={{ fontWeight: '600' }}>{loc.customers}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance & Alerts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Performance Metrics */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiActivity /> Performance
                        </h3>
                    </div>
                    <div className="card-body">
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Bounce Rate</span>
                                <span style={{ fontWeight: '600' }}>{performance?.bounceRate}%</span>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Avg. Session</span>
                                <span style={{ fontWeight: '600' }}>{Math.floor((performance?.avgSessionDuration || 0) / 60)}m {(performance?.avgSessionDuration || 0) % 60}s</span>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Pages/Session</span>
                                <span style={{ fontWeight: '600' }}>{performance?.pagesPerSession}</span>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Mobile Traffic</span>
                                <span style={{ fontWeight: '600' }}>{performance?.mobileTraffic}%</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Cart Abandonment</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-error)' }}>{performance?.cartAbandonmentRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skin Quiz Stats */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiEye /> Skin Quiz
                        </h3>
                    </div>
                    <div className="card-body">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>{quizData?.totalCompletions}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Quiz Completions</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                            <span>Completion Rate</span>
                            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{quizData?.completionRate}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Conversion After Quiz</span>
                            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{quizData?.conversionAfterQuiz}%</span>
                        </div>
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <FiAlertCircle /> Inventory Alerts
                        </h3>
                    </div>
                    <div className="card-body">
                        {inventory?.lowStock?.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-warning)',
                                    fontWeight: '600',
                                    marginBottom: '4px',
                                }}>⚠️ LOW STOCK</div>
                                {inventory.lowStock.map((item, i) => (
                                    <div key={i} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                        {item.name} ({item.stock} left)
                                    </div>
                                ))}
                            </div>
                        )}
                        {inventory?.outOfStock?.length > 0 && (
                            <div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-error)',
                                    fontWeight: '600',
                                    marginBottom: '4px',
                                }}>❌ OUT OF STOCK</div>
                                {inventory.outOfStock.map((item, i) => (
                                    <div key={i} style={{ fontSize: '0.9rem' }}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {(!inventory?.lowStock?.length && !inventory?.outOfStock?.length) && (
                            <div style={{ textAlign: 'center', color: 'var(--color-success)' }}>
                                ✓ All inventory levels healthy
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
            </style>
        </div>
    );
};

export default AnalyticsDashboard;
