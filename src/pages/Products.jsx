// Products Page - Full product listing with search and filters
import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiStar, FiHeart, FiGrid, FiList } from 'react-icons/fi';
import { getProducts } from '../data/productsData';
import { useCart } from '../context/CartContext';
import ProductSearch from '../components/ProductSearch';
import ProductFilters from '../components/ProductFilters';
import SEO from '../components/SEO';
import { processProducts } from '../utils/search';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        priceRange: { min: '', max: '' },
        sortBy: searchParams.get('sort') || 'featured',
        inStock: false,
    });
    const { addItem } = useCart();

    // Load products
    useEffect(() => {
        const allProducts = getProducts();
        setProducts(allProducts);
        setLoading(false);
    }, []);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        return processProducts(products, {
            query: searchQuery,
            filters,
            sortBy: filters.sortBy,
        });
    }, [products, searchQuery, filters]);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (filters.category) params.set('category', filters.category);
        if (filters.sortBy !== 'featured') params.set('sort', filters.sortBy);
        setSearchParams(params, { replace: true });
    }, [searchQuery, filters, setSearchParams]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return (
            <div className="section" style={{ paddingTop: '120px' }}>
                <div className="container">
                    <div className="skeleton" style={{ height: '400px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="products-page" style={{ paddingTop: '100px' }}>
            <SEO
                title="All Products"
                description="Browse our complete collection of premium skincare products. Find cleansers, serums, moisturizers, and treatments for radiant skin."
                url="/products"
            />

            <div className="container section">
                {/* Page Header */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>All Products</h1>
                    <p className="text-muted">
                        Discover our complete range of premium skincare products
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <ProductSearch
                        products={products}
                        onSearch={handleSearch}
                        placeholder="Search products..."
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--spacing-xl)' }}>
                    {/* Sidebar Filters */}
                    <aside>
                        <ProductFilters
                            products={products}
                            onFilterChange={handleFilterChange}
                            initialFilters={filters}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main>
                        {/* Results Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-lg)',
                            paddingBottom: 'var(--spacing-md)',
                            borderBottom: '1px solid var(--color-border)',
                        }}>
                            <p className="text-muted">
                                Showing {filteredProducts.length} of {products.length} products
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                                    title="Grid view"
                                >
                                    <FiGrid />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                                    title="List view"
                                >
                                    <FiList />
                                </button>
                            </div>
                        </div>

                        {/* No Results */}
                        {filteredProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                                <p className="text-large text-muted">No products found</p>
                                <p className="text-muted">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'responsive-grid-3' : 'product-list'}>
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className={`product-card ${viewMode === 'list' ? 'product-card-list' : ''}`}>
                                        {/* Product Image */}
                                        <div className="product-image-wrapper">
                                            <Link to={`/product/${product.slug}`}>
                                                <img
                                                    src={product.images?.[0] || 'https://placehold.co/400x400/E8D5B7/FFFFFF?text=Product'}
                                                    alt={product.name}
                                                    className="product-image"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            {/* Badges */}
                                            <div className="product-badge-group">
                                                {product.isNew && (
                                                    <span className="badge badge-primary">New</span>
                                                )}
                                                {product.discount > 0 && (
                                                    <span className="badge badge-error">-{product.discount}%</span>
                                                )}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="product-actions">
                                                <button className="product-action-btn" title="Add to Wishlist">
                                                    <FiHeart size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="product-info">
                                            <div className="product-category">{product.category}</div>

                                            <Link to={`/product/${product.slug}`}>
                                                <h3 className="product-name">{product.name}</h3>
                                            </Link>

                                            {/* Rating */}
                                            <div className="product-rating" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar
                                                        key={i}
                                                        size={14}
                                                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                                    />
                                                ))}
                                                <span style={{ color: 'var(--color-text-muted)' }}>
                                                    ({product.reviews || 0})
                                                </span>
                                            </div>

                                            <p className="product-description">
                                                {product.shortDescription || product.description?.substring(0, 80) + '...'}
                                            </p>

                                            {/* Footer */}
                                            <div className="product-footer">
                                                <div className="product-price">
                                                    <div className="product-price-current">
                                                        ₹{product.price.toLocaleString()}
                                                    </div>
                                                    {product.comparePrice && (
                                                        <div className="product-price-original">
                                                            ₹{product.comparePrice.toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => addItem(product)}
                                                    className="btn btn-primary btn-sm"
                                                    disabled={!product.inStock}
                                                >
                                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style>
                {`
                    .product-list {
                        display: flex;
                        flex-direction: column;
                        gap: var(--spacing-lg);
                    }
                    .product-card-list {
                        display: grid;
                        grid-template-columns: 200px 1fr;
                        gap: var(--spacing-lg);
                    }
                    .product-card-list .product-image-wrapper {
                        aspect-ratio: 1;
                    }
                    @media (max-width: 768px) {
                        .products-page .container > div[style*="grid-template-columns: 280px"] {
                            grid-template-columns: 1fr !important;
                        }
                        .desktop-filters {
                            display: none;
                        }
                        .mobile-filter-toggle {
                            display: flex !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Products;
