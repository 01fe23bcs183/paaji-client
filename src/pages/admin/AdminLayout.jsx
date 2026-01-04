import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings,
    FiBarChart2, FiTag, FiTruck, FiFileText, FiLogOut,
    FiMenu, FiX, FiPercent, FiGrid, FiHelpCircle, FiImage
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            section: 'Overview',
            items: [
                { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
                { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
            ],
        },
        {
            section: 'Store Management',
            items: [
                { path: '/admin/products', icon: FiPackage, label: 'Products' },
                { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders', badge: 3 },
                { path: '/admin/customers', icon: FiUsers, label: 'Customers' },
                { path: '/admin/categories', icon: FiGrid, label: 'Categories' },
            ],
        },
        {
            section: 'Marketing',
            items: [
                { path: '/admin/campaigns', icon: FiPercent, label: 'Campaigns', isNew: true },
                { path: '/admin/coupons', icon: FiTag, label: 'Coupons' },
                { path: '/admin/banners', icon: FiImage, label: 'Banners' },
            ],
        },
        {
            section: 'Fulfillment',
            items: [
                { path: '/admin/shipping', icon: FiTruck, label: 'Shipping', isNew: true },
                { path: '/admin/reports', icon: FiFileText, label: 'Reports' },
            ],
        },
        {
            section: 'Settings',
            items: [
                { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
                { path: '/admin/help', icon: FiHelpCircle, label: 'Help & Support' },
            ],
        },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 99,
                        display: 'none',
                    }}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <Link to="/admin" className="admin-sidebar-logo">
                        <div className="admin-sidebar-logo-icon">✨</div>
                        <span>JMC Admin</span>
                    </Link>
                </div>

                <nav className="admin-nav">
                    {navItems.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="admin-nav-section">
                            <div className="admin-nav-section-title">{section.section}</div>
                            {section.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    to={item.path}
                                    className={`admin-nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className="admin-nav-badge">{item.badge}</span>
                                    )}
                                    {item.isNew && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '0.625rem',
                                            fontWeight: '700',
                                            padding: '0.125rem 0.375rem',
                                            background: 'linear-gradient(135deg, #C4A77D, #A68A5A)',
                                            color: 'white',
                                            borderRadius: '50px',
                                            textTransform: 'uppercase',
                                        }}>
                                            New
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <button
                        onClick={handleLogout}
                        className="admin-nav-link"
                        style={{
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Mobile Header */}
                <div style={{
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }} className="admin-mobile-header">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            padding: '0.5rem',
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                    <span style={{ fontWeight: '600' }}>JMC Admin</span>
                    <div style={{ width: '36px' }} />
                </div>

                {/* Page Content */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
