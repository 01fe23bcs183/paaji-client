import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FiLock } from 'react-icons/fi';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message || 'Invalid password');
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
                        <p className="text-muted">Enter password to access admin panel</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                            />
                            {error && <p className="form-error">{error}</p>}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>

                    <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>
                            <strong>Default Password:</strong> admin123
                        </p>
                        <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>
                            Change this after first login in Settings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
