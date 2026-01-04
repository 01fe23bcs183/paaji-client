import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiClock, FiTag, FiChevronRight } from 'react-icons/fi';
import { getBlogPosts, blogCategories, popularTags } from '../data/blogData';
import SEO from '../components/SEO';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, [currentPage, selectedCategory]);

    const loadPosts = () => {
        setLoading(true);
        const result = getBlogPosts({
            page: currentPage,
            limit: 6,
            category: selectedCategory,
            search: search,
        });
        setPosts(result.posts);
        setTotal(result.total);
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadPosts();
    };

    const featuredPost = posts.find(p => p.featured);
    const regularPosts = posts.filter(p => currentPage > 1 || !p.featured);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            <SEO
                title="Skincare Blog"
                description="Expert skincare tips, product guides, and advice for healthy, glowing skin. Learn about ingredients, routines, and more from our skincare experts."
                keywords="skincare blog, beauty tips, skincare routine, skin health, beauty advice"
                url="/blog"
            />

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                padding: 'var(--spacing-xxl) 0',
                color: 'white',
                textAlign: 'center',
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>
                        Skincare Blog
                    </h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                        Expert tips, guides, and advice for your skincare journey
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section style={{
                background: 'var(--color-background)',
                padding: 'var(--spacing-lg) 0',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky',
                top: '60px',
                zIndex: 100,
            }}>
                <div className="container">
                    <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                flex: 1,
                                position: 'relative',
                            }}>
                                <FiSearch style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Main Content */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-xxl)' }}>
                        {/* Posts */}
                        <div>
                            {/* Featured Post */}
                            {currentPage === 1 && featuredPost && (
                                <Link
                                    to={`/blog/${featuredPost.slug}`}
                                    className="card"
                                    style={{
                                        display: 'block',
                                        marginBottom: 'var(--spacing-xl)',
                                        overflow: 'hidden',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <div style={{
                                        height: '300px',
                                        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light, #F5EFE0))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            top: 'var(--spacing-md)',
                                            left: 'var(--spacing-md)',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                        }}>
                                            FEATURED
                                        </span>
                                        <span style={{ fontSize: '4rem' }}>📝</span>
                                    </div>
                                    <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-md)',
                                            marginBottom: 'var(--spacing-sm)',
                                            fontSize: '0.85rem',
                                            color: 'var(--color-text-muted)',
                                        }}>
                                            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                                                {featuredPost.category}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiCalendar size={14} /> {formatDate(featuredPost.publishedAt)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiClock size={14} /> {featuredPost.readTime} min read
                                            </span>
                                        </div>
                                        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{featuredPost.title}</h2>
                                        <p className="text-muted">{featuredPost.excerpt}</p>
                                        <span style={{
                                            color: 'var(--color-primary)',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            marginTop: 'var(--spacing-md)',
                                        }}>
                                            Read More <FiChevronRight />
                                        </span>
                                    </div>
                                </Link>
                            )}

                            {/* Post Grid */}
                            {loading ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                                    {regularPosts.map(post => (
                                        <Link
                                            key={post.id}
                                            to={`/blog/${post.slug}`}
                                            className="card"
                                            style={{
                                                display: 'block',
                                                overflow: 'hidden',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                transition: 'transform 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{
                                                height: '180px',
                                                background: 'linear-gradient(135deg, var(--color-background-alt), var(--color-border))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <span style={{ fontSize: '3rem', opacity: 0.5 }}>📄</span>
                                            </div>
                                            <div className="card-body">
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 'var(--spacing-xs)',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--color-text-muted)',
                                                }}>
                                                    <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                                                        {post.category}
                                                    </span>
                                                    <span>{post.readTime} min</span>
                                                </div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)' }}>
                                                    {post.title}
                                                </h3>
                                                <p className="text-small text-muted" style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}>
                                                    {post.excerpt}
                                                </p>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    marginTop: 'var(--spacing-sm)',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-text-muted)',
                                                }}>
                                                    <FiCalendar size={12} /> {formatDate(post.publishedAt)}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {total > 6 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 'var(--spacing-sm)',
                                    marginTop: 'var(--spacing-xl)',
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="btn btn-outline"
                                    >
                                        Previous
                                    </button>
                                    <span style={{
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        color: 'var(--color-text-muted)',
                                    }}>
                                        Page {currentPage} of {Math.ceil(total / 6)}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage >= Math.ceil(total / 6)}
                                        className="btn btn-outline"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside>
                            {/* Categories */}
                            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <div className="card-header">
                                    <h4 style={{ margin: 0 }}>Categories</h4>
                                </div>
                                <div className="card-body" style={{ padding: 0 }}>
                                    {blogCategories.map((cat, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSelectedCategory(selectedCategory === cat.name ? '' : cat.name);
                                                setCurrentPage(1);
                                            }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: 'var(--spacing-md)',
                                                border: 'none',
                                                borderBottom: i < blogCategories.length - 1 ? '1px solid var(--color-border)' : 'none',
                                                background: selectedCategory === cat.name ? 'var(--color-primary-light)' : 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <span>{cat.name}</span>
                                            <span style={{
                                                background: 'var(--color-background-alt)',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                            }}>
                                                {cat.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <div className="card-header">
                                    <h4 style={{ margin: 0 }}>Popular Tags</h4>
                                </div>
                                <div className="card-body">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                                        {popularTags.map((tag, i) => (
                                            <Link
                                                key={i}
                                                to={`/blog?tag=${tag}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 10px',
                                                    background: 'var(--color-background-alt)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-text)',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <FiTag size={12} /> {tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter CTA */}
                            <div className="card" style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                color: 'white',
                            }}>
                                <div className="card-body" style={{ textAlign: 'center' }}>
                                    <h4 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>
                                        Get Skincare Tips
                                    </h4>
                                    <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: 'var(--spacing-md)' }}>
                                        Subscribe for weekly tips and exclusive offers
                                    </p>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="form-input"
                                        style={{
                                            marginBottom: 'var(--spacing-sm)',
                                            background: 'rgba(255,255,255,0.9)',
                                        }}
                                    />
                                    <button className="btn" style={{
                                        width: '100%',
                                        background: 'white',
                                        color: 'var(--color-primary)',
                                    }}>
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
