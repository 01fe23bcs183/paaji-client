import { useState, useEffect } from 'react';
import { getBundles } from '../data/bundlesData';
import BundleCard from '../components/BundleCard';
import { FiPackage, FiPercent, FiHeart, FiStar } from 'react-icons/fi';
import SEO from '../components/SEO';

const Bundles = () => {
    const [bundles, setBundles] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBundles = () => {
            const allBundles = getBundles();
            setBundles(allBundles);
            setLoading(false);
        };
        loadBundles();
    }, []);

    const skinTypes = ['all', 'oily', 'dry', 'combination', 'normal', 'sensitive'];

    const filteredBundles = filter === 'all'
        ? bundles
        : bundles.filter(b => b.skinTypes.includes(filter));

    const totalSavings = bundles.reduce((sum, b) => sum + b.savings, 0);

    if (loading) {
        return (
            <div className="section" style={{ paddingTop: '100px' }}>
                <div className="container">
                    <div className="grid grid-cols-3 gap-lg">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '400px' }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px' }}>
            <SEO
                title="Skincare Bundles"
                description="Save up to 25% with our expertly curated skincare bundles. Complete routines for every skin type - oily, dry, combination, and sensitive skin."
                keywords="skincare bundles, skincare sets, skincare routine, anti-aging bundle, acne kit, hydration set"
                url="/bundles"
            />
            {/* Hero Banner */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                padding: 'var(--spacing-xxl) 0',
                color: 'white',
                textAlign: 'center',
            }}>
                <div className="container">
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)',
                    }}>
                        <FiPackage size={40} />
                    </div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)', color: 'white' }}>
                        Skincare Bundles
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-lg)',
                    }}>
                        Save up to 25% with our expertly curated skincare sets.
                        Complete routines designed for real results.
                    </p>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xl)',
                        marginTop: 'var(--spacing-xl)',
                    }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{bundles.length}</div>
                            <div style={{ opacity: 0.8 }}>Curated Sets</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>25%</div>
                            <div style={{ opacity: 0.8 }}>Max Savings</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>₹{totalSavings}+</div>
                            <div style={{ opacity: 0.8 }}>Total Savings</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Bar */}
            <section style={{
                background: 'var(--color-background-alt)',
                padding: 'var(--spacing-lg) 0',
                borderBottom: '1px solid var(--color-border)',
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xxl)',
                        flexWrap: 'wrap',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <FiPercent size={24} color="var(--color-primary)" />
                            <span>Bundle & Save</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <FiHeart size={24} color="var(--color-primary)" />
                            <span>Expert Curated</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <FiStar size={24} color="var(--color-primary)" />
                            <span>Complete Routines</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section">
                <div className="container">
                    {/* Filters */}
                    <div style={{
                        marginBottom: 'var(--spacing-xl)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        flexWrap: 'wrap',
                    }}>
                        {skinTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`btn ${filter === type ? 'btn-primary' : 'btn-outline'} btn-sm`}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {type === 'all' ? 'All Bundles' : `${type} Skin`}
                            </button>
                        ))}
                    </div>

                    {/* Bundles Grid */}
                    {filteredBundles.length > 0 ? (
                        <div className="grid grid-cols-3 gap-lg">
                            {filteredBundles.map((bundle) => (
                                <BundleCard key={bundle.id} bundle={bundle} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
                            <FiPackage size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                            <h3>No bundles found for this skin type</h3>
                            <p className="text-muted">Try a different filter or view all bundles.</p>
                            <button
                                onClick={() => setFilter('all')}
                                className="btn btn-primary mt-md"
                            >
                                View All Bundles
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Bundles Section */}
            <section className="section" style={{ background: 'var(--color-background-alt)' }}>
                <div className="container">
                    <div className="text-center mb-xl">
                        <h2>Why Choose Bundles?</h2>
                        <p className="text-muted">More than just savings</p>
                    </div>

                    <div className="grid grid-cols-3 gap-lg">
                        <div className="card card-body text-center">
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--spacing-md)',
                            }}>
                                <FiPercent size={28} color="var(--color-primary)" />
                            </div>
                            <h4>Save Money</h4>
                            <p className="text-small text-muted">
                                Up to 25% off compared to buying products individually
                            </p>
                        </div>

                        <div className="card card-body text-center">
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--spacing-md)',
                            }}>
                                <FiStar size={28} color="var(--color-primary)" />
                            </div>
                            <h4>Expert Selection</h4>
                            <p className="text-small text-muted">
                                Products selected by skincare experts to work together
                            </p>
                        </div>

                        <div className="card card-body text-center">
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--spacing-md)',
                            }}>
                                <FiHeart size={28} color="var(--color-primary)" />
                            </div>
                            <h4>Complete Routine</h4>
                            <p className="text-small text-muted">
                                Everything you need for a complete skincare regimen
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Bundles;
