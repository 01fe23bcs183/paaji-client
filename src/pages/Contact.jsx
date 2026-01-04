import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatus({ type: '', message: '' });

        // Simulate sending (in production, this would call your backend)
        setTimeout(() => {
            setStatus({
                type: 'success',
                message: 'Thank you for your message! We\'ll get back to you soon.'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSending(false);
        }, 1500);
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            {/* Hero Section */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-background-alt) 100%)', paddingTop: '5rem' }}>
                <div className="container text-center">
                    <h1 className="mb-md">Get In Touch</h1>
                    <p className="text-large text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-3 gap-xl">
                        {/* Contact Form */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <div className="card">
                                <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                                    <h2 className="mb-lg">Send Us a Message</h2>

                                    {status.message && (
                                        <div className={`admin-alert ${status.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'} mb-md`}>
                                            {status.message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="admin-form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Your Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-input"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Email Address *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-input"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Subject *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                className="form-input"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Message *</label>
                                            <textarea
                                                name="message"
                                                className="form-textarea"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={sending}
                                        >
                                            {sending ? 'Sending...' : (
                                                <>
                                                    <FiSend /> Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <div className="card mb-md">
                                <div className="card-body">
                                    <h3 className="mb-lg">Contact Information</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                        {settings?.contactEmail && (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(196, 167, 125, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--color-primary)'
                                                    }}>
                                                        <FiMail />
                                                    </div>
                                                    <div>
                                                        <p className="text-small text-muted" style={{ marginBottom: '0.125rem' }}>Email</p>
                                                        <a href={`mailto:${settings.contactEmail}`} className="text-small" style={{ fontWeight: 500 }}>
                                                            {settings.contactEmail}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {settings?.contactPhone && (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(196, 167, 125, 0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--color-primary)'
                                                    }}>
                                                        <FiPhone />
                                                    </div>
                                                    <div>
                                                        <p className="text-small text-muted" style={{ marginBottom: '0.125rem' }}>Phone</p>
                                                        <a href={`tel:${settings.contactPhone}`} className="text-small" style={{ fontWeight: 500 }}>
                                                            {settings.contactPhone}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(196, 167, 125, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--color-primary)'
                                                }}>
                                                    <FiMapPin />
                                                </div>
                                                <div>
                                                    <p className="text-small text-muted" style={{ marginBottom: '0.125rem' }}>Location</p>
                                                    <p className="text-small" style={{ fontWeight: 500, marginBottom: 0 }}>
                                                        India
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="card mb-md">
                                <div className="card-body">
                                    <h4 className="mb-md">Business Hours</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-small text-muted">Monday - Friday</span>
                                            <span className="text-small">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-small text-muted">Saturday</span>
                                            <span className="text-small">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-small text-muted">Sunday</span>
                                            <span className="text-small">Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            {settings?.whatsappNumber && (
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💬</div>
                                        <h4 className="mb-sm">Quick Chat</h4>
                                        <p className="text-small text-muted mb-md">
                                            Get instant responses on WhatsApp
                                        </p>
                                        <a
                                            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ width: '100%', justifyContent: 'center' }}
                                        >
                                            Chat on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="section" style={{ backgroundColor: 'var(--color-background-alt)' }}>
                <div className="container">
                    <div className="text-center mb-xl">
                        <h2>Frequently Asked Questions</h2>
                        <p className="text-large text-muted">Quick answers to common questions</p>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {[
                            {
                                q: 'What is your shipping policy?',
                                a: 'We offer free shipping on orders above ₹999. For orders below that, shipping charges vary by location. Standard delivery takes 5-7 days for pan-India, and 2-3 days for local deliveries.'
                            },
                            {
                                q: 'How can I track my order?',
                                a: 'Once your order is shipped, you\'ll receive a tracking number via email and WhatsApp. You can also track your order on our Track Order page using your order ID.'
                            },
                            {
                                q: 'What payment methods do you accept?',
                                a: 'We accept UPI, Credit/Debit Cards, Net Banking, Digital Wallets (Paytm, PhonePe, etc.), and Cash on Delivery.'
                            },
                            {
                                q: 'Are your products cruelty-free?',
                                a: 'Yes! All our products are 100% cruelty-free and made with natural ingredients.'
                            },
                        ].map((faq, index) => (
                            <div key={index} className="card">
                                <div className="card-body">
                                    <h4 className="mb-sm">{faq.q}</h4>
                                    <p className="text-muted" style={{ marginBottom: 0 }}>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
