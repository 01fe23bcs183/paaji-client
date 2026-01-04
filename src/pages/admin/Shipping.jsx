import { useState, useEffect } from 'react';
import {
    FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiAlertCircle,
    FiDownload, FiPrinter, FiRefreshCw, FiSearch, FiFilter,
    FiClock, FiXCircle, FiNavigation, FiExternalLink
} from 'react-icons/fi';

const ShiprocketPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingData, setTrackingData] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock orders for demo - replace with real API call
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders?status=processing');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Demo data
            setOrders([
                {
                    id: 'ORD-001',
                    customer: 'Priya Sharma',
                    address: 'Mumbai, MH 400001',
                    status: 'pending',
                    amount: 2499,
                    items: 3,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'ORD-002',
                    customer: 'Rahul Verma',
                    address: 'Delhi, DL 110001',
                    status: 'shipped',
                    awbCode: 'SR123456789',
                    amount: 1899,
                    items: 2,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const createShipment = async (orderId) => {
        try {
            const response = await fetch('/api/shiprocket/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Shipment created! Order ID: ${result.shiprocketOrderId}`);
                fetchOrders();
            }
        } catch (error) {
            alert('Failed to create shipment: ' + error.message);
        }
    };

    const trackShipment = async (awbCode) => {
        try {
            const response = await fetch(`/api/shiprocket/track/${awbCode}`);
            if (response.ok) {
                const data = await response.json();
                setTrackingData(data);
            }
        } catch (error) {
            console.error('Failed to track shipment:', error);
        }
    };

    const downloadLabel = async (shipmentId) => {
        try {
            const response = await fetch(`/api/shiprocket/label/${shipmentId}`);
            if (response.ok) {
                const data = await response.json();
                window.open(data.labelUrl, '_blank');
            }
        } catch (error) {
            alert('Failed to download label');
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <FiClock className="text-warning" />,
            processing: <FiRefreshCw className="text-info" />,
            shipped: <FiTruck className="text-primary" />,
            delivered: <FiCheckCircle className="text-success" />,
            cancelled: <FiXCircle className="text-error" />,
        };
        return icons[status] || <FiPackage />;
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            processing: 'badge-secondary',
            shipped: 'badge-success',
            delivered: 'badge-success',
            cancelled: 'badge-error',
        };
        return badges[status] || 'badge-secondary';
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Shipping Management</h1>
                    <p className="admin-subtitle">Manage orders and shipments with Shiprocket</p>
                </div>
                <button className="btn btn-primary" onClick={fetchOrders}>
                    <FiRefreshCw /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                        <FiClock />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {orders.filter(o => o.status === 'pending').length}
                        </span>
                        <span className="admin-stat-label">Pending Shipments</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <FiTruck />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {orders.filter(o => o.status === 'shipped').length}
                        </span>
                        <span className="admin-stat-label">In Transit</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                        <FiCheckCircle />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {orders.filter(o => o.status === 'delivered').length}
                        </span>
                        <span className="admin-stat-label">Delivered</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                        <FiAlertCircle />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">0</span>
                        <span className="admin-stat-label">NDR Issues</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-card-body" style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#F8FAFC',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        flex: '1',
                        maxWidth: '400px',
                    }}>
                        <FiSearch size={18} color="#64748B" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                flex: 1,
                                fontSize: '0.9375rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['all', 'pending', 'shipped', 'delivered'].map(status => (
                            <button
                                key={status}
                                className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(status)}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Destination</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>AWB</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders
                                .filter(o => filter === 'all' || o.status === filter)
                                .filter(o =>
                                    searchQuery === '' ||
                                    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                                {order.id}
                                            </span>
                                        </td>
                                        <td>{order.customer}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FiMapPin size={14} color="#64748B" />
                                                {order.address}
                                            </div>
                                        </td>
                                        <td>{order.items} items</td>
                                        <td style={{ fontWeight: '600' }}>₹{order.amount.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span style={{ marginLeft: '0.25rem', textTransform: 'capitalize' }}>
                                                    {order.status}
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            {order.awbCode ? (
                                                <code style={{
                                                    background: '#F1F5F9',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8125rem',
                                                }}>
                                                    {order.awbCode}
                                                </code>
                                            ) : (
                                                <span style={{ color: '#9CA3AF' }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {order.status === 'pending' && (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                                                        onClick={() => createShipment(order.id)}
                                                    >
                                                        <FiTruck size={14} /> Ship
                                                    </button>
                                                )}
                                                {order.awbCode && (
                                                    <>
                                                        <button
                                                            className="btn-icon-sm"
                                                            title="Track"
                                                            onClick={() => trackShipment(order.awbCode)}
                                                        >
                                                            <FiNavigation size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-icon-sm"
                                                            title="Download Label"
                                                            onClick={() => downloadLabel(order.shipmentId)}
                                                        >
                                                            <FiDownload size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-icon-sm"
                                                            title="Print Invoice"
                                                        >
                                                            <FiPrinter size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tracking Modal */}
            {trackingData && (
                <div className="modal-overlay" onClick={() => setTrackingData(null)}>
                    <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Shipment Tracking</h3>
                            <button className="modal-close" onClick={() => setTrackingData(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>
                                        AWB Code
                                    </div>
                                    <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                        {trackingData.awbCode}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>
                                        Courier
                                    </div>
                                    <div style={{ fontWeight: '600' }}>{trackingData.courierName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>
                                        Status
                                    </div>
                                    <div className={`badge ${getStatusBadge(trackingData.currentStatus?.toLowerCase())}`}>
                                        {trackingData.currentStatus}
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '1rem' }}>Tracking History</h4>
                            <div style={{
                                borderLeft: '2px solid #E2E8F0',
                                paddingLeft: '1.5rem',
                                marginLeft: '0.5rem',
                            }}>
                                {trackingData.trackingHistory?.map((event, index) => (
                                    <div key={index} style={{
                                        position: 'relative',
                                        paddingBottom: '1.5rem',
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '-1.875rem',
                                            top: '0.25rem',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: index === 0 ? '#22C55E' : '#E2E8F0',
                                            border: '2px solid white',
                                        }} />
                                        <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                                            {event.date} • {event.time}
                                        </div>
                                        <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>
                                            {event.status}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                                            {event.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiprocketPanel;
