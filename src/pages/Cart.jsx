import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../services/payments';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { useState } from 'react';
import CartUpsell from '../components/CartUpsell';

const Cart = () => {
    const {
        items,
        coupon,
        removeItem,
        updateQuantity,
        getCartTotals,
        applyCoupon,
        removeCoupon,
    } = useCart();

    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
    const [applying, setApplying] = useState(false);

    const totals = getCartTotals();

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setApplying(true);
        setCouponMessage({ type: '', text: '' });

        const result = await applyCoupon(couponCode);

        if (result.success) {
            setCouponMessage({ type: 'success', text: result.message });
            setCouponCode('');
        } else {
            setCouponMessage({ type: 'error', text: result.message });
        }

        setApplying(false);
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponMessage({ type: '', text: '' });
    };

    if (items.length === 0) {
        return (
            <div className="section" style={{ paddingTop: '100px', minHeight: '60vh' }}>
                <div className="container text-center">
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
                    <h2>Your Cart is Empty</h2>
                    <p className="text-large text-muted mb-lg">
                        Add some products to get started
                    </p>
                    <Link to="/" className="btn btn-primary btn-lg">
                        <FiShoppingBag /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section" style={{ paddingTop: '100px' }}>
            <div className="container">
                <h1 className="mb-xl">Shopping Cart</h1>

                <div className="grid grid-cols-3 gap-xl">
                    {/* Cart Items */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {items.map((item) => (
                                <div key={`${item.id}-${item.variant?.name || 'default'}`} className="cart-item">
                                    <div className="cart-item-image">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        {item.variant && (
                                            <p className="cart-item-variant">Variant: {item.variant.name}</p>
                                        )}
                                        <p className="text-muted text-small">
                                            {formatCurrency(item.price)} each
                                        </p>

                                        <div className="cart-item-actions">
                                            <div className="cart-item-quantity">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?.name)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FiMinus size={16} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.name)}
                                                    disabled={item.quantity >= (item.stock || 999)}
                                                >
                                                    <FiPlus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id, item.variant?.name)}
                                                className="cart-item-remove"
                                            >
                                                <FiTrash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-price">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upsell Section */}
                        <div className="card mt-lg">
                            <div className="card-body">
                                <CartUpsell cartTotal={totals.total} />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '100px' }}>
                            <div className="card-header">
                                <h3 style={{ marginBottom: 0 }}>Order Summary</h3>
                            </div>
                            <div className="card-body">
                                {/* Coupon Code */}
                                <div className="form-group">
                                    <label className="form-label">
                                        <FiTag /> Have a coupon?
                                    </label>
                                    {!coupon ? (
                                        <>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Enter code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    className="btn btn-outline btn-sm"
                                                    disabled={applying || !couponCode.trim()}
                                                >
                                                    {applying ? 'Applying...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponMessage.text && (
                                                <p className={`text-small mt-xs ${couponMessage.type === 'success' ? 'text-primary' : 'text-error'}`}>
                                                    {couponMessage.text}
                                                </p>
                                            )}
                                            <p className="text-tiny text-muted mt-xs">
                                                Try: WELCOME10 for 10% off
                                            </p>
                                        </>
                                    ) : (
                                        <div style={{
                                            padding: 'var(--spacing-sm)',
                                            background: 'var(--color-background-alt)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div>
                                                <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                    {coupon.code}
                                                </p>
                                                <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>
                                                    {coupon.type === 'percentage' ? `${coupon.value}% off` : formatCurrency(coupon.value)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="btn btn-ghost btn-sm btn-icon"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

                                {/* Totals */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted">Subtotal</span>
                                        <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                                    </div>

                                    {totals.discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                            <span>Discount</span>
                                            <span>-{formatCurrency(totals.discount)}</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-muted">Shipping</span>
                                        <span className="text-muted text-small">Calculated at checkout</span>
                                    </div>

                                    <hr style={{ margin: 'var(--spacing-sm) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(totals.total)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer" style={{ padding: 'var(--spacing-md)' }}>
                                <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Proceed to Checkout
                                </Link>
                                <Link to="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="card mt-md">
                            <div className="card-body" style={{ padding: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🔒</span>
                                        <span className="text-small">Secure Checkout</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🚚</span>
                                        <span className="text-small">Free Shipping on ₹999+</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <span style={{ fontSize: '1.5rem' }}>↩️</span>
                                        <span className="text-small">Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
