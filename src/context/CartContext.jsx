import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { validateCoupon } from '../services/storage';
import { calculateOrderTotal } from '../services/payments';
import { trackCartActivity, markCartRecovered } from '../services/cartAbandonment';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

const CART_STORAGE_KEY = 'jmc-cart';

const getInitialCartState = () => {
    if (typeof window === 'undefined') {
        return { items: [], coupon: null, shippingCost: 0 };
    }

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) {
        return { items: [], coupon: null, shippingCost: 0 };
    }

    try {
        const parsed = JSON.parse(savedCart);
        return {
            items: parsed.items || [],
            coupon: parsed.coupon || null,
            shippingCost: parsed.shippingCost || 0,
        };
    } catch (error) {
        console.error('Error loading cart:', error);
        return { items: [], coupon: null, shippingCost: 0 };
    }
};

export const CartProvider = ({ children }) => {
    const initialCart = useMemo(() => getInitialCartState(), []);
    const [items, setItems] = useState(initialCart.items);
    const [coupon, setCoupon] = useState(initialCart.coupon);
    const [shippingCost, setShippingCost] = useState(initialCart.shippingCost);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
            items,
            coupon,
            shippingCost,
        }));

        // Track cart activity for abandonment emails
        if (items.length > 0) {
            const email = localStorage.getItem('jmc_customer_email');
            trackCartActivity(items, email);
        }
    }, [items, coupon, shippingCost]);

    // Add item to cart
    const addItem = (product, quantity = 1, variant = null) => {
        setItems(currentItems => {
            const existingIndex = currentItems.findIndex(item =>
                item.id === product.id &&
                (!variant || item.variant?.name === variant?.name)
            );

            if (existingIndex >= 0) {
                // Update quantity of existing item
                const updated = [...currentItems];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                // Add new item
                return [...currentItems, {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: variant?.price || product.price,
                    image: product.images?.[0] || null,
                    quantity,
                    variant: variant || null,
                    stock: variant?.stock || product.stock,
                }];
            }
        });
    };

    // Remove item from cart
    const removeItem = (productId, variantName = null) => {
        setItems(currentItems =>
            currentItems.filter(item =>
                !(item.id === productId && (!variantName || item.variant?.name === variantName))
            )
        );
    };

    // Update item quantity
    const updateQuantity = (productId, newQuantity, variantName = null) => {
        if (newQuantity <= 0) {
            removeItem(productId, variantName);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item => {
                if (item.id === productId && (!variantName || item.variant?.name === variantName)) {
                    // Check if new quantity exceeds stock
                    const maxQuantity = item.stock || 999;
                    return {
                        ...item,
                        quantity: Math.min(newQuantity, maxQuantity),
                    };
                }
                return item;
            })
        );
    };

    // Clear cart
    const clearCart = (recovered = false) => {
        setItems([]);
        setCoupon(null);
        setShippingCost(0);

        // Mark as recovered if checkout was completed
        if (recovered) {
            markCartRecovered();
        }
    };

    // Apply coupon
    const applyCoupon = async (code) => {
        try {
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const result = await validateCoupon(code, subtotal);

            if (result.valid) {
                setCoupon(result.coupon);
                return { success: true, message: 'Coupon applied successfully!' };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            return { success: false, message: 'Failed to apply coupon' };
        }
    };

    // Remove coupon
    const removeCoupon = () => {
        setCoupon(null);
    };

    // Update shipping cost
    const updateShippingCost = (cost) => {
        setShippingCost(cost);
    };

    // Calculate discount from coupon
    const calculateDiscount = () => {
        if (!coupon) return 0;

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (coupon.type === 'percentage') {
            const discount = (subtotal * coupon.value) / 100;
            return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
        } else if (coupon.type === 'fixed') {
            return Math.min(coupon.value, subtotal);
        }

        return 0;
    };

    // Get cart totals
    const getCartTotals = () => {
        const discount = calculateDiscount();
        return calculateOrderTotal(items, shippingCost, discount);
    };

    // Get cart item count
    const getItemCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    // Check if product is in cart
    const isInCart = (productId, variantName = null) => {
        return items.some(item =>
            item.id === productId && (!variantName || item.variant?.name === variantName)
        );
    };

    // Get item from cart
    const getCartItem = (productId, variantName = null) => {
        return items.find(item =>
            item.id === productId && (!variantName || item.variant?.name === variantName)
        );
    };

    const value = {
        items,
        coupon,
        shippingCost,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        updateShippingCost,
        getCartTotals,
        getItemCount,
        isInCart,
        getCartItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
