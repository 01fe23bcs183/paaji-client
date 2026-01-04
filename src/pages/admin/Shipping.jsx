import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';

const Shipping = () => {
    const { shippingZones, addNewShippingZone, removeShippingZone, loadAdminData } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        pincodes: '',
        rate: '',
        deliveryDays: '',
    });

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addNewShippingZone({
            name: formData.name,
            pincodes: formData.pincodes.split(',').map(p => p.trim()),
            rate: parseFloat(formData.rate),
            deliveryDays: formData.deliveryDays,
        });

        setFormData({ name: '', pincodes: '', rate: '', deliveryDays: '' });
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Shipping Zones</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Shipping</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-lg">
                {/* Add Zone Form */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ marginBottom: 0 }}>Add Shipping Zone</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Zone Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Local Area"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Pincodes (comma separated)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.pincodes}
                                        onChange={(e) => setFormData({ ...formData, pincodes: e.target.value })}
                                        required
                                        rows={3}
                                        placeholder="110001, 110002, 110003"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Shipping Rate (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Delivery Time</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.deliveryDays}
                                        onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                                        required
                                        placeholder="2-3 days"
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <FiPlus /> Add Zone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Zones List */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h3 style={{ marginBottom: 0 }}>Shipping Zones</h3>
                        </div>
                        {shippingZones.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Zone Name</th>
                                        <th>Pincodes</th>
                                        <th>Rate</th>
                                        <th>Delivery</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shippingZones.map((zone) => (
                                        <tr key={zone.id}>
                                            <td className="text-small" style={{ fontWeight: 600 }}>{zone.name}</td>
                                            <td className="text-small">{zone.pincodes?.slice(0, 3).join(', ')}{zone.pincodes?.length > 3 && '...'}</td>
                                            <td className="text-small">₹{zone.rate}</td>
                                            <td className="text-small">{zone.deliveryDays}</td>
                                            <td>
                                                <button
                                                    onClick={() => removeShippingZone(zone.id)}
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
                                <FiTruck size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                                <h3>No Shipping Zones Yet</h3>
                                <p className="text-muted">Add shipping zones to calculate delivery costs</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
