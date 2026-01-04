import { useState, useEffect } from 'react';
import { FiCreditCard, FiSave } from 'react-icons/fi';
import { getPaymentConfig, updatePaymentConfig } from '../../services/storage';

const Payments = () => {
    const [config, setConfig] = useState({
        razorpay: {
            enabled: false,
            keyId: '',
            keySecret: '',
            testMode: true,
        },
        cashfree: {
            enabled: false,
            appId: '',
            secretKey: '',
            testMode: true,
        },
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const savedConfig = getPaymentConfig();
        setConfig(savedConfig);
    }, []);

    const handleInputChange = (gateway, field, value) => {
        setConfig(prev => ({
            ...prev,
            [gateway]: {
                ...prev[gateway],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            updatePaymentConfig(config);
            setMessage({ type: 'success', text: 'Payment settings saved successfully!' });
        } catch (error) {
            console.error('Error saving payment config:', error);
            setMessage({ type: 'error', text: 'Failed to save payment settings' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Payment Methods</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Payments</span>
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
                    {/* Razorpay */}
                    <div className="admin-payment-config">
                        <div className="admin-payment-config-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div className="admin-payment-config-logo">
                                    <FiCreditCard size={32} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Razorpay</h3>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Accept UPI, Cards, Net Banking & Wallets
                                    </p>
                                </div>
                            </div>
                            <label className="admin-switch">
                                <input
                                    type="checkbox"
                                    checked={config.razorpay.enabled}
                                    onChange={(e) => handleInputChange('razorpay', 'enabled', e.target.checked)}
                                />
                                <span className="admin-switch-slider"></span>
                            </label>
                        </div>

                        {config.razorpay.enabled && (
                            <div className="admin-payment-config-body">
                                <div className="admin-form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Key ID</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={config.razorpay.keyId}
                                            onChange={(e) => handleInputChange('razorpay', 'keyId', e.target.value)}
                                            placeholder="rzp_test_xxxxxxxxxxxxx"
                                        />
                                        <p className="text-tiny text-muted mt-xs">
                                            Get from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer">Razorpay Dashboard</a>
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Key Secret</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={config.razorpay.keySecret}
                                            onChange={(e) => handleInputChange('razorpay', 'keySecret', e.target.value)}
                                            placeholder="••••••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.razorpay.testMode}
                                            onChange={(e) => handleInputChange('razorpay', 'testMode', e.target.checked)}
                                        />
                                        <span>Test Mode (Use test API keys)</span>
                                    </label>
                                </div>

                                <div className="admin-alert admin-alert-info">
                                    <p className="text-small" style={{ marginBottom: 0 }}>
                                        <strong>Note:</strong> Razorpay charges 2% + GST per transaction. Settlements happen in T+2 days.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cashfree */}
                    <div className="admin-payment-config">
                        <div className="admin-payment-config-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div className="admin-payment-config-logo">
                                    <FiCreditCard size={32} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Cashfree</h3>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Fast and secure payment gateway
                                    </p>
                                </div>
                            </div>
                            <label className="admin-switch">
                                <input
                                    type="checkbox"
                                    checked={config.cashfree.enabled}
                                    onChange={(e) => handleInputChange('cashfree', 'enabled', e.target.checked)}
                                />
                                <span className="admin-switch-slider"></span>
                            </label>
                        </div>

                        {config.cashfree.enabled && (
                            <div className="admin-payment-config-body">
                                <div className="admin-form-grid">
                                    <div className="form-group">
                                        <label className="form-label">App ID</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={config.cashfree.appId}
                                            onChange={(e) => handleInputChange('cashfree', 'appId', e.target.value)}
                                            placeholder="xxxxxxxxxxxxxxxxxxxx"
                                        />
                                        <p className="text-tiny text-muted mt-xs">
                                            Get from <a href="https://merchant.cashfree.com/merchants/login" target="_blank" rel="noopener noreferrer">Cashfree Dashboard</a>
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Secret Key</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={config.cashfree.secretKey}
                                            onChange={(e) => handleInputChange('cashfree', 'secretKey', e.target.value)}
                                            placeholder="••••••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.cashfree.testMode}
                                            onChange={(e) => handleInputChange('cashfree', 'testMode', e.target.checked)}
                                        />
                                        <span>Test Mode (Use sandbox credentials)</span>
                                    </label>
                                </div>

                                <div className="admin-alert admin-alert-info">
                                    <p className="text-small" style={{ marginBottom: 0 }}>
                                        <strong>Note:</strong> Cashfree offers competitive pricing. Check your merchant dashboard for exact rates.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cash on Delivery */}
                    <div className="admin-payment-config">
                        <div className="admin-payment-config-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div className="admin-payment-config-logo">
                                    💰
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Cash on Delivery</h3>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Always enabled as a fallback option
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="card">
                        <div className="card-header">
                            <h4 style={{ marginBottom: 0 }}>Setup Instructions</h4>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <h5 className="mb-xs">1. Create Accounts</h5>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Sign up at <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer">Razorpay</a> and/or <a href="https://cashfree.com" target="_blank" rel="noopener noreferrer">Cashfree</a>
                                    </p>
                                </div>

                                <div>
                                    <h5 className="mb-xs">2. Get API Credentials</h5>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Navigate to your dashboard and copy the API keys (use test keys for testing)
                                    </p>
                                </div>

                                <div>
                                    <h5 className="mb-xs">3. Configure Webhooks (Production)</h5>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Set up webhooks in your payment gateway dashboard to receive payment confirmations
                                    </p>
                                </div>

                                <div>
                                    <h5 className="mb-xs">4. Test Payments</h5>
                                    <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                        Use test mode and test cards provided by the payment gateway to verify integration
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            <FiSave /> {saving ? 'Saving...' : 'Save Payment Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Payments;
