import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@jmcskincare.com',
        password: 'admin123', // Will be hashed
        phone: '9876543210',
        role: 'admin',
        isVerified: true,
        addresses: [],
        wishlist: [],
    },
    {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'customer123', // Will be hashed
        phone: '9876543211',
        role: 'customer',
        isVerified: true,
        addresses: [
            {
                type: 'home',
                name: 'Test Customer',
                phone: '9876543211',
                address: '123 Test Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                isDefault: true,
            }
        ],
        wishlist: [],
    },
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '9876543212',
        role: 'customer',
        isVerified: true,
        addresses: [
            {
                type: 'home',
                name: 'John Doe',
                phone: '9876543212',
                address: '456 Main Road',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                isDefault: true,
            }
        ],
        wishlist: [],
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '9876543213',
        role: 'customer',
        isVerified: false,
        addresses: [],
        wishlist: [],
    },
];

export const seedUsers = async () => {
    try {
        console.log('🌱 Seeding users...');

        for (const userData of users) {
            const [user, created] = await User.findOrCreate({
                where: { email: userData.email },
                defaults: userData
            });

            if (created) {
                console.log(`✅ Created user: ${user.email} (${user.role})`);
            } else {
                console.log(`⏭️  User already exists: ${user.email}`);
            }
        }

        console.log('✅ User seeding completed');
        console.log('\n📝 Default Credentials:');
        console.log('Admin: admin@jmcskincare.com / admin123');
        console.log('Customer: customer@test.com / customer123');

        return true;
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
};

export default seedUsers;
