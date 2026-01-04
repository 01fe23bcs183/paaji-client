import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FiXCircle, FiCalendar, FiDollarSign, FiUser } from 'react-icons/fi';

const CancelledOrders = () => {
    const { getAllOrders } = useAdmin();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCancelledOrders();
    }, []);

    const loadCancelledOrders = () => {
        const allOrders = getAllOrders();
        const cancelled = allOrders.filter(order => order.status === 'cancelled');
        setOrders(cancelled);
        setLoading(false);
    };

    if (loading) {
        return (
            <div>
                <div className="admin-header">
                    <h1 className="admin-page-title">Cancelled Orders</h1>
                </div>
                <p className="text-center text-muted">Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Cancelled Orders</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Cancelled Orders</span>
                        </div>
                    </div>
                    <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon" style={{ background: 'var(--color-danger-light)' }}>
                                <FiXCircle style={{ color: 'var(--color-danger)' }} />
                            </div>
                            <div>
                                <div className="admin-stat-value">{orders.length}</div>
                                <div className="admin-stat-label">Total Cancelled</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon" style={{ background: 'var(--color-danger-light)' }}>
                                <FiDollarSign style={{ color: 'var(--color-danger)' }} />
                            </div>
                            <div>
                                <div className="admin-stat-value">
                                    ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                                </div>
                                <div className="admin-stat-label">Lost Revenue</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
                        <FiXCircle size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <h3 className="heading-md mb-sm">No Cancelled Orders</h3>
                        <p className="text-muted">All orders are active</p>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment Method</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="admin-badge admin-badge-danger">{order.orderNumber}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="admin-table-name">{order.customer?.name || 'N/A'}</div>
                                                <div className="admin-table-meta">{order.customer?.email || ''}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-table-date">
                                                <FiCalendar size={14} />
                                                {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {order.items?.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="admin-table-meta">
                                                        {item.name} × {item.quantity}
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <div className="admin-table-meta">
                                                        +{order.items.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-table-price">₹{order.total?.toFixed(2) || '0.00'}</span>
                                        </td>
                                        <td>
                                            <span className="text-capitalize">{order.paymentMethod || 'N/A'}</span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-muted">
                                                {order.cancellationReason || 'Customer request'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {orders.length > 0 && (
                <div className="admin-card mt-lg">
                    <h3 className="heading-md mb-md">Cancellation Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <p className="text-sm text-muted mb-xs">Average Order Value</p>
                            <p className="heading-sm">
                                ₹{(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted mb-xs">Most Common Payment</p>
                            <p className="heading-sm text-capitalize">
                                {orders.reduce((acc, order) => {
                                    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                                    return acc;
                                }, {})}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted mb-xs">This Month</p>
                            <p className="heading-sm">
                                {orders.filter(o => {
                                    const orderDate = new Date(o.createdAt);
                                    const now = new Date();
                                    return orderDate.getMonth() === now.getMonth() &&
                                        orderDate.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancelledOrders;
