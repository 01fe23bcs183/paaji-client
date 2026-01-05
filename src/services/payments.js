// Payment Gateway Integration Service
import { getPaymentConfig } from './storage';

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Load Cashfree script
export const loadCashfreeScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// ========================================
// Razorpay Payment
// ========================================

export const processRazorpayPayment = async (orderData) => {
    const config = getPaymentConfig();

    if (!config.razorpay.enabled || !config.razorpay.keyId) {
        throw new Error('Razorpay is not configured');
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
    }

    return new Promise((resolve, reject) => {
        const options = {
            key: config.razorpay.keyId,
            amount: Math.round(orderData.total * 100), // Convert to paise
            currency: 'INR',
            name: 'JMC Skincare',
            description: `Order #${orderData.orderId || 'NEW'}`,
            image: '/logo.png', // Update with your logo
            order_id: orderData.razorpayOrderId, // This should come from backend
            prefill: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                contact: orderData.customer.phone,
            },
            theme: {
                color: '#C4A77D', // Primary brand color
            },
            handler: function (response) {
                // Payment successful
                resolve({
                    success: true,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                });
            },
            modal: {
                ondismiss: function () {
                    reject({
                        success: false,
                        message: 'Payment cancelled by user',
                    });
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    });
};

// ========================================
// Cashfree Payment
// ========================================

export const processCashfreePayment = async (orderData) => {
    const config = getPaymentConfig();

    if (!config.cashfree.enabled || !config.cashfree.appId) {
        throw new Error('Cashfree is not configured');
    }

    // Load Cashfree script
    const scriptLoaded = await loadCashfreeScript();
    if (!scriptLoaded) {
        throw new Error('Failed to load Cashfree SDK');
    }

    // In production, you'd call your backend to create a Cashfree order
    // For now, we'll simulate the payment flow

    return new Promise((resolve, reject) => {
        const cashfree = window.Cashfree;

        if (!cashfree) {
            reject({ success: false, message: 'Cashfree SDK not loaded' });
            return;
        }

        // Initialize Cashfree
        cashfree.initialize({
            mode: config.cashfree.testMode ? 'sandbox' : 'production',
        });

        const paymentSessionId = orderData.cashfreePaymentSessionId; // From backend

        const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: '_modal',
        };

        cashfree.checkout(checkoutOptions).then((result) => {
            if (result.error) {
                reject({
                    success: false,
                    message: result.error.message,
                });
            } else if (result.paymentDetails) {
                resolve({
                    success: true,
                    paymentId: result.paymentDetails.paymentId,
                    orderId: result.paymentDetails.orderId,
                });
            }
        });
    });
};

// ========================================
// Mock Payment (for development/testing)
// ========================================

export const processMockPayment = async (orderData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful payment
            resolve({
                success: true,
                paymentId: `MOCK_${Date.now()}`,
                orderId: orderData.orderId || 'NEW',
                message: 'Mock payment successful',
            });
        }, 2000);
    });
};

// ========================================
// Unified Payment Handler
// ========================================

export const processPayment = async (gateway, orderData) => {
    try {
        switch (gateway.toLowerCase()) {
            case 'razorpay':
                return await processRazorpayPayment(orderData);

            case 'cashfree':
                return await processCashfreePayment(orderData);

            case 'mock':
            case 'cod':
                return await processMockPayment(orderData);

            default:
                throw new Error(`Unknown payment gateway: ${gateway}`);
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
    }
};

// ========================================
// Payment Method Icons
// ========================================

export const getPaymentMethodIcon = (method) => {
    const icons = {
        upi: '📱',
        card: '💳',
        netbanking: '🏦',
        wallet: '👛',
        cod: '💰',
    };

    return icons[method.toLowerCase()] || '💳';
};

// ========================================
// Supported Payment Methods
// ========================================

export const getAvailablePaymentMethods = () => {
    const config = getPaymentConfig();
    const methods = [];

    if (config.razorpay.enabled) {
        methods.push({
            id: 'razorpay',
            name: 'Razorpay',
            description: 'UPI, Cards, Netbanking, Wallets',
            logo: '/razorpay-logo.png',
            supported: ['upi', 'card', 'netbanking', 'wallet'],
        });
    }

    if (config.cashfree.enabled) {
        methods.push({
            id: 'cashfree',
            name: 'Cashfree',
            description: 'UPI, Cards, Netbanking, Wallets',
            logo: '/cashfree-logo.png',
            supported: ['upi', 'card', 'netbanking', 'wallet'],
        });
    }

    // Always show COD as fallback
    methods.push({
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive',
        logo: null,
        supported: ['cash'],
    });

    return methods;
};

// ========================================
// Verify Payment
// ========================================

import api from './api';

// Check if we're in demo mode
const isDemoMode = () => {
    return import.meta.env.VITE_DEMO_MODE === 'true';
};

export const verifyPayment = async (paymentId, orderId, gateway = 'razorpay', signature = null) => {
    // In demo mode, simulate successful verification
    if (isDemoMode()) {
        console.warn('Payment verification in demo mode - always returns success');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    verified: true,
                    status: 'success',
                    message: 'Demo mode - payment verification simulated',
                });
            }, 500);
        });
    }

    // Production mode - verify with backend
    try {
        const response = await api.post('/payments/verify', {
            paymentId,
            orderId,
            gateway,
            signature, // Required for Razorpay signature verification
        });

        return {
            verified: response.data.verified,
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Payment verification failed:', error);
        return {
            verified: false,
            status: 'failed',
            message: error.response?.data?.message || 'Payment verification failed',
        };
    }
};

// ========================================
// Format Currency
// ========================================

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// ========================================
// Calculate Order Total
// ========================================

export const calculateOrderTotal = (items, shippingCost = 0, discount = 0) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const total = subtotal + shippingCost - discount;

    return {
        subtotal,
        shippingCost,
        discount,
        total: Math.max(0, total), // Ensure total is never negative
    };
};

// ========================================
// Send Order Notifications
// ========================================

export const sendOrderNotifications = async (order) => {
    // In demo mode, just log the notifications
    if (isDemoMode()) {
        console.log('📧 [Demo] Email notification to:', order.customer.email);
        console.log('📱 [Demo] WhatsApp notification to:', order.customer.phone);
        return {
            email: true,
            whatsapp: true,
            message: 'Demo mode - notifications simulated',
        };
    }

    // Production mode - call backend to send real notifications
    try {
        const response = await api.post('/notifications/order', {
            orderId: order.id,
            customerEmail: order.customer.email,
            customerPhone: order.customer.phone,
            orderDetails: {
                items: order.items,
                total: order.total,
                status: order.status,
            },
        });

        return {
            email: response.data.emailSent,
            whatsapp: response.data.whatsappSent,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Failed to send notifications:', error);
        return {
            email: false,
            whatsapp: false,
            message: error.response?.data?.message || 'Failed to send notifications',
        };
    }
};

// ========================================
// Generate Order Number
// ========================================

export const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `JMC-${timestamp}-${random}`;
};
