import { FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';

const TrustBadges = ({ variant = 'horizontal', showLabels = true }) => {
    const badges = [
        {
            icon: FiShield,
            label: '100% Secure',
            sublabel: 'SSL Encrypted',
            color: '#5B8C5A',
        },
        {
            icon: FiTruck,
            label: 'Free Shipping',
            sublabel: 'Orders over ₹999',
            color: '#4A90A4',
        },
        {
            icon: FiRefreshCw,
            label: 'Easy Returns',
            sublabel: '7-Day Policy',
            color: '#C4A77D',
        },
        {
            icon: FiAward,
            label: '100% Genuine',
            sublabel: 'Authentic Products',
            color: '#8B5A8B',
        },
    ];

    const containerStyle = {
        display: 'flex',
        flexDirection: variant === 'vertical' ? 'column' : 'row',
        gap: variant === 'compact' ? 'var(--spacing-sm)' : 'var(--spacing-lg)',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: variant === 'compact' ? 'var(--spacing-sm)' : 'var(--spacing-md)',
    };

    const badgeStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: variant === 'compact' ? 'var(--spacing-xs) var(--spacing-sm)' : 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--color-background-alt)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.2s ease',
    };

    const iconContainerStyle = (color) => ({
        width: variant === 'compact' ? '32px' : '40px',
        height: variant === 'compact' ? '32px' : '40px',
        borderRadius: '50%',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
    });

    return (
        <div style={containerStyle} className="trust-badges">
            {badges.map((badge, index) => (
                <div key={index} style={badgeStyle} className="trust-badge">
                    <div style={iconContainerStyle(badge.color)}>
                        <badge.icon size={variant === 'compact' ? 16 : 20} />
                    </div>
                    {showLabels && (
                        <div>
                            <div style={{
                                fontWeight: '600',
                                fontSize: variant === 'compact' ? '0.75rem' : '0.85rem',
                                color: 'var(--color-text)'
                            }}>
                                {badge.label}
                            </div>
                            {variant !== 'compact' && (
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {badge.sublabel}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;
