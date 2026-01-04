import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight, FiClock, FiGift, FiPercent, FiTruck } from 'react-icons/fi';

const CampaignBanner = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dismissed, setDismissed] = useState([]);
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        fetchActiveCampaigns();
    }, []);

    useEffect(() => {
        if (campaigns.length > 0) {
            const timer = setInterval(() => {
                updateCountdown();
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [campaigns]);

    const fetchActiveCampaigns = async () => {
        try {
            const response = await fetch('/api/campaigns/active');
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data.filter(c => c.type === 'banner'));
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        }
    };

    const updateCountdown = () => {
        const newTimeLeft = {};
        campaigns.forEach(campaign => {
            const end = new Date(campaign.endDate);
            const now = new Date();
            const diff = end - now;

            if (diff > 0) {
                newTimeLeft[campaign.id] = {
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                };
            }
        });
        setTimeLeft(newTimeLeft);
    };

    const handleDismiss = (id) => {
        setDismissed([...dismissed, id]);
        trackImpression(id);
    };

    const handleClick = (id) => {
        fetch(`/api/campaigns/${id}/click`, { method: 'POST' });
    };

    const trackImpression = (id) => {
        fetch(`/api/campaigns/${id}/impression`, { method: 'POST' });
    };

    const getDiscountIcon = (type) => {
        switch (type) {
            case 'percentage': return <FiPercent />;
            case 'fixed': return <FiGift />;
            case 'freeShipping': return <FiTruck />;
            default: return <FiGift />;
        }
    };

    const visibleCampaigns = campaigns.filter(c => !dismissed.includes(c.id));

    if (visibleCampaigns.length === 0) return null;

    const campaign = visibleCampaigns[currentIndex % visibleCampaigns.length];
    const countdown = timeLeft[campaign?.id];

    return (
        <div
            className="campaign-banner animate-fade-in"
            style={{
                background: `linear-gradient(135deg, ${campaign.backgroundColor}, ${campaign.backgroundColor}dd)`,
                color: campaign.textColor,
                padding: '0.875rem 1rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-10%',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-60%',
                right: '-5%',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Icon */}
                <span style={{ fontSize: '1.25rem' }}>
                    {getDiscountIcon(campaign.discountType)}
                </span>

                {/* Main Content */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                    <span style={{
                        fontWeight: '600',
                        fontSize: '0.9375rem',
                        textAlign: 'center',
                    }}>
                        {campaign.title}
                    </span>

                    {campaign.couponCode && (
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            letterSpacing: '0.05em',
                        }}>
                            {campaign.couponCode}
                        </span>
                    )}

                    {/* Countdown Timer */}
                    {countdown && campaign.type === 'countdown' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.8125rem',
                        }}>
                            <FiClock size={14} />
                            <span>
                                {countdown.days > 0 && `${countdown.days}d `}
                                {String(countdown.hours).padStart(2, '0')}:
                                {String(countdown.minutes).padStart(2, '0')}:
                                {String(countdown.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <Link
                    to={campaign.buttonLink}
                    onClick={() => handleClick(campaign.id)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'inherit',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '50px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}
                >
                    {campaign.buttonText}
                    <FiArrowRight size={14} />
                </Link>

                {/* Close Button */}
                <button
                    onClick={() => handleDismiss(campaign.id)}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        opacity: 0.7,
                        transition: 'opacity 0.2s',
                    }}
                    aria-label="Dismiss banner"
                >
                    <FiX size={18} />
                </button>
            </div>
        </div>
    );
};

export default CampaignBanner;
