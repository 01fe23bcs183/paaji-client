// Orders Repository - Abstraction layer for order operations
import { isDemoMode, createRepository } from './baseRepo';
import * as storage from '../services/storage';
import { ordersAPI } from '../services/api';

// Demo mode implementation (IndexedDB)
const demoImpl = {
    async getAll() {
        return await storage.getOrders();
    },
    
    async getById(id) {
        return await storage.getOrder(id);
    },
    
    async create(orderData) {
        return await storage.createOrder(orderData);
    },
    
    async update(id, orderData) {
        return await storage.updateOrder(id, orderData);
    },
    
    async updateStatus(id, status, notes = '') {
        const order = await storage.getOrder(id);
        if (!order) throw new Error('Order not found');
        
        return await storage.updateOrder(id, {
            ...order,
            status,
            statusHistory: [
                ...(order.statusHistory || []),
                { status, timestamp: new Date().toISOString(), notes }
            ]
        });
    },
    
    async track(orderNumber) {
        const orders = await storage.getOrders();
        return orders.find(o => o.orderNumber === orderNumber || o.id === orderNumber) || null;
    },
    
    async getByStatus(status) {
        const orders = await storage.getOrders();
        return orders.filter(o => o.status === status);
    },
    
    async getByCustomerEmail(email) {
        const orders = await storage.getOrders();
        return orders.filter(o => o.customer?.email === email);
    },
    
    async exportCSV() {
        return await storage.exportOrdersToCSV();
    },
};

// Production mode implementation (API)
const apiImpl = {
    async getAll(params = {}) {
        const response = await ordersAPI.getAll(params);
        return response.data.orders || response.data;
    },
    
    async getById(id) {
        const response = await ordersAPI.getById(id);
        return response.data.order || response.data;
    },
    
    async create(orderData) {
        const response = await ordersAPI.create(orderData);
        return response.data.order || response.data;
    },
    
    async update(id, orderData) {
        const response = await ordersAPI.update(id, orderData);
        return response.data.order || response.data;
    },
    
    async updateStatus(id, status, notes = '') {
        const response = await ordersAPI.updateStatus(id, { status, notes });
        return response.data.order || response.data;
    },
    
    async track(orderNumber) {
        const response = await ordersAPI.track(orderNumber);
        return response.data.order || response.data;
    },
    
    async getByStatus(status) {
        const response = await ordersAPI.getAll({ status });
        return response.data.orders || response.data;
    },
    
    async getByCustomerEmail(email) {
        const response = await ordersAPI.getAll({ customerEmail: email });
        return response.data.orders || response.data;
    },
    
    async exportCSV() {
        const response = await ordersAPI.exportCSV();
        // Handle blob download
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    },
};

// Export unified repository
export const ordersRepo = createRepository(demoImpl, apiImpl);

// Also export individual functions for convenience
export const getOrders = () => ordersRepo.getAll();
export const getOrder = (id) => ordersRepo.getById(id);
export const createOrder = (data) => ordersRepo.create(data);
export const updateOrder = (id, data) => ordersRepo.update(id, data);
export const updateOrderStatus = (id, status, notes) => ordersRepo.updateStatus(id, status, notes);
export const trackOrder = (orderNumber) => ordersRepo.track(orderNumber);
export const getOrdersByStatus = (status) => ordersRepo.getByStatus(status);
export const getOrdersByCustomer = (email) => ordersRepo.getByCustomerEmail(email);
export const exportOrdersCSV = () => ordersRepo.exportCSV();

export default ordersRepo;
