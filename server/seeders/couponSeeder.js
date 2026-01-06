import Coupon from '../models/Coupon.js';

const coupons = [
    {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrderValue: 500,
        maxDiscount: 500,
        description: 'Welcome discount for new customers',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 1000,
        usedCount: 0,
        isActive: true,
        userRestrictions: 'newUsers',
    },
    {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        minOrderValue: 1000,
        maxDiscount: 1000,
        description: '20% off on orders above ₹1000',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        usageLimit: 500,
        usedCount: 0,
        isActive: true,
        userRestrictions: 'all',
    },
    {
        code: 'FLAT100',
        type: 'fixed',
        value: 100,
        minOrderValue: 800,
        maxDiscount: null,
        description: 'Flat ₹100 off on orders above ₹800',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        usageLimit: null, // Unlimited
        usedCount: 0,
        isActive: true,
        userRestrictions: 'all',
    },
    {
        code: 'FREESHIP',
        type: 'freeShipping',
        value: 0,
        minOrderValue: 599,
        maxDiscount: null,
        description: 'Free shipping on orders above ₹599',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: null,
        usedCount: 0,
        isActive: true,
        userRestrictions: 'all',
    },
    {
        code: 'SKINCARE30',
        type: 'percentage',
        value: 30,
        minOrderValue: 1500,
        maxDiscount: 1500,
        description: 'Special 30% off for skincare lovers',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        usageLimit: 200,
        usedCount: 0,
        isActive: true,
        userRestrictions: 'all',
        applicableCategories: ['Serums', 'Moisturizers', 'Cleansers'],
    },
    {
        code: 'VIP500',
        type: 'fixed',
        value: 500,
        minOrderValue: 3000,
        maxDiscount: null,
        description: 'VIP discount for premium orders',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
        userRestrictions: 'existingUsers',
    },
];

export const seedCoupons = async () => {
    try {
        console.log('🌱 Seeding coupons...');

        for (const couponData of coupons) {
            const [coupon, created] = await Coupon.findOrCreate({
                where: { code: couponData.code },
                defaults: couponData
            });

            if (created) {
                console.log(`✅ Created coupon: ${coupon.code} (${coupon.type} - ${coupon.value}${coupon.type === 'percentage' ? '%' : '₹'})`);
            } else {
                console.log(`⏭️  Coupon already exists: ${coupon.code}`);
            }
        }

        console.log('✅ Coupon seeding completed');
        console.log('\n🎫 Available Coupons:');
        coupons.forEach(c => {
            console.log(`   ${c.code} - ${c.description}`);
        });

        return true;
    } catch (error) {
        console.error('❌ Error seeding coupons:', error);
        throw error;
    }
};

export default seedCoupons;
