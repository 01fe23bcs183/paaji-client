// Storage Service using IndexedDB and localStorage
import { openDB } from 'idb';

const DB_NAME = 'jmc-store';
const DB_VERSION = 1;

// Initialize IndexedDB
export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
      }
      
      // Media store (images/videos)
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
      }
      
      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
      }
      
      // Coupons store
      if (!db.objectStoreNames.contains('coupons')) {
        db.createObjectStore('coupons', { keyPath: 'code' });
      }
      
      // Shipping zones store
      if (!db.objectStoreNames.contains('shipping')) {
        db.createObjectStore('shipping', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// ========================================
// Products
// ========================================

export const getProducts = async () => {
  const db = await initDB();
  return await db.getAll('products');
};

export const getProduct = async (id) => {
  const db = await initDB();
  return await db.get('products', id);
};

export const addProduct = async (product) => {
  const db = await initDB();
  const id = await db.add('products', { ...product, createdAt: new Date().toISOString() });
  return id;
};

export const updateProduct = async (id, product) => {
  const db = await initDB();
  await db.put('products', { ...product, id, updatedAt: new Date().toISOString() });
};

export const deleteProduct = async (id) => {
  const db = await initDB();
  await db.delete('products', id);
};

// ========================================
// Media (Images/Videos)
// ========================================

export const saveMedia = async (file, metadata = {}) => {
  const db = await initDB();
  
  // Convert file to base64 for storage
  const base64 = await fileToBase64(file);
  
  const mediaItem = {
    name: file.name,
    type: file.type,
    size: file.size,
    data: base64,
    ...metadata,
    createdAt: new Date().toISOString(),
  };
  
  const id = await db.add('media', mediaItem);
  return { id, ...mediaItem };
};

export const getMedia = async () => {
  const db = await initDB();
  return await db.getAll('media');
};

export const getMediaById = async (id) => {
  const db = await initDB();
  return await db.get('media', id);
};

export const deleteMedia = async (id) => {
  const db = await initDB();
  await db.delete('media', id);
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// ========================================
// Orders
// ========================================

export const getOrders = async () => {
  const db = await initDB();
  const orders = await db.getAll('orders');
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getOrder = async (id) => {
  const db = await initDB();
  return await db.get('orders', id);
};

export const createOrder = async (orderData) => {
  const db = await initDB();
  const order = {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const id = await db.add('orders', order);
  return { id, ...order };
};

export const updateOrder = async (id, updates) => {
  const db = await initDB();
  const order = await db.get('orders', id);
  await db.put('orders', { ...order, ...updates, updatedAt: new Date().toISOString() });
};

// ========================================
// Settings (localStorage)
// ========================================

const SETTINGS_KEY = 'jmc-settings';

export const getSettings = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : getDefaultSettings();
};

export const updateSettings = (updates) => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...updates };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  return newSettings;
};

const getDefaultSettings = () => ({
  siteName: 'JMC',
  tagline: 'Luxury Skincare',
  logo: null,
  favicon: null,
  primaryColor: '#C4A77D',
  secondaryColor: '#2C2C2C',
  contactEmail: '',
  contactPhone: '',
  whatsappNumber: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
  googleAnalyticsId: '',
  facebookPixelId: '',
  instagramPixelId: '',
});

// ========================================
// Coupons
// ========================================

export const getCoupons = async () => {
  const db = await initDB();
  return await db.getAll('coupons');
};

export const getCoupon = async (code) => {
  const db = await initDB();
  return await db.get('coupons', code.toUpperCase());
};

export const addCoupon = async (coupon) => {
  const db = await initDB();
  await db.add('coupons', { 
    ...coupon, 
    code: coupon.code.toUpperCase(),
    createdAt: new Date().toISOString() 
  });
};

export const updateCoupon = async (code, updates) => {
  const db = await initDB();
  const coupon = await db.get('coupons', code);
  await db.put('coupons', { ...coupon, ...updates });
};

export const deleteCoupon = async (code) => {
  const db = await initDB();
  await db.delete('coupons', code);
};

export const validateCoupon = async (code, cartTotal) => {
  const coupon = await getCoupon(code);
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
    return { valid: false, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
  }
  
  return { valid: true, coupon };
};

// ========================================
// Shipping Zones
// ========================================

export const getShippingZones = async () => {
  const db = await initDB();
  return await db.getAll('shipping');
};

export const addShippingZone = async (zone) => {
  const db = await initDB();
  return await db.add('shipping', zone);
};

export const updateShippingZone = async (id, updates) => {
  const db = await initDB();
  const zone = await db.get('shipping', id);
  await db.put('shipping', { ...zone, ...updates });
};

export const deleteShippingZone = async (id) => {
  const db = await initDB();
  await db.delete('shipping', id);
};

export const calculateShipping = async (pincode) => {
  const zones = await getShippingZones();
  
  // Find matching zone by pincode
  const zone = zones.find(z => {
    if (z.pincodes && Array.isArray(z.pincodes)) {
      return z.pincodes.includes(pincode);
    }
    return false;
  });
  
  if (zone) {
    return {
      rate: zone.rate,
      deliveryDays: zone.deliveryDays,
      zoneName: zone.name,
    };
  }
  
  // Default shipping for unknown zones
  return {
    rate: 100,
    deliveryDays: '7-10',
    zoneName: 'Standard',
  };
};

// ========================================
// Payment Gateway Config (localStorage)
// ========================================

const PAYMENT_KEY = 'jmc-payment-config';

export const getPaymentConfig = () => {
  const config = localStorage.getItem(PAYMENT_KEY);
  return config ? JSON.parse(config) : {
    razorpay: {
      enabled: false,
      keyId: '',
      keySecret: '',
      testMode: true,
    },
    cashfree: {
      enabled: false,
      appId: '',
      secretKey: '',
      testMode: true,
    },
  };
};

export const updatePaymentConfig = (gateway, updates) => {
  const config = getPaymentConfig();
  config[gateway] = { ...config[gateway], ...updates };
  localStorage.setItem(PAYMENT_KEY, JSON.stringify(config));
  return config;
};

// ========================================
// Admin Auth (DEPRECATED - use adminAuth.js instead)
// ========================================
// These functions are kept for backward compatibility but should not be used.
// Import from '../services/adminAuth' instead for proper auth handling.

import adminAuth from './adminAuth';

// @deprecated Use adminAuth.login() instead
export const adminLogin = (password) => {
  console.warn('adminLogin from storage.js is deprecated. Use adminAuth.login() instead.');
  return adminAuth.login({ password });
};

// @deprecated Use adminAuth.logout() instead
export const adminLogout = () => {
  console.warn('adminLogout from storage.js is deprecated. Use adminAuth.logout() instead.');
  return adminAuth.logout();
};

// @deprecated Use adminAuth.isAuthenticatedSync() instead
export const isAdminAuthenticated = () => {
  return adminAuth.isAuthenticatedSync();
};

// @deprecated Use adminAuth.changePassword() instead
export const changeAdminPassword = (currentPassword, newPassword) => {
  console.warn('changeAdminPassword from storage.js is deprecated. Use adminAuth.changePassword() instead.');
  return adminAuth.changePassword(currentPassword, newPassword);
};

// ========================================
// Export Orders to CSV
// ========================================

export const exportOrdersToCSV = async () => {
  const orders = await getOrders();
  
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Email',
    'Phone',
    'Items',
    'Subtotal',
    'Shipping',
    'Total',
    'Status',
    'Payment Method',
  ];
  
  const rows = orders.map(order => [
    order.id,
    new Date(order.createdAt).toLocaleDateString(),
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
    `₹${order.subtotal}`,
    `₹${order.shippingCost}`,
    `₹${order.total}`,
    order.status,
    order.paymentMethod,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `jmc-orders-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ========================================
// Initialize Default Data
// ========================================

export const initializeDefaultData = async () => {
  const products = await getProducts();
  
  // Only initialize if no products exist
  if (products.length === 0) {
    // Add default products
    const defaultProducts = [
      {
        name: 'Lemon Facewash',
        slug: 'lemon-facewash',
        description: 'Refreshing lemon-infused facewash for deep cleansing and brightening.',
        price: 499,
        comparePrice: 599,
        stock: 50,
        images: [],
        video: null,
        variants: [
          { name: '100ml', price: 499, stock: 30 },
          { name: '200ml', price: 799, stock: 20 },
        ],
        featured: true,
      },
      {
        name: 'Centella Reversa Night Cream',
        slug: 'centella-reversa-night-cream',
        description: 'Intensive overnight repair cream with Centella Asiatica for rejuvenated skin.',
        price: 899,
        comparePrice: 1099,
        stock: 40,
        images: [],
        video: null,
        variants: [
          { name: '50g', price: 899, stock: 40 },
        ],
        featured: true,
      },
      {
        name: 'JMC Skin Tint with SPF',
        slug: 'jmc-skin-tint-spf',
        description: 'Lightweight skin tint with SPF 30 for natural coverage and sun protection.',
        price: 699,
        comparePrice: 849,
        stock: 35,
        images: [],
        video: null,
        variants: [
          { name: 'Light', price: 699, stock: 15 },
          { name: 'Medium', price: 699, stock: 12 },
          { name: 'Dark', price: 699, stock: 8 },
        ],
        featured: true,
      },
    ];
    
    for (const product of defaultProducts) {
      await addProduct(product);
    }
    
    // Add default shipping zones
    await addShippingZone({
      name: 'Local (Same City)',
      pincodes: ['400001', '400002', '400003'], // Example Mumbai pincodes
      rate: 50,
      deliveryDays: '2-3',
    });
    
    await addShippingZone({
      name: 'Metro Cities',
      pincodes: ['110001', '560001', '700001'], // Delhi, Bangalore, Kolkata
      rate: 80,
      deliveryDays: '3-5',
    });
    
    await addShippingZone({
      name: 'Rest of India',
      pincodes: [], // Catch-all
      rate: 100,
      deliveryDays: '5-7',
    });
    
    // Add sample coupons
    await addCoupon({
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minPurchase: 500,
      maxDiscount: 200,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      usageLimit: 100,
      usageCount: 0,
    });
    
    console.log('✅ Default data initialized');
  }
};
