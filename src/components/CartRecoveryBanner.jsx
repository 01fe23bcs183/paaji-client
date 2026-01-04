import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiX, FiClock, FiPercent } from 'react-icons/fi';
import {
    isCartAbandoned,
    getRecoveryMessage,
    getRecoveryDiscount,
    getAbandonedCartData
} from '../services/cartAbandonment';
import { formatCurrency } from '../services/payments';

const CartRecoveryBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [recoveryData, setRecoveryData] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check every 30 seconds for abandoned cart
        const checkAbandonment = () => {
            if (dismissed) return;

            const isAbandoned = isCartAbandoned();
            if (isAbandoned) {
                const message = getRecoveryMessage();
                const discount = getRecoveryDiscount();
                const cartData = getAbandonedCartData();

                if (message && cartData) {
                    setRecoveryData({
                        ...message,
                        ...cartData,
                        discount,
                    });
                    setShowBanner(true);
                }
            }
        };

        // Check on mount
        checkAbandonment();

        // Check periodically
        const interval = setInterval(checkAbandonment, 30000);

        return () => clearInterval(interval);
    }, [dismissed]);

    const handleDismiss = () => {
        setShowBanner(false);
        setDismissed(true);
        sessionStorage.setItem('cart_recovery_dismissed', 'true');
    };

    if (!showBanner || !recoveryData) return null;

    return (
        <>
            <style>
                {`
          .cart-recovery-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            z-index: 9997;
            animation: slideUp 0.3s ease;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          .cart-recovery-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-lg);
          }
          
          .cart-recovery-message {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
          }
          
          .cart-recovery-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cart-recovery-text h4 {
            margin: 0 0 4px;
            color: white;
            font-size: 1.1rem;
          }
          
          .cart-recovery-text p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.9rem;
          }
          
          .cart-recovery-discount {
            background: rgba(255, 255, 255, 0.2);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-md);
            text-align: center;
          }
          
          .cart-recovery-discount-code {
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 1px;
          }
          
          .cart-recovery-discount-label {
            font-size: 0.75rem;
            opacity: 0.9;
          }
          
          .cart-recovery-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }
          
          .cart-recovery-cta {
            background: white;
            color: var(--color-primary);
            padding: var(--spacing-sm) var(--spacing-lg);
            border-radius: var(--radius-md);
            font-weight: 600;
            text-decoration: none;
            white-space: nowrap;
            transition: all 0.2s;
          }
          
          .cart-recovery-cta:hover {
            background: var(--color-background-alt);
            transform: scale(1.02);
          }
          
          .cart-recovery-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: var(--spacing-xs);
            opacity: 0.8;
          }
          
          .cart-recovery-close:hover {
            opacity: 1;
          }
          
          @media (max-width: 768px) {
            .cart-recovery-content {
              flex-direction: column;
              text-align: center;
              gap: var(--spacing-md);
            }
            
            .cart-recovery-message {
              flex-direction: column;
            }
            
            .cart-recovery-discount {
              width: 100%;
            }
          }
        `}
            </style>

            <div className="cart-recovery-banner">
                <div className="cart-recovery-content">
                    <div className="cart-recovery-message">
                        <div className="cart-recovery-icon">
                            <FiShoppingCart size={24} />
                        </div>
                        <div className="cart-recovery-text">
                            <h4>{recoveryData.headline}</h4>
                            <p>
                                {recoveryData.itemCount} {recoveryData.itemCount === 1 ? 'item' : 'items'} worth {formatCurrency(recoveryData.totalValue)}
                            </p>
                        </div>
                    </div>

                    {recoveryData.discount && (
                        <div className="cart-recovery-discount">
                            <div className="cart-recovery-discount-label">Use code</div>
                            <div className="cart-recovery-discount-code">{recoveryData.discount.code}</div>
                            <div className="cart-recovery-discount-label">for {recoveryData.discount.discount}% off</div>
                        </div>
                    )}

                    <div className="cart-recovery-actions">
                        <Link to="/cart" className="cart-recovery-cta" onClick={() => setShowBanner(false)}>
                            {recoveryData.cta}
                        </Link>
                        <button className="cart-recovery-close" onClick={handleDismiss}>
                            <FiX size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartRecoveryBanner;
