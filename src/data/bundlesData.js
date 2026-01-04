// Sample bundles data - In production, this would come from the database
export const sampleBundles = [
    {
        id: 'bundle-1',
        name: 'Complete Glow Routine',
        slug: 'complete-glow-routine',
        description: 'Everything you need for radiant, glowing skin. Perfect for beginners.',
        image: null, // Will show gradient placeholder
        productIds: [], // Will be linked to actual products
        products: [
            { name: 'Gentle Cleanser', price: 599, image: null },
            { name: 'Hydrating Toner', price: 499, image: null },
            { name: 'Vitamin C Serum', price: 999, image: null },
            { name: 'Daily Moisturizer', price: 699, image: null },
        ],
        originalPrice: 2796,
        bundlePrice: 2237,
        discountPercent: 20,
        savings: 559,
        featured: true,
        skinTypes: ['normal', 'combination', 'dry'],
        concerns: ['dullness', 'hydration'],
    },
    {
        id: 'bundle-2',
        name: 'Acne Fighter Kit',
        slug: 'acne-fighter-kit',
        description: 'Targeted treatment set for acne-prone skin. Clears and prevents breakouts.',
        image: null,
        productIds: [],
        products: [
            { name: 'Salicylic Acid Cleanser', price: 699, image: null },
            { name: 'BHA Exfoliating Toner', price: 599, image: null },
            { name: 'Niacinamide Serum', price: 899, image: null },
            { name: 'Oil-Free Gel Moisturizer', price: 599, image: null },
        ],
        originalPrice: 2796,
        bundlePrice: 2097,
        discountPercent: 25,
        savings: 699,
        featured: true,
        skinTypes: ['oily', 'combination'],
        concerns: ['acne', 'oiliness'],
    },
    {
        id: 'bundle-3',
        name: 'Anti-Aging Essentials',
        slug: 'anti-aging-essentials',
        description: 'Premium anti-aging routine to reduce fine lines and restore youthful glow.',
        image: null,
        productIds: [],
        products: [
            { name: 'Gentle Cream Cleanser', price: 799, image: null },
            { name: 'Retinol Night Serum', price: 1499, image: null },
            { name: 'Peptide Eye Cream', price: 999, image: null },
            { name: 'Rich Repair Cream', price: 1299, image: null },
        ],
        originalPrice: 4596,
        bundlePrice: 3677,
        discountPercent: 20,
        savings: 919,
        featured: true,
        skinTypes: ['all'],
        concerns: ['aging', 'wrinkles', 'firmness'],
    },
    {
        id: 'bundle-4',
        name: 'Hydration Boost Set',
        slug: 'hydration-boost-set',
        description: 'Deep hydration for dry and dehydrated skin. Restores moisture barrier.',
        image: null,
        productIds: [],
        products: [
            { name: 'Hydrating Milk Cleanser', price: 699, image: null },
            { name: 'Hyaluronic Acid Serum', price: 899, image: null },
            { name: 'Ceramide Moisturizer', price: 999, image: null },
        ],
        originalPrice: 2597,
        bundlePrice: 1948,
        discountPercent: 25,
        savings: 649,
        featured: false,
        skinTypes: ['dry', 'sensitive'],
        concerns: ['dehydration', 'dryness'],
    },
];

// Get all bundles
export const getBundles = () => {
    // In production, fetch from API
    const stored = localStorage.getItem('bundles');
    if (stored) {
        return JSON.parse(stored);
    }
    return sampleBundles;
};

// Get featured bundles
export const getFeaturedBundles = () => {
    return getBundles().filter(b => b.featured);
};

// Get bundle by ID
export const getBundleById = (id) => {
    return getBundles().find(b => b.id === id);
};

// Get bundle by slug
export const getBundleBySlug = (slug) => {
    return getBundles().find(b => b.slug === slug);
};

// Get bundles for skin type
export const getBundlesForSkinType = (skinType) => {
    return getBundles().filter(b =>
        b.skinTypes.includes(skinType) || b.skinTypes.includes('all')
    );
};

// Get bundles for concern
export const getBundlesForConcern = (concern) => {
    return getBundles().filter(b => b.concerns.includes(concern));
};

// Save bundles (admin)
export const saveBundles = (bundles) => {
    localStorage.setItem('bundles', JSON.stringify(bundles));
};

// Cross-sell / "Goes well with" recommendations
export const getRelatedProducts = (productId, allProducts) => {
    // Simple recommendation: return other products not including current
    return allProducts
        .filter(p => p.id !== productId)
        .slice(0, 4);
};

// "Customers also bought" based on category
export const getFrequentlyBoughtTogether = (product, allProducts) => {
    // Return products in same category or complementary categories
    return allProducts
        .filter(p => p.id !== product?.id && p.category === product?.category)
        .slice(0, 3);
};

export default sampleBundles;
