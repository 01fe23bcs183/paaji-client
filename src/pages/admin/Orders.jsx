import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../services/payments';
import { FiDownload, FiEye, FiX, FiPackage } from 'react-icons/fi';

const Orders = () => {
    const { orders, editOrder, exportOrders, loadAdminData } = useAdmin();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const handleStatusChange = async (orderId, newStatus) => {
        await editOrder(orderId, { status: newStatus });
    };

    const handleExport = async () => {
        await exportOrders();
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Orders</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Orders</span>
                        </div>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={handleExport} className="btn btn-outline">
                            <FiDownload /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`btn ${filter === status ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="admin-table-container">
                {filteredOrders.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
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
                                        <span className="text-small">{order.items.length} items</span>
                                    </td>
                                    <td>
                                        <span className="text-small" style={{ fontWeight: 600 }}>
                                            {formatCurrency(order.total)}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="form-input"
                                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', minWidth: '130px' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className="text-small text-muted">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="btn btn-sm btn-outline"
                                        >
                                            <FiEye /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                        <FiPackage size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <h3>No Orders Yet</h3>
                        <p className="text-muted">Orders will appear here once customers start purchasing</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal-backdrop">
                    <div className="modal" style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Order {selectedOrder.orderNumber}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="modal-close">
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Customer Info */}
                            <div className="mb-lg">
                                <h4 className="mb-md">Customer Information</h4>
                                <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-small" style={{ marginBottom: '0.25rem' }}><strong>{selectedOrder.customer.name}</strong></p>
                                    <p className="text-small" style={{ marginBottom: '0.25rem' }}>{selectedOrder.customer.email}</p>
                                    <p className="text-small" style={{ marginBottom: '0.25rem' }}>{selectedOrder.customer.phone}</p>
                                    <p className="text-small" style={{ marginBottom: '0.25rem' }}>{selectedOrder.customer.address}</p>
                                    <p className="text-small" style={{ marginBottom: 0 }}>
                                        {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-lg">
                                <h4 className="mb-md">Order Items</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-md)',
                                            padding: 'var(--spacing-sm)',
                                            background: 'var(--color-background-alt)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--spacing-sm)'
                                        }}
                                    >
                                        <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--color-primary)' }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{item.name}</p>
                                            {item.variant && <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>{item.variant}</p>}
                                        </div>
                                        <p className="text-small" style={{ marginBottom: 0 }}>×{item.quantity}</p>
                                        <p className="text-small" style={{ fontWeight: 600, marginBottom: 0 }}>{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="mb-md">Order Summary</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-small">Subtotal</span>
                                        <span className="text-small">{formatCurrency(selectedOrder.subtotal)}</span>
                                    </div>
                                    {selectedOrder.discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                            <span className="text-small">Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                                            <span className="text-small">-{formatCurrency(selectedOrder.discount)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-small">Shipping</span>
                                        <span className="text-small">{formatCurrency(selectedOrder.shippingCost)}</span>
                                    </div>
                                    <hr style={{ margin: 'var(--spacing-sm) 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedOrder(null)} className="btn btn-outline">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
