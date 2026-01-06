import Product from '../models/Product.js';

const products = [
    {
        name: 'Vitamin C Serum',
        slug: 'vitamin-c-serum',
        description: 'Brighten your skin with our powerful Vitamin C serum. Reduces dark spots and evens skin tone.',
        price: 1299,
        compareAtPrice: 1599,
        category: 'Serums',
        sku: 'JMC-VCS-001',
        stock: 50,
        images: ['/products/vitamin-c-serum.jpg'],
        featured: true,
        tags: ['bestseller', 'vitamin-c', 'brightening'],
        ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Vitamin E'],
        benefits: ['Brightens skin', 'Reduces dark spots', 'Anti-aging'],
        howToUse: 'Apply 2-3 drops on clean face, morning and night.',
        suitableFor: ['All skin types', 'Dull skin', 'Uneven tone'],
    },
    {
        name: 'Hyaluronic Acid Moisturizer',
        slug: 'hyaluronic-acid-moisturizer',
        description: 'Deep hydration with hyaluronic acid. Perfect for dry and dehydrated skin.',
        price: 999,
        compareAtPrice: 1299,
        category: 'Moisturizers',
        sku: 'JMC-HAM-002',
        stock: 75,
        images: ['/products/ha-moisturizer.jpg'],
        featured: true,
        tags: ['hydration', 'moisturizer', 'hyaluronic-acid'],
        ingredients: ['Hyaluronic Acid', 'Glycerin', 'Ceramides'],
        benefits: ['Deep hydration', 'Plump skin', '24-hour moisture'],
        howToUse: 'Apply to damp skin twice daily.',
        suitableFor: ['Dry skin', 'Dehydrated skin', 'All skin types'],
    },
    {
        name: 'Niacinamide Face Wash',
        slug: 'niacinamide-face-wash',
        description: 'Gentle cleanser with niacinamide to control oil and minimize pores.',
        price: 699,
        compareAtPrice: 899,
        category: 'Cleansers',
        sku: 'JMC-NFW-003',
        stock: 100,
        images: ['/products/niacinamide-facewash.jpg'],
        featured: false,
        tags: ['cleanser', 'niacinamide', 'pore-minimizing'],
        ingredients: ['Niacinamide', 'Salicylic Acid', 'Aloe Vera'],
        benefits: ['Controls oil', 'Minimizes pores', 'Gentle cleansing'],
        howToUse: 'Use twice daily. Apply to wet face, massage, rinse.',
        suitableFor: ['Oily skin', 'Combination skin', 'Acne-prone'],
    },
    {
        name: 'Retinol Night Cream',
        slug: 'retinol-night-cream',
        description: 'Anti-aging night cream with retinol. Reduces fine lines and wrinkles.',
        price: 1499,
        compareAtPrice: 1999,
        category: 'Night Creams',
        sku: 'JMC-RNC-004',
        stock: 40,
        images: ['/products/retinol-cream.jpg'],
        featured: true,
        tags: ['anti-aging', 'retinol', 'night-cream'],
        ingredients: ['Retinol', 'Peptides', 'Shea Butter'],
        benefits: ['Reduces wrinkles', 'Firms skin', 'Overnight repair'],
        howToUse: 'Apply at night on clean, dry skin. Use sunscreen during day.',
        suitableFor: ['Mature skin', 'Aging skin', 'All skin types 25+'],
    },
    {
        name: 'Sunscreen SPF 50',
        slug: 'sunscreen-spf-50',
        description: 'Broad spectrum protection with SPF 50. Non-greasy, lightweight formula.',
        price: 799,
        compareAtPrice: 999,
        category: 'Sunscreens',
        sku: 'JMC-SS50-005',
        stock: 120,
        images: ['/products/sunscreen-spf50.jpg'],
        featured: true,
        tags: ['sunscreen', 'spf50', 'daily-protection'],
        ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E'],
        benefits: ['UV protection', 'Non-greasy', 'Water resistant'],
        howToUse: 'Apply generously 15 min before sun exposure. Reapply every 2 hours.',
        suitableFor: ['All skin types', 'Sensitive skin', 'Daily use'],
    },
    {
        name: 'Rose Water Toner',
        slug: 'rose-water-toner',
        description: 'Refreshing rose water toner. Balances pH and soothes skin.',
        price: 499,
        compareAtPrice: 699,
        category: 'Toners',
        sku: 'JMC-RWT-006',
        stock: 90,
        images: ['/products/rose-toner.jpg'],
        featured: false,
        tags: ['toner', 'rose-water', 'soothing'],
        ingredients: ['Rose Water', 'Glycerin', 'Witch Hazel'],
        benefits: ['Balances pH', 'Soothes skin', 'Refreshing'],
        howToUse: 'Apply with cotton pad after cleansing.',
        suitableFor: ['All skin types', 'Sensitive skin'],
    },
    {
        name: 'Clay Face Mask',
        slug: 'clay-face-mask',
        description: 'Detoxifying clay mask. Draws out impurities and excess oil.',
        price: 899,
        compareAtPrice: 1199,
        category: 'Masks',
        sku: 'JMC-CFM-007',
        stock: 60,
        images: ['/products/clay-mask.jpg'],
        featured: false,
        tags: ['mask', 'clay', 'detox'],
        ingredients: ['Bentonite Clay', 'Kaolin Clay', 'Tea Tree Oil'],
        benefits: ['Detoxifies', 'Controls oil', 'Clears pores'],
        howToUse: 'Apply thin layer, leave for 10-15 min, rinse. Use 2x per week.',
        suitableFor: ['Oily skin', 'Acne-prone', 'Combination skin'],
    },
    {
        name: 'Eye Cream',
        slug: 'anti-aging-eye-cream',
        description: 'Specialized eye cream to reduce dark circles and puffiness.',
        price: 1099,
        compareAtPrice: 1399,
        category: 'Eye Care',
        sku: 'JMC-EC-008',
        stock: 45,
        images: ['/products/eye-cream.jpg'],
        featured: false,
        tags: ['eye-cream', 'dark-circles', 'anti-aging'],
        ingredients: ['Caffeine', 'Peptides', 'Vitamin K'],
        benefits: ['Reduces dark circles', 'Firms under-eye', 'Reduces puffiness'],
        howToUse: 'Gently pat around eye area, morning and night.',
        suitableFor: ['All skin types', 'Tired eyes', 'Mature skin'],
    },
];

export const seedProducts = async () => {
    try {
        console.log('🌱 Seeding products...');

        // Clear existing products (optional - comment out to preserve existing data)
        // await Product.destroy({ where: {}, truncate: true });

        for (const productData of products) {
            const [product, created] = await Product.findOrCreate({
                where: { slug: productData.slug },
                defaults: productData
            });

            if (created) {
                console.log(`✅ Created product: ${product.name}`);
            } else {
                console.log(`⏭️  Product already exists: ${product.name}`);
            }
        }

        console.log('✅ Product seeding completed');
        return true;
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
};

export default seedProducts;
