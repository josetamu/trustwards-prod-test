import React from 'react';
import Link from 'next/link';
import './Banner.css';

const Banner = ({ className = '' }) => {
  return (
    <div className={`tw-banner ${className}`}>
      <div className='tw-banner__background'>
        <svg width="108" height="29" viewBox="0 0 108 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_1242_131)">
          <path d="M20.8009 24.1405C28.3985 -14.4666 67.8642 -19.7616 86.6473 -17.5833C90.0241 -13.059 89.1802 1.11709 58.7896 21.6271C28.399 42.1371 64.6986 58.6591 86.6473 64.3563C61.5328 67.0373 13.2032 62.7476 20.8009 24.1405Z" fill="url(#paint0_linear_1242_131)"/>
          </g>
          <defs>
          <filter id="filter0_f_1242_131" x="0" y="-38" width="108" height="123" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1242_131"/>
          </filter>
          <linearGradient id="paint0_linear_1242_131" x1="88.3789" y1="-28.5566" x2="66.0594" y2="67.7936" gradientUnits="userSpaceOnUse">
          <stop offset="0.181" stopColor="#0099FE" stopOpacity="0.25"/>
          <stop offset="0.692308" stopColor="#DB8C91"/>
          </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="tw-banner__inner">
        <span className="tw-banner__text">Lifetime deal available for a limited time</span>
        <Link href="#" className="tw-banner__pricing-btn">Pricing</Link>
      </div>
    </div>
  );
};

export default Banner;
