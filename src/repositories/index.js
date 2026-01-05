// Repository Layer - Unified data access abstraction
// Automatically switches between demo mode (IndexedDB) and production mode (API)

export { isDemoMode, createRepository } from './baseRepo';

// Products
export { 
    productsRepo,
    getProducts,
    getProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getFeaturedProducts,
} from './productsRepo';

// Orders
export {
    ordersRepo,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    updateOrderStatus,
    trackOrder,
    getOrdersByStatus,
    getOrdersByCustomer,
    exportOrdersCSV,
} from './ordersRepo';

// Coupons
export {
    couponsRepo,
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    incrementCouponUsage,
} from './couponsRepo';

// Shipping
export {
    shippingRepo,
    getShippingZones,
    addShippingZone,
    updateShippingZone,
    deleteShippingZone,
    calculateShipping,
} from './shippingRepo';
