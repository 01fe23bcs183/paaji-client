import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...userData } = formData;
        const result = await register(userData);

        if (result.success) {
            navigate('/my-account');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="container py-xl">
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <h1 className="heading-lg mb-xs">Create Account</h1>
                        <p className="text-base text-muted">Join JMC Skincare family</p>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiUser /> Full Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiMail /> Email Address
                            </label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiPhone /> Phone Number
                            </label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiLock /> Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                            <p className="text-tiny text-muted mt-xs">Minimum 6 characters</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiLock /> Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <p className="text-base text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="link">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                        <Link to="/" className="link text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
