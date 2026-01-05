// Structured Data Helper - Generate JSON-LD for SEO
// https://schema.org/

// Organization schema for the business
export const getOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JMC Skincare',
    url: 'https://clientjmc.netlify.app',
    logo: 'https://clientjmc.netlify.app/logo.png',
    description: 'Premium luxury skincare products for radiant, healthy skin',
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-XXXXXXXXXX',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
        'https://www.instagram.com/jmcskincare',
        'https://www.facebook.com/jmcskincare',
    ],
});

// Product schema for individual products
export const getProductSchema = (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || 'https://clientjmc.netlify.app/placeholder.jpg',
    sku: product.id || product.slug,
    brand: {
        '@type': 'Brand',
        name: 'JMC Skincare',
    },
    offers: {
        '@type': 'Offer',
        url: `https://clientjmc.netlify.app/products/${product.slug}`,
        priceCurrency: 'INR',
        price: product.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.stock > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
        seller: {
            '@type': 'Organization',
            name: 'JMC Skincare',
        },
    },
    ...(product.comparePrice && {
        priceSpecification: {
            '@type': 'PriceSpecification',
            price: product.comparePrice,
            priceCurrency: 'INR',
            valueAddedTaxIncluded: true,
        },
    }),
});

// BreadcrumbList schema for navigation
export const getBreadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});

// WebSite schema with search action
export const getWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JMC Skincare',
    url: 'https://clientjmc.netlify.app',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://clientjmc.netlify.app/products?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
});

// LocalBusiness schema (if applicable)
export const getLocalBusinessSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JMC Skincare',
    image: 'https://clientjmc.netlify.app/logo.png',
    '@id': 'https://clientjmc.netlify.app',
    url: 'https://clientjmc.netlify.app',
    priceRange: '$$',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
    },
});

// FAQ schema for FAQ pages
export const getFAQSchema = (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
});

// Helper to inject JSON-LD into page head
export const injectJsonLd = (schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return script;
};

// Helper to remove JSON-LD script
export const removeJsonLd = (script) => {
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
};

export default {
    getOrganizationSchema,
    getProductSchema,
    getBreadcrumbSchema,
    getWebsiteSchema,
    getLocalBusinessSchema,
    getFAQSchema,
    injectJsonLd,
    removeJsonLd,
};
