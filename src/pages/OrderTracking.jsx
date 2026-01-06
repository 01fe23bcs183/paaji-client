import { useState } from 'react';
import { getOrderByNumber } from '../services/customerAPI';
import { formatCurrency } from '../services/payments';
import { FiCheck, FiSearch } from 'react-icons/fi';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const found = await getOrderByNumber(orderId.trim().toUpperCase());

            if (found) {
                setOrder(found);
            } else {
                setError('Order not found. Please check your order ID and try again.');
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Failed to track order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'var(--color-warning)',
            processing: 'var(--color-primary)',
            shipped: 'var(--color-primary)',
            delivered: 'var(--color-success)',
            cancelled: 'var(--color-error)',
        };
        return colors[status] || 'var(--color-text-muted)';
    };

    const statusSteps = [
        { id: 'pending', label: 'Order Placed' },
        { id: 'processing', label: 'Processing' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'delivered', label: 'Delivered' },
    ];

    const getCurrentStepIndex = (status) => {
        return statusSteps.findIndex(step => step.id === status);
    };

    return (
        <div className="section" style={{ paddingTop: '100px', minHeight: '70vh' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="text-center mb-xl">
                    <h1>Track Your Order</h1>
                    <p className="text-large text-muted">
                        Enter your order ID to see the latest updates
                    </p>
                </div>

                {/* Search Form */}
                <div className="card mb-xl">
                    <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                        <form onSubmit={handleTrack}>
                            <div className="form-group">
                                <label className="form-label">Order ID</label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter your order ID (e.g., JMC-ABC123-XY45)"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !orderId.trim()}
                                    >
                                        <FiSearch /> {loading ? 'Searching...' : 'Track'}
                                    </button>
                                </div>
                                {error && <p className="form-error">{error}</p>}
                                <p className="text-small text-muted mt-xs">
                                    You can find your order ID in the confirmation email
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="fade-in">
                        {/* Order Status Timeline */}
                        <div className="card mb-md">
                            <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                        <h3>Order {order.orderNumber}</h3>
                                        <span
                                            className="badge"
                                            style={{ backgroundColor: getStatusColor(order.status), color: 'white', textTransform: 'capitalize' }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-small text-muted">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Status Timeline */}
                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                    {statusSteps.map((step, index) => {
                                        const isCompleted = getCurrentStepIndex(order.status) >= index;
                                        const isCurrent = order.status === step.id;

                                        return (
                                            <div key={step.id} style={{ position: 'relative', paddingBottom: index < statusSteps.length - 1 ? 'var(--spacing-xl)' : 0 }}>
                                                {/* Connector Line */}
                                                {index < statusSteps.length - 1 && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            left: '-1.25rem',
                                                            top: '2rem',
                                                            width: '2px',
                                                            height: 'calc(100% - 1rem)',
                                                            backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                                                        }}
                                                    />
                                                )}

                                                {/* Status Dot */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: '-1.75rem',
                                                        top: '0.375rem',
                                                        width: '1.5rem',
                                                        height: '1.5rem',
                                                        borderRadius: '50%',
                                                        backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-background)',
                                                        border: `2px solid ${isCompleted ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {isCompleted && <FiCheck />}
                                                </div>

                                                {/* Status Label */}
                                                <div>
                                                    <p
                                                        className="text-small"
                                                        style={{
                                                            fontWeight: isCurrent ? 600 : 400,
                                                            color: isCompleted ? 'var(--color-text)' : 'var(--color-text-muted)',
                                                            marginBottom: '0.25rem'
                                                        }}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-tiny" style={{ color: 'var(--color-primary)', marginBottom: 0 }}>
                                                            Current Status
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Delivery Estimate */}
                                {order.shippingDetails && (
                                    <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                                        <p className="text-small" style={{ marginBottom: '0.25rem' }}>
                                            <strong>Estimated Delivery:</strong> {order.shippingDetails.deliveryDays} days
                                        </p>
                                        <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                            Zone: {order.shippingDetails.zoneName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="card mb-md">
                            <div className="card-header">
                                <h4 style={{ marginBottom: 0 }}>Shipping Address</h4>
                            </div>
                            <div className="card-body">
                                <p className="text-small" style={{ marginBottom: '0.25rem' }}><strong>{order.customer.name}</strong></p>
                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{order.customer.email}</p>
                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{order.customer.phone}</p>
                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{order.customer.address}</p>
                                <p className="text-small" style={{ marginBottom: 0 }}>
                                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="card mb-md">
                            <div className="card-header">
                                <h4 style={{ marginBottom: 0 }}>Order Items</h4>
                            </div>
                            <div className="card-body" style={{ padding: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-md)',
                                                padding: 'var(--spacing-md) var(--spacing-lg)',
                                                borderBottom: index < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                                            }}
                                        >
                                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: 'var(--color-primary)' }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</p>
                                                {item.variant && <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>{item.variant}</p>}
                                            </div>
                                            <p className="text-small" style={{ marginBottom: 0 }}>Qty: {item.quantity}</p>
                                            <p className="text-small" style={{ fontWeight: 600, marginBottom: 0 }}>{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="card">
                            <div className="card-header">
                                <h4 style={{ marginBottom: 0 }}>Order Summary</h4>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-small text-muted">Subtotal</span>
                                        <span className="text-small">{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                            <span className="text-small">Discount {order.couponCode && `(${order.couponCode})`}</span>
                                            <span className="text-small">-{formatCurrency(order.discount)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-small text-muted">Shipping</span>
                                        <span className="text-small">{formatCurrency(order.shippingCost)}</span>
                                    </div>
                                    <hr style={{ margin: 'var(--spacing-sm) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
