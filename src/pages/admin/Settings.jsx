import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FiSave, FiImage, FiGlobe, FiMail, FiPhone } from 'react-icons/fi';

const Settings = () => {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        siteName: '',
        tagline: '',
        logo: null,
        favicon: null,
        primaryColor: '#C4A77D',
        secondaryColor: '#2C2C2C',
        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
        },
        googleAnalyticsId: '',
        facebookPixelId: '',
        instagramPixelId: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || '',
                tagline: settings.tagline || '',
                logo: settings.logo || null,
                favicon: settings.favicon || null,
                primaryColor: settings.primaryColor || '#C4A77D',
                secondaryColor: settings.secondaryColor || '#2C2C2C',
                contactEmail: settings.contactEmail || '',
                contactPhone: settings.contactPhone || '',
                whatsappNumber: settings.whatsappNumber || '',
                socialLinks: settings.socialLinks || { facebook: '', instagram: '', twitter: '' },
                googleAnalyticsId: settings.googleAnalyticsId || '',
                facebookPixelId: settings.facebookPixelId || '',
                instagramPixelId: settings.instagramPixelId || '',
            });
        }
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialKey]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [type]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading logo:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            updateSettings(formData);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Settings</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Settings</span>
                        </div>
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`admin-alert ${message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'} mb-lg`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {/* General Settings */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <FiGlobe /> General Settings
                        </h3>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Site Name</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    className="form-input"
                                    value={formData.siteName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tagline</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    className="form-input"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <FiImage /> Branding
                        </h3>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, 'logo')}
                                    className="form-input"
                                />
                                {formData.logo && (
                                    <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                        <img src={formData.logo} alt="Logo" style={{ maxHeight: '60px' }} />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Favicon</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, 'favicon')}
                                    className="form-input"
                                />
                                {formData.favicon && (
                                    <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                        <img src={formData.favicon} alt="Favicon" style={{ maxHeight: '32px' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Primary Color</label>
                                <div className="admin-color-picker">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="primaryColor"
                                        className="form-input"
                                        value={formData.primaryColor}
                                        onChange={handleInputChange}
                                        placeholder="#C4A77D"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Secondary Color</label>
                                <div className="admin-color-picker">
                                    <input
                                        type="color"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="secondaryColor"
                                        className="form-input"
                                        value={formData.secondaryColor}
                                        onChange={handleInputChange}
                                        placeholder="#2C2C2C"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <FiMail /> Contact Information
                        </h3>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    className="form-input"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    className="form-input"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    className="form-input"
                                    value={formData.whatsappNumber}
                                    onChange={handleInputChange}
                                    placeholder="919876543210"
                                />
                                <p className="text-tiny text-muted mt-xs">Include country code (e.g., 919876543210)</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">Social Media Links</h3>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Facebook</label>
                                <input
                                    type="url"
                                    name="social.facebook"
                                    className="form-input"
                                    value={formData.socialLinks.facebook}
                                    onChange={handleInputChange}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Instagram</label>
                                <input
                                    type="url"
                                    name="social.instagram"
                                    className="form-input"
                                    value={formData.socialLinks.instagram}
                                    onChange={handleInputChange}
                                    placeholder="https://instagram.com/yourprofile"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Twitter</label>
                                <input
                                    type="url"
                                    name="social.twitter"
                                    className="form-input"
                                    value={formData.socialLinks.twitter}
                                    onChange={handleInputChange}
                                    placeholder="https://twitter.com/yourhandle"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Analytics & Tracking */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">Analytics & Tracking</h3>

                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label className="form-label">Google Analytics ID</label>
                                <input
                                    type="text"
                                    name="googleAnalyticsId"
                                    className="form-input"
                                    value={formData.googleAnalyticsId}
                                    onChange={handleInputChange}
                                    placeholder="G-XXXXXXXXXX"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Facebook Pixel ID</label>
                                <input
                                    type="text"
                                    name="facebookPixelId"
                                    className="form-input"
                                    value={formData.facebookPixelId}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Instagram Pixel ID</label>
                                <input
                                    type="text"
                                    name="instagramPixelId"
                                    className="form-input"
                                    value={formData.instagramPixelId}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
