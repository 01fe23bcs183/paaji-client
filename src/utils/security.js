// Security utilities for fraud prevention and input validation

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    // Remove potentially dangerous characters
    return input
        .replace(/[<>]/g, '') // Remove HTML brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate PIN code (Indian format)
 */
export function isValidPincode(pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
}

/**
 * Rate limiter for API calls
 */
const rateLimitStore = new Map();

export function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create request log
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, []);
    }

    const requests = rateLimitStore.get(key);

    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);

    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
        return {
            allowed: false,
            retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000),
            remaining: 0,
        };
    }

    // Add current request
    validRequests.push(now);
    rateLimitStore.set(key, validRequests);

    return {
        allowed: true,
        remaining: maxRequests - validRequests.length,
        retryAfter: 0,
    };
}

/**
 * Fraud detection patterns
 */
const FRAUD_PATTERNS = {
    // Suspicious order patterns
    highValueThreshold: 50000, // Orders over ₹50,000
    maxOrdersPerHour: 5,
    maxOrdersPerDay: 10,

    // Suspicious address patterns
    suspiciousKeywords: ['test', 'fake', 'xxx', 'asdf', '1234'],

    // Payment patterns
    maxPaymentAttempts: 3,
};

/**
 * Check order for fraud indicators
 */
export function checkOrderFraud(order, userHistory = {}) {
    const riskFactors = [];
    let riskScore = 0;

    // Check order value
    if (order.total > FRAUD_PATTERNS.highValueThreshold) {
        riskFactors.push('High value order');
        riskScore += 20;
    }

    // Check order frequency
    if (userHistory.ordersLastHour >= FRAUD_PATTERNS.maxOrdersPerHour) {
        riskFactors.push('Too many orders in 1 hour');
        riskScore += 40;
    }

    if (userHistory.ordersToday >= FRAUD_PATTERNS.maxOrdersPerDay) {
        riskFactors.push('Too many orders today');
        riskScore += 30;
    }

    // Check for suspicious address
    const addressLower = (order.shippingAddress || '').toLowerCase();
    for (const keyword of FRAUD_PATTERNS.suspiciousKeywords) {
        if (addressLower.includes(keyword)) {
            riskFactors.push(`Suspicious address keyword: ${keyword}`);
            riskScore += 15;
        }
    }

    // Check for new customer with high value
    if (!userHistory.previousOrders && order.total > 10000) {
        riskFactors.push('New customer with high value order');
        riskScore += 25;
    }

    // Check for COD abuse
    if (order.paymentMethod === 'cod' && order.total > 5000) {
        riskFactors.push('High value COD order');
        riskScore += 15;
    }

    // Check phone/email mismatch with previous orders
    if (userHistory.previousEmails?.length && !userHistory.previousEmails.includes(order.email)) {
        riskFactors.push('Email mismatch with previous orders');
        riskScore += 20;
    }

    return {
        riskScore: Math.min(riskScore, 100),
        riskLevel: riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
        factors: riskFactors,
        requiresReview: riskScore >= 40,
        autoReject: riskScore >= 80,
    };
}

/**
 * Validate coupon usage for abuse
 */
export function checkCouponAbuse(couponCode, userId, usageHistory = {}) {
    const issues = [];

    // Check if already used by user
    if (usageHistory.usedBy?.includes(userId)) {
        issues.push('Coupon already used by this user');
    }

    // Check usage limit
    if (usageHistory.totalUsage >= usageHistory.maxUsage) {
        issues.push('Coupon usage limit exceeded');
    }

    // Check per-user limit
    if (usageHistory.userUsageCount >= (usageHistory.perUserLimit || 1)) {
        issues.push('User has exceeded coupon usage limit');
    }

    // Check for rapid usage (potential abuse)
    if (usageHistory.usagesLastHour >= 3) {
        issues.push('Suspicious rapid coupon usage');
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}

/**
 * Payment attempt tracker
 */
const paymentAttempts = new Map();

export function trackPaymentAttempt(userId, success) {
    const key = `payment_${userId}`;

    if (!paymentAttempts.has(key)) {
        paymentAttempts.set(key, { attempts: 0, lastAttempt: null, blocked: false });
    }

    const record = paymentAttempts.get(key);

    if (success) {
        // Reset on success
        record.attempts = 0;
        record.blocked = false;
    } else {
        record.attempts += 1;
        record.lastAttempt = Date.now();

        if (record.attempts >= FRAUD_PATTERNS.maxPaymentAttempts) {
            record.blocked = true;
        }
    }

    paymentAttempts.set(key, record);

    return record;
}

/**
 * Check if payment is blocked
 */
export function isPaymentBlocked(userId) {
    const key = `payment_${userId}`;
    const record = paymentAttempts.get(key);

    if (!record) return false;

    // Unblock after 30 minutes
    if (record.blocked && record.lastAttempt && Date.now() - record.lastAttempt > 30 * 60 * 1000) {
        record.blocked = false;
        record.attempts = 0;
        paymentAttempts.set(key, record);
        return false;
    }

    return record.blocked;
}

/**
 * Generate secure order ID
 */
export function generateSecureOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const checksum = (parseInt(timestamp, 36) % 97).toString().padStart(2, '0');
    return `JMC-${timestamp.toUpperCase()}-${random.toUpperCase()}-${checksum}`;
}

/**
 * Validate order data completeness
 */
export function validateOrder(order) {
    const errors = [];

    // Required fields
    if (!order.items || order.items.length === 0) {
        errors.push('Order must contain at least one item');
    }

    if (!order.shippingAddress) {
        errors.push('Shipping address is required');
    }

    if (!order.email || !isValidEmail(order.email)) {
        errors.push('Valid email is required');
    }

    if (!order.phone || !isValidPhone(order.phone)) {
        errors.push('Valid phone number is required');
    }

    if (!order.paymentMethod) {
        errors.push('Payment method is required');
    }

    // Validate items
    for (const item of order.items || []) {
        if (!item.id || !item.quantity || item.quantity <= 0) {
            errors.push('Invalid item in order');
            break;
        }
        if (item.price <= 0) {
            errors.push('Invalid item price');
            break;
        }
    }

    // Validate totals
    const calculatedTotal = (order.items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (Math.abs(calculatedTotal - (order.subtotal || 0)) > 1) {
        errors.push('Order total mismatch - possible tampering');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Honeypot field validation (for bots)
 */
export function checkHoneypot(formData) {
    // If honeypot field is filled, it's likely a bot
    const honeypotFields = ['website', 'url', 'company_website', 'fax'];

    for (const field of honeypotFields) {
        if (formData[field] && formData[field].trim() !== '') {
            return { isBot: true, field };
        }
    }

    return { isBot: false };
}

/**
 * CAPTCHA verification (placeholder for integration)
 */
export async function verifyCaptcha(token) {
    // This would integrate with Google reCAPTCHA or similar
    // For now, return success if token exists
    if (!token) {
        return { success: false, error: 'CAPTCHA token required' };
    }

    // In production, verify with Google:
    // const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    //   method: 'POST',
    //   body: `secret=YOUR_SECRET&response=${token}`,
    // });

    return { success: true };
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data) {
    const masked = { ...data };

    if (masked.email) {
        const [user, domain] = masked.email.split('@');
        masked.email = `${user.substring(0, 2)}***@${domain}`;
    }

    if (masked.phone) {
        masked.phone = `****${masked.phone.slice(-4)}`;
    }

    if (masked.cardNumber) {
        masked.cardNumber = `****${masked.cardNumber.slice(-4)}`;
    }

    return masked;
}

export default {
    sanitizeInput,
    isValidEmail,
    isValidPhone,
    isValidPincode,
    checkRateLimit,
    checkOrderFraud,
    checkCouponAbuse,
    trackPaymentAttempt,
    isPaymentBlocked,
    generateSecureOrderId,
    validateOrder,
    checkHoneypot,
    verifyCaptcha,
    maskSensitiveData,
};
