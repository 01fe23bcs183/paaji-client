import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const About = () => {
    const { settings } = useSettings();

    return (
        <div style={{ paddingTop: '80px' }}>
            <SEO
                title="About Us"
                description="Learn about JMC Skincare - our story, values, and commitment to providing luxury skincare products for radiant, healthy skin."
                keywords="about JMC, skincare company, luxury skincare, natural ingredients, cruelty-free"
                url="/about"
            />
            {/* Hero Section */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-background-alt) 100%)', paddingTop: '5rem' }}>
                <div className="container text-center">
                    <h1 className="mb-md">About {settings?.siteName || 'JMC'}</h1>
                    <p className="text-large text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {settings?.tagline || 'Luxury Skincare for Radiant Skin'}
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-2 gap-xl items-center">
                        <div>
                            <h2 className="mb-md">Our Story</h2>
                            <p className="text-large mb-md">
                                Founded with a passion for excellence, {settings?.siteName || 'JMC'} brings you the finest in luxury skincare.
                            </p>
                            <p className="text-muted mb-md">
                                We believe that everyone deserves to feel confident in their skin. That's why we've dedicated ourselves
                                to creating premium skincare products that combine the best of nature and science.
                            </p>
                            <p className="text-muted">
                                Each product is carefully formulated with high-quality ingredients, rigorously tested, and designed
                                to deliver visible results. Our commitment to excellence extends beyond our products to every
                                aspect of your experience with us.
                            </p>
                        </div>
                        <div>
                            <div className="card" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)', opacity: 0.3 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="section" style={{ backgroundColor: 'var(--color-background-alt)' }}>
                <div className="container">
                    <div className="text-center mb-xl">
                        <h2>Our Values</h2>
                        <p className="text-large text-muted">What drives us every day</p>
                    </div>

                    <div className="grid grid-cols-3 gap-lg">
                        <div className="card text-center">
                            <div className="card-body">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✨</div>
                                <h3 className="mb-md">Quality First</h3>
                                <p className="text-muted">
                                    We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards.
                                </p>
                            </div>
                        </div>

                        <div className="card text-center">
                            <div className="card-body">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🌿</div>
                                <h3 className="mb-md">Natural Ingredients</h3>
                                <p className="text-muted">
                                    We harness the power of nature, using only the finest natural ingredients that are safe and effective.
                                </p>
                            </div>
                        </div>

                        <div className="card text-center">
                            <div className="card-body">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💚</div>
                                <h3 className="mb-md">Cruelty-Free</h3>
                                <p className="text-muted">
                                    All our products are cruelty-free. We believe in beauty without harm to any living creature.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-2 gap-xl items-center">
                        <div>
                            <div className="card" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)', opacity: 0.3 }} />
                        </div>
                        <div>
                            <h2 className="mb-md">Why Choose {settings?.siteName || 'JMC'}?</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🔬</div>
                                    <div>
                                        <h4 className="mb-xs">Science-Backed Formulas</h4>
                                        <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                                            Our products are developed with dermatologists and backed by scientific research.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🌟</div>
                                    <div>
                                        <h4 className="mb-xs">Visible Results</h4>
                                        <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                                            Experience noticeable improvements in your skin's health and appearance.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💝</div>
                                    <div>
                                        <h4 className="mb-xs">Customer Satisfaction</h4>
                                        <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                                            Your happiness is our priority. We're here to support you every step of the way.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🚚</div>
                                    <div>
                                        <h4 className="mb-xs">Fast & Reliable Delivery</h4>
                                        <p className="text-muted text-small" style={{ marginBottom: 0 }}>
                                            Quick shipping across India with careful packaging to ensure products arrive in perfect condition.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'white' }}>
                <div className="container text-center">
                    <h2 className="mb-md" style={{ color: 'white' }}>Experience the {settings?.siteName || 'JMC'} Difference</h2>
                    <p className="text-large mb-lg" style={{ maxWidth: '600px', margin: '0 auto var(--spacing-lg)' }}>
                        Join thousands of satisfied customers who have transformed their skincare routine with our premium products.
                    </p>
                    <a href="/" className="btn btn-secondary btn-lg">
                        Shop Now
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
