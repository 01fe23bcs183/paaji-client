import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
    FiHome,
    FiPackage,
    FiShoppingBag,
    FiImage,
    FiTag,
    FiTruck,
    FiCreditCard,
    FiSettings,
    FiLogOut,
    FiXCircle
} from 'react-icons/fi';

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const isActive = (path) => {
        return location.pathname === `/admin${path}` || location.pathname === path;
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2 className="admin-sidebar-logo">JMC Admin</h2>
                </div>

                <nav className="admin-sidebar-nav">
                    <Link
                        to="/admin"
                        className={`admin-sidebar-link ${isActive('') || isActive('/') ? 'active' : ''}`}
                    >
                        <FiHome /> Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`admin-sidebar-link ${isActive('/products') ? 'active' : ''}`}
                    >
                        <FiPackage /> Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={`admin-sidebar-link ${isActive('/orders') ? 'active' : ''}`}
                    >
                        <FiShoppingBag /> Orders
                    </Link>
                    <Link
                        to="/admin/cancelled"
                        className={`admin-sidebar-link ${isActive('/cancelled') ? 'active' : ''}`}
                    >
                        <FiXCircle /> Cancelled Orders
                    </Link>
                    <Link
                        to="/admin/media"
                        className={`admin-sidebar-link ${isActive('/media') ? 'active' : ''}`}
                    >
                        <FiImage /> Media Library
                    </Link>
                    <Link
                        to="/admin/coupons"
                        className={`admin-sidebar-link ${isActive('/coupons') ? 'active' : ''}`}
                    >
                        <FiTag /> Coupons
                    </Link>
                    <Link
                        to="/admin/shipping"
                        className={`admin-sidebar-link ${isActive('/shipping') ? 'active' : ''}`}
                    >
                        <FiTruck /> Shipping
                    </Link>
                    <Link
                        to="/admin/payments"
                        className={`admin-sidebar-link ${isActive('/payments') ? 'active' : ''}`}
                    >
                        <FiCreditCard /> Payments
                    </Link>
                    <Link
                        to="/admin/settings"
                        className={`admin-sidebar-link ${isActive('/settings') ? 'active' : ''}`}
                    >
                        <FiSettings /> Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="admin-sidebar-link"
                        style={{ marginTop: 'auto', width: '100%', textAlign: 'left' }}
                    >
                        <FiLogOut /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
