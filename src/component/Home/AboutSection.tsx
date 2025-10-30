import React from 'react';
import { useTranslation } from 'react-i18next';
import './thucdon.css';

const AboutSection = () => {
    const { t } = useTranslation();

    return (
        <div className="about-section mt-5 ">
            <h2 className="news-section-title text-center mb-4">{t('aboutUs')}</h2>
            <div className="row g-4" style={{ margin: "10px" }}>
                <div className="col-md-6">
                    <h1 className="about-title">
                        <span>{t('aboutCoffeeHaven')}</span>
                    </h1>
                    <h2 className="about-subtitle">
                        <span>{t('journeySubtitle')}</span>
                    </h2>
                    <p className="about-text">
                        {t('aboutText')}
                    </p>
                    <a
                        href="/about"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn about-btn"
                    >
                        {t('seeMore')}
                    </a>
                </div>
                <div className="col-md-6 text-right">
                    <div className="about-image-wrapper">
                        <img
                            src="https://katinat.vn/wp-content/uploads/2024/04/about-us-1024x1024.jpeg"
                            alt={t('aboutCoffeeHaven')}
                            className="about-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;