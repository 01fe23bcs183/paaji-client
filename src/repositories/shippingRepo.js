// Shipping Repository - Abstraction layer for shipping operations
import { isDemoMode, createRepository } from './baseRepo';
import * as storage from '../services/storage';
import api from '../services/api';

// Demo mode implementation (IndexedDB)
const demoImpl = {
    async getZones() {
        return await storage.getShippingZones();
    },
    
    async addZone(zoneData) {
        return await storage.addShippingZone(zoneData);
    },
    
    async updateZone(id, zoneData) {
        return await storage.updateShippingZone(id, zoneData);
    },
    
    async deleteZone(id) {
        return await storage.deleteShippingZone(id);
    },
    
    async calculateShipping(pincode, cartTotal) {
        return await storage.calculateShipping(pincode, cartTotal);
    },
};

// Production mode implementation (API)
const apiImpl = {
    async getZones() {
        const response = await api.get('/shipping/zones');
        return response.data.zones || response.data;
    },
    
    async addZone(zoneData) {
        const response = await api.post('/shipping/zones', zoneData);
        return response.data.zone || response.data;
    },
    
    async updateZone(id, zoneData) {
        const response = await api.patch(`/shipping/zones/${id}`, zoneData);
        return response.data.zone || response.data;
    },
    
    async deleteZone(id) {
        await api.delete(`/shipping/zones/${id}`);
        return true;
    },
    
    async calculateShipping(pincode, cartTotal) {
        const response = await api.post('/shipping/calculate', { pincode, cartTotal });
        return response.data;
    },
};

// Export unified repository
export const shippingRepo = createRepository(demoImpl, apiImpl);

// Also export individual functions for convenience
export const getShippingZones = () => shippingRepo.getZones();
export const addShippingZone = (data) => shippingRepo.addZone(data);
export const updateShippingZone = (id, data) => shippingRepo.updateZone(id, data);
export const deleteShippingZone = (id) => shippingRepo.deleteZone(id);
export const calculateShipping = (pincode, cartTotal) => shippingRepo.calculateShipping(pincode, cartTotal);

export default shippingRepo;
