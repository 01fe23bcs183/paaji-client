// Admin Authentication Service
// Supports both demo mode (localStorage) and production mode (API)

import api from './api';

const ADMIN_KEY = 'jmc-admin-auth';
const ADMIN_TOKEN_KEY = 'jmc-admin-token';

// Check if we're in demo mode (no backend)
const isDemoMode = () => {
    return import.meta.env.VITE_DEMO_MODE === 'true';
};

// ========================================
// Demo Mode Auth (localStorage-based)
// ========================================

const demoLogin = (password) => {
    // In demo mode, use environment variable or prompt user to set password
    // Never use a hardcoded default password in production
    const demoPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD;
    
    if (!demoPassword) {
        console.warn('Demo mode: VITE_DEMO_ADMIN_PASSWORD not set. Admin login disabled.');
        return { 
            success: false, 
            message: 'Admin login not configured. Set VITE_DEMO_ADMIN_PASSWORD in .env.local' 
        };
    }
    
    if (password === demoPassword) {
        const token = btoa(`admin:${Date.now()}:${Math.random().toString(36)}`);
        localStorage.setItem(ADMIN_KEY, 'true');
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        return { success: true, token };
    }
    
    return { success: false, message: 'Invalid password' };
};

const demoLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const demoIsAuthenticated = () => {
    return localStorage.getItem(ADMIN_KEY) === 'true';
};

const demoChangePassword = () => {
    // In demo mode, password changes are not supported
    // Password must be changed via environment variable
    return { 
        success: false, 
        message: 'Password changes not supported in demo mode. Update VITE_DEMO_ADMIN_PASSWORD in .env.local' 
    };
};

// ========================================
// Production Mode Auth (API-based)
// ========================================

const apiLogin = async (email, password) => {
    try {
        const response = await api.post('/auth/admin/login', { email, password });
        const { token, admin } = response.data;
        
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        localStorage.setItem(ADMIN_KEY, 'true');
        
        return { success: true, token, admin };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed',
        };
    }
};

const apiLogout = async () => {
    try {
        await api.post('/auth/admin/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
};

const apiIsAuthenticated = async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;
    
    try {
        await api.get('/auth/admin/verify');
        return true;
    } catch (error) {
        // Token invalid or expired
        localStorage.removeItem(ADMIN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        return false;
    }
};

const apiChangePassword = async (currentPassword, newPassword) => {
    try {
        await api.post('/auth/admin/change-password', { currentPassword, newPassword });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Password change failed',
        };
    }
};

// ========================================
// Unified Admin Auth API
// ========================================

export const adminLogin = async (credentials) => {
    if (isDemoMode()) {
        // Demo mode only uses password
        return demoLogin(credentials.password || credentials);
    }
    // Production mode uses email + password
    return apiLogin(credentials.email, credentials.password);
};

export const adminLogout = async () => {
    if (isDemoMode()) {
        return demoLogout();
    }
    return apiLogout();
};

export const isAdminAuthenticated = async () => {
    if (isDemoMode()) {
        return demoIsAuthenticated();
    }
    return apiIsAuthenticated();
};

// Synchronous check for immediate UI updates
export const isAdminAuthenticatedSync = () => {
    return localStorage.getItem(ADMIN_KEY) === 'true';
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
    if (isDemoMode()) {
        return demoChangePassword();
    }
    return apiChangePassword(currentPassword, newPassword);
};

export const getAdminToken = () => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export default {
    login: adminLogin,
    logout: adminLogout,
    isAuthenticated: isAdminAuthenticated,
    isAuthenticatedSync: isAdminAuthenticatedSync,
    changePassword: changeAdminPassword,
    getToken: getAdminToken,
    isDemoMode,
};
