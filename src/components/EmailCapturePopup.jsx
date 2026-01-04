import { useState, useEffect } from 'react';
import { FiMail, FiX, FiBell, FiGift } from 'react-icons/fi';
import { trackCartActivity } from '../services/cartAbandonment';

const EmailCapturePopup = ({ cartItems, onEmailCaptured }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if we should show popup
        const hasEmail = localStorage.getItem('jmc_customer_email');
        const wasDismissed = sessionStorage.getItem('email_capture_dismissed');

        if (!hasEmail && !wasDismissed && cartItems && cartItems.length > 0) {
            // Show popup after 5 seconds if cart has items
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [cartItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email && !phone) {
            setError('Please enter your email or phone number');
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Save to localStorage
        if (email) {
            localStorage.setItem('jmc_customer_email', email);
            trackCartActivity(cartItems, email);
        }

        if (phone) {
            localStorage.setItem('jmc_customer_phone', phone);
        }

        // Notify parent
        onEmailCaptured?.({ email, phone });

        setSubmitted(true);

        // Close after showing success
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
    };

    const handleDismiss = () => {
        setShowPopup(false);
        sessionStorage.setItem('email_capture_dismissed', 'true');
    };

    if (!showPopup) return null;

    return (
        <>
            <style>
                {`
          .email-capture-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .email-capture-modal {
            background: var(--color-background);
            border-radius: var(--radius-lg);
            max-width: 450px;
            width: 100%;
            overflow: hidden;
            animation: scaleIn 0.3s ease;
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.95);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .email-capture-header {
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            padding: var(--spacing-xl);
            text-align: center;
            color: white;
            position: relative;
          }
          
          .email-capture-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            opacity: 0.8;
          }
          
          .email-capture-close:hover {
            opacity: 1;
          }
          
          .email-capture-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-md);
          }
          
          .email-capture-header h3 {
            margin: 0 0 var(--spacing-xs);
            color: white;
            font-size: 1.5rem;
          }
          
          .email-capture-header p {
            margin: 0;
            opacity: 0.9;
          }
          
          .email-capture-body {
            padding: var(--spacing-xl);
          }
          
          .email-capture-benefits {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            margin-bottom: var(--spacing-lg);
          }
          
          .email-capture-benefit {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 0.9rem;
          }
          
          .email-capture-benefit-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--color-primary-light);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          
          .email-capture-form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .email-capture-error {
            color: var(--color-error);
            font-size: 0.85rem;
            text-align: center;
          }
          
          .email-capture-success {
            text-align: center;
            padding: var(--spacing-xl);
          }
          
          .email-capture-success-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--color-success);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-md);
            font-size: 2rem;
          }
          
          .email-capture-divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: var(--spacing-sm) 0;
          }
          
          .email-capture-divider::before,
          .email-capture-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--color-border);
          }
          
          .email-capture-divider span {
            padding: 0 var(--spacing-sm);
            color: var(--color-text-muted);
            font-size: 0.85rem;
          }
        `}
            </style>

            <div className="email-capture-overlay" onClick={handleDismiss}>
                <div className="email-capture-modal" onClick={e => e.stopPropagation()}>
                    {submitted ? (
                        <div className="email-capture-success">
                            <div className="email-capture-success-icon">✓</div>
                            <h3>You're All Set! 🎉</h3>
                            <p className="text-muted">
                                We'll keep you updated on your order and send you exclusive offers!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="email-capture-header">
                                <button className="email-capture-close" onClick={handleDismiss}>
                                    <FiX size={24} />
                                </button>
                                <div className="email-capture-icon">
                                    <FiGift size={32} />
                                </div>
                                <h3>Don't Miss Out!</h3>
                                <p>Save your cart and get exclusive offers</p>
                            </div>

                            <div className="email-capture-body">
                                <div className="email-capture-benefits">
                                    <div className="email-capture-benefit">
                                        <div className="email-capture-benefit-icon">
                                            <FiBell size={14} />
                                        </div>
                                        <span>Get notified about order updates</span>
                                    </div>
                                    <div className="email-capture-benefit">
                                        <div className="email-capture-benefit-icon">
                                            <FiGift size={14} />
                                        </div>
                                        <span>Receive exclusive discounts & offers</span>
                                    </div>
                                    <div className="email-capture-benefit">
                                        <div className="email-capture-benefit-icon">
                                            <FiMail size={14} />
                                        </div>
                                        <span>Get personalized skincare tips</span>
                                    </div>
                                </div>

                                <form className="email-capture-form" onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                    />

                                    <div className="email-capture-divider">
                                        <span>or</span>
                                    </div>

                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="form-input"
                                    />

                                    {error && <p className="email-capture-error">{error}</p>}

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                        Save My Cart
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDismiss}
                                        className="btn btn-ghost"
                                        style={{ width: '100%' }}
                                    >
                                        No thanks, continue shopping
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmailCapturePopup;
