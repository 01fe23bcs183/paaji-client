import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow guest checkout
        references: {
            model: 'users',
            key: 'id'
        }
    },
    customer: {
        type: DataTypes.JSON,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    shippingCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    couponCode: {
        type: DataTypes.STRING
    },
    paymentMethod: {
        type: DataTypes.ENUM('razorpay', 'cashfree', 'cod', 'mock'),
        allowNull: false
    },
    paymentId: {
        type: DataTypes.STRING
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    shippingDetails: {
        type: DataTypes.JSON
    },
    trackingNumber: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    },
    statusHistory: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    emailSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    whatsappSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Shiprocket fields
    shiprocketOrderId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shipmentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    awbCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    courierCompanyId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    courierName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shippingStatus: {
        type: DataTypes.ENUM('not_created', 'processing', 'manifested', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled'),
        defaultValue: 'not_created'
    },
    pickupScheduledDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true
});

// Add initial status to history on creation
Order.beforeCreate((order) => {
    order.statusHistory = [{
        status: order.status,
        timestamp: new Date(),
        note: 'Order placed'
    }];
});

export default Order;
