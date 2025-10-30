import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Slide = () => {
  return (
    <div>
      <div id="demo" className="carousel slide" data-bs-ride="carousel">
        {/* Indicators/dots */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
        </div>
        
        {/* The slideshow/carousel */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://file.hstatic.net/1000075078/file/web_moi_-_desktop_f530d78ec22344d8a73658ee6b3bfc03.jpg" alt="Los Angeles" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="https://file.hstatic.net/1000075078/file/web_moi_-_desktop_d2b3024e2914401a98601a1c43064e6d.jpg" alt="Chicago" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="https://file.hstatic.net/1000075078/file/desktop_52f1aebaf1f943b2babdc0b6ae0d30cf.jpg" alt="New York" className="d-block w-100" />
          </div>
        </div>
        
        {/* Left and right controls/icons */}
        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
      
      
    </div>
  );
};

export default Slide;
