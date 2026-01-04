import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../services/payments';

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 8;

// Helper to add a product to recently viewed
export const addToRecentlyViewed = (product) => {
    if (!product) return;

    try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Remove if already exists
        const filtered = existing.filter(p => p.id !== product.id);

        // Add to beginning
        const updated = [{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
            viewedAt: new Date().toISOString(),
        }, ...filtered].slice(0, MAX_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving recently viewed:', error);
    }
};

// Helper to get recently viewed products
export const getRecentlyViewed = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

const RecentlyViewed = ({ excludeId = null, maxItems = 4 }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let items = getRecentlyViewed();

        // Exclude current product
        if (excludeId) {
            items = items.filter(p => p.id !== excludeId);
        }

        setProducts(items.slice(0, maxItems));
    }, [excludeId, maxItems]);

    if (products.length === 0) return null;

    return (
        <div className="recently-viewed">
            <h3 style={{
                marginBottom: 'var(--spacing-lg)',
                fontSize: '1.25rem',
                fontWeight: '600',
            }}>
                Recently Viewed
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(products.length, maxItems)}, 1fr)`,
                gap: 'var(--spacing-md)',
            }}>
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div
                            className="card"
                            style={{
                                overflow: 'hidden',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <div style={{
                                aspectRatio: '1',
                                overflow: 'hidden',
                                background: 'var(--color-background-alt)',
                            }}>
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}>
                                        {product.name.substring(0, 2)}
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: 'var(--spacing-sm)' }}>
                                <p style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginBottom: 'var(--spacing-xs)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {product.name}
                                </p>
                                <p style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: 'var(--color-primary)',
                                    marginBottom: 0,
                                }}>
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
