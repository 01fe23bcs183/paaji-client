import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTag, FiPercent } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const BundleCard = ({ bundle }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        // Add bundle as a single cart item
        addItem({
            id: `bundle-${bundle.id}`,
            name: bundle.name,
            price: bundle.price,
            image: bundle.image,
            type: 'bundle',
            bundleItems: bundle.products,
        });
    };

    const savingsAmount = bundle.originalPrice - bundle.price;
    const savingsPercent = Math.round((savingsAmount / bundle.originalPrice) * 100);

    return (
        <div className="card product-card">
            {/* Bundle Image */}
            <div className="product-image-wrapper">
                <img
                    src={bundle.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'}
                    alt={bundle.name}
                    className="product-image"
                />

                {/* Savings Badge */}
                <div className="product-badge-group">
                    <span className="badge badge-success" style={{
                        fontSize: 'var(--text-sm)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                    }}>
                        <FiPercent size={14} /> Save {savingsPercent}%
                    </span>
                </div>
            </div>

            {/* Bundle Info */}
            <div className="product-info">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    marginBottom: 'var(--spacing-xs)',
                }}>
                    <FiTag size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="product-category">Bundle</span>
                </div>

                <h3 className="product-name">{bundle.name}</h3>

                <p className="product-description">
                    {bundle.description}
                </p>

                {/* Products in Bundle */}
                <div style={{
                    marginBottom: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-background-alt)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: '600',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        Includes:
                    </div>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: 'var(--text-sm)',
                    }}>
                        {bundle.products?.map((product, index) => (
                            <li key={index} style={{
                                marginBottom: 'var(--spacing-xs)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                            }}>
                                <span style={{
                                    color: 'var(--color-success)',
                                    fontSize: 'var(--text-xs)',
                                }}>✓</span>
                                {product.name || product}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pricing */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-md)',
                }}>
                    <div>
                        <div className="product-price-current">
                            ₹{bundle.price.toLocaleString()}
                        </div>
                        <div style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'line-through',
                        }}>
                            ₹{bundle.originalPrice.toLocaleString()}
                        </div>
                    </div>
                    <div style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-success-light)',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                    }}>
                        Save ₹{savingsAmount.toLocaleString()}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAddToCart}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    <FiShoppingCart size={18} />
                    Add Bundle to Cart
                </button>
            </div>
        </div>
    );
};

export default BundleCard;
