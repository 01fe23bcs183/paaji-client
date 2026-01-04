import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { FiPackage, FiUser, FiLogOut, FiShoppingBag } from 'react-icons/fi';

const MyAccount = () => {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
            return;
        }
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, loading, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await usersAPI.getOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="container py-xl" style={{ textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container py-xl">
            <div className="mb-xl">
                <h1 className="heading-xl mb-sm">My Account</h1>
                <p className="text-lg text-muted">Welcome back, {user?.name}! 👋</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <FiUser size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 className="heading-sm mb-xs">Profile</h3>
                    <p className="text-sm text-muted">{user?.email}</p>
                    <p className="text-sm text-muted">{user?.phone}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <FiShoppingBag size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 className="heading-sm mb-xs">Total Orders</h3>
                    <p className="heading-lg" style={{ color: 'var(--color-primary)' }}>{orders.length}</p>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <FiPackage size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 className="heading-sm mb-xs">Active Orders</h3>
                    <p className="heading-lg" style={{ color: 'var(--color-primary)' }}>
                        {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                    </p>
                </div>
            </div>

            <div className="card mb-lg">
                <h2 className="heading-lg mb-lg">Order History</h2>

                {loadingOrders ? (
                    <p className="text-center text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <FiShoppingBag size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <p className="text-lg text-muted mb-lg">No orders yet</p>
                        <Link to="/" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="card"
                                style={{
                                    padding: 'var(--spacing-lg)',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-background-alt)',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <h3 className="heading-sm mb-xs">Order #{order.orderNumber}</h3>
                                        <p className="text-sm text-muted">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className="badge"
                                        style={{
                                            background:
                                                order.status === 'delivered'
                                                    ? 'var(--color-success)'
                                                    : order.status === 'shipped'
                                                        ? 'var(--color-info)'
                                                        : order.status === 'cancelled'
                                                            ? 'var(--color-danger)'
                                                            : 'var(--color-warning)',
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                                    {order.items && order.items.slice(0, 2).map((item, idx) => (
                                        <p key={idx} className="text-sm">
                                            {item.name} {item.variant && `(${item.variant})`} × {item.quantity}
                                        </p>
                                    ))}
                                    {order.items && order.items.length > 2 && (
                                        <p className="text-sm text-muted">+ {order.items.length - 2} more items</p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                                    <div>
                                        <p className="text-sm text-muted">Total</p>
                                        <p className="heading-sm">₹{order.total}</p>
                                    </div>
                                    <Link
                                        to={`/track-order?orderId=${order.orderNumber}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Track Order
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center' }}>
                <button onClick={handleLogout} className="btn btn-outline">
                    <FiLogOut /> Logout
                </button>
            </div>
        </div>
    );
};

export default MyAccount;
