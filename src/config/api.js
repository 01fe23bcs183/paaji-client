// API configuration for production deployment
// This allows switching between development and production backends

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
    baseURL: API_BASE_URL,
    endpoints: {
        // Auth
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        logout: `${API_BASE_URL}/api/auth/logout`,

        // Products
        products: `${API_BASE_URL}/api/products`,
        product: (id) => `${API_BASE_URL}/api/products/${id}`,

        // Orders
        orders: `${API_BASE_URL}/api/orders`,
        order: (id) => `${API_BASE_URL}/api/orders/${id}`,

        // Cart
        cart: `${API_BASE_URL}/api/cart`,

        // Campaigns
        campaigns: `${API_BASE_URL}/api/campaigns`,
        activeCampaigns: `${API_BASE_URL}/api/campaigns/active`,

        // Shiprocket
        shiprocket: `${API_BASE_URL}/api/shiprocket`,

        // Coupons
        coupons: `${API_BASE_URL}/api/coupons`,
        validateCoupon: `${API_BASE_URL}/api/coupons/validate`,

        // Users
        users: `${API_BASE_URL}/api/users`,

        // Analytics
        analytics: `${API_BASE_URL}/api/analytics`,

        // Settings
        settings: `${API_BASE_URL}/api/settings`,
    },
};

// Helper function for API calls
export async function fetchAPI(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(endpoint, mergedOptions);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export default apiConfig;
