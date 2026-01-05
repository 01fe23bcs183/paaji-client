// Loading Spinner Component - Used as fallback for lazy-loaded routes

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    const sizeClasses = {
        small: 'loading-spinner-small',
        medium: 'loading-spinner-medium',
        large: 'loading-spinner-large',
    };

    return (
        <div className={`loading-spinner-container ${sizeClasses[size]}`}>
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
