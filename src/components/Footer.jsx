import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-column">
                        <h3>{settings?.siteName || 'JMC'}</h3>
                        <p className="text-small">
                            {settings?.tagline || 'Luxury Skincare'}
                        </p>
                        <p className="text-small" style={{ marginTop: '1rem', opacity: 0.8 }}>
                            Premium skincare products for radiant, healthy skin. Experience the luxury of JMC.
                        </p>
                        <div className="footer-social">
                            {settings?.socialLinks?.facebook && (
                                <a
                                    href={settings.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-icon"
                                    aria-label="Facebook"
                                >
                                    <FiFacebook />
                                </a>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <a
                                    href={settings.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-icon"
                                    aria-label="Instagram"
                                >
                                    <FiInstagram />
                                </a>
                            )}
                            {settings?.socialLinks?.twitter && (
                                <a
                                    href={settings.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-icon"
                                    aria-label="Twitter"
                                >
                                    <FiTwitter />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <div className="footer-links">
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/contact" className="footer-link">Contact</Link>
                            <Link to="/track-order" className="footer-link">Track Order</Link>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-column">
                        <h3>Customer Service</h3>
                        <div className="footer-links">
                            <Link to="/cart" className="footer-link">Shopping Cart</Link>
                            <Link to="/checkout" className="footer-link">Checkout</Link>
                            <a href="#faq" className="footer-link">FAQ</a>
                            <a href="#shipping" className="footer-link">Shipping Info</a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-column">
                        <h3>Contact Us</h3>
                        <div className="footer-links">
                            {settings?.contactEmail && (
                                <a
                                    href={`mailto:${settings.contactEmail}`}
                                    className="footer-link"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FiMail size={16} />
                                    {settings.contactEmail}
                                </a>
                            )}
                            {settings?.contactPhone && (
                                <a
                                    href={`tel:${settings.contactPhone}`}
                                    className="footer-link"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FiPhone size={16} />
                                    {settings.contactPhone}
                                </a>
                            )}
                            {settings?.whatsappNumber && (
                                <a
                                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    📱 WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        &copy; {currentYear} {settings?.siteName || 'JMC'}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
