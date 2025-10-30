import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './thucdon.css';

const PromotionSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const quangCao = [
        {
            title: t('coffee'), // Sử dụng key từ i18n
            image: 'https://katinat.vn/wp-content/uploads/2023/12/357194611_256587093736825_386966657846776321_n-1.jpg',
            alt: 'Cà Phê Phin Mê',
            link: '/menu',
        },
        {
            title: t('milkTea'), // Sử dụng key từ i18n
            image: 'https://katinat.vn/wp-content/uploads/2024/03/image.png',
            alt: 'Trà Sữa',
            link: '/menu',
        },
        {
            title: t('fruitTea'), // Sử dụng key từ i18n
            image: 'https://katinat.vn/wp-content/uploads/2024/04/2.png',
            alt: 'Trà Trái Cây',
            link: '/menu',
        },
    ];

    return (
        <div className="promotion-section">
            <h2 className="news-section-title text-center mb-4">{t('menuTitle')}</h2>

            <div className="row g-4 justify-content-center">
                {quangCao.map((item, index) => (
                    <div
                        className="col-md-4 col-sm-6 col-12"
                        key={index}
                        onClick={() => navigate(item.link)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="menu-card shadow-sm">
                            <div className="menu-image-wrapper">
                                <img src={item.image} alt={item.alt} className="menu-image" />
                            </div>
                            <h2 className="menu-item-title text-center">{item.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionSection;