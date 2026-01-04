import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
};

// Orders API
export const ordersAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
    updateStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
    exportCSV: () => api.get('/orders/export/csv', { responseType: 'blob' }),
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.patch('/users/profile', data),
    getOrders: () => api.get('/users/orders'),

    // Address management
    addAddress: (address) => api.post('/users/addresses', address),
    updateAddress: (addressId, address) => api.patch(`/users/addresses/${addressId}`, address),
    deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),

    // Wishlist
    getWishlist: () => api.get('/users/wishlist'),
    addToWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
    removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
};

// Reviews API
export const reviewsAPI = {
    getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
    create: (reviewData) => api.post('/reviews', reviewData),
    update: (id, reviewData) => api.patch(`/reviews/${id}`, reviewData),
    delete: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.patch(`/reviews/${id}/helpful`),

    // Admin
    getAllReviews: (params) => api.get('/reviews/admin', { params }),
    approve: (id) => api.patch(`/reviews/${id}/approve`),
};

// Coupons API
export const couponsAPI = {
    validate: (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal }),
    getAll: () => api.get('/coupons'),
    create: (couponData) => api.post('/coupons', couponData),
    delete: (code) => api.delete(`/coupons/${code}`),
};

// Analytics API (Admin)
export const analyticsAPI = {
    getOverview: (params) => api.get('/analytics/overview', { params }),
    getSales: (params) => api.get('/analytics/sales', { params }),
    getProducts: () => api.get('/analytics/products'),
    getCustomers: () => api.get('/analytics/customers'),
    getReviews: () => api.get('/analytics/reviews'),
};

export default api;
