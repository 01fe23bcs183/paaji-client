// Product Search Component - Search bar with autocomplete
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

const ProductSearch = ({ 
    products = [], 
    onSearch, 
    placeholder = 'Search products...',
    showSuggestions = true,
    maxSuggestions = 5,
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Filter products based on query
    useEffect(() => {
        if (query.length < 2 || !showSuggestions) {
            setSuggestions([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = products
            .filter(product => 
                product.name.toLowerCase().includes(lowerQuery) ||
                product.description?.toLowerCase().includes(lowerQuery)
            )
            .slice(0, maxSuggestions);

        setSuggestions(filtered);
        setShowDropdown(filtered.length > 0);
        setSelectedIndex(-1);
    }, [query, products, showSuggestions, maxSuggestions]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            }
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (product) => {
        setQuery(product.name);
        setShowDropdown(false);
        navigate(`/products/${product.slug}`);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    return (
        <div className="product-search">
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                        placeholder={placeholder}
                        className="search-input"
                        aria-label="Search products"
                        autoComplete="off"
                    />
                    {query && (
                        <button 
                            type="button" 
                            onClick={clearSearch}
                            className="clear-button"
                            aria-label="Clear search"
                        >
                            <FiX />
                        </button>
                    )}
                </div>
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            {showDropdown && suggestions.length > 0 && (
                <div ref={dropdownRef} className="search-suggestions">
                    {suggestions.map((product, index) => (
                        <div
                            key={product.id || product.slug}
                            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(product)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {product.images?.[0] && (
                                <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="suggestion-image"
                                />
                            )}
                            <div className="suggestion-info">
                                <span className="suggestion-name">{product.name}</span>
                                <span className="suggestion-price">
                                    ₹{product.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
