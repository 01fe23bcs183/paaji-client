import sequelize from './config/database.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Campaign from './models/Campaign.js';
import Coupon from './models/Coupon.js';

const initDB = async () => {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized');

        // Show registered models
        const models = Object.keys(sequelize.models);
        console.log(`📦 Models: ${models.join(', ')}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDB();
