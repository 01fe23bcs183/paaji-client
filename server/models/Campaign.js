import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('banner', 'popup', 'floating', 'countdown'),
        defaultValue: 'banner',
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING(500),
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed', 'freeShipping', 'buyOneGetOne'),
        defaultValue: 'percentage',
    },
    discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    couponCode: {
        type: DataTypes.STRING(50),
    },
    minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    backgroundColor: {
        type: DataTypes.STRING(50),
        defaultValue: '#C4A77D',
    },
    textColor: {
        type: DataTypes.STRING(50),
        defaultValue: '#FFFFFF',
    },
    buttonText: {
        type: DataTypes.STRING(50),
        defaultValue: 'Shop Now',
    },
    buttonLink: {
        type: DataTypes.STRING(500),
        defaultValue: '/products',
    },
    imageUrl: {
        type: DataTypes.STRING(500),
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    showOnPages: {
        type: DataTypes.JSON,
        defaultValue: ['home'],
    },
    targetAudience: {
        type: DataTypes.ENUM('all', 'newUsers', 'returningUsers', 'subscribers'),
        defaultValue: 'all',
    },
    impressions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    conversions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'campaigns',
    timestamps: true,
});

export default Campaign;
