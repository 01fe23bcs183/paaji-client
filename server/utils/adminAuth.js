import bcrypt from 'bcryptjs';

/**
 * Admin Authentication Helper
 * Simple password-based authentication for admin panel
 */

// Default admin password (CHANGE THIS IN PRODUCTION!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const verifyAdminPassword = async (password) => {
    // In development, allow plain text comparison for simplicity
    // In production, you should hash the admin password
    if (process.env.NODE_ENV === 'development') {
        return password === ADMIN_PASSWORD;
    }

    // For production, use bcrypt
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    return await bcrypt.compare(password, hashedPassword);
};

export const generateAdminToken = () => {
    // Generate a simple token for admin session
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default {
    verifyAdminPassword,
    generateAdminToken
};
