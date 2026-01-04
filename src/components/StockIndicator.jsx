import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

const StockIndicator = ({ stock, threshold = 10, showExact = false }) => {
    const getStockStatus = () => {
        if (stock <= 0) {
            return {
                status: 'out',
                label: 'Out of Stock',
                color: '#C85A54',
                bgColor: '#C85A5415',
                icon: FiX,
                urgent: false,
            };
        }
        if (stock <= threshold) {
            return {
                status: 'low',
                label: showExact ? `Only ${stock} left in stock!` : 'Low Stock - Order Soon!',
                color: '#E67E22',
                bgColor: '#E67E2215',
                icon: FiAlertCircle,
                urgent: true,
            };
        }
        return {
            status: 'available',
            label: 'In Stock',
            color: '#5B8C5A',
            bgColor: '#5B8C5A15',
            icon: FiCheck,
            urgent: false,
        };
    };

    const stockInfo = getStockStatus();

    const containerStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        borderRadius: 'var(--radius-md)',
        background: stockInfo.bgColor,
        border: `1px solid ${stockInfo.color}30`,
        fontSize: '0.85rem',
        fontWeight: '500',
        color: stockInfo.color,
        animation: stockInfo.urgent ? 'pulse 2s ease-in-out infinite' : 'none',
    };

    const dotStyle = {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: stockInfo.color,
        animation: stockInfo.urgent ? 'blink 1s ease-in-out infinite' : 'none',
    };

    return (
        <>
            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
            </style>
            <div style={containerStyle} className="stock-indicator">
                <div style={dotStyle} />
                <stockInfo.icon size={14} />
                <span>{stockInfo.label}</span>
                {stockInfo.status === 'low' && stock <= 5 && (
                    <span style={{
                        marginLeft: 'var(--spacing-xs)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                    }}>
                        🔥 Selling Fast!
                    </span>
                )}
            </div>
        </>
    );
};

export default StockIndicator;
