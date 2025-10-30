import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('sendCodeFailed')); // Thêm key
      }

      setSuccess(t('codeSentSuccess')); // Thêm key
      setStep(2);
      setResendCooldown(60);
    } catch (error) {
      setError(error.message || t('sendCodeError')); // Thêm key
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Code: code, MatKhauMoi: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('resetPasswordFailed')); // Thêm key
      }

      setSuccess(t('resetPasswordSuccess')); // Thêm key
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message || t('resetPasswordError')); // Thêm key
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('resendCodeFailed')); // Thêm key
      }

      setSuccess(t('codeResentSuccess')); // Thêm key
      setResendCooldown(60);
    } catch (error) {
      setError(error.message || t('resendCodeError')); // Thêm key
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block image-container">
            <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=550&h=550&q=80" alt="Login Image" className="img-fluid" />
            <div className="image-overlay"></div>
          </div>

          <div className="col-md-5">
            <div className="login-card p-4 shadow-lg">
              <h2 className="text-center mb-4">{step === 1 ? t('forgotPasswordTitle') : t('resetPasswordTitle')}</h2>

              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}

              {step === 1 ? (
                <form onSubmit={handleSendCode}>
                  <div className="mb-3">
                    <input type="email" className="form-control login-input" placeholder={t('enterEmail')} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                  </div>
                  <button type="submit" className="btn login-btn w-100" disabled={loading}>
                    {loading ? t('sending') : t('sendCode')} {/* Thêm key 'sending' */}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <input type="text" className="form-control login-input" placeholder={t('enterCode')} value={code} onChange={(e) => setCode(e.target.value)} required disabled={loading} />
                  </div>
                  <div className="mb-3">
                    <input type="password" className="form-control login-input" placeholder={t('newPasswordPlaceholder')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={loading} />
                  </div>
                  <button type="submit" className="btn login-btn w-100" disabled={loading}>
                    {loading ? t('processing') : t('resetPasswordTitle')}
                  </button>
                  <div className="mt-3 text-center">
                    <button className="btn btn-link text-link" onClick={handleResendCode} disabled={resendCooldown > 0 || loading}>
                      {resendCooldown > 0 ? `${t('resendCodeAfter')} ${resendCooldown}s` : t('resendCode')} {/* Thêm key 'resendCodeAfter' */}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-3 text-center">
                <a href="/login" className="text-link">{t('backToLogin')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;