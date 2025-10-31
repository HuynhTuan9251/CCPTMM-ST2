import React from 'react';

import CategorySection from './CategorySection';

import './menu.css';

const ThucDon = () => {
    return (
        <div id="menu" className="menu-page d-flex flex-column align-items-center">
            <div className="container">
            
                <CategorySection />
               
            </div>
        </div>
    );
};

export default ThucDon;