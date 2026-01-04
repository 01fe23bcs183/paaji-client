import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';

const StickyAddToCart = ({
    product,
    price,
    originalPrice,
    onAddToCart,
    isLoading = false,
    showAt = 400 // pixels from top when to show
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY > showAt);
        };

        checkMobile();
        handleScroll();

        window.addEventListener('resize', checkMobile);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showAt]);

    if (!isMobile || !isVisible) return null;

    const containerStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-background)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-md)',
        zIndex: 999,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        animation: 'slideUp 0.3s ease-out',
    };

    const productInfoStyle = {
        flex: 1,
        minWidth: 0,
    };

    const nameStyle = {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const priceContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
    };

    const currentPriceStyle = {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--color-primary)',
    };

    const originalPriceStyle = {
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        textDecoration: 'line-through',
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
    };

    return (
        <>
            <style>
                {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
            </style>
            <div style={containerStyle} className="sticky-add-to-cart">
                <div style={productInfoStyle}>
                    <div style={nameStyle}>{product?.name || 'Product'}</div>
                    <div style={priceContainerStyle}>
                        <span style={currentPriceStyle}>₹{price}</span>
                        {originalPrice && originalPrice > price && (
                            <span style={originalPriceStyle}>₹{originalPrice}</span>
                        )}
                    </div>
                </div>
                <button
                    style={buttonStyle}
                    onClick={onAddToCart}
                    disabled={isLoading}
                >
                    <FiShoppingCart size={18} />
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </>
    );
};

export default StickyAddToCart;
