import React from 'react';
import PromotionSection from './PromotionSection';
import AboutSection from './AboutSection';
import './thucdon.css';
import StoreSection from './StoreSection';
import NewsSection from './NewsSection';

const Home = () => {
  return (
    <div className="home-page d-flex flex-column align-items-center">
      <div className="container">
        <AboutSection />
        <PromotionSection />
        <StoreSection />
        <NewsSection />
      </div>
    </div>
  );
};

export default Home;