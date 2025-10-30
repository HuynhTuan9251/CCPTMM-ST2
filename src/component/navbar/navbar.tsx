import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./navbar.css";
import { FaCoffee, FaUser, FaSignOutAlt, FaShoppingCart, FaCog, FaTachometerAlt } from 'react-icons/fa';
import { Dropdown, Button } from 'react-bootstrap';

interface NavBarProps {
  user: {
    TenNguoiDung?: string;
    VaiTro?: string;
  } | null;
  onLogout: () => void;
}

const languageNames: Record<string, string> = {
  'vi': 'Tiếng Việt',
  'en': 'English',
  'zh-CN': '中文 (简体)',
};

const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Change language
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  // Handle brand click (force navigation to home)
  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Memoize displayUser
  const displayUser = user ?? { TenNguoiDung: "Guest", VaiTro: "Guest" };

  // Navigation items
  const navItems = [
    { path: "/", label: t('home') },
    { path: "/about", label: t('about') },
    { path: "/menu", label: t('menu') },
    { path: "/tintuc", label: t('news') },
    { path: "/store-locator", label: t('stores') },
  ];

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={handleBrandClick}
        >
          <FaCoffee className="navbar-icon coffee-icon me-2" />
          <span className="navbar-title fw-bold">Coffee Haven</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link${location.pathname === item.path ? " active" : ""}`}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Language Switcher */}
            <div className="language-switcher">
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-secondary" id="languageDropdown">
                  {languageNames[i18n.language] || 'Tiếng Việt'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => changeLanguage('vi')}>Tiếng Việt</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage('zh-CN')}>中文 (简体)</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* User Dropdown or Auth Buttons */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-secondary" id="userDropdown" className="d-flex align-items-center">
                  <FaUser className="navbar-icon me-2" />
                  {displayUser.TenNguoiDung} ({displayUser.VaiTro})
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-sm">
                  <Dropdown.Item as={Link} to="/account">
                    <FaCog className="navbar-icon me-2" /> {t('accountSettings')}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/cart">
                    <FaShoppingCart className="navbar-icon me-2" /> {t('cart')}
                  </Dropdown.Item>
                  {user.VaiTro?.toLowerCase() === 'admin' && (
                    <Dropdown.Item as={Link} to="/admin">
                      <FaTachometerAlt className="navbar-icon me-2" /> {t('adminDashboard')}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogout} className="text-danger">
                    <FaSignOutAlt className="navbar-icon me-2" /> {t('logout')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary me-2"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
