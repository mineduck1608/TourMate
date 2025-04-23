"use client";

import React from 'react';

interface BannerProps {
  imageUrl: string;
  title: string;
}

const Banner: React.FC<BannerProps> = ({ imageUrl, title }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <img 
        src={imageUrl} 
        alt={title} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.6)' // Keeps the text readable
        }} 
      />
      <div className="banner-title">
        {title}
      </div>
      <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');

        .banner-title {
          display: flex;
          justify-content: center; /* Horizontally centers the title */
          align-items: center; /* Vertically centers the title */
          position: absolute; /* Keeps the title inside the banner */
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%); /* Center the title within the banner */
          color: #fff;
          font-size: 3rem; /* Default font size */
          text-align: center;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6); /* Makes the title more readable */
          width: 100%; /* Ensures the title spans the full width */
          font-family: 'EB Garamond', serif; /* Apply EB Garamond font */
          padding: 0 20px; /* Adds some padding to the title */
        }

        @media (max-width: 768px) {
          .banner-title {
            font-size: 1.8rem; /* Smaller font size for tablets */
          }
        }

        @media (max-width: 480px) {
          .banner-title {
            font-size: 1.5rem; /* Even smaller font size for mobile screens */
          }
          div {
            height: 250px; /* Adjust height on mobile for better readability */
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
