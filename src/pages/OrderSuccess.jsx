import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheck, FiPackage, FiMail } from 'react-icons/fi';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setTimeout(() => setShowConfetti(false), 3000);
    }, []);

    return (
        <div className="section" style={{ paddingTop: '100px', minHeight: '70vh', backgroundColor: 'var(--color-background-alt)' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card text-center">
                    <div className="card-body" style={{ padding: 'var(--spacing-2xl)' }}>
                        {/* Success Icon */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto var(--spacing-lg)',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2.5rem',
                                animation: showConfetti ? 'scaleIn 0.5s ease-out' : 'none'
                            }}
                        >
                            <FiCheck />
                        </div>

                        <h1 className="mb-sm" style={{ color: 'var(--color-success)' }}>
                            Order Placed Successfully!
                        </h1>

                        {orderId && (
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <p className="text-muted mb-xs">Your Order ID</p>
                                <p className="text-large" style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    {orderId}
                                </p>
                            </div>
                        )}

                        <p className="text-large mb-xl">
                            Thank you for your order! We've sent a confirmation email with your order details.
                        </p>

                        {/* Info Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', textAlign: 'left' }}>
                            <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                    <FiMail />
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Confirmation Email Sent
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Check your inbox for order details and tracking information
                                    </p>
                                </div>
                            </div>

                            <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                    <FiPackage />
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Order Processing
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        We'll start processing your order right away. You'll receive shipping updates via email.
                                    </p>
                                </div>
                            </div>

                            <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ fontSize: '1.5rem' }}>💬</div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Need Help?
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Contact us anytime if you have questions about your order
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {orderId && (
                                <Link to="/track-order" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                                    Track My Order
                                </Link>
                            )}
                            <Link to="/" className="btn btn-outline btn-lg" style={{ justifyContent: 'center' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="card mt-lg">
                    <div className="card-header">
                        <h3 style={{ marginBottom: 0 }}>What Happens Next?</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    flexShrink: 0
                                }}>
                                    1
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Order Confirmation
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        You'll receive an email confirmation with your order details
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    flexShrink: 0
                                }}>
                                    2
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Order Processing
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        We'll carefully pack your items for shipping
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    flexShrink: 0
                                }}>
                                    3
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Shipping Updates
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Track your package with the tracking number we'll send you
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem',
                                    flexShrink: 0
                                }}>
                                    4
                                </div>
                                <div>
                                    <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Delivery
                                    </p>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Your order will be delivered to your doorstep!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
