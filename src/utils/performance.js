// Performance utilities for the application

/**
 * Debounce function - delays execution until after wait period
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait period
 */
export function throttle(func, wait = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}

/**
 * Preload images for better UX
 */
export function preloadImages(imageUrls) {
    return Promise.all(
        imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(url);
                img.src = url;
            });
        })
    );
}

/**
 * Prefetch a page for faster navigation
 */
export function prefetchPage(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * Measure and log performance metrics
 */
export function logPerformanceMetrics() {
    if (typeof window === 'undefined' || !window.performance) return;

    // Wait for page to fully load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('📊 Performance Metrics:');
            console.log(`  - Page Load Time: ${pageLoadTime}ms`);
            console.log(`  - Server Connection: ${connectTime}ms`);
            console.log(`  - DOM Render: ${renderTime}ms`);

            // Report Core Web Vitals if available
            if ('PerformanceObserver' in window) {
                try {
                    // LCP (Largest Contentful Paint)
                    new PerformanceObserver((entryList) => {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log(`  - LCP: ${lastEntry.startTime.toFixed(0)}ms`);
                    }).observe({ type: 'largest-contentful-paint', buffered: true });

                    // FID (First Input Delay)
                    new PerformanceObserver((entryList) => {
                        const firstInput = entryList.getEntries()[0];
                        console.log(`  - FID: ${firstInput.processingStart - firstInput.startTime}ms`);
                    }).observe({ type: 'first-input', buffered: true });

                    // CLS (Cumulative Layout Shift)
                    let clsValue = 0;
                    new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        }
                        console.log(`  - CLS: ${clsValue.toFixed(3)}`);
                    }).observe({ type: 'layout-shift', buffered: true });
                } catch (e) {
                    console.log('Core Web Vitals not supported');
                }
            }
        }, 100);
    });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
}

/**
 * Check network connection type
 */
export function getNetworkInfo() {
    if (typeof navigator === 'undefined' || !navigator.connection) {
        return { type: 'unknown', saveData: false };
    }

    const { effectiveType, saveData } = navigator.connection;
    return {
        type: effectiveType,
        saveData,
        isSlow: effectiveType === '2g' || effectiveType === 'slow-2g',
    };
}

/**
 * Lazy load component (React.lazy wrapper with retry)
 */
export function lazyWithRetry(componentImport, retries = 3, interval = 1000) {
    return new Promise((resolve, reject) => {
        const attemptLoad = (retriesLeft) => {
            componentImport()
                .then(resolve)
                .catch((error) => {
                    if (retriesLeft === 0) {
                        reject(error);
                        return;
                    }
                    setTimeout(() => attemptLoad(retriesLeft - 1), interval);
                });
        };
        attemptLoad(retries);
    });
}

/**
 * Memory cleanup helper
 */
export function cleanupMemory() {
    // Clear unnecessary caches
    if ('caches' in window) {
        caches.keys().then((names) => {
            names.forEach((name) => {
                if (name.includes('old') || name.includes('deprecated')) {
                    caches.delete(name);
                }
            });
        });
    }

    // Suggest garbage collection (Chrome only)
    if (window.gc) {
        window.gc();
    }
}

/**
 * Service Worker registration
 */
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('[PWA] Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] New Service Worker installing...');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content available
                        console.log('[PWA] New content available, refresh to update');
                        // Optionally notify user about update
                        if (window.confirm('New version available! Reload to update?')) {
                            window.location.reload();
                        }
                    }
                });
            });

            return registration;
        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
            return null;
        }
    }
    return null;
}

/**
 * Request push notification permission
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('[Push] Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

export default {
    debounce,
    throttle,
    preloadImages,
    prefetchPage,
    logPerformanceMetrics,
    prefersReducedMotion,
    getNetworkInfo,
    registerServiceWorker,
    requestNotificationPermission,
};
