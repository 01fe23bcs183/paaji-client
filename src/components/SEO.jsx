import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - Open Graph type (website, product, article)
 * @param {Object} props.product - Product data for structured data
 * @param {Object} props.article - Article data for structured data
 */
const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    product = null,
    article = null,
    noindex = false,
}) => {
    const siteName = 'JMC Skincare';
    const siteUrl = 'https://jmcskincare.com';
    const defaultImage = `${siteUrl}/og-image.jpg`;
    const defaultDescription = 'Luxury skincare products for radiant, healthy skin. Discover our premium collection of cleansers, serums, moisturizers, and more.';

    const pageTitle = title ? `${title} | ${siteName}` : siteName;
    const pageDescription = description || defaultDescription;
    const pageImage = image || defaultImage;
    const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

    // Generate structured data
    const generateStructuredData = () => {
        const baseData = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            url: siteUrl,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        };

        if (product) {
            return {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description,
                image: product.image,
                brand: {
                    '@type': 'Brand',
                    name: siteName,
                },
                sku: product.sku || product.id,
                offers: {
                    '@type': 'Offer',
                    url: pageUrl,
                    priceCurrency: 'INR',
                    price: product.price,
                    availability: product.inStock
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                    seller: {
                        '@type': 'Organization',
                        name: siteName,
                    },
                },
                ...(product.rating && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviewCount || 1,
                    },
                }),
            };
        }

        if (article) {
            return {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: article.title,
                description: article.description,
                image: article.image,
                author: {
                    '@type': 'Person',
                    name: article.author || siteName,
                },
                publisher: {
                    '@type': 'Organization',
                    name: siteName,
                    logo: {
                        '@type': 'ImageObject',
                        url: `${siteUrl}/logo.png`,
                    },
                },
                datePublished: article.publishedDate,
                dateModified: article.modifiedDate || article.publishedDate,
            };
        }

        return baseData;
    };

    // Organization schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [
            'https://facebook.com/jmcskincare',
            'https://instagram.com/jmcskincare',
            'https://twitter.com/jmcskincare',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-XXXXXXXXXX',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi'],
        },
    };

    // Breadcrumb schema (can be extended per page)
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
            },
            ...(title && title !== 'Home'
                ? [
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: title,
                        item: pageUrl,
                    },
                ]
                : []),
        ],
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={pageUrl} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />

            {/* Additional SEO */}
            <meta name="author" content={siteName} />
            <meta name="theme-color" content="#C4A77D" />

            {/* Language */}
            <html lang="en" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(generateStructuredData())}
            </script>

            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>

            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
