import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./news.css";

// Define the interface for a news item
interface NewsItem {
  id: number;
  TieuDe: string;
  HinhAnh?: string;
  date?: string;
}

const TinTuc = () => {
  const { t, i18n } = useTranslation();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        const formattedData: NewsItem[] = data.data.map((item: any) => ({
          id: item.id,
          TieuDe: item.tieu_de,
          HinhAnh: item.hinh_anh,
          date: item.ngay_tao ? new Date(item.ngay_tao).toLocaleDateString('vi-VN') : undefined,
        }));
        setNewsItems(formattedData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (id: number) => {
    if (id) {
      navigate(`/chitiettintuc/${id}`);
    } else {
      console.error("Invalid article ID");
    }
  };

  return (
    <div id="tintuc" className="tintuc-page">
      <div className="container">
        <div className="tch-box__title tch-box__title-news text-center mb-5">
          <span className="text-title">{t('latestNews')}</span>
        </div>
        <div className="row justify-content-center">
          {newsItems.length > 0 ? (
            newsItems.map((article) => (
              <div key={article.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="article-card-tintuc">
                  <div className="tch-product__card">
                    <div className="tch-product__image">
                      <img src={article.HinhAnh} alt={article.TieuDe} />
                    </div>
                    <div className="tch-product__content">
                        <h4 className="tch-product-content__title">{article.TieuDe}</h4>
                      <button
                          onClick={() => handleReadMore(article.id)}
                        className="btn btn-tintuc"
                      >
                        {t('readMore')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">{t('noNews')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TinTuc;