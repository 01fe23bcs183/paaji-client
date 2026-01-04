import { useState, useEffect } from 'react';
import {
    FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight,
    FiCalendar, FiPercent, FiGift, FiTruck, FiEye, FiMousePointer,
    FiShoppingCart, FiTrendingUp, FiCopy
} from 'react-icons/fi';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'banner',
        title: '',
        subtitle: '',
        discountType: 'percentage',
        discountValue: 10,
        couponCode: '',
        minOrderValue: 0,
        maxDiscount: '',
        backgroundColor: '#C4A77D',
        textColor: '#FFFFFF',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        startDate: '',
        endDate: '',
        isActive: true,
        priority: 0,
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch('/api/campaigns');
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCampaign
                ? `/api/campaigns/${editingCampaign.id}`
                : '/api/campaigns';
            const method = editingCampaign ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchCampaigns();
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Failed to save campaign:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
            fetchCampaigns();
        } catch (error) {
            console.error('Failed to delete campaign:', error);
        }
    };

    const handleToggle = async (id) => {
        try {
            await fetch(`/api/campaigns/${id}/toggle`, { method: 'PATCH' });
            fetchCampaigns();
        } catch (error) {
            console.error('Failed to toggle campaign:', error);
        }
    };

    const handleEdit = (campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            ...campaign,
            startDate: new Date(campaign.startDate).toISOString().slice(0, 16),
            endDate: new Date(campaign.endDate).toISOString().slice(0, 16),
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCampaign(null);
        setFormData({
            name: '',
            type: 'banner',
            title: '',
            subtitle: '',
            discountType: 'percentage',
            discountValue: 10,
            couponCode: '',
            minOrderValue: 0,
            maxDiscount: '',
            backgroundColor: '#C4A77D',
            textColor: '#FFFFFF',
            buttonText: 'Shop Now',
            buttonLink: '/products',
            startDate: '',
            endDate: '',
            isActive: true,
            priority: 0,
        });
    };

    const getStatusBadge = (campaign) => {
        const now = new Date();
        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);

        if (!campaign.isActive) {
            return <span className="badge badge-secondary">Inactive</span>;
        }
        if (now < start) {
            return <span className="badge badge-warning">Scheduled</span>;
        }
        if (now > end) {
            return <span className="badge badge-error">Expired</span>;
        }
        return <span className="badge badge-success">Live</span>;
    };

    const getDiscountIcon = (type) => {
        const icons = {
            percentage: <FiPercent />,
            fixed: <FiGift />,
            freeShipping: <FiTruck />,
            buyOneGetOne: <FiShoppingCart />,
        };
        return icons[type] || <FiGift />;
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Coupon code copied!');
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Discount Campaigns</h1>
                    <p className="admin-subtitle">Create and manage promotional campaigns</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { resetForm(); setShowModal(true); }}
                >
                    <FiPlus /> New Campaign
                </button>
            </div>

            {/* Stats Overview */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                        <FiTrendingUp />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {campaigns.filter(c => c.isActive && new Date(c.endDate) > new Date()).length}
                        </span>
                        <span className="admin-stat-label">Active Campaigns</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <FiEye />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0).toLocaleString()}
                        </span>
                        <span className="admin-stat-label">Total Impressions</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}>
                        <FiMousePointer />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0).toLocaleString()}
                        </span>
                        <span className="admin-stat-label">Total Clicks</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                        <FiShoppingCart />
                    </div>
                    <div className="admin-stat-content">
                        <span className="admin-stat-value">
                            {campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0).toLocaleString()}
                        </span>
                        <span className="admin-stat-label">Conversions</span>
                    </div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Type</th>
                                <th>Discount</th>
                                <th>Coupon Code</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Performance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map(campaign => (
                                <tr key={campaign.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: campaign.backgroundColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: campaign.textColor,
                                            }}>
                                                {getDiscountIcon(campaign.discountType)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{campaign.name}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                                    {campaign.title}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">{campaign.type}</span>
                                    </td>
                                    <td>
                                        {campaign.discountType === 'percentage' && `${campaign.discountValue}% OFF`}
                                        {campaign.discountType === 'fixed' && `₹${campaign.discountValue} OFF`}
                                        {campaign.discountType === 'freeShipping' && 'Free Shipping'}
                                        {campaign.discountType === 'buyOneGetOne' && 'BOGO'}
                                    </td>
                                    <td>
                                        {campaign.couponCode ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <code style={{
                                                    background: 'var(--color-background-alt)',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8125rem',
                                                }}>
                                                    {campaign.couponCode}
                                                </code>
                                                <button
                                                    onClick={() => copyCode(campaign.couponCode)}
                                                    className="btn-icon-sm"
                                                    title="Copy code"
                                                >
                                                    <FiCopy size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--color-text-muted)' }}>Auto-apply</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.8125rem' }}>
                                            <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>
                                                to {new Date(campaign.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(campaign)}</td>
                                    <td>
                                        <div style={{ fontSize: '0.8125rem' }}>
                                            <div>{campaign.impressions || 0} views</div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>
                                                {campaign.clicks || 0} clicks • {campaign.conversions || 0} sales
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleToggle(campaign.id)}
                                                className="btn-icon-sm"
                                                title={campaign.isActive ? 'Deactivate' : 'Activate'}
                                                style={{ color: campaign.isActive ? '#22C55E' : '#9CA3AF' }}
                                            >
                                                {campaign.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(campaign)}
                                                className="btn-icon-sm"
                                                title="Edit"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(campaign.id)}
                                                className="btn-icon-sm text-error"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Campaign Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="e.g., Summer Sale 2026"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Display Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="banner">Top Banner</option>
                                            <option value="popup">Popup</option>
                                            <option value="floating">Floating Bar</option>
                                            <option value="countdown">Countdown Timer</option>
                                        </select>
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label>Headline</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="e.g., 🎉 SUMMER SALE - Get 25% OFF Everything!"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="percentage">Percentage Off</option>
                                            <option value="fixed">Fixed Amount Off</option>
                                            <option value="freeShipping">Free Shipping</option>
                                            <option value="buyOneGetOne">Buy One Get One</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Value</label>
                                        <input
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                            placeholder={formData.discountType === 'percentage' ? '% off' : '₹ off'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Coupon Code (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.couponCode}
                                            onChange={e => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                                            placeholder="e.g., SUMMER25"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Min Order Value (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.minOrderValue}
                                            onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Background Color</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="color"
                                                value={formData.backgroundColor}
                                                onChange={e => setFormData({ ...formData, backgroundColor: e.target.value })}
                                                style={{ width: '50px', height: '38px', padding: '2px' }}
                                            />
                                            <input
                                                type="text"
                                                value={formData.backgroundColor}
                                                onChange={e => setFormData({ ...formData, backgroundColor: e.target.value })}
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Button Text</label>
                                        <input
                                            type="text"
                                            value={formData.buttonText}
                                            onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Button Link</label>
                                        <input
                                            type="text"
                                            value={formData.buttonLink}
                                            onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Priority (higher = more important)</label>
                                        <input
                                            type="number"
                                            value={formData.priority}
                                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div style={{ marginTop: '1.5rem' }}>
                                    <label style={{ marginBottom: '0.5rem', display: 'block' }}>Preview</label>
                                    <div style={{
                                        background: formData.backgroundColor,
                                        color: formData.textColor,
                                        padding: '0.875rem 1rem',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{formData.title || 'Your headline here'}</span>
                                        {formData.couponCode && (
                                            <code style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                marginLeft: '0.75rem',
                                            }}>
                                                {formData.couponCode}
                                            </code>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
