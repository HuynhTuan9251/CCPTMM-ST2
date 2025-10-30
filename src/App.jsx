import './App.css';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import Navbar from './component/navbar/navbar';
import Footer from './component/footer/footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Menu from './component/menu/menu';
import News from './component/news/news';
import NewSDetails from './component/news/newsDetails';
import Login from './component/login/login';
import ForgotPasswordPage from './component/login/ForgotPasswordPage';
import SignUp from './component/SignUp/SignUp';
import { useState, useEffect, useCallback } from 'react';
import AccountSettings from './component/AccountSettings/AccountSettings';
import Cart from './component/Cart/Cart';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import Slide from './component/slide/slide';
import Stores from './component/store/store';
import Home from './component/Home/home';
import About from './component/About/about';
import './i18n';

// Component để bảo vệ các route cần đăng nhập
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, user, path }) => {
  if (!user) {
    // Lưu message và địa chỉ trở về sau khi đăng nhập
    console.log('ProtectedRoute: User not logged in, saving return URL:', path);
    sessionStorage.setItem('loginMessage', 'Vui lòng đăng nhập để tiếp tục');
    sessionStorage.setItem('returnUrl', path);
    return <Navigate to="/login" replace />;
  }
  console.log('ProtectedRoute: User is logged in, allowing access to:', path);
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Lỗi parse JSON:', error);
        localStorage.removeItem('user'); 
        setUser(null);
      }
    }
  }, []);
  
  

  const handleLoginSuccess = useCallback((userInfo) => {
    console.log('App: handleLoginSuccess called with:', userInfo);
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
  }, []);

  const handleLogout = useCallback(() => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <GoogleOAuthProvider clientId="829080747995-l9tr6smuhkpsctfnht1alo0gcq549fq4.apps.googleusercontent.com">
      <Router>
        <Navbar key={user ? user.Email : 'no-user'} user={user} onLogout={handleLogout} />
        <Slide />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tintuc" element={<News />} />
          <Route path="/store-locator" element={<Stores />} />
          <Route path="/chitiettintuc/:id" element={<NewSDetails />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account" element={
            <ProtectedRoute user={user} path="/account">
              <AccountSettings user={user} />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute user={user} path="/cart">
              <Cart />
            </ProtectedRoute>
          } />
          {user && user.VaiTro === 'Admin' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
        </Routes>

        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;