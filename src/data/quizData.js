// Skin Quiz Questions and Logic
export const quizQuestions = [
    {
        id: 1,
        question: "How would you describe your skin type?",
        description: "Think about how your skin typically feels throughout the day.",
        options: [
            { id: 'oily', label: 'Oily', icon: '💧', description: 'Shiny, especially in T-zone' },
            { id: 'dry', label: 'Dry', icon: '🏜️', description: 'Tight, flaky, or rough' },
            { id: 'combination', label: 'Combination', icon: '⚖️', description: 'Oily T-zone, dry cheeks' },
            { id: 'normal', label: 'Normal', icon: '✨', description: 'Balanced, rarely problematic' },
            { id: 'sensitive', label: 'Sensitive', icon: '🌸', description: 'Easily irritated or reactive' },
        ],
    },
    {
        id: 2,
        question: "What's your primary skin concern?",
        description: "Select the issue you'd most like to address.",
        options: [
            { id: 'acne', label: 'Acne & Breakouts', icon: '🔴', description: 'Pimples, blackheads, clogged pores' },
            { id: 'aging', label: 'Anti-Aging', icon: '⏰', description: 'Fine lines, wrinkles, firmness' },
            { id: 'pigmentation', label: 'Dark Spots', icon: '🌑', description: 'Hyperpigmentation, uneven tone' },
            { id: 'dullness', label: 'Dullness', icon: '🌫️', description: 'Lack of radiance and glow' },
            { id: 'dehydration', label: 'Dehydration', icon: '💦', description: 'Tightness despite oily skin' },
            { id: 'redness', label: 'Redness', icon: '🔥', description: 'Rosacea, irritation, flushing' },
        ],
    },
    {
        id: 3,
        question: "How does your skin feel after cleansing?",
        description: "Wait 30 minutes after washing without applying anything.",
        options: [
            { id: 'tight', label: 'Tight & Dry', icon: '😣', description: 'Uncomfortable, pulling sensation' },
            { id: 'oily-quick', label: 'Oily Within an Hour', icon: '😅', description: 'Shine returns quickly' },
            { id: 'comfortable', label: 'Comfortable', icon: '😊', description: 'Balanced, no issues' },
            { id: 'some-dry', label: 'Dry in Some Areas', icon: '🤔', description: 'Cheeks dry, T-zone fine' },
        ],
    },
    {
        id: 4,
        question: "How often do you experience breakouts?",
        description: "Consider your average frequency.",
        options: [
            { id: 'frequent', label: 'Frequently', icon: '📅', description: 'Weekly or more often' },
            { id: 'occasionally', label: 'Occasionally', icon: '📆', description: 'A few times a month' },
            { id: 'rarely', label: 'Rarely', icon: '🗓️', description: 'Only during hormonal changes' },
            { id: 'never', label: 'Almost Never', icon: '✅', description: 'Very rarely if ever' },
        ],
    },
    {
        id: 5,
        question: "What's your age range?",
        description: "This helps us recommend age-appropriate products.",
        options: [
            { id: 'under-25', label: 'Under 25', icon: '🌱', description: 'Prevention focused' },
            { id: '25-35', label: '25-35', icon: '🌿', description: 'Early maintenance' },
            { id: '35-45', label: '35-45', icon: '🌳', description: 'Active treatment' },
            { id: 'over-45', label: '45+', icon: '🌲', description: 'Intensive care' },
        ],
    },
    {
        id: 6,
        question: "How would you describe your current skincare routine?",
        description: "Be honest - there's no wrong answer!",
        options: [
            { id: 'minimal', label: 'Minimal', icon: '1️⃣', description: 'Just cleanser or nothing' },
            { id: 'basic', label: 'Basic', icon: '2️⃣', description: 'Cleanser + moisturizer' },
            { id: 'moderate', label: 'Moderate', icon: '3️⃣', description: '3-4 products regularly' },
            { id: 'advanced', label: 'Advanced', icon: '4️⃣', description: '5+ products, actives included' },
        ],
    },
];

// Skin profile analysis based on answers
export const analyzeSkinProfile = (answers) => {
    const profile = {
        skinType: answers[1],
        primaryConcern: answers[2],
        afterCleansing: answers[3],
        breakoutFrequency: answers[4],
        ageRange: answers[5],
        routineLevel: answers[6],
    };

    // Generate recommendations based on profile
    const recommendations = generateRecommendations(profile);
    const skinAnalysis = generateAnalysis(profile);

    return {
        profile,
        recommendations,
        skinAnalysis,
    };
};

const generateAnalysis = (profile) => {
    const analyses = {
        skinType: {
            oily: "Your skin produces excess sebum, especially in the T-zone. Focus on oil control without over-drying.",
            dry: "Your skin lacks natural moisture. Prioritize hydrating and nourishing ingredients.",
            combination: "Your skin has both oily and dry areas. Use targeted products for different zones.",
            normal: "Your skin is well-balanced. Focus on maintenance and prevention.",
            sensitive: "Your skin reacts easily. Choose gentle, fragrance-free products.",
        },
        concern: {
            acne: "To address breakouts, look for salicylic acid, niacinamide, and tea tree oil.",
            aging: "For anti-aging, retinol, peptides, and vitamin C are your best friends.",
            pigmentation: "To fade dark spots, use vitamin C, alpha arbutin, and niacinamide.",
            dullness: "For radiance, incorporate AHAs, vitamin C, and hydrating serums.",
            dehydration: "For dehydrated skin, hyaluronic acid and ceramides are essential.",
            redness: "To calm redness, look for centella asiatica, azelaic acid, and aloe vera.",
        },
    };

    return {
        skinTypeAnalysis: analyses.skinType[profile.skinType] || "Your skin needs a personalized approach.",
        concernAnalysis: analyses.concern[profile.primaryConcern] || "We'll help you address your concerns.",
        overallScore: calculateSkinScore(profile),
    };
};

const calculateSkinScore = (profile) => {
    // Simple scoring based on current routine and concerns
    let score = 50;

    if (profile.routineLevel === 'advanced') score += 20;
    else if (profile.routineLevel === 'moderate') score += 15;
    else if (profile.routineLevel === 'basic') score += 10;

    if (profile.breakoutFrequency === 'never') score += 15;
    else if (profile.breakoutFrequency === 'rarely') score += 10;

    if (profile.afterCleansing === 'comfortable') score += 10;

    return Math.min(100, score);
};

const generateRecommendations = (profile) => {
    const routine = {
        morning: [],
        evening: [],
        weekly: [],
    };

    // Morning routine
    routine.morning = [
        {
            step: 1,
            category: 'Cleanser',
            description: profile.skinType === 'oily'
                ? 'Gentle foaming cleanser with salicylic acid'
                : profile.skinType === 'dry'
                    ? 'Hydrating cream cleanser'
                    : 'Gentle pH-balanced cleanser',
            importance: 'Essential',
        },
        {
            step: 2,
            category: 'Toner',
            description: profile.primaryConcern === 'acne'
                ? 'Exfoliating toner with BHA'
                : 'Hydrating toner with hyaluronic acid',
            importance: 'Recommended',
        },
        {
            step: 3,
            category: 'Serum',
            description: profile.primaryConcern === 'pigmentation' || profile.primaryConcern === 'dullness'
                ? 'Vitamin C serum for brightness'
                : profile.primaryConcern === 'aging'
                    ? 'Peptide serum for firmness'
                    : 'Niacinamide serum for balance',
            importance: 'Essential',
        },
        {
            step: 4,
            category: 'Moisturizer',
            description: profile.skinType === 'oily'
                ? 'Lightweight gel moisturizer'
                : profile.skinType === 'dry'
                    ? 'Rich cream moisturizer'
                    : 'Balanced lotion moisturizer',
            importance: 'Essential',
        },
        {
            step: 5,
            category: 'Sunscreen',
            description: 'Broad spectrum SPF 50+ sunscreen',
            importance: 'Essential',
        },
    ];

    // Evening routine
    routine.evening = [
        {
            step: 1,
            category: 'Cleanser',
            description: 'Double cleanse - oil cleanser followed by water-based cleanser',
            importance: 'Essential',
        },
        {
            step: 2,
            category: 'Treatment',
            description: profile.primaryConcern === 'acne'
                ? 'Benzoyl peroxide or retinoid treatment'
                : profile.primaryConcern === 'aging'
                    ? 'Retinol or retinoid serum'
                    : profile.primaryConcern === 'pigmentation'
                        ? 'Alpha arbutin or tranexamic acid serum'
                        : 'Niacinamide serum',
            importance: 'Essential',
        },
        {
            step: 3,
            category: 'Eye Cream',
            description: profile.ageRange === 'over-45' || profile.ageRange === '35-45'
                ? 'Retinol eye cream for fine lines'
                : 'Hydrating eye cream with peptides',
            importance: 'Recommended',
        },
        {
            step: 4,
            category: 'Night Cream',
            description: profile.skinType === 'oily'
                ? 'Lightweight night gel'
                : 'Rich overnight repair cream',
            importance: 'Essential',
        },
    ];

    // Weekly treatments
    routine.weekly = [
        {
            category: 'Exfoliation',
            frequency: profile.skinType === 'sensitive' ? '1x per week' : '2x per week',
            description: profile.skinType === 'sensitive'
                ? 'Gentle enzymatic exfoliant'
                : profile.skinType === 'oily' || profile.primaryConcern === 'acne'
                    ? 'BHA chemical exfoliant'
                    : 'AHA chemical exfoliant',
        },
        {
            category: 'Face Mask',
            frequency: '1-2x per week',
            description: profile.skinType === 'oily'
                ? 'Clay mask for deep cleansing'
                : profile.skinType === 'dry'
                    ? 'Hydrating sheet mask'
                    : 'Multi-masking based on zones',
        },
    ];

    return routine;
};

export default quizQuestions;
