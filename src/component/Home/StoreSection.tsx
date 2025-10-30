import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './StoreSection.css';

const StoreSection = () => {
  const { t } = useTranslation();
  const [storeImages, setStoreImages] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stores');
        const data = await response.json();
        const images = data.data.map((item) => item.ImageURL || 'https://via.placeholder.com/800x450');
        setStoreImages(images.slice(0, 4)); // Chỉ lấy 4 ảnh đầu tiên
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStores();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  return (
    <div className="store-container">
      {/* Phần hình ảnh */}
      <div className="store-image-section">
        {storeImages.length > 0 ? (
          <Slider {...settings}>
            {storeImages.map((image, index) => (
              <div key={index} className="store-slide">
                <img src={image} alt={`${t('storesTitle')} ${index + 1}`} className="store-image" />
              </div>
            ))}
          </Slider>
        ) : (
          <p>{t('noStoreImages')}</p>
        )}
      </div>

      {/* Phần chữ */}
      <div className="store-text-section">
        <h1 className="store-title">{t('storesTitle')}</h1>
        <p className="store-description">{t('storeDescription')}</p>
        <a href="/store-locator" className="store-button">{t('viewStores')}</a>
      </div>
    </div>
  );
};

export default StoreSection;