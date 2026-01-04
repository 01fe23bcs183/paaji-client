import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedBundles } from '../data/bundlesData';
import { getProducts } from '../services/storage';
import { formatCurrency } from '../services/payments';
import { useCart } from '../context/CartContext';
import { FiPlus, FiCheck, FiPackage } from 'react-icons/fi';

const CartUpsell = ({ cartTotal }) => {
    const [products, setProducts] = useState([]);
    const [bundles, setBundles] = useState([]);
    const { items, addItem, isInCart } = useCart();

    useEffect(() => {
        const loadData = async () => {
            // Load products
            const allProducts = await getProducts();
            const cartProductIds = items.map(item => item.id);

            // Get products not in cart
            const suggestedProducts = allProducts
                .filter(p => !cartProductIds.includes(p.id))
                .slice(0, 3);

            setProducts(suggestedProducts);

            // Load bundles
            const featuredBundles = getFeaturedBundles();
            setBundles(featuredBundles.slice(0, 2));
        };

        loadData();
    }, [items]);

    const handleQuickAdd = (product) => {
        addItem(product, 1);
    };

    // Calculate free shipping threshold
    const freeShippingThreshold = 999;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
    const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

    if (products.length === 0 && bundles.length === 0) return null;

    return (
        <div className="cart-upsell">
            {/* Free Shipping Progress */}
            {amountToFreeShipping > 0 && (
                <div style={{
                    background: 'var(--color-background-alt)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--spacing-sm)',
                        fontSize: '0.85rem',
                    }}>
                        <span>🚚 Add {formatCurrency(amountToFreeShipping)} for FREE shipping!</span>
                        <span className="text-muted">{Math.round(progressPercent)}%</span>
                    </div>
                    <div style={{
                        height: '8px',
                        background: 'var(--color-border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: progressPercent >= 100
                                ? 'var(--color-success)'
                                : 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                            transition: 'width 0.3s ease',
                        }} />
                    </div>
                </div>
            )}

            {amountToFreeShipping <= 0 && (
                <div style={{
                    background: 'var(--color-success-light)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)',
                    textAlign: 'center',
                    color: 'var(--color-success)',
                    fontWeight: '600',
                }}>
                    ✓ You qualify for FREE shipping!
                </div>
            )}

            {/* Quick Add Products */}
            {products.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                        Customers Also Bought
                    </h4>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-sm)',
                    }}>
                        {products.map((product) => {
                            const inCart = isInCart(product.id);
                            return (
                                <div
                                    key={product.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-sm)',
                                        background: 'var(--color-background-alt)',
                                        borderRadius: 'var(--radius-md)',
                                    }}
                                >
                                    <Link to={`/product/${product.slug}`}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: product.images?.[0]
                                                ? `url(${product.images[0]}) center/cover`
                                                : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                        }}>
                                            {!product.images?.[0] && product.name.substring(0, 2)}
                                        </div>
                                    </Link>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link
                                            to={`/product/${product.slug}`}
                                            style={{
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                color: 'var(--color-text)',
                                                textDecoration: 'none',
                                                display: 'block',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {product.name}
                                        </Link>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: 'var(--color-primary)',
                                        }}>
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleQuickAdd(product)}
                                        className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-outline'}`}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '50%',
                                            minWidth: '32px',
                                            height: '32px',
                                        }}
                                    >
                                        {inCart ? <FiCheck size={14} /> : <FiPlus size={14} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Bundle Suggestion */}
            {bundles.length > 0 && (
                <div>
                    <h4 style={{
                        marginBottom: 'var(--spacing-md)',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                    }}>
                        <FiPackage /> Save More with Bundles
                    </h4>
                    <Link
                        to="/bundles"
                        style={{
                            display: 'block',
                            padding: 'var(--spacing-md)',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            textDecoration: 'none',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                            Bundle & Save up to 25%
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                            View all skincare bundles →
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartUpsell;
