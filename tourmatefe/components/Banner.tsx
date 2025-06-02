"use client";

import React from 'react';
import SafeImage from './safe-image';

interface BannerProps {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  height?: string
}

const Banner: React.FC<BannerProps> = ({ imageUrl, title, subtitle, height }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: height ?? '400px' }}>
      <SafeImage
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
      {subtitle && (
        <div className="banner-subtitle">
          {subtitle}
        </div>
      )}
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

        .banner-subtitle {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 1.5rem;
          text-align: center;
          width: 100%;
          font-family: 'EB Garamond', serif;
          padding: 0 20px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 768px) {
          .banner-title {
            font-size: 1.8rem; /* Smaller font size for tablets */
          }

          .banner-subtitle {
            font-size: 1.2rem; /* Smaller font size for subtitles on tablets */
          }
        }

        @media (max-width: 480px) {
          .banner-title {
            font-size: 1.5rem; /* Even smaller font size for mobile screens */
          }

          .banner-subtitle {
            font-size: 1rem; /* Even smaller font size for subtitles on mobile */
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
