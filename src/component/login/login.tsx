import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const LoginPage = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra message và return URL từ sessionStorage khi component mount
  useEffect(() => {
    const message = sessionStorage.getItem('loginMessage');
    if (message) {
      setLoginMessage(message);
      sessionStorage.removeItem('loginMessage'); // Xóa message sau khi đã lấy
    }
  }, []);

  // Hàm helper để lấy return URL và điều hướng
  const getReturnUrlAndNavigate = () => {
    const returnUrl = sessionStorage.getItem('returnUrl');
    console.log('Return URL from sessionStorage:', returnUrl);
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      return returnUrl;
    }
    console.log('No return URL, going to home');
    return '/'; // Mặc định về trang chủ
  };

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const provider = params.get('provider');

      if (token && provider === 'github') {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = response.data.data;
          if (!user) throw new Error(t('noUserInfo'));

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          if (onLoginSuccess) onLoginSuccess(user);
          setSuccess(t('loginSuccess'));
          
          // Delay để App.jsx có thời gian cập nhật state
          setTimeout(() => {
            const returnUrl = sessionStorage.getItem('returnUrl') || '/';
            console.log('Navigating to:', returnUrl);
            if (returnUrl !== '/') {
              sessionStorage.removeItem('returnUrl');
            }
            navigate(returnUrl, { replace: true });
          }, 1500);
        } catch (err) {
          console.error('GitHub login error:', err.response?.data || err.message);
          setError(t('githubLoginError'));
        } finally {
          setLoading(false);
        }
      }
    };

    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.data;
        if (!user) throw new Error(t('noUserInfo'));
        localStorage.setItem('user', JSON.stringify(user));
        if (onLoginSuccess) onLoginSuccess(user);
        setSuccess(t('loginSuccess'));
        setTimeout(() => navigate(getReturnUrlAndNavigate()), 1500);
      } catch (err) {
        console.error('Error checking login status:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    handleGitHubCallback();
    if (!location.search.includes('token')) checkLoginStatus();
  }, [navigate, onLoginSuccess, t, location.search]);

  // 🧠 Hàm xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Kiểm tra dữ liệu đầu vào ---
    if (!email.trim() && !matKhau.trim()) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!matKhau.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }
    if (matKhau.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, MatKhau: matKhau }),
        credentials: 'include',
      });

      const result = await response.json();

      // --- Kiểm tra phản hồi từ backend ---
      if (!response.ok) {
        if (result.message?.includes('Sai mật khẩu')) {
          setError('Sai mật khẩu');
        } else if (result.message?.includes('khóa')) {
          setError('Tài khoản đã bị khóa');
        } else if (result.message?.includes('Email không tồn tại')) {
          setError('Email không tồn tại');
        } else {
          setError(result.message || 'Đăng nhập thất bại');
        }
        return;
      }

      // --- Đăng nhập thành công ---
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('token', result.data.token);
      if (onLoginSuccess) onLoginSuccess(result.data);
      setSuccess('Đăng nhập thành công!');
      
      // Delay một chút để App.jsx có thời gian cập nhật state
      setTimeout(() => {
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        console.log('Navigating to:', returnUrl);
        if (returnUrl !== '/') {
          sessionStorage.removeItem('returnUrl');
        }
        navigate(returnUrl, { replace: true });
      }, 1500);
    } catch (error) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // --- Google login ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const user = {
          Email: userInfo.data.email,
          TenNguoiDung: userInfo.data.name || 'Unknown',
          Provider: 'Google',
          ProviderID: userInfo.data.sub,
        };

        const res = await axios.post('http://localhost:3000/api/auth/google-login', user, {
          withCredentials: true,
        });
        const { data: userFromBackend } = res.data;

        localStorage.setItem('user', JSON.stringify(userFromBackend));
        localStorage.setItem('token', userFromBackend.token);
        if (onLoginSuccess) onLoginSuccess(userFromBackend);
        setSuccess('Đăng nhập thành công!');
        
        // Delay để App.jsx có thời gian cập nhật state
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('returnUrl') || '/';
          console.log('Navigating to:', returnUrl);
          if (returnUrl !== '/') {
            sessionStorage.removeItem('returnUrl');
          }
          navigate(returnUrl, { replace: true });
        }, 2000);
      } catch (err) {
        setError('Lỗi đăng nhập Google: ' + (err.response?.data?.error || err.message));
      }
    },
    onError: () => setError('Đăng nhập Google thất bại'),
  });

  const githubLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github';
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      googleLogout();
      setSuccess('Đăng xuất thành công');
      navigate('/login', { state: { justLoggedOut: true } });
    } catch (err) {
      setError('Lỗi khi đăng xuất');
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block image-container">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=550&h=550&q=80"
              alt="Login"
              className="img-fluid"
            />
          </div>
          <div className="col-md-5">
            <div className="login-card p-4 shadow-lg">
              <h2 className="text-center mb-4">{t('loginTitle')}</h2>

              {loginMessage && <div className="alert alert-warning text-center">{loginMessage}</div>}
              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}
              {loading && <div className="alert alert-info text-center">Đang xử lý...</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder="Nhập mật khẩu"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn login-btn w-100" disabled={loading}>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="d-flex justify-content-between mt-3">
                <Link to="/forgot-password" className="text-link">Quên mật khẩu?</Link>
                <Link to="/signup" className="text-link">Đăng ký</Link>
              </div>

              <div className="mt-4 text-center text-muted">Hoặc đăng nhập bằng</div>
              <div className="d-flex justify-content-center mt-3 gap-3">
                <button onClick={() => googleLogin()} disabled={loading} className="btn social-btn google-btn">
                  <i className="fab fa-google"></i> Google
                </button>
                <button onClick={githubLogin} disabled={loading} className="btn social-btn github-btn">
                  <i className="fab fa-github"></i> GitHub
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
