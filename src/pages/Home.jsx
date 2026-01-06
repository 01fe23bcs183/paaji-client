import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiHeart, FiShield, FiTruck, FiAward, FiRefreshCw } from 'react-icons/fi';
import { getProducts } from '../services/customerAPI';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const products = await getProducts({ featured: true });
                setFeaturedProducts(products.slice(0, 6));
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const heroFeatures = [
        { icon: FiShield, text: 'Dermatologist Tested' },
        { icon: FiAward, text: '100% Authentic' },
        { icon: FiTruck, text: 'Free Shipping ₹999+' },
    ];

    const stats = [
        { value: '50K+', label: 'Happy Customers' },
        { value: '4.9★', label: 'Average Rating' },
        { value: '100+', label: 'Premium Products' },
        { value: '24/7', label: 'Customer Support' },
    ];

    return (
        <div className="home-page">
            <SEO
                title="Premium Luxury Skincare Products"
                description="Discover science-backed luxury skincare at JMC. Transform your skin with our premium collection of cleansers, serums, moisturizers, and treatments."
                url="/"
            />

            {/* HERO SECTION - Modern & Engaging */}
            <section className="hero hero-gradient" style={{ paddingTop: '100px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3xl)', alignItems: 'center' }}>

                        {/* Hero Content */}
                        <div className="hero-content animate-fade-in-up">
                            <div style={{
                                display: 'inline-block',
                                padding: 'var(--spacing-xs) var(--spacing-md)',
                                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent))',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: 'var(--spacing-lg)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: '600',
                                color: 'var(--color-primary-dark)',
                            }}>
                                ✨ Scientifically Proven Skincare
                            </div>

                            <h1 className="hero-title">
                                Radiant Skin<br />
                                Starts Here
                            </h1>

                            <p className="hero-subtitle">
                                Experience the perfect blend of nature and science with our
                                premium skincare collection crafted for your unique beauty.
                            </p>

                            <div className="hero-cta">
                                <Link to="/skin-quiz" className="btn btn-primary btn-lg">
                                    Find Your Routine <FiArrowRight />
                                </Link>
                                <Link to="/#products" className="btn btn-secondary btn-lg">
                                    Explore Products
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div style={{
                                display: 'flex',
                                gap: 'var(--spacing-lg)',
                                marginTop: 'var(--spacing-xl)',
                                flexWrap: 'wrap',
                            }}>
                                {heroFeatures.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--color-surface)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-primary)',
                                        }}>
                                            <feature.icon size={16} />
                                        </div>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image/Visual */}
                        <div style={{ position: 'relative' }} className="animate-float">
                            <div style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-2xl)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-2xl)',
                                aspectRatio: '4/5',
                            }}>
                                <img
                                    src="/images/hero_skincare_luxury_1767531071505.png"
                                    alt="Luxury Skincare"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>

                            {/* Floating Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '-20px',
                                background: 'var(--color-surface)',
                                padding: 'var(--spacing-lg)',
                                borderRadius: 'var(--radius-xl)',
                                boxShadow: 'var(--shadow-xl)',
                                border: '1px solid var(--color-border-light)',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: 'var(--text-3xl)',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        4.9★
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        50K+ Reviews
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="hero-decoration" style={{ width: '400px', height: '400px', top: '-200px', right: '-100px' }} />
                <div className="hero-decoration" style={{ width: '300px', height: '300px', bottom: '-150px', left: '-50px' }} />
            </section>

            {/* STATS SECTION */}
            <section style={{ padding: 'var(--spacing-3xl) 0', background: 'var(--color-surface)' }}>
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section id="products" className="section">
                <div className="container">
                    {/* Section Header */}
                    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--spacing-3xl)' }}>
                        <div className="badge badge-primary" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Featured Collection
                        </div>
                        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
                            Our Bestsellers
                        </h2>
                        <p className="text-large text-muted">
                            Discover our most-loved products, trusted by thousands for their transformative results
                        </p>
                    </div>

                    {/* Products Grid */}
                    <div className="responsive-grid-3">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                {/* Product Image */}
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.images?.[0] || 'https://placehold.co/400x400/E8D5B7/FFFFFF?text=Product'}
                                        alt={product.name}
                                        className="product-image"
                                    />

                                    {/* Badges */}
                                    <div className="product-badge-group">
                                        {product.isNew && (
                                            <span className="badge badge-primary">New</span>
                                        )}
                                        {product.discount > 0 && (
                                            <span className="badge badge-error">-{product.discount}%</span>
                                        )}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="product-actions">
                                        <button className="product-action-btn" title="Add to Wishlist">
                                            <FiHeart size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="product-info">
                                    <div className="product-category">{product.category}</div>

                                    <Link to={`/product/${product.slug}`}>
                                        <h3 className="product-name">{product.name}</h3>
                                    </Link>

                                    {/* Rating */}
                                    <div className="product-rating" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={14}
                                                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                        <span style={{ color: 'var(--color-text-muted)' }}>
                                            ({product.reviews || 0})
                                        </span>
                                    </div>

                                    <p className="product-description">
                                        {product.shortDescription || product.description?.substring(0, 80) + '...'}
                                    </p>

                                    {/* Footer */}
                                    <div className="product-footer">
                                        <div className="product-price">
                                            <div className="product-price-current">
                                                ₹{product.price.toLocaleString()}
                                            </div>
                                            {product.comparePrice && (
                                                <div className="product-price-original">
                                                    ₹{product.comparePrice.toLocaleString()}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => addItem(product)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-3xl)' }}>
                        <Link to="/" className="btn btn-outline btn-lg">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SKIN QUIZ CTA */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div className="container section">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-3xl)',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <div>
                            <h2 style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
                                Not Sure Where to Start?
                            </h2>
                            <p style={{
                                fontSize: 'var(--text-xl)',
                                opacity: 0.95,
                                marginBottom: 'var(--spacing-xl)',
                                lineHeight: 1.6,
                            }}>
                                Take our personalized skin quiz to discover the perfect products
                                tailored to your unique skin type and concerns.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                <Link to="/skin-quiz" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)' }}>
                                    Take the Quiz
                                </Link>
                                <Link to="/about" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--spacing-xl)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}>
                                <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                                    ✨
                                </div>
                                <h4 style={{ color: 'white', textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                    2-Minute Quiz
                                </h4>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 'var(--spacing-md)',
                                    fontSize: 'var(--text-sm)',
                                }}>
                                    {['Skin Type Analysis', 'Concern Detection', 'Product Matching', 'Custom Routine'].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                ✓
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, white, transparent)',
                }} />
            </section>

            {/* TRUST SECTION */}
            <section className="section" style={{ background: 'var(--color-background-alt)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        Why Choose JMC Skincare
                    </h2>

                    <div className="trust-badges">
                        {[
                            { icon: FiShield, title: 'Dermatologist Approved', desc: 'Clinically tested formulas' },
                            { icon: FiAward, title: '100% Authentic', desc: 'Genuine products guaranteed' },
                            { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
                            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day money back' },
                        ].map((trust, i) => (
                            <div key={i} className="trust-badge" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                                <div className="trust-badge-icon" style={{ width: '56px', height: '56px', marginBottom: 'var(--spacing-md)' }}>
                                    <trust.icon size={24} />
                                </div>
                                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{trust.title}</h4>
                                <p className="text-small text-muted" style={{ margin: 0 }}>{trust.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="section">
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-surface), var(--color-background-alt))',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--spacing-3xl)',
                        textAlign: 'center',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
                            Get Glowing Skin Tips 📩
                        </h2>
                        <p className="text-large text-muted" style={{ maxWidth: '500px', margin: '0 auto var(--spacing-xl)' }}>
                            Subscribe to our newsletter for exclusive offers, skincare tips, and product launches.
                        </p>

                        <div style={{
                            maxWidth: '500px',
                            margin: '0 auto',
                            display: 'flex',
                            gap: 'var(--spacing-sm)',
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-primary">
                                Subscribe
                            </button>
                        </div>

                        <p className="text-small text-muted" style={{ marginTop: 'var(--spacing-md)', marginBottom: 0 }}>
                            Join 50,000+ subscribers. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </section>

            <style>
                {`
          @media (max-width: 768px) {
            .hero > .container > div,
            .featured-product,
            section[style*="grid-template-columns: 1fr 1fr"] > .container > div {
              grid-template-columns: 1fr !important;
            }

            .hero-title {
              font-size: 2.5rem !important;
            }

            .trust-badges {
              flex-direction: column;
            }

            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}
            </style>
        </div>
    );
};

export default Home;
