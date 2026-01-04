import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiHome, FiInfo, FiMail, FiPackage, FiBookOpen } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { getItemCount } = useCart();
    const { settings, loading } = useSettings();
    const { isAuthenticated, user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartItemCount = getItemCount();

    if (loading) return null;

    return (
        <>
            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            <nav className={`navbar navbar-glass ${isScrolled ? 'scrolled' : ''}`} style={{
                padding: '1rem 0',
                background: isScrolled
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(196, 167, 125, 0.1)',
                boxShadow: isScrolled
                    ? '0 4px 20px rgba(0, 0, 0, 0.08)'
                    : '0 2px 10px rgba(0, 0, 0, 0.05)',
            }}>
                <div className="navbar-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    padding: '0 2rem',
                }}>
                    {/* Logo */}
                    <Link to="/" className="navbar-logo" style={{
                        fontSize: '1.75rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: '700',
                        letterSpacing: '0.15em',
                        background: 'linear-gradient(135deg, #C4A77D 0%, #A68A5A 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                    }}>
                        {settings?.siteName || 'JMC'}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="navbar-menu hide-mobile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                    }}>
                        <Link to="/" style={navLinkStyle}>
                            <FiHome size={16} />
                            <span>Home</span>
                        </Link>
                        <Link to="/about" style={navLinkStyle}>
                            <FiInfo size={16} />
                            <span>About</span>
                        </Link>
                        <Link to="/blog" style={navLinkStyle}>
                            <FiBookOpen size={16} />
                            <span>Blog</span>
                        </Link>
                        <Link to="/contact" style={navLinkStyle}>
                            <FiMail size={16} />
                            <span>Contact</span>
                        </Link>
                        <Link to="/track-order" style={navLinkStyle}>
                            <FiPackage size={16} />
                            <span>Track Order</span>
                        </Link>

                        {/* Skin Quiz - Special Button */}
                        <Link to="/skin-quiz" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.625rem 1.25rem',
                            background: 'linear-gradient(135deg, #C4A77D 0%, #A68A5A 100%)',
                            color: 'white',
                            borderRadius: '50px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(196, 167, 125, 0.3)',
                        }}>
                            <span>✨</span>
                            <span>Skin Quiz</span>
                        </Link>
                    </div>

                    {/* Right Side - Cart & User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* User Icon */}
                        {isAuthenticated ? (
                            <Link to="/my-account" className="hide-mobile" style={iconButtonStyle}>
                                <FiUser size={20} />
                            </Link>
                        ) : (
                            <Link to="/login" className="hide-mobile" style={iconButtonStyle}>
                                <FiUser size={20} />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link to="/cart" className="hide-mobile" style={{
                            ...iconButtonStyle,
                            position: 'relative',
                        }}>
                            <FiShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    minWidth: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                                    borderRadius: '50px',
                                    padding: '0 6px',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle show-mobile"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                ...iconButtonStyle,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Slide Menu */}
                    <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`} style={{
                        position: 'fixed',
                        top: 0,
                        right: mobileMenuOpen ? 0 : '-100%',
                        width: 'min(320px, 85vw)',
                        height: '100vh',
                        background: 'white',
                        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                        padding: '3rem 1.5rem',
                        transition: 'right 0.3s ease',
                        zIndex: 1001,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        <button
                            className="mobile-menu-close"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                width: '36px',
                                height: '36px',
                                borderRadius: '0.5rem',
                                background: 'rgba(196, 167, 125, 0.1)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <FiX size={20} />
                        </button>

                        <Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiHome size={18} /> Home
                        </Link>
                        <Link to="/about" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiInfo size={18} /> About
                        </Link>
                        <Link to="/blog" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiBookOpen size={18} /> Blog
                        </Link>
                        <Link to="/contact" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiMail size={18} /> Contact
                        </Link>
                        <Link to="/track-order" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiPackage size={18} /> Track Order
                        </Link>
                        <Link to="/skin-quiz" className="navbar-link" onClick={() => setMobileMenuOpen(false)} style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            marginTop: '0.5rem',
                        }}>
                            ✨ Skin Quiz
                        </Link>
                        <Link to={isAuthenticated ? "/my-account" : "/login"} className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiUser size={18} /> {isAuthenticated ? 'Account' : 'Login'}
                        </Link>
                        <Link to="/cart" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                            <FiShoppingCart size={18} /> Cart {cartItemCount > 0 && `(${cartItemCount})`}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

// Inline styles for nav links
const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: '500',
    color: '#4A4A4A',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    position: 'relative',
};

const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(196, 167, 125, 0.1)',
    color: '#C4A77D',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
};

export default Navbar;
