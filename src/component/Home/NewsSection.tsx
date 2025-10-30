import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './NewsSection.css';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  const { t } = useTranslation();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  type NewsItem = {
    id: number;
    title: string;
    image: string;
    link: string;
    date: string;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          id: item.id,
          title: item.tieu_de,
          image: item.hinh_anh,
          link: `/chitiettintuc/${item.id}`,
          date: new Date(item.ngay_tao).toLocaleDateString('vi-VN'), // Định dạng ngày theo kiểu Việt Nam
        }));
        setNewsItems(formattedData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="news-section">
      <h2 className="news-section-title text-center mb-4">{t('latestNews')}</h2>
      {newsItems.length > 0 ? (
        <Slider {...settings}>
          {newsItems.map((item: NewsItem) => (
            <div key={item.id} className="wppsac-carousel-slides">
              <div className="wppsac-post-image-bg">
                <Link to={item.link}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="wppsac-post-image"
                    
                  />
                </Link>
              </div>
              <div className="wppsac-post-content-position">
                <h2 className="wppsac-post-title">
                  <Link to={item.link}>{item.title}</Link>
                </h2>
                <div className="wppsac-post-date">
                  <span>{t('byKatinat')}</span> / {item.date}
                </div>
                <div className="wppsac-post-content">
                  <Link to={item.link} className="wppsac-readmorebtn">
                    {t('readMore')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center">{t('noNews')}</p>
      )}
    </div>
  );
};

export default NewsSection;