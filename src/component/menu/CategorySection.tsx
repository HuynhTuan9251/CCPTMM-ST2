import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './menu.css';
import './ProductList.css';

const CategorySection = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [menuItems, setMenuItems] = useState([]);
  const [products, setProducts] = useState({});
  const [maKhachHang] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.MaNguoiDung;
  });

  type Product = {
    MaSanPham: number;
    TenSanPham: string;
    Gia: number;
    HinhAnh: string;
  };
  type Category = {
    MaLoaiSanPham: number;
    TenLoaiSanPham: string;
    MoTa: string;
  };

  // Lấy danh sách loại sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories', {
          params: { lang: i18n.language }, // Gửi ngôn ngữ hiện tại
        });
        setMenuItems(response.data.data);
        if (response.data.data.length > 0) setSelectedCategory(response.data.data[0]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [i18n.language]);


  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory?.MaLoaiSanPham) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/products/category/${selectedCategory.MaLoaiSanPham}`,
            {
              params: { lang: i18n.language }, // Gửi ngôn ngữ hiện tại
            }
          );
          setProducts((prev) => ({ ...prev, [selectedCategory.TenLoaiSanPham]: response.data.data }));
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };
    fetchProducts();
  }, [selectedCategory, i18n.language]);

  const addToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      if (!user.MaNguoiDung) {
        alert(t('pleaseLoginFirst'));
        return;
      }
      
      if (!token) {
        alert(t('pleaseLoginFirst'));
        return;
      }
      
      await axios.post(
        'http://localhost:3000/api/cart',
        {
          MaKhachHang: user.MaNguoiDung,
          MaSanPham: product.MaSanPham,
          SoLuong: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`${t('addedToCart')} ${product.TenSanPham}!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert(t('pleaseLoginFirst'));
      } else {
        alert(t('addToCartError'));
      }
    }
  };


  return (
    <div className="cs-category-section">
      <div className="cs-menu-header text-center mb-4 mt-5">
        <span className="cs-icon">
          <i aria-hidden="true" className="fa fa-trophy fa-2x"></i>
        </span>
        <h1 className="cs-menu-title">{t('productsFromNhi')}</h1>
      </div>

      <ul className="cs-tch-category-card-list d-flex justify-content-md-center flex-wrap border-0">
        {menuItems.map((item: Category) => (
          <li key={item.MaLoaiSanPham} className="cs-custom-nav-item nav-item">
            <button
              onClick={() => setSelectedCategory(item)}
              className={`cs-nav-link cs-nav-link-category m-0 border-0 ${selectedCategory?.MaLoaiSanPham === item.MaLoaiSanPham ? 'active' : ''}`}
              role="tab"
              aria-controls={item.TenLoaiSanPham}
              aria-selected={selectedCategory?.MaLoaiSanPham === item.MaLoaiSanPham}
            >
              <div className="cs-tch-category-card cs-custom-category-card d-flex flex-column">
                <div className="cs-tch-category-card__image cs-tch-category-card--circle">
                  <img src={item.MoTa || 'default-image.jpg'} alt={item.TenLoaiSanPham} />
                </div>
                <div className="cs-tch-category-card__content">
                  <h5 className="text-center mb-0">{item.TenLoaiSanPham}</h5>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div className="cs-tab-content mt-4">
          <h2 className="text-center mb-4">{selectedCategory.TenLoaiSanPham}</h2>
          <div className="row mb-4 mb-lg-5 justify-content-center">
            {products[selectedCategory.TenLoaiSanPham]?.length > 0 ? (
              products[selectedCategory.TenLoaiSanPham].map((product) => (
                <div key={product.MaSanPham} className="col-12 col-md-4 col-lg-3 col-xl-2 mt-2 mt-lg-3">
                  <div className="cs-tch-product__card cs-custom-product-card shadow-sm">
                    <div className="cs-tch-product__image cs-custom-product-image">
                      <img src={product.HinhAnh || 'default-image.jpg'} alt={product.TenSanPham} />
                    </div>
                    <div className="cs-tch-product__content d-flex flex-column">
                      <h4 className="cs-custom-title">{product.TenSanPham}</h4>
                      <p className="cs-custom-price">{product.Gia.toLocaleString()}đ</p>
                      <button className="cs-btn-success mt-2 shadow-sm" onClick={() => addToCart(product)}>
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">{t('noProducts')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;