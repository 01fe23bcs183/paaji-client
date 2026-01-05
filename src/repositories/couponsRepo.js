// Coupons Repository - Abstraction layer for coupon operations
import { isDemoMode, createRepository } from './baseRepo';
import * as storage from '../services/storage';
import { couponsAPI } from '../services/api';

// Demo mode implementation (IndexedDB)
const demoImpl = {
    async getAll() {
        return await storage.getCoupons();
    },
    
    async getByCode(code) {
        return await storage.getCoupon(code);
    },
    
    async create(couponData) {
        return await storage.addCoupon(couponData);
    },
    
    async update(code, couponData) {
        return await storage.updateCoupon(code, couponData);
    },
    
    async delete(code) {
        return await storage.deleteCoupon(code);
    },
    
    async validate(code, orderTotal) {
        return await storage.validateCoupon(code, orderTotal);
    },
    
    async incrementUsage(code) {
        const coupon = await storage.getCoupon(code);
        if (coupon) {
            return await storage.updateCoupon(code, {
                ...coupon,
                usageCount: (coupon.usageCount || 0) + 1
            });
        }
        return null;
    },
};

// Production mode implementation (API)
const apiImpl = {
    async getAll() {
        const response = await couponsAPI.getAll();
        return response.data.coupons || response.data;
    },
    
    async getByCode(code) {
        const response = await couponsAPI.getByCode(code);
        return response.data.coupon || response.data;
    },
    
    async create(couponData) {
        const response = await couponsAPI.create(couponData);
        return response.data.coupon || response.data;
    },
    
    async update(code, couponData) {
        const response = await couponsAPI.update(code, couponData);
        return response.data.coupon || response.data;
    },
    
    async delete(code) {
        await couponsAPI.delete(code);
        return true;
    },
    
    async validate(code, orderTotal) {
        const response = await couponsAPI.validate(code, orderTotal);
        return response.data;
    },
    
    async incrementUsage(code) {
        const response = await couponsAPI.incrementUsage(code);
        return response.data.coupon || response.data;
    },
};

// Export unified repository
export const couponsRepo = createRepository(demoImpl, apiImpl);

// Also export individual functions for convenience
export const getCoupons = () => couponsRepo.getAll();
export const getCoupon = (code) => couponsRepo.getByCode(code);
export const createCoupon = (data) => couponsRepo.create(data);
export const updateCoupon = (code, data) => couponsRepo.update(code, data);
export const deleteCoupon = (code) => couponsRepo.delete(code);
export const validateCoupon = (code, orderTotal) => couponsRepo.validate(code, orderTotal);
export const incrementCouponUsage = (code) => couponsRepo.incrementUsage(code);

export default couponsRepo;
