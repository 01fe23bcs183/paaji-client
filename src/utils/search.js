// Search Utility Functions - Product search and filtering logic

// Search products by query
export const searchProducts = (products, query) => {
    if (!query || query.length < 2) return products;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return products.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(lowerQuery);
        const descMatch = product.description?.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.category?.toLowerCase().includes(lowerQuery);
        const tagsMatch = product.tags?.some(tag => 
            tag.toLowerCase().includes(lowerQuery)
        );
        
        return nameMatch || descMatch || categoryMatch || tagsMatch;
    });
};

// Filter products by criteria
export const filterProducts = (products, filters) => {
    let filtered = [...products];
    
    // Filter by category
    if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filter by price range
    if (filters.priceRange?.min !== '' || filters.priceRange?.max !== '') {
        const min = filters.priceRange?.min || 0;
        const max = filters.priceRange?.max || Infinity;
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }
    
    // Filter by stock
    if (filters.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
    }
    
    // Filter by featured
    if (filters.featured) {
        filtered = filtered.filter(p => p.featured);
    }
    
    return filtered;
};

// Sort products
export const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => 
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
        case 'featured':
        default:
            return sorted.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
            });
    }
};

// Combined search, filter, and sort
export const processProducts = (products, { query, filters, sortBy }) => {
    let result = [...products];
    
    // Apply search
    if (query) {
        result = searchProducts(result, query);
    }
    
    // Apply filters
    if (filters) {
        result = filterProducts(result, filters);
    }
    
    // Apply sorting
    if (sortBy) {
        result = sortProducts(result, sortBy);
    }
    
    return result;
};

// Get unique categories from products
export const getCategories = (products) => {
    return [...new Set(products.map(p => p.category).filter(Boolean))];
};

// Get price range from products
export const getPriceRange = (products) => {
    if (products.length === 0) return { min: 0, max: 0 };
    
    const prices = products.map(p => p.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
};

// Highlight search terms in text
export const highlightSearchTerm = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

// Debounce function for search input
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export default {
    searchProducts,
    filterProducts,
    sortProducts,
    processProducts,
    getCategories,
    getPriceRange,
    highlightSearchTerm,
    debounce,
};
