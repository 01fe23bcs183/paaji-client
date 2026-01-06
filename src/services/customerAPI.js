import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests (for authenticated users)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            // Optionally redirect to login
        }
        return Promise.reject(error);
    }
);

// ========================================
// Products API (Customer-facing)
// ========================================

export const getProducts = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.featured) params.append('featured', 'true');
        if (options.category) params.append('category', options.category);
        if (options.search) params.append('search', options.search);

        const response = await api.get(`/products?${params.toString()}`);
        return response.data.products || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/products/slug/${slug}`);
        return response.data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

// ========================================
// Orders API (Customer-facing)
// ========================================

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getOrderByNumber = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/track/${orderNumber}`);
        return response.data.order;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders/my');
        return response.data.orders || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

// ========================================
// Coupons API (Customer-facing)
// ========================================

export const validateCoupon = async (code, orderTotal, productIds = []) => {
    try {
        const response = await api.post('/coupons/validate', {
            code,
            orderTotal,
            productIds
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            valid: false,
            message: error.response?.data?.message || 'Invalid coupon'
        };
    }
};

// ========================================
// Shipping API (Customer-facing)
// ========================================

export const getShippingRates = async (pincode, weight = 500) => {
    try {
        const response = await api.get(`/shiprocket/serviceability`, {
            params: { pickup_postcode: '400001', delivery_postcode: pincode, weight }
        });

        if (response.data.success && response.data.couriers?.length > 0) {
            const cheapest = response.data.couriers.reduce((min, c) =>
                c.rate < min.rate ? c : min
            );
            return {
                rate: cheapest.rate,
                deliveryDays: cheapest.etd || '5-7',
                courierName: cheapest.courier_name,
                available: true
            };
        }

        // Default fallback
        return {
            rate: 99,
            deliveryDays: '5-7',
            courierName: 'Standard',
            available: true
        };
    } catch (error) {
        console.error('Error calculating shipping:', error);
        return {
            rate: 99,
            deliveryDays: '5-7',
            courierName: 'Standard',
            available: true
        };
    }
};

// ========================================
// Reviews API (Customer-facing)
// ========================================

export const getProductReviews = async (productId) => {
    try {
        const response = await api.get(`/reviews/product/${productId}`);
        return response.data.reviews || [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

export const submitReview = async (reviewData) => {
    try {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ========================================
// Auth API
// ========================================

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('auth_token');
    api.post('/auth/logout').catch(() => { });
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data.user;
    } catch (error) {
        return null;
    }
};

// ========================================
// Campaigns API
// ========================================

export const getActiveCampaigns = async () => {
    try {
        const response = await api.get('/campaigns/active');
        return response.data.campaigns || [];
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
    }
};

export default api;
