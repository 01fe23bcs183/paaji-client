import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

// Customer Pages
import Home from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderTracking from './pages/OrderTracking';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import UserProfile from './pages/UserProfile';
import SkinQuiz from './pages/SkinQuiz';
import Bundles from './pages/Bundles';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import MediaLibrary from './pages/admin/MediaLibrary';
import Coupons from './pages/admin/Coupons';
import Shipping from './pages/admin/Shipping';
import Payments from './pages/admin/Payments';
import Settings from './pages/admin/Settings';
import CancelledOrders from './pages/admin/CancelledOrders';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import Campaigns from './pages/admin/Campaigns';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExitIntentPopup from './components/ExitIntentPopup';
import InstallPrompt from './components/InstallPrompt';
import CartRecoveryBanner from './components/CartRecoveryBanner';
import CampaignBanner from './components/CampaignBanner';


import './index.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/admin.css';

// Register service worker for PWA (temporarily disabled)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('[PWA] Service Worker registered:', registration.scope);
//       })
//       .catch((error) => {
//         console.log('[PWA] Service Worker registration failed:', error);
//       });
//   });
// }

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <AdminProvider>
              <Router>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="cancelled" element={<CancelledOrders />} />
                    <Route path="media" element={<MediaLibrary />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="shipping" element={<Shipping />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="campaigns" element={<Campaigns />} />
                  </Route>

                  {/* Customer Routes */}
                  <Route path="/*" element={
                    <>
                      <CampaignBanner />
                      <Navbar />
                      <Routes>
                                                                                                <Route path="/" element={<Home />} />
                                                                        <Route path="/products" element={<ProductsPage />} />
                                                                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/track-order" element={<OrderTracking />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                                                <Route path="/my-account" element={<MyAccount />} />
                                                <Route path="/profile" element={<UserProfile />} />
                                                <Route path="/skin-quiz" element={<SkinQuiz />} />
                        <Route path="/bundles" element={<Bundles />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                      </Routes>
                      <Footer />
                      <ExitIntentPopup />
                      <InstallPrompt />
                      <CartRecoveryBanner />
                    </>
                  } />
                </Routes>
              </Router>
            </AdminProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
