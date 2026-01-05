// Page Skeleton Component - Skeleton loaders for better perceived performance

const PageSkeleton = ({ type = 'page' }) => {
    if (type === 'product-grid') {
        return (
            <div className="skeleton-product-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="skeleton-product-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text skeleton-title"></div>
                        <div className="skeleton-text skeleton-price"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'product-detail') {
        return (
            <div className="skeleton-product-detail">
                <div className="skeleton-product-images">
                    <div className="skeleton-main-image"></div>
                    <div className="skeleton-thumbnails">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton-thumbnail"></div>
                        ))}
                    </div>
                </div>
                <div className="skeleton-product-info">
                    <div className="skeleton-text skeleton-title-large"></div>
                    <div className="skeleton-text skeleton-price-large"></div>
                    <div className="skeleton-text skeleton-description"></div>
                    <div className="skeleton-text skeleton-description"></div>
                    <div className="skeleton-button"></div>
                </div>
            </div>
        );
    }

    if (type === 'admin-table') {
        return (
            <div className="skeleton-admin-table">
                <div className="skeleton-table-header"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton-table-row">
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                        <div className="skeleton-cell"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Default page skeleton
    return (
        <div className="skeleton-page">
            <div className="skeleton-header">
                <div className="skeleton-text skeleton-title-large"></div>
            </div>
            <div className="skeleton-content">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text skeleton-short"></div>
            </div>
        </div>
    );
};

export default PageSkeleton;
