import { useState, useEffect, useRef } from 'react';

/**
 * Lazy loading image component with blur placeholder
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {string} props.placeholder - Placeholder color or blur image
 * @param {function} props.onLoad - Callback when image loads
 * @param {function} props.onError - Callback when image fails to load
 */
const LazyImage = ({
    src,
    alt = '',
    className = '',
    style = {},
    placeholder = 'var(--color-background-alt)',
    onLoad,
    onError,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Load images 100px before they enter viewport
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    return (
        <div
            ref={containerRef}
            className={`lazy-image-container ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: placeholder,
                ...style,
            }}
        >
            {/* Placeholder shimmer */}
            {!isLoaded && !hasError && (
                <div
                    className="lazy-image-placeholder"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(90deg, ${placeholder} 0%, rgba(255,255,255,0.2) 50%, ${placeholder} 100%)`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                    }}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-background-alt)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                    }}
                >
                    <span>📷</span>
                </div>
            )}

            {/* Actual image */}
            {isInView && !hasError && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    loading="lazy"
                    decoding="async"
                    {...props}
                />
            )}

            <style>
                {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
            </style>
        </div>
    );
};

/**
 * Optimized background image component
 */
export const LazyBackground = ({
    src,
    children,
    className = '',
    style = {},
    placeholder = 'var(--color-background-alt)',
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const img = new Image();
                    img.onload = () => setIsLoaded(true);
                    img.src = src;
                    observer.disconnect();
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                background: isLoaded ? `url(${src}) center/cover no-repeat` : placeholder,
                transition: 'background 0.3s ease',
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default LazyImage;
