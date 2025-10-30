import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup.css';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TenNguoiDung: '',
    Email: '',
    MatKhau: '',
    XacNhanMatKhau: '',
    SoDienThoai: '',
    VaiTro: 'KhachHang',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'SoDienThoai') {
      // Chỉ cho phép số
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [id]: numericValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, VaiTro: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Kiểm tra trường email bị để trốn g
    if (!formData.Email.trim()) {
      setError("Vui lòng nhập email");
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }

    // Kiểm tra số điện thoại: phải có đúng 10 chữ số
    if (!/^[0-9]{10}$/.test(formData.SoDienThoai)) {
      setError( "Số điện thoại phải có đúng 10 chữ số");
      setLoading(false);
      return;
    }

    if (formData.MatKhau !== formData.XacNhanMatKhau) {
      setError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    const apiEndpoint = 'http://localhost:3000/api/auth/register';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TenNguoiDung: formData.TenNguoiDung,
          Email: formData.Email,
          MatKhau: formData.MatKhau,
          SoDienThoai: formData.SoDienThoai,
          VaiTro: formData.VaiTro,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || t('signupFailed')); // Key: "Đăng ký thất bại"
      }

      const result = await response.json();
      setSuccess(t('signupSuccess')); // Key: "Đăng ký thành công"
      setFormData({
        TenNguoiDung: '',
        Email: '',
        MatKhau: '',
        XacNhanMatKhau: '',
        SoDienThoai: '',
        VaiTro: 'KhachHang',
      });
      setTimeout(() => navigate('/login'), 500); // Chuyển hướng về trang đăng nhập sau 2 giây
    } catch (error) {
      setError(error.message || t('signupError')); // Key: "Lỗi đăng ký"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block image-container">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=550&h=550&q=80"
              alt="Signup Image"
              className="img-fluid"
            />
          </div>
          <div className="col-md-5">
            <div className="signup-card p-4 shadow-lg">
              <h2 className="text-center mb-4">{t('signupTitle')}</h2>

              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}
              {loading && <div className="alert alert-info text-center">{t('processing')}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    id="TenNguoiDung"
                    className="form-control signup-input"
                    placeholder={t('enterFullName')}
                    value={formData.TenNguoiDung}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    id="Email"
                    className="form-control signup-input"
                    placeholder={t('enterEmail')}
                    value={formData.Email}
                    onChange={handleChange}
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+" 
                    title="Vui lòng nhập email hợp lệ (ví dụ: example@domain.com)"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="MatKhau"
                    className="form-control signup-input"
                    placeholder={t('password')}
                    value={formData.MatKhau}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="XacNhanMatKhau"
                    className="form-control signup-input"
                    placeholder={t('enterConfirmPassword')}
                    value={formData.XacNhanMatKhau}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    id="SoDienThoai"
                    className="form-control signup-input"
                    placeholder={t('enterPhoneNumber')}
                    value={formData.SoDienThoai}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Số điện thoại phải có đúng 10 chữ số"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="VaiTro" className="form-label">{t('role')}:</label>
                  <select
                    id="VaiTro"
                    className="form-select signup-input"
                    value={formData.VaiTro}
                    onChange={handleRoleChange}
                    disabled={loading}
                  >
                    <option value="KhachHang">{t('customer')}</option>
                    <option value="Admin">{t('admin')}</option>
                  </select>
                </div>
                <button type="submit" className="btn signup-btn w-100" disabled={loading}>
                  {loading ? t('signingUp') : t('signupTitle')}
                </button>
              </form>
              <div className="mt-3 text-center">
                <span>{t('haveAccount')}</span>{' '}
                <a href="/login" className="text-link">{t('loginLink')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;