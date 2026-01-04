import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';

const Coupons = () => {
    const { coupons, addNewCoupon, removeCoupon, loadAdminData } = useAdmin();
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '',
        maxDiscount: '',
        expiresAt: '',
    });

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addNewCoupon({
            ...formData,
            value: parseFloat(formData.value),
            minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null,
            maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
            expiresAt: formData.expiresAt || null,
            usageCount: 0,
        });

        setFormData({ code: '', type: 'percentage', value: '', minOrder: '', maxDiscount: '', expiresAt: '' });
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Discount Coupons</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Coupons</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-lg">
                {/* Add Coupon Form */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ marginBottom: 0 }}>Create Coupon</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Coupon Code</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                        placeholder="WELCOME10"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Discount Type</label>
                                    <select
                                        className="form-input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Minimum Order (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.minOrder}
                                        onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                                        min="0"
                                    />
                                </div>

                                {formData.type === 'percentage' && (
                                    <div className="form-group">
                                        <label className="form-label">Max Discount (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.maxDiscount}
                                            onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                            min="0"
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Expires On</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <FiPlus /> Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Coupons List */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h3 style={{ marginBottom: 0 }}>Active Coupons</h3>
                        </div>
                        {coupons.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Type</th>
                                        <th>Value</th>
                                        <th>Min Order</th>
                                        <th>Expires</th>
                                        <th>Used</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((coupon) => (
                                        <tr key={coupon.code}>
                                            <td>
                                                <span className="badge badge-primary">{coupon.code}</span>
                                            </td>
                                            <td className="text-small" style={{ textTransform: 'capitalize' }}>{coupon.type}</td>
                                            <td className="text-small">
                                                {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                            </td>
                                            <td className="text-small">
                                                {coupon.minOrder ? `₹${coupon.minOrder}` : '-'}
                                            </td>
                                            <td className="text-small text-muted">
                                                {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}
                                            </td>
                                            <td className="text-small">{coupon.usageCount || 0}</td>
                                            <td>
                                                <button
                                                    onClick={() => removeCoupon(coupon.code)}
                                                    className="admin-table-action-btn danger"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                                <FiTag size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                                <h3>No Coupons Yet</h3>
                                <p className="text-muted">Create your first discount coupon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coupons;
