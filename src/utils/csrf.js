// CSRF and XSS Protection utilities

/**
 * Generate CSRF token
 */
export function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session
 */
export function storeCSRFToken(token) {
    sessionStorage.setItem('csrf_token', token);
}

/**
 * Get stored CSRF token
 */
export function getStoredCSRFToken() {
    return sessionStorage.getItem('csrf_token');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token) {
    const storedToken = getStoredCSRFToken();
    return storedToken && token === storedToken;
}

/**
 * Initialize CSRF protection
 */
export function initCSRFProtection() {
    let token = getStoredCSRFToken();
    if (!token) {
        token = generateCSRFToken();
        storeCSRFToken(token);
    }
    return token;
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
    if (typeof text !== 'string') return text;

    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
}

/**
 * Sanitize HTML content (allow safe tags)
 */
export function sanitizeHtml(html) {
    if (typeof html !== 'string') return html;

    // Remove script tags
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove onclick, onerror, etc. event handlers
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');

    // Remove javascript: in href
    html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');

    // Remove data: URLs
    html = html.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""');

    return html;
}

/**
 * Validate URL to prevent open redirects
 */
export function isValidRedirectUrl(url) {
    if (!url) return false;

    // Only allow relative URLs or same-origin URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
        return true;
    }

    try {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.origin === window.location.origin;
    } catch {
        return false;
    }
}

/**
 * Secure cookie options
 */
export const SECURE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
};

/**
 * Set secure cookie from client (limited options)
 */
export function setSecureCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    cookieString += `; expires=${expires.toUTCString()}`;
    cookieString += '; path=/';
    cookieString += '; SameSite=Strict';

    if (window.location.protocol === 'https:') {
        cookieString += '; Secure';
    }

    document.cookie = cookieString;
}

/**
 * Get cookie value
 */
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

/**
 * Delete cookie
 */
export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Content Security Policy headers (for reference)
 */
export const CSP_POLICY = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", 'https://www.google.com/recaptcha/', 'https://www.gstatic.com/recaptcha/'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://api.jmcskincare.com'],
    'frame-src': ['https://www.google.com/recaptcha/'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader() {
    return Object.entries(CSP_POLICY)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');
}

/**
 * Check for common attack patterns in input
 */
export function detectAttackPattern(input) {
    if (typeof input !== 'string') return { safe: true };

    const patterns = [
        { name: 'SQL Injection', regex: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b.*\b(FROM|INTO|WHERE|TABLE)\b)/i },
        { name: 'XSS Script', regex: /<script[\s\S]*?>[\s\S]*?<\/script>/gi },
        { name: 'XSS Event Handler', regex: /\bon\w+\s*=/gi },
        { name: 'Path Traversal', regex: /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\//gi },
        { name: 'Command Injection', regex: /[;&|`$()]/g },
    ];

    for (const { name, regex } of patterns) {
        if (regex.test(input)) {
            return { safe: false, attack: name };
        }
    }

    return { safe: true };
}

/**
 * Secure password requirements
 */
export function validatePasswordStrength(password) {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    return {
        requirements,
        score,
        strength: score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong',
        valid: score >= 4,
    };
}

export default {
    generateCSRFToken,
    storeCSRFToken,
    getStoredCSRFToken,
    validateCSRFToken,
    initCSRFProtection,
    escapeHtml,
    sanitizeHtml,
    isValidRedirectUrl,
    setSecureCookie,
    getCookie,
    deleteCookie,
    generateCSPHeader,
    detectAttackPattern,
    validatePasswordStrength,
};
