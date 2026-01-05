// Base Repository - Provides abstraction for data operations
// Supports both demo mode (IndexedDB) and production mode (API)

// Check if we're in demo mode
export const isDemoMode = () => {
    return import.meta.env.VITE_DEMO_MODE === 'true';
};

// Create a repository that switches between demo and production implementations
export const createRepository = (demoImpl, apiImpl) => {
    return new Proxy({}, {
        get(target, prop) {
            const impl = isDemoMode() ? demoImpl : apiImpl;
            if (typeof impl[prop] === 'function') {
                return (...args) => impl[prop](...args);
            }
            return impl[prop];
        }
    });
};

export default { isDemoMode, createRepository };
