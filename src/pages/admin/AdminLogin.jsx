import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FiLock, FiMail } from 'react-icons/fi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '1rem' }}>
                <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            margin: '0 auto var(--spacing-md)',
                            background: 'var(--color-primary)',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                        }}>
                            <FiLock />
                        </div>
                        <h2>Admin Login</h2>
                        <p className="text-muted">Enter your credentials to access admin panel</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@jmcskincare.com"
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                            {error && <p className="form-error">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-tiny text-muted" style={{ marginBottom: '4px' }}>
                            <strong>Default Admin:</strong>
                        </p>
                        <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>
                            Email: admin@jmcskincare.com<br />
                            Password: admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
