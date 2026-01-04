// Cart Abandonment Tracking Service
// Tracks abandoned carts and triggers recovery actions

const ABANDONMENT_KEY = 'jmc_cart_abandonment';
const ABANDONMENT_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Cart session data structure
 */
const createSession = () => ({
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    items: [],
    email: null,
    recovered: false,
    emailsSent: [],
});

/**
 * Generate unique session ID
 */
function generateSessionId() {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get current cart session from localStorage
 */
export function getCartSession() {
    try {
        const data = localStorage.getItem(ABANDONMENT_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

/**
 * Save cart session to localStorage
 */
export function saveCartSession(session) {
    try {
        localStorage.setItem(ABANDONMENT_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('[CartAbandonment] Failed to save session:', error);
    }
}

/**
 * Start or update cart session
 */
export function trackCartActivity(items, email = null) {
    let session = getCartSession();

    if (!session) {
        session = createSession();
    }

    session.items = items;
    session.lastActivityAt = new Date().toISOString();

    if (email) {
        session.email = email;
    }

    saveCartSession(session);
    return session;
}

/**
 * Mark session as recovered (checkout completed)
 */
export function markCartRecovered() {
    const session = getCartSession();
    if (session) {
        session.recovered = true;
        session.recoveredAt = new Date().toISOString();
        saveCartSession(session);

        // Clear session after a delay
        setTimeout(() => {
            localStorage.removeItem(ABANDONMENT_KEY);
        }, 5000);
    }
}

/**
 * Check if cart is abandoned (inactive for ABANDONMENT_TIMEOUT)
 */
export function isCartAbandoned() {
    const session = getCartSession();
    if (!session || session.recovered || session.items.length === 0) {
        return false;
    }

    const lastActivity = new Date(session.lastActivityAt);
    const now = new Date();
    const timeDiff = now - lastActivity;

    return timeDiff >= ABANDONMENT_TIMEOUT;
}

/**
 * Get abandoned cart data for recovery
 */
export function getAbandonedCartData() {
    const session = getCartSession();
    if (!session || session.recovered) {
        return null;
    }

    return {
        sessionId: session.sessionId,
        email: session.email,
        items: session.items,
        startedAt: session.startedAt,
        lastActivityAt: session.lastActivityAt,
        totalValue: session.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
}

/**
 * Record that an abandonment email was sent
 */
export function recordEmailSent(emailType) {
    const session = getCartSession();
    if (session) {
        session.emailsSent.push({
            type: emailType,
            sentAt: new Date().toISOString(),
        });
        saveCartSession(session);
    }
}

/**
 * Check if a specific email type has been sent
 */
export function hasEmailBeenSent(emailType) {
    const session = getCartSession();
    if (!session) return false;
    return session.emailsSent.some(e => e.type === emailType);
}

/**
 * Calculate cart recovery discount based on time abandoned
 */
export function getRecoveryDiscount() {
    const session = getCartSession();
    if (!session) return null;

    const lastActivity = new Date(session.lastActivityAt);
    const now = new Date();
    const hoursAbandoned = (now - lastActivity) / (1000 * 60 * 60);

    // Tiered discount based on abandonment time
    if (hoursAbandoned >= 24) {
        return { code: 'COMEBACK15', discount: 15, type: 'percentage' };
    } else if (hoursAbandoned >= 6) {
        return { code: 'COMEBACK10', discount: 10, type: 'percentage' };
    } else if (hoursAbandoned >= 1) {
        return { code: 'COMEBACK5', discount: 5, type: 'percentage' };
    }

    return null;
}

/**
 * Get personalized recovery message
 */
export function getRecoveryMessage() {
    const session = getCartSession();
    if (!session || session.items.length === 0) return null;

    const itemCount = session.items.length;
    const totalValue = session.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = getRecoveryDiscount();

    const messages = [
        `You left ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart!`,
        `Your cart is waiting for you`,
        `Complete your skincare routine`,
        `Don't miss out on your favorites!`,
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    return {
        headline: message,
        itemCount,
        totalValue,
        discount,
        cta: discount ? `Complete Order & Save ${discount.discount}%` : 'Complete Your Order',
    };
}

/**
 * Send cart abandonment data to server
 */
export async function syncAbandonedCart(apiUrl = '/api/cart-abandonment') {
    const cartData = getAbandonedCartData();
    if (!cartData || !cartData.email) return null;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartData),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('[CartAbandonment] Failed to sync:', error);
    }

    return null;
}

export default {
    trackCartActivity,
    markCartRecovered,
    isCartAbandoned,
    getAbandonedCartData,
    getRecoveryDiscount,
    getRecoveryMessage,
    recordEmailSent,
    hasEmailBeenSent,
    syncAbandonedCart,
};
