import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../services/payments';
import { FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle, FiTrendingUp, FiClock } from 'react-icons/fi';

const Dashboard = () => {
    const { products, orders, getDashboardStats, loadAdminData } = useAdmin();

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const stats = getDashboardStats();
    const recentOrders = orders.slice(0, 5);

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Dashboard</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(91, 140, 90, 0.1)', color: 'var(--color-success)' }}>
                        <FiDollarSign />
                    </div>
                    <div className="admin-stat-value">{formatCurrency(stats.totalRevenue)}</div>
                    <div className="admin-stat-label">Total Revenue</div>
                    <div className="admin-stat-change positive">
                        <FiTrendingUp size={14} /> All Time
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <FiShoppingBag />
                    </div>
                    <div className="admin-stat-value">{stats.totalOrders}</div>
                    <div className="admin-stat-label">Total Orders</div>
                    <div className="admin-stat-change">
                        {stats.pendingOrders} pending
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(139, 115, 85, 0.1)', color: 'var(--color-accent)' }}>
                        <FiPackage />
                    </div>
                    <div className="admin-stat-value">{stats.totalProducts}</div>
                    <div className="admin-stat-label">Total Products</div>
                    {stats.lowStockProducts > 0 && (
                        <div className="admin-stat-change" style={{ color: 'var(--color-warning)' }}>
                            <FiAlertCircle size={14} /> {stats.lowStockProducts} low stock
                        </div>
                    )}
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(200, 90, 84, 0.1)', color: 'var(--color-error)' }}>
                        <FiClock />
                    </div>
                    <div className="admin-stat-value">{stats.pendingOrders}</div>
                    <div className="admin-stat-label">Pending Orders</div>
                    <div className="admin-stat-change">
                        Needs attention
                    </div>
                </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-2 gap-lg mt-lg">
                {/* Recent Orders */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3 style={{ marginBottom: 0 }}>Recent Orders</h3>
                        <Link to="/admin/orders" className="btn btn-sm btn-outline">
                            View All
                        </Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="text-small" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                {order.orderNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="text-small" style={{ fontWeight: 500, marginBottom: '0.125rem' }}>
                                                    {order.customer.name}
                                                </p>
                                                <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>
                                                    {order.customer.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-small" style={{ fontWeight: 600 }}>
                                                {formatCurrency(order.total)}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: order.status === 'delivered' ? 'var(--color-success)' :
                                                        order.status === 'cancelled' ? 'var(--color-error)' :
                                                            order.status === 'shipped' ? 'var(--color-primary)' :
                                                                'var(--color-warning)',
                                                    color: 'white',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-small text-muted">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <p className="text-muted">No orders yet</p>
                        </div>
                    )}
                </div>

                {/* Low Stock Products */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3 style={{ marginBottom: 0 }}>Low Stock Alert</h3>
                        <Link to="/admin/products" className="btn btn-sm btn-outline">
                            Manage Stock
                        </Link>
                    </div>
                    {products.filter(p => p.stock < 10).length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.filter(p => p.stock < 10).map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                                    {product.images && product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', background: 'var(--color-primary)' }} />
                                                    )}
                                                </div>
                                                <span className="text-small" style={{ fontWeight: 500 }}>
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: product.stock === 0 ? 'var(--color-error)' :
                                                        product.stock < 5 ? 'var(--color-warning)' : 'var(--color-success)',
                                                    color: 'white'
                                                }}
                                            >
                                                {product.stock} left
                                            </span>
                                        </td>
                                        <td>
                                            <Link to="/admin/products" className="btn btn-sm btn-primary">
                                                Update
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <p className="text-success">✓ All products have sufficient stock</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mt-lg">
                <div className="card-header">
                    <h3 style={{ marginBottom: 0 }}>Quick Actions</h3>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-4 gap-md">
                        <Link to="/admin/products" className="card card-body text-center hover-lift" style={{ textDecoration: 'none' }}>
                            <FiPackage size={32} style={{ color: 'var(--color-primary)', margin: '0 auto var(--spacing-sm)' }} />
                            <h4 className="text-small" style={{ marginBottom: '0.25rem' }}>Add Product</h4>
                            <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>Create new product</p>
                        </Link>

                        <Link to="/admin/orders" className="card card-body text-center hover-lift" style={{ textDecoration: 'none' }}>
                            <FiShoppingBag size={32} style={{ color: 'var(--color-primary)', margin: '0 auto var(--spacing-sm)' }} />
                            <h4 className="text-small" style={{ marginBottom: '0.25rem' }}>View Orders</h4>
                            <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>Manage all orders</p>
                        </Link>

                        <Link to="/admin/coupons" className="card card-body text-center hover-lift" style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: '2rem', display: 'block', margin: '0 auto var(--spacing-sm)' }}>🎫</span>
                            <h4 className="text-small" style={{ marginBottom: '0.25rem' }}>Create Coupon</h4>
                            <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>Add discount code</p>
                        </Link>

                        <Link to="/admin/settings" className="card card-body text-center hover-lift" style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: '2rem', display: 'block', margin: '0 auto var(--spacing-sm)' }}>⚙️</span>
                            <h4 className="text-small" style={{ marginBottom: '0.25rem' }}>Settings</h4>
                            <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>Configure site</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
