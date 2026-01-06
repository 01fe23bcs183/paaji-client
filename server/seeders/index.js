import sequelize from '../config/database.js';
import { seedProducts } from './productSeeder.js';
import { seedUsers } from './userSeeder.js';
import { seedCoupons } from './couponSeeder.js';

const runSeeders = async () => {
    try {
        console.log('🚀 Starting database seeding...\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized\n');

        // Run seeders in order
        await seedUsers();
        console.log('');

        await seedProducts();
        console.log('');

        await seedCoupons();
        console.log('');

        console.log('🎉 All seeders completed successfully!');
        console.log('\n📊 Database is now populated with sample data');
        console.log('\n💡 You can now:');
        console.log('   - Login to admin panel with: admin@jmcskincare.com / admin123');
        console.log('   - Browse products on the website');
        console.log('   - Test checkout with coupons');
        console.log('   - Manage orders in admin panel');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeders if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeeders();
}

export default runSeeders;
