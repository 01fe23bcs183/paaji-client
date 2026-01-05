// Product Reviews Component - Display and submit product reviews
import { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';

const ProductReviews = ({ productId, productName }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: '',
        comment: '',
    });

    // Demo reviews for when API is not available
    const demoReviews = [
        {
            id: 1,
            userName: 'Priya S.',
            rating: 5,
            title: 'Amazing product!',
            comment: 'This product has completely transformed my skin. I\'ve been using it for 3 weeks and can already see visible results. Highly recommend!',
            createdAt: '2025-12-15',
            helpful: 12,
            verified: true,
        },
        {
            id: 2,
            userName: 'Rahul M.',
            rating: 4,
            title: 'Good quality, fast delivery',
            comment: 'The product quality is excellent. Packaging was secure and delivery was quick. Would have given 5 stars but the price is a bit high.',
            createdAt: '2025-12-10',
            helpful: 8,
            verified: true,
        },
        {
            id: 3,
            userName: 'Anita K.',
            rating: 5,
            title: 'Best skincare purchase ever',
            comment: 'I\'ve tried many products but this one actually works. My skin feels so much smoother and healthier. Will definitely repurchase!',
            createdAt: '2025-12-05',
            helpful: 15,
            verified: false,
        },
    ];

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            const response = await reviewsAPI.getProductReviews(productId);
            setReviews(response.data.reviews || []);
        } catch (error) {
            // Use demo reviews if API fails
            console.log('Using demo reviews');
            setReviews(demoReviews);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Please login to submit a review');
            return;
        }

        setSubmitting(true);
        try {
            await reviewsAPI.create({
                productId,
                ...newReview,
            });
            setNewReview({ rating: 5, title: '', comment: '' });
            setShowForm(false);
            loadReviews();
        } catch (error) {
            // Demo mode - add review locally
            const demoNewReview = {
                id: Date.now(),
                userName: user?.name || 'You',
                ...newReview,
                createdAt: new Date().toISOString().split('T')[0],
                helpful: 0,
                verified: true,
            };
            setReviews([demoNewReview, ...reviews]);
            setNewReview({ rating: 5, title: '', comment: '' });
            setShowForm(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        try {
            await reviewsAPI.markHelpful(reviewId);
            setReviews(reviews.map(r => 
                r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
            ));
        } catch (error) {
            // Demo mode - increment locally
            setReviews(reviews.map(r => 
                r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
            ));
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: reviews.length > 0 
            ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
            : 0,
    }));

    const StarRating = ({ rating, interactive = false, onChange }) => (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={interactive ? 24 : 16}
                    fill={star <= rating ? 'var(--color-warning)' : 'none'}
                    color={star <= rating ? 'var(--color-warning)' : 'var(--color-text-muted)'}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                    onClick={() => interactive && onChange && onChange(star)}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="product-reviews">
                <div className="skeleton" style={{ height: '200px' }} />
            </div>
        );
    }

    return (
        <div className="product-reviews" style={{ marginTop: 'var(--spacing-3xl)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Customer Reviews</h2>

            {/* Reviews Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
            }}>
                {/* Average Rating */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {averageRating}
                    </div>
                    <StarRating rating={Math.round(averageRating)} />
                    <p className="text-muted" style={{ marginTop: 'var(--spacing-sm)' }}>
                        Based on {reviews.length} reviews
                    </p>
                </div>

                {/* Rating Distribution */}
                <div>
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-xs)',
                        }}>
                            <span style={{ width: '60px' }}>{rating} stars</span>
                            <div style={{
                                flex: 1,
                                height: '8px',
                                background: 'var(--color-border)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${percentage}%`,
                                    height: '100%',
                                    background: 'var(--color-warning)',
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                            <span style={{ width: '40px', textAlign: 'right' }} className="text-muted">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Button */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmitReview} className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Write Your Review</h3>
                    
                    <div className="form-group">
                        <label className="form-label">Your Rating</label>
                        <StarRating
                            rating={newReview.rating}
                            interactive
                            onChange={(rating) => setNewReview({ ...newReview, rating })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Review Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Summarize your experience"
                            value={newReview.title}
                            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Review</label>
                        <textarea
                            className="form-input"
                            rows={4}
                            placeholder="Tell us about your experience with this product"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: 'var(--spacing-md)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--color-primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                    }}>
                                        <FiUser size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>
                                            {review.userName}
                                            {review.verified && (
                                                <span className="badge badge-success" style={{ marginLeft: 'var(--spacing-sm)', fontSize: '0.7rem' }}>
                                                    Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-small text-muted">
                                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>

                            {review.title && (
                                <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>{review.title}</h4>
                            )}
                            <p style={{ marginBottom: 'var(--spacing-md)', lineHeight: 1.6 }}>
                                {review.comment}
                            </p>

                            <button
                                onClick={() => handleHelpful(review.id)}
                                className="btn btn-outline btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                            >
                                <FiThumbsUp size={14} />
                                Helpful ({review.helpful || 0})
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
