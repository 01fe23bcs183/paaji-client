import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isUppercase: true,
            len: [3, 50]
        }
    },
    type: {
        type: DataTypes.ENUM('percentage', 'fixed', 'freeShipping'),
        allowNull: false,
        defaultValue: 'percentage'
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usageLimit: {
        type: DataTypes.INTEGER,
        defaultValue: null, // null = unlimited
        validate: {
            min: 0
        }
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    applicableProducts: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of product IDs, null means all products'
    },
    applicableCategories: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of category names, null means all categories'
    },
    userRestrictions: {
        type: DataTypes.ENUM('all', 'newUsers', 'existingUsers'),
        defaultValue: 'all'
    }
}, {
    tableName: 'coupons',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['code']
        },
        {
            fields: ['isActive']
        },
        {
            fields: ['expiryDate']
        }
    ]
});

// Instance method to check if coupon is valid
Coupon.prototype.isValid = function (orderTotal = 0, userId = null, productIds = []) {
    const now = new Date();

    // Check if active
    if (!this.isActive) {
        return { valid: false, message: 'This coupon is not active' };
    }

    // Check expiry
    if (now > this.expiryDate || now < this.startDate) {
        return { valid: false, message: 'This coupon has expired or is not yet active' };
    }

    // Check usage limit
    if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
        return { valid: false, message: 'This coupon has reached its usage limit' };
    }

    // Check minimum order value
    if (orderTotal < this.minOrderValue) {
        return { valid: false, message: `Minimum order value of ₹${this.minOrderValue} required` };
    }

    // Check product restrictions
    if (this.applicableProducts && this.applicableProducts.length > 0) {
        const hasValidProduct = productIds.some(id => this.applicableProducts.includes(id));
        if (!hasValidProduct) {
            return { valid: false, message: 'This coupon is not applicable to the products in your cart' };
        }
    }

    return { valid: true, message: 'Coupon is valid' };
};

// Instance method to calculate discount
Coupon.prototype.calculateDiscount = function (orderTotal) {
    if (this.type === 'percentage') {
        const discount = (orderTotal * this.value) / 100;
        return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
    } else if (this.type === 'fixed') {
        return Math.min(this.value, orderTotal);
    } else if (this.type === 'freeShipping') {
        return 0; // Shipping discount handled separately
    }
    return 0;
};

// Instance method to increment usage count
Coupon.prototype.incrementUsage = async function () {
    this.usedCount += 1;
    await this.save();
};

export default Coupon;
