// User Profile Page - Profile management with addresses
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import SEO from '../components/SEO';

const UserProfile = () => {
    const { user, isAuthenticated, loading, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [addressData, setAddressData] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
    });

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            loadAddresses();
        }
    }, [user, isAuthenticated, loading, navigate]);

    const loadAddresses = async () => {
        try {
            const response = await usersAPI.getProfile();
            setAddresses(response.data.user?.addresses || []);
        } catch (error) {
            // Demo mode - use local storage
            const savedAddresses = localStorage.getItem('user_addresses');
            if (savedAddresses) {
                setAddresses(JSON.parse(savedAddresses));
            }
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await usersAPI.updateProfile(profileData);
            if (updateUser) {
                updateUser(profileData);
            }
            setEditing(false);
        } catch (error) {
            // Demo mode - update locally
            localStorage.setItem('user_profile', JSON.stringify(profileData));
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingAddress) {
                await usersAPI.updateAddress(editingAddress.id, addressData);
            } else {
                await usersAPI.addAddress(addressData);
            }
            loadAddresses();
            resetAddressForm();
        } catch (error) {
            // Demo mode - save locally
            let updatedAddresses;
            if (editingAddress) {
                updatedAddresses = addresses.map(a => 
                    a.id === editingAddress.id ? { ...addressData, id: a.id } : a
                );
            } else {
                updatedAddresses = [...addresses, { ...addressData, id: Date.now() }];
            }
            setAddresses(updatedAddresses);
            localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
            resetAddressForm();
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        
        try {
            await usersAPI.deleteAddress(addressId);
            loadAddresses();
        } catch (error) {
            // Demo mode - delete locally
            const updatedAddresses = addresses.filter(a => a.id !== addressId);
            setAddresses(updatedAddresses);
            localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setAddressData(address);
        setShowAddressForm(true);
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressData({
            label: 'Home',
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: false,
        });
    };

    if (loading) {
        return (
            <div className="container py-xl" style={{ textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="user-profile" style={{ paddingTop: '100px' }}>
            <SEO title="My Profile" description="Manage your profile and addresses" />
            
            <div className="container section">
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Profile</h1>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-xl)',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: 'var(--spacing-md)',
                }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        <FiUser /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`btn ${activeTab === 'addresses' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        <FiMapPin /> Addresses
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="card">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-xl)',
                        }}>
                            <h2>Personal Information</h2>
                            {!editing && (
                                <button onClick={() => setEditing(true)} className="btn btn-outline">
                                    <FiEdit2 /> Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label className="form-label">
                                    <FiUser style={{ marginRight: '8px' }} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiMail style={{ marginRight: '8px' }} /> Email
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiPhone style={{ marginRight: '8px' }} /> Phone
                                </label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    disabled={!editing}
                                />
                            </div>

                            {editing && (
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setProfileData({
                                                name: user?.name || '',
                                                email: user?.email || '',
                                                phone: user?.phone || '',
                                            });
                                        }}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div>
                        {/* Add Address Button */}
                        {!showAddressForm && (
                            <button
                                onClick={() => setShowAddressForm(true)}
                                className="btn btn-primary"
                                style={{ marginBottom: 'var(--spacing-xl)' }}
                            >
                                <FiPlus /> Add New Address
                            </button>
                        )}

                        {/* Address Form */}
                        {showAddressForm && (
                            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <form onSubmit={handleAddressSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Label</label>
                                            <select
                                                className="form-input"
                                                value={addressData.label}
                                                onChange={(e) => setAddressData({ ...addressData, label: e.target.value })}
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={addressData.fullName}
                                                onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                value={addressData.phone}
                                                onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Pincode</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={addressData.pincode}
                                                onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Address Line 1</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={addressData.addressLine1}
                                            onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                                            placeholder="House/Flat No., Building Name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Address Line 2</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={addressData.addressLine2}
                                            onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
                                            placeholder="Street, Area, Landmark"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={addressData.city}
                                                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={addressData.state}
                                                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <input
                                                type="checkbox"
                                                checked={addressData.isDefault}
                                                onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                                            />
                                            Set as default address
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                        </button>
                                        <button type="button" onClick={resetAddressForm} className="btn btn-outline">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Addresses List */}
                        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                            {addresses.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                                    <FiMapPin size={48} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                                    <p className="text-muted">No addresses saved yet</p>
                                </div>
                            ) : (
                                addresses.map((address) => (
                                    <div key={address.id} className="card" style={{ position: 'relative' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                                    <span className="badge badge-primary">{address.label}</span>
                                                    {address.isDefault && (
                                                        <span className="badge badge-success">Default</span>
                                                    )}
                                                </div>
                                                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{address.fullName}</h4>
                                                <p className="text-muted" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                                    {address.addressLine1}
                                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                                </p>
                                                <p className="text-muted" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                                    {address.city}, {address.state} - {address.pincode}
                                                </p>
                                                <p className="text-muted">
                                                    <FiPhone size={14} style={{ marginRight: '4px' }} />
                                                    {address.phone}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button
                                                    onClick={() => handleEditAddress(address)}
                                                    className="btn btn-outline btn-sm"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                    className="btn btn-outline btn-sm"
                                                    title="Delete"
                                                    style={{ color: 'var(--color-danger)' }}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
