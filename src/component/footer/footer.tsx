import React from 'react';
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./footer.css";


type User = {
  MaNguoiDung: string;
  TenNguoiDung: string;
  SoDienThoai: string;
  Email: string;
};
type FooterProps = {
  user: User | null;
}

const Footer = ({ user }: FooterProps) => {
  const { t } = useTranslation();


  return (
    <footer className="mt-auto">
      <div id="footer-collapse" className="collapse show">
        <div className="tch-footer__top-content">
          <div className="container-lg container-fluid">
            <div className="row">
              <div className="col-4 col-sm-3 col-lg-2">
                <div className="tch-footer__top__logo">
                  <img src="/src/assets/logo-footer.72c86fc.png" alt="Footer Logo" />
                </div>
              </div>
              <div className="col-8 col-sm-9 col-lg-10">
                <ul className="tch-footer__top__navbar-list mb-0 row">
                  <li className="col-12 col-md-6 col-lg-3">
                    <div className="tch-footer__navbar-item">
                      <div data-toggle="collapse" aria-expanded="true" aria-controls="tch-footer__navbar-1" className="tch-footer__navbar-item-header" onClick={() => {
                        window.location.href = "/";
                      }}>
                        <span className="text">{t('websiteInfo')}</span>
                      </div>
                      <ul id="tch-footer__navbar-1" className="tch-footer__navbar-item-body collapse show">
                        <li><a href="/">{t('home')}</a></li>
                        <li><a href="/product-listing">{t('order')}</a></li>
                        <li><a href="/blogs">{t('news')}</a></li>
                        <li><a href="https://tuyendung.thecoffeehouse.com/">{t('recruitment')}</a></li>
                        <li><a href="/">{t('promotions')}</a></li>
                      </ul>
                    </div>
                  </li>
                  <li className="col-12 col-md-6 col-lg-3">
                    <div className="tch-footer__navbar-item">
                      <div data-toggle="collapse" aria-expanded="true" aria-controls="tch-footer__navbar-3" className="tch-footer__navbar-item-header" onClick={() => {
                        window.location.href = "/terms";
                      }}>
                        <span className="text">{t('terms')}</span>
                      </div>
                      <ul id="tch-footer__navbar-3" className="tch-footer__navbar-item-body collapse show">
                        <li><a href="/terms">{t('websitePolicy')}</a></li>
                        <li><a href="/policy">{t('privacyPolicy')}</a></li>
                        <li><a href="https://thecoffeehouse.com/pages/huong-dan-xuat-hoa-don-gtgt">{t('invoiceGuide')}</a></li>
                      </ul>
                    </div>
                  </li>
                  <li className="col-12 col-md-6 col-lg-3">
                    <div className="tch-footer__navbar-item">
                      <div data-toggle="collapse" aria-expanded="true" aria-controls="tch-footer__navbar-34" className="tch-footer__navbar-item-header" onClick={() => {
                        window.location.href = "/hotline";
                      }}>
                        <span className="text">{t('hotline')}</span>
                      </div>
                      <ul id="tch-footer__navbar-34" className="tch-footer__navbar-item-body collapse show">
                        <li><a href="">{t('orderHotline')}</a></li>
                        <li><a href="">{t('supportHotline')}</a></li>
                      </ul>
                    </div>
                  </li>
                  <li className="col-12 col-md-6 col-lg-3">
                    <div className="tch-footer__navbar-item">
                      <div data-toggle="collapse" aria-expanded="true" aria-controls="tch-footer__navbar-4" className="tch-footer__navbar-item-header" onClick={() => {
                        window.location.href = "/contact";
                      }}>
                        <span className="text">{t('contact')}</span>
                      </div>
                      <ul id="tch-footer__navbar-4" className="tch-footer__navbar-item-body collapse show">
                        <li><a href="javascript:void(0)">{t('footerAddress')}</a></li>
                        <li><a href="javascript:void(0)">+842871 078 079</a></li>
                        <li><a href="javascript:void(0)">hi@thecoffeehouse.vn</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tch-footer__bottom-content">
          <div className="container-lg container-fluid">
            <div className="row align-items-center footer-info">
              <div className="col-12 col-lg-8">
                <p className="tch-footer__bottom__text mb-0"></p>
                <p className="tch-footer__bottom__text">{t('company')}</p>
                <p className="tch-footer__bottom__text">{t('taxCode')} {t('issuedBy')}</p>
                <p className="tch-footer__bottom__text">{t('representative')}</p>
                <p className="tch-footer__bottom__text">{t('footerAddress')} Điện thoại: (028) 7107 8079 Email: hi@thecoffeehouse.vn</p>
                <p className="tch-footer__bottom__text"></p>
                <p className="tch-footer__bottom__text">{t('copyright')}</p>
              </div>
              <div className="col-12 col-lg-4">
                <div className="tch-footer__bottom-logo ml-auto">
                  <a href="http://online.gov.vn/Home/WebDetails/48042" target="_blank" rel="noopener noreferrer">
                    <img src="/src/assets/active.4cba64f.png" alt="Active Logo" className="ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;