import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiTag } from 'react-icons/fi';
import { getBlogPost, getRelatedPosts } from '../data/blogData';
import SEO from '../components/SEO';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const foundPost = getBlogPost(slug);
        if (foundPost) {
            setPost(foundPost);
            setRelatedPosts(getRelatedPosts(slug, 3));
        }
        setLoading(false);
        window.scrollTo(0, 0);
    }, [slug]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = (platform) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        };
        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '100px' }}>
                <div className="container">
                    <div className="skeleton" style={{ height: '300px', marginBottom: 'var(--spacing-lg)' }} />
                    <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: 'var(--spacing-md)' }} />
                    <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: 'var(--spacing-xl)' }} />
                    <div className="skeleton" style={{ height: '400px' }} />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="container">
                    <h1>Article Not Found</h1>
                    <p className="text-muted">The article you're looking for doesn't exist.</p>
                    <Link to="/blog" className="btn btn-primary mt-lg">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px' }}>
            <SEO
                title={post.title}
                description={post.excerpt}
                keywords={post.tags.join(', ')}
                url={`/blog/${post.slug}`}
                type="article"
                articleData={{
                    publishedTime: post.publishedAt,
                    author: post.author,
                    section: post.category,
                    tags: post.tags,
                }}
            />

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                padding: 'var(--spacing-xxl) 0',
                color: 'white',
            }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <Link
                        to="/blog"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'white',
                            opacity: 0.9,
                            marginBottom: 'var(--spacing-lg)',
                            textDecoration: 'none',
                        }}
                    >
                        <FiArrowLeft /> Back to Blog
                    </Link>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                        }}>
                            {post.category}
                        </span>
                    </div>

                    <h1 style={{
                        color: 'white',
                        fontSize: '2.5rem',
                        lineHeight: 1.2,
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        {post.title}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        flexWrap: 'wrap',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FiUser size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>{post.author}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Skincare Expert</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                            <FiCalendar /> {formatDate(post.publishedAt)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                            <FiClock /> {post.readTime} min read
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--spacing-xl)' }}>
                        {/* Main Content */}
                        <article>
                            <div
                                className="blog-content"
                                style={{
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    color: 'var(--color-text)',
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            <div style={{
                                marginTop: 'var(--spacing-xl)',
                                paddingTop: 'var(--spacing-lg)',
                                borderTop: '1px solid var(--color-border)',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    flexWrap: 'wrap',
                                }}>
                                    <FiTag style={{ color: 'var(--color-text-muted)' }} />
                                    {post.tags.map((tag, i) => (
                                        <Link
                                            key={i}
                                            to={`/blog?tag=${tag}`}
                                            style={{
                                                padding: '4px 12px',
                                                background: 'var(--color-background-alt)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.9rem',
                                                color: 'var(--color-text)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Share */}
                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-lg)',
                                background: 'var(--color-background-alt)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiShare2 /> Share this article
                                </span>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: '#1DA1F2',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FiTwitter />
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: '#4267B2',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FiFacebook />
                                    </button>
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: '#0077B5',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FiLinkedin />
                                    </button>
                                </div>
                            </div>

                            {/* Author Box */}
                            <div style={{
                                marginTop: 'var(--spacing-xl)',
                                padding: 'var(--spacing-lg)',
                                background: 'var(--color-background-alt)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                gap: 'var(--spacing-lg)',
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '2rem',
                                    flexShrink: 0,
                                }}>
                                    <FiUser />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{post.author}</h4>
                                    <p className="text-muted" style={{ marginBottom: 0 }}>
                                        {post.author} is a skincare expert and dermatologist with over 10 years of experience
                                        in helping people achieve healthy, radiant skin through science-backed skincare routines.
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Sticky Share Sidebar */}
                        <div style={{
                            position: 'sticky',
                            top: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-sm)',
                        }}>
                            <button
                                onClick={() => handleShare('twitter')}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-background)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                title="Share on Twitter"
                            >
                                <FiTwitter />
                            </button>
                            <button
                                onClick={() => handleShare('facebook')}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-background)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                title="Share on Facebook"
                            >
                                <FiFacebook />
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-background)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                title="Share on LinkedIn"
                            >
                                <FiLinkedin />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="section" style={{ background: 'var(--color-background-alt)' }}>
                    <div className="container" style={{ maxWidth: '900px' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                            Related Articles
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
                            {relatedPosts.map(related => (
                                <Link
                                    key={related.id}
                                    to={`/blog/${related.slug}`}
                                    className="card"
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div style={{
                                        height: '140px',
                                        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-border))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <span style={{ fontSize: '2rem', opacity: 0.5 }}>📄</span>
                                    </div>
                                    <div className="card-body">
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-primary)',
                                            fontWeight: '600',
                                        }}>
                                            {related.category}
                                        </span>
                                        <h4 style={{
                                            fontSize: '1rem',
                                            marginTop: '4px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {related.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="section" style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                textAlign: 'center',
                color: 'white',
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h2 style={{ color: 'white' }}>Ready to Start Your Skincare Journey?</h2>
                    <p style={{ opacity: 0.9, marginBottom: 'var(--spacing-lg)' }}>
                        Take our quick skin quiz to get personalized product recommendations
                    </p>
                    <Link to="/skin-quiz" className="btn btn-secondary btn-lg">
                        Take the Skin Quiz
                    </Link>
                </div>
            </section>

            {/* Blog Content Styles */}
            <style>
                {`
          .blog-content h2 {
            margin-top: var(--spacing-xl);
            margin-bottom: var(--spacing-md);
            color: var(--color-text);
          }
          
          .blog-content h3 {
            margin-top: var(--spacing-lg);
            margin-bottom: var(--spacing-sm);
            color: var(--color-text);
          }
          
          .blog-content p {
            margin-bottom: var(--spacing-md);
          }
          
          .blog-content ul, .blog-content ol {
            margin-bottom: var(--spacing-md);
            padding-left: var(--spacing-lg);
          }
          
          .blog-content li {
            margin-bottom: var(--spacing-xs);
          }
          
          .blog-content strong {
            color: var(--color-primary);
          }
        `}
            </style>
        </div>
    );
};

export default BlogPost;
