import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatCurrency, processPayment, getAvailablePaymentMethods, generateOrderNumber, sendOrderNotifications } from '../services/payments';
import { calculateShipping } from '../services/storage';
import { FiCheck, FiCreditCard, FiTruck, FiLock } from 'react-icons/fi';
import TrustBadges from '../components/TrustBadges';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getCartTotals, clearCart, coupon } = useCart();
    const { newOrder } = useAdmin();

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Shipping Info
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    // Shipping Cost
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingDetails, setShippingDetails] = useState(null);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('');
    const availablePaymentMethods = getAvailablePaymentMethods();
    const { pincode } = shippingInfo;

    const handleCalculateShipping = useCallback(async (pincode) => {
        try {
            const result = await calculateShipping(pincode);
            setShippingCost(result.rate);
            setShippingDetails(result);
        } catch (error) {
            console.error('Error calculating shipping:', error);
            setShippingCost(100); // Default shipping
            setShippingDetails({ rate: 100, deliveryDays: '5-7', zoneName: 'Standard' });
        }
    }, []);

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    useEffect(() => {
        // Calculate shipping when pincode is entered
        if (pincode && pincode.length === 6) {
            handleCalculateShipping(pincode);
        }
    }, [handleCalculateShipping, pincode]);

    const totals = getCartTotals();
    const finalTotal = totals.total + shippingCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const validateShippingInfo = () => {
        const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        for (const field of required) {
            if (!shippingInfo[field] || !shippingInfo[field].trim()) {
                setError(`Please fill in ${field}`);
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingInfo.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Validate phone
        if (shippingInfo.phone.length < 10) {
            setError('Please enter a valid phone number');
            return false;
        }

        // Validate pincode
        if (shippingInfo.pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        setError('');

        if (step === 1) {
            if (!validateShippingInfo()) return;
            setStep(2);
        } else if (step === 2) {
            if (!paymentMethod) {
                setError('Please select a payment method');
                return;
            }
            setStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Create order data
            const orderNumber = generateOrderNumber();
            const orderData = {
                orderNumber,
                customer: shippingInfo,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    variant: item.variant?.name || null,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                subtotal: totals.subtotal,
                discount: totals.discount,
                shippingCost,
                total: finalTotal,
                couponCode: coupon?.code || null,
                paymentMethod,
                shippingDetails,
                status: 'pending',
            };

            // Process payment
            let paymentResult;
            if (paymentMethod === 'cod') {
                paymentResult = { success: true, paymentId: 'COD', message: 'Cash on Delivery' };
            } else {
                paymentResult = await processPayment(paymentMethod, {
                    ...orderData,
                    orderId: orderNumber,
                });
            }

            if (!paymentResult.success) {
                throw new Error(paymentResult.message || 'Payment failed');
            }

            // Save order
            const savedOrder = await newOrder({
                ...orderData,
                paymentId: paymentResult.paymentId,
                status: paymentMethod === 'cod' ? 'pending' : 'paid',
            });

            if (!savedOrder.success) {
                throw new Error('Failed to save order');
            }

            // Send notifications
            await sendOrderNotifications(savedOrder.order);

            // Clear cart
            clearCart();

            // Redirect to success page
            navigate(`/order-success?orderId=${orderNumber}`);
        } catch (err) {
            console.error('Order placement error:', err);
            setError(err.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="section" style={{ paddingTop: '100px', backgroundColor: 'var(--color-background-alt)' }}>
            <div className="container">
                {/* Progress Steps */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', maxWidth: '600px', margin: '0 auto' }}>
                        {[
                            { num: 1, label: 'Shipping' },
                            { num: 2, label: 'Payment' },
                            { num: 3, label: 'Review' },
                        ].map(({ num, label }) => (
                            <div key={num} style={{ flex: 1, textAlign: 'center' }}>
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        margin: '0 auto var(--spacing-sm)',
                                        borderRadius: '50%',
                                        backgroundColor: step >= num ? 'var(--color-primary)' : 'var(--color-background)',
                                        color: step >= num ? 'white' : 'var(--color-text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem',
                                        border: step >= num ? 'none' : '2px solid var(--color-border)',
                                    }}
                                >
                                    {step > num ? <FiCheck /> : num}
                                </div>
                                <p className="text-small" style={{ marginBottom: 0, fontWeight: step === num ? 600 : 400 }}>
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-xl">
                    {/* Main Form */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div className="card">
                            <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                                {error && (
                                    <div className="admin-alert admin-alert-error mb-lg">
                                        {error}
                                    </div>
                                )}

                                {/* Step 1: Shipping Information */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="mb-lg">
                                            <FiTruck /> Shipping Information
                                        </h2>

                                        <div className="admin-form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-input"
                                                    value={shippingInfo.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-input"
                                                    value={shippingInfo.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="form-input"
                                                    value={shippingInfo.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Address *</label>
                                            <textarea
                                                name="address"
                                                className="form-textarea"
                                                value={shippingInfo.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="admin-form-grid">
                                            <div className="form-group">
                                                <label className="form-label">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    className="form-input"
                                                    value={shippingInfo.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">State *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    className="form-input"
                                                    value={shippingInfo.state}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Pincode *</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    className="form-input"
                                                    value={shippingInfo.pincode}
                                                    onChange={handleInputChange}
                                                    maxLength={6}
                                                    required
                                                />
                                                {shippingDetails && (
                                                    <p className="text-small mt-xs" style={{ color: 'var(--color-success)' }}>
                                                        ✓ Delivery in {shippingDetails.deliveryDays} days
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment Method */}
                                {step === 2 && (
                                    <div>
                                        <h2 className="mb-lg">
                                            <FiCreditCard /> Payment Method
                                        </h2>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                            {availablePaymentMethods.map(method => (
                                                <label
                                                    key={method.id}
                                                    className="card"
                                                    style={{
                                                        cursor: 'pointer',
                                                        border: paymentMethod === method.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                                    }}
                                                >
                                                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={method.id}
                                                            checked={paymentMethod === method.id}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <h4 style={{ marginBottom: '0.25rem' }}>{method.name}</h4>
                                                            <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                                                {method.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="mt-lg" style={{ padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <FiLock style={{ color: 'var(--color-success)' }} />
                                            <span className="text-small">Your payment information is secure and encrypted</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review Order */}
                                {step === 3 && (
                                    <div>
                                        <h2 className="mb-lg">Review Your Order</h2>

                                        {/* Shipping Info Review */}
                                        <div className="mb-lg">
                                            <h4 className="mb-md">Shipping Address</h4>
                                            <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                                                <p className="text-small" style={{ marginBottom: '0.25rem' }}><strong>{shippingInfo.name}</strong></p>
                                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{shippingInfo.email}</p>
                                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{shippingInfo.phone}</p>
                                                <p className="text-small" style={{ marginBottom: '0.25rem' }}>{shippingInfo.address}</p>
                                                <p className="text-small" style={{ marginBottom: 0 }}>
                                                    {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items Review */}
                                        <div className="mb-lg">
                                            <h4 className="mb-md">Order Items</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                                {items.map((item) => (
                                                    <div
                                                        key={`${item.id}-${item.variant?.name || 'default'}`}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--spacing-md)',
                                                            padding: 'var(--spacing-sm)',
                                                            background: 'var(--color-background-alt)',
                                                            borderRadius: 'var(--radius-md)',
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
                                                            {item.variant && <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>{item.variant.name}</p>}
                                                        </div>
                                                        <p className="text-small" style={{ marginBottom: 0 }}>Qty: {item.quantity}</p>
                                                        <p className="text-small" style={{ fontWeight: 600, marginBottom: 0 }}>{formatCurrency(item.price * item.quantity)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment Method Review */}
                                        <div>
                                            <h4 className="mb-md">Payment Method</h4>
                                            <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                                                <p className="text-small" style={{ marginBottom: 0 }}>
                                                    {availablePaymentMethods.find(m => m.id === paymentMethod)?.name || paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                                    {step > 1 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="btn btn-outline"
                                            disabled={loading}
                                        >
                                            Back
                                        </button>
                                    )}
                                    {step < 3 ? (
                                        <button
                                            onClick={handleNextStep}
                                            className="btn btn-primary"
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="btn btn-primary btn-lg"
                                            style={{ marginLeft: 'auto' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : `Place Order - ${formatCurrency(finalTotal)}`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '100px' }}>
                            <div className="card-header">
                                <h3 style={{ marginBottom: 0 }}>Order Summary</h3>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted text-small">Subtotal ({items.length} items)</span>
                                        <span className="text-small">{formatCurrency(totals.subtotal)}</span>
                                    </div>

                                    {totals.discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                            <span className="text-small">Discount</span>
                                            <span className="text-small">-{formatCurrency(totals.discount)}</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted text-small">Shipping</span>
                                        <span className="text-small">{shippingCost > 0 ? formatCurrency(shippingCost) : 'TBD'}</span>
                                    </div>

                                    <hr style={{ margin: 'var(--spacing-sm) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="card mt-lg">
                            <div className="card-body">
                                <TrustBadges variant="vertical" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
