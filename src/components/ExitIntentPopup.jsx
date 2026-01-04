import { useState, useEffect, useCallback } from 'react';
import { FiX, FiGift } from 'react-icons/fi';

const ExitIntentPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const STORAGE_KEY = 'exit_popup_shown';
    const DISCOUNT_CODE = 'WELCOME10';

    useEffect(() => {
        // Check if already shown this session
        const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
        if (alreadyShown) return;

        const handleMouseOut = (e) => {
            // Only trigger when mouse leaves toward the top of the viewport
            if (e.clientY < 10 && e.relatedTarget === null) {
                setIsVisible(true);
                sessionStorage.setItem(STORAGE_KEY, 'true');
                // Remove listener after showing
                document.removeEventListener('mouseout', handleMouseOut);
            }
        };

        // Add listener after a short delay to avoid immediate trigger
        const timer = setTimeout(() => {
            document.addEventListener('mouseout', handleMouseOut);
        }, 3000);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Here you would typically send to your backend/newsletter service
        console.log('Newsletter signup:', email);

        // Store in localStorage as a simple example
        try {
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            }
        } catch (err) {
            console.error('Error saving email:', err);
        }

        setSubmitted(true);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(DISCOUNT_CODE);
    };

    if (!isVisible) return null;

    return (
        <>
            <style>
                {`
          .exit-popup-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-md);
            animation: fadeIn 0.3s ease;
          }
          
          .exit-popup {
            background: var(--color-background);
            border-radius: var(--radius-lg);
            max-width: 450px;
            width: 100%;
            overflow: hidden;
            animation: slideIn 0.3s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .exit-popup-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
          }
          
          .exit-popup-close:hover {
            background: var(--color-background-alt);
            color: var(--color-text);
          }
        `}
            </style>

            <div className="exit-popup-overlay" onClick={handleClose}>
                <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
                    <button className="exit-popup-close" onClick={handleClose}>
                        <FiX size={24} />
                    </button>

                    {/* Header with gradient */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        color: 'white',
                    }}>
                        <FiGift size={48} style={{ marginBottom: 'var(--spacing-md)' }} />
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            marginBottom: 'var(--spacing-xs)',
                        }}>
                            Wait! Don't Leave Empty-Handed
                        </h2>
                        <p style={{ opacity: 0.9 }}>
                            Get 10% off your first order
                        </p>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                        {!submitted ? (
                            <>
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    marginBottom: 'var(--spacing-lg)',
                                }}>
                                    Subscribe to our newsletter and receive an exclusive discount code for your first purchase.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-md)',
                                            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '1rem',
                                            marginBottom: error ? 'var(--spacing-xs)' : 'var(--spacing-md)',
                                        }}
                                    />

                                    {error && (
                                        <p style={{
                                            color: 'var(--color-danger)',
                                            fontSize: '0.85rem',
                                            marginBottom: 'var(--spacing-md)',
                                            textAlign: 'left',
                                        }}>
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%' }}
                                    >
                                        Get My 10% Discount
                                    </button>
                                </form>

                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    marginTop: 'var(--spacing-md)',
                                }}>
                                    By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'var(--color-success)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-lg)',
                                    color: 'white',
                                    fontSize: '2rem',
                                }}>
                                    ✓
                                </div>

                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: 'var(--spacing-md)',
                                }}>
                                    Welcome to the Family!
                                </h3>

                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    marginBottom: 'var(--spacing-lg)',
                                }}>
                                    Here's your exclusive discount code:
                                </p>

                                <div style={{
                                    background: 'var(--color-background-alt)',
                                    padding: 'var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px dashed var(--color-primary)',
                                    marginBottom: 'var(--spacing-lg)',
                                }}>
                                    <code style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: 'var(--color-primary)',
                                        letterSpacing: '2px',
                                    }}>
                                        {DISCOUNT_CODE}
                                    </code>
                                </div>

                                <button
                                    onClick={copyCode}
                                    className="btn btn-outline"
                                    style={{ marginBottom: 'var(--spacing-md)' }}
                                >
                                    Copy Code
                                </button>

                                <button
                                    onClick={handleClose}
                                    className="btn btn-primary"
                                    style={{ display: 'block', width: '100%' }}
                                >
                                    Start Shopping
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExitIntentPopup;
