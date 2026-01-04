import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'jmc_ecommerce',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false
        }
    }
);

// Test connection
export const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL database connected successfully');

        // Sync models (creates tables if they don't exist)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized');
        }
    } catch (error) {
        console.error('❌ Unable to connect to MySQL database:', error);
        process.exit(1);
    }
};

export default sequelize;
