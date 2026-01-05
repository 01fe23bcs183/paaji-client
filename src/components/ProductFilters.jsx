// Product Filters Component - Category, price, and sorting filters
import { useState, useEffect } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductFilters = ({
    products = [],
    onFilterChange,
    initialFilters = {},
    showMobileToggle = true,
}) => {
    const [filters, setFilters] = useState({
        category: initialFilters.category || '',
        priceRange: initialFilters.priceRange || { min: '', max: '' },
        sortBy: initialFilters.sortBy || 'featured',
        inStock: initialFilters.inStock || false,
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        sort: true,
    });

    // Extract unique categories from products
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    // Price range options
    const priceRanges = [
        { label: 'Under ₹500', min: 0, max: 500 },
        { label: '₹500 - ₹1000', min: 500, max: 1000 },
        { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
        { label: 'Above ₹2000', min: 2000, max: Infinity },
    ];

    // Sort options
    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A to Z' },
        { value: 'name-desc', label: 'Name: Z to A' },
        { value: 'newest', label: 'Newest First' },
    ];

    // Notify parent of filter changes
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange]);

    const handleCategoryChange = (category) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? '' : category,
        }));
    };

    const handlePriceRangeChange = (range) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                min: prev.priceRange.min === range.min ? '' : range.min,
                max: prev.priceRange.max === range.max ? '' : range.max,
            },
        }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({
            ...prev,
            sortBy: e.target.value,
        }));
    };

    const handleStockToggle = () => {
        setFilters(prev => ({
            ...prev,
            inStock: !prev.inStock,
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            priceRange: { min: '', max: '' },
            sortBy: 'featured',
            inStock: false,
        });
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const hasActiveFilters = 
        filters.category || 
        filters.priceRange.min || 
        filters.priceRange.max || 
        filters.inStock ||
        filters.sortBy !== 'featured';

    const FilterContent = () => (
        <div className="filters-content">
            {/* Sort By */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('sort')}
                >
                    <span>Sort By</span>
                    {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.sort && (
                    <div className="filter-section-content">
                        <select 
                            value={filters.sortBy} 
                            onChange={handleSortChange}
                            className="sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div className="filter-section">
                    <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('category')}
                    >
                        <span>Category</span>
                        {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {expandedSections.category && (
                        <div className="filter-section-content">
                            {categories.map(category => (
                                <label key={category} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.category === category}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    <span>{category}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Price Range */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('price')}
                >
                    <span>Price Range</span>
                    {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.price && (
                    <div className="filter-section-content">
                        {priceRanges.map((range, index) => (
                            <label key={index} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={
                                        filters.priceRange.min === range.min &&
                                        filters.priceRange.max === range.max
                                    }
                                    onChange={() => handlePriceRangeChange(range)}
                                />
                                <span>{range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* In Stock Only */}
            <div className="filter-section">
                <label className="filter-checkbox stock-filter">
                    <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={handleStockToggle}
                    />
                    <span>In Stock Only</span>
                </label>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                    <FiX /> Clear All Filters
                </button>
            )}
        </div>
    );

    return (
        <div className="product-filters">
            {/* Mobile Toggle */}
            {showMobileToggle && (
                <button 
                    className="mobile-filter-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <FiFilter />
                    <span>Filters</span>
                    {hasActiveFilters && <span className="filter-badge">!</span>}
                </button>
            )}

            {/* Desktop Filters */}
            <div className="desktop-filters">
                <FilterContent />
            </div>

            {/* Mobile Filters Drawer */}
            {mobileOpen && (
                <div className="mobile-filters-overlay" onClick={() => setMobileOpen(false)}>
                    <div className="mobile-filters-drawer" onClick={e => e.stopPropagation()}>
                        <div className="mobile-filters-header">
                            <h3>Filters</h3>
                            <button onClick={() => setMobileOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <FilterContent />
                        <button 
                            className="apply-filters-btn"
                            onClick={() => setMobileOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilters;
