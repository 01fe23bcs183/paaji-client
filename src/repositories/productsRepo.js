// Products Repository - Abstraction layer for product operations
import { isDemoMode, createRepository } from './baseRepo';
import * as storage from '../services/storage';
import { productsAPI } from '../services/api';

// Demo mode implementation (IndexedDB)
const demoImpl = {
    async getAll() {
        return await storage.getProducts();
    },
    
    async getById(id) {
        return await storage.getProduct(id);
    },
    
    async getBySlug(slug) {
        const products = await storage.getProducts();
        return products.find(p => p.slug === slug) || null;
    },
    
    async create(productData) {
        return await storage.addProduct(productData);
    },
    
    async update(id, productData) {
        return await storage.updateProduct(id, productData);
    },
    
    async delete(id) {
        return await storage.deleteProduct(id);
    },
    
    async search(query) {
        const products = await storage.getProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery)
        );
    },
    
    async getFeatured() {
        const products = await storage.getProducts();
        return products.filter(p => p.featured);
    },
};

// Production mode implementation (API)
const apiImpl = {
    async getAll(params = {}) {
        const response = await productsAPI.getAll(params);
        return response.data.products || response.data;
    },
    
    async getById(id) {
        const response = await productsAPI.getById(id);
        return response.data.product || response.data;
    },
    
    async getBySlug(slug) {
        const response = await productsAPI.getBySlug(slug);
        return response.data.product || response.data;
    },
    
    async create(productData) {
        const response = await productsAPI.create(productData);
        return response.data.product || response.data;
    },
    
    async update(id, productData) {
        const response = await productsAPI.update(id, productData);
        return response.data.product || response.data;
    },
    
    async delete(id) {
        await productsAPI.delete(id);
        return true;
    },
    
    async search(query) {
        const response = await productsAPI.getAll({ search: query });
        return response.data.products || response.data;
    },
    
    async getFeatured() {
        const response = await productsAPI.getAll({ featured: true });
        return response.data.products || response.data;
    },
};

// Export unified repository
export const productsRepo = createRepository(demoImpl, apiImpl);

// Also export individual functions for convenience
export const getProducts = () => productsRepo.getAll();
export const getProduct = (id) => productsRepo.getById(id);
export const getProductBySlug = (slug) => productsRepo.getBySlug(slug);
export const createProduct = (data) => productsRepo.create(data);
export const updateProduct = (id, data) => productsRepo.update(id, data);
export const deleteProduct = (id) => productsRepo.delete(id);
export const searchProducts = (query) => productsRepo.search(query);
export const getFeaturedProducts = () => productsRepo.getFeatured();

export default productsRepo;
