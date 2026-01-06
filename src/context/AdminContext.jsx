import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProductAPI,
    deleteProductAPI,
    fetchOrders,
    fetchOrder,
    createOrderAPI,
    updateOrderAPI,
    fetchCoupons,
    createCoupon,
    updateCouponAPI,
    deleteCouponAPI,
    exportOrdersAPI,
} from '../services/adminAPI';
import {
    getShippingZones,
    addShippingZone,
    updateShippingZone,
    deleteShippingZone,
    getMedia,
    saveMedia,
    deleteMedia,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,
} from '../services/storage';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [shippingZones, setShippingZones] = useState([]);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadAdminData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsRes, ordersRes, couponsRes, zonesData, mediaData] = await Promise.all([
                fetchProducts(),
                fetchOrders(),
                fetchCoupons(),
                getShippingZones(),
                getMedia(),
            ]);

            const productsData = productsRes.data;
            const ordersData = ordersRes.data;
            const couponsData = couponsRes.data.coupons || couponsRes.data;

            setProducts(productsData);
            setOrders(ordersData);
            setCoupons(couponsData);
            setShippingZones(zonesData);
            setMedia(mediaData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsAuthenticated(isAdminAuthenticated());
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadAdminData();
        }
    }, [isAuthenticated, loadAdminData]);

    // Auth
    const login = async (password) => {
        const result = adminLogin(password);
        if (result.success) {
            setIsAuthenticated(true);
            return { success: true };
        }
        return { success: false, message: result.message };
    };

    const logout = () => {
        adminLogout();
        setIsAuthenticated(false);
        setProducts([]);
        setOrders([]);
        setCoupons([]);
        setShippingZones([]);
        setMedia([]);
    };

    // Products
    const addNewProduct = async (productData) => {
        try {
            const response = await createProduct(productData);
            const newProduct = response.data.product || response.data;
            setProducts(prev => [...prev, newProduct]);
            return { success: true, product: newProduct };
        } catch (error) {
            console.error('Error adding product:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const editProduct = async (id, updates) => {
        try {
            const response = await updateProductAPI(id, updates);
            const updated = response.data.product || response.data;
            setProducts(prev => prev.map(p => p.id === id ? updated : p));
            return { success: true, product: updated };
        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const removeProduct = async (id) => {
        try {
            await deleteProductAPI(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    // Orders
    const newOrder = async (orderData) => {
        try {
            const response = await createOrderAPI(orderData);
            const order = response.data.order || response.data;
            setOrders(prev => [order, ...prev]);
            return { success: true, order };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const editOrder = async (id, updates) => {
        try {
            const response = await updateOrderAPI(id, updates);
            const updated = response.data.order || response.data;
            setOrders(prev => prev.map(o => o.id === id ? updated : o));
            return { success: true, order: updated };
        } catch (error) {
            console.error('Error updating order:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const exportOrders = async () => {
        try {
            const response = await exportOrdersAPI();
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            return { success: true };
        } catch (error) {
            console.error('Error exporting orders:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    // Coupons
    const addNewCoupon = async (couponData) => {
        try {
            const response = await createCoupon(couponData);
            const newCoupon = response.data.coupon || response.data;
            setCoupons(prev => [...prev, newCoupon]);
            return { success: true, coupon: newCoupon };
        } catch (error) {
            console.error('Error adding coupon:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const editCoupon = async (code, updates) => {
        try {
            await updateCouponAPI(code, updates);
            const response = await fetchCoupons();
            setCoupons(response.data.coupons || response.data);
            return { success: true };
        } catch (error) {
            console.error('Error updating coupon:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const removeCoupon = async (code) => {
        try {
            await deleteCouponAPI(code);
            setCoupons(prev => prev.filter(c => c.code !== code));
            return { success: true };
        } catch (error) {
            console.error('Error deleting coupon:', error);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    // Shipping Zones
    const addNewShippingZone = async (zoneData) => {
        try {
            const id = await addShippingZone(zoneData);
            const updatedZones = await getShippingZones();
            setShippingZones(updatedZones);
            return { success: true, id };
        } catch (error) {
            console.error('Error adding shipping zone:', error);
            return { success: false, message: error.message };
        }
    };

    const editShippingZone = async (id, updates) => {
        try {
            await updateShippingZone(id, updates);
            const updatedZones = await getShippingZones();
            setShippingZones(updatedZones);
            return { success: true };
        } catch (error) {
            console.error('Error updating shipping zone:', error);
            return { success: false, message: error.message };
        }
    };

    const removeShippingZone = async (id) => {
        try {
            await deleteShippingZone(id);
            setShippingZones(prev => prev.filter(z => z.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting shipping zone:', error);
            return { success: false, message: error.message };
        }
    };

    // Media
    const uploadMedia = async (file, metadata) => {
        try {
            const mediaItem = await saveMedia(file, metadata);
            setMedia(prev => [mediaItem, ...prev]);
            return { success: true, media: mediaItem };
        } catch (error) {
            console.error('Error uploading media:', error);
            return { success: false, message: error.message };
        }
    };

    const removeMedia = async (id) => {
        try {
            await deleteMedia(id);
            setMedia(prev => prev.filter(m => m.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting media:', error);
            return { success: false, message: error.message };
        }
    };

    // Dashboard Stats
    const getDashboardStats = () => {
        const totalRevenue = orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0);

        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'delivered').length;

        const lowStockProducts = products.filter(p => p.stock < 10).length;

        return {
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders,
            completedOrders,
            totalProducts: products.length,
            lowStockProducts,
            activeUser: orders.length > 0,
        };
    };

    const value = {
        isAuthenticated,
        loading,
        products,
        orders,
        coupons,
        shippingZones,
        media,
        login,
        logout,
        loadAdminData,
        // Products
        addNewProduct,
        editProduct,
        removeProduct,
        // Orders
        newOrder,
        editOrder,
        exportOrders,
        // Coupons
        addNewCoupon,
        editCoupon,
        removeCoupon,
        // Shipping
        addNewShippingZone,
        editShippingZone,
        removeShippingZone,
        // Media
        uploadMedia,
        removeMedia,
        // Stats
        getDashboardStats,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
