import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../services/storage';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../services/payments';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import StockIndicator from '../components/StockIndicator';
import TrustBadges from '../components/TrustBadges';
import StickyAddToCart from '../components/StickyAddToCart';
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed';
import ProductReviews from '../components/ProductReviews';
import SEO from '../components/SEO';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addItem, isInCart } = useCart();

    const loadProduct = useCallback(async () => {
        try {
            const products = await getProducts();
            const found = products.find(p => p.slug === slug);
            setProduct(found);

            if (found && found.variants && found.variants.length > 0) {
                setSelectedVariant(found.variants[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading product:', error);
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    // Track recently viewed
    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem(product, quantity, selectedVariant);
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product?.price;
    const currentStock = selectedVariant ? selectedVariant.stock : product?.stock;
    const inCart = isInCart(product?.id, selectedVariant?.name);

    if (loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="skeleton" style={{ height: '500px' }} />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="section">
                <div className="container text-center">
                    <h2>Product Not Found</h2>
                    <Link to="/" className="btn btn-primary mt-md">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section" style={{ paddingTop: '100px' }}>
            <SEO
                title={product.name}
                description={product.description || `Shop ${product.name} - Premium skincare product from JMC Skincare. Free shipping on orders above ₹999.`}
                keywords={`${product.name}, skincare, ${product.category || 'beauty'}, buy online`}
                url={`/product/${product.slug}`}
                type="product"
                image={product.images?.[0]}
                product={{
                    name: product.name,
                    description: product.description,
                    image: product.images?.[0],
                    price: currentPrice,
                    inStock: currentStock > 0,
                    sku: product.id,
                }}
            />
            <div className="container">
                <div className="grid grid-cols-2 gap-xl">
                    {/* Product Image */}
                    <div>
                        <div className="card">
                            {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} style={{ width: '100%' }} />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    {product.name.substring(0, 2)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1>{product.name}</h1>
                        <div style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: '700', margin: '1rem 0' }}>
                            {formatCurrency(currentPrice)}
                            {product.comparePrice && product.comparePrice > currentPrice && (
                                <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginLeft: '1rem' }}>
                                    {formatCurrency(product.comparePrice)}
                                </span>
                            )}
                        </div>

                        {/* Stock Indicator */}
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <StockIndicator stock={currentStock || 0} threshold={10} showExact />
                        </div>

                        {product.description && (
                            <p className="text-large mb-lg">{product.description}</p>
                        )}

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Select Variant:</label>
                                <div className="flex gap-sm">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.name}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`btn ${selectedVariant?.name === variant.name ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="form-group">
                            <label className="form-label">Quantity:</label>
                            <div className="flex gap-sm items-center">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="btn btn-outline btn-sm"
                                >
                                    -
                                </button>
                                <span style={{ padding: '0 1rem', fontSize: '1.125rem', fontWeight: '600' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(currentStock || 999, quantity + 1))}
                                    className="btn btn-outline btn-sm"
                                    disabled={quantity >= (currentStock || 999)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={!currentStock || currentStock <= 0}
                        >
                            {currentStock <= 0 ? (
                                'Out of Stock'
                            ) : inCart ? (
                                <>
                                    <FiCheck /> Added to Cart
                                </>
                            ) : (
                                <>
                                    <FiShoppingCart /> Add to Cart
                                </>
                            )}
                        </button>

                        <Link to="/cart" className="btn btn-outline btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                            View Cart
                        </Link>

                        {/* Trust Badges */}
                        <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                            <TrustBadges variant="compact" />
                        </div>
                    </div>
                </div>
            </div>

                        {/* Product Reviews Section */}
                        <div className="container" style={{ marginTop: 'var(--spacing-xxl)' }}>
                            <ProductReviews productId={product.id} productName={product.name} />
                        </div>

                        {/* Recently Viewed Section */}
                        <div className="container" style={{ marginTop: 'var(--spacing-xxl)' }}>
                            <RecentlyViewed excludeId={product.id} maxItems={4} />
                        </div>

                        {/* Sticky Add to Cart for Mobile */}
            <StickyAddToCart
                product={product}
                price={currentPrice}
                originalPrice={product.comparePrice}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default ProductDetail;
