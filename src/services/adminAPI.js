import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Products API
export const fetchProducts = () => api.get('/products');
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProductAPI = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProductAPI = (id) => api.delete(`/products/${id}`);

// Orders API  
export const fetchOrders = () => api.get('/orders');
export const fetchOrder = (id) => api.get(`/orders/${id}`);
export const createOrderAPI = (data) => api.post('/orders', data);
export const updateOrderAPI = (id, data) => api.patch(`/orders/${id}/status`, data);
export const exportOrdersAPI = () => api.get('/orders/export/csv', { responseType: 'blob' });

// Coupons API
export const fetchCoupons = () => api.get('/coupons');
export const createCoupon = (data) => api.post('/coupons', data);
export const updateCouponAPI = (code, data) => api.patch(`/coupons/${code}`, data);
export const deleteCouponAPI = (code) => api.delete(`/coupons/${code}`);

// Campaigns API
export const fetchCampaigns = () => api.get('/campaigns');
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaignAPI = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaignAPI = (id) => api.delete(`/campaigns/${id}`);
export const toggleCampaignAPI = (id) => api.patch(`/campaigns/${id}/toggle`);

// Users API (Admin)
export const fetchUsers = () => api.get('/users');
export const fetchUser = (id) => api.get(`/users/${id}`);

// Reviews API (Admin)
export const fetchReviews = (params) => api.get('/reviews/admin', { params });
export const approveReview = (id) => api.patch(`/reviews/${id}/approve`);
export const deleteReviewAPI = (id) => api.delete(`/reviews/${id}`);

// Analytics API
export const fetchAnalytics = (params) => api.get('/analytics/overview', { params });
export const fetchSalesAnalytics = (params) => api.get('/analytics/sales', { params });

export default api;
