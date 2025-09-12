'use client'

import './root.css'
import './web.css'
import '@components/tooltip/Tooltip.css'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState, useRef } from 'react'
import Header from './websiteComponents/Header/Header'
import Footer from './websiteComponents/Footer/Footer'
import Marquee from './websiteMiniComponents/Marquee/Marquee'
import UnderlineHover from './websiteMiniComponents/UnderlineHover/UnderlineHover'
import './websiteMiniComponents/Marquee/Marquee.css'
import './websiteMiniComponents/UnderlineHover/UnderlineHover.css'

function Web() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUsefulDropdownOpen, setIsUsefulDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const usefulDropdownRef = useRef(null);
  const usefulDropdownButtonRef = useRef(null);

  // Keyboard navigation handlers - following project patterns
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsUsefulDropdownOpen(false);
    }
  };


  useEffect(() => {
    const adjustMargin = () => {
      const wrapper = document.querySelector('.tw-wrapper');
      const newsletter = document.querySelector('.tw-newsletter');
      
      if (wrapper && newsletter) {
        // Get the actual height of the newsletter
        const newsletterHeight = newsletter.offsetHeight;
        
        // Calculate viewport dimensions
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // The margin should ALWAYS be at least the full newsletter height
        // to ensure the newsletter is never cut off
        let finalMargin = newsletterHeight;
        
        // Only reduce margin for extremely large viewports, but never below newsletter height
        if (viewportHeight > newsletterHeight * 4) {
          // For extremely large viewports, use a slightly smaller margin
          // but NEVER less than the full newsletter height
          finalMargin = Math.max(newsletterHeight, viewportHeight * 0.2);
        }
        
        // Apply the calculated margin
        wrapper.style.marginBottom = `${finalMargin}px`;
      }
    };

    const adjustNewsletterContent = () => {
      const newsletter = document.querySelector('.tw-newsletter');
      const span = document.querySelector('.tw-newsletter__span');
      const logo = document.querySelector('.tw-newsletter__logo');
      const viewportWidth = window.innerWidth;
      
      if (newsletter) {
        // Calculate a scale factor based on viewport width
        // This creates smooth scaling from 0.7 to 1.0 based on viewport width
        const minScale = 0.7;
        const maxScale = 1.0;
        const minWidth = 360;
        const maxWidth = 1200;
        
        let scaleFactor;
        if (viewportWidth <= minWidth) {
          scaleFactor = minScale;
        } else if (viewportWidth >= maxWidth) {
          scaleFactor = maxScale;
        } else {
          // Smooth interpolation between min and max scale
          const progress = (viewportWidth - minWidth) / (maxWidth - minWidth);
          scaleFactor = minScale + (maxScale - minScale) * progress;
        }
        
        // Apply the scale to the newsletter content
        newsletter.style.transform = `scale(${scaleFactor})`;
        newsletter.style.transformOrigin = 'bottom center';
        
        // Logo scaling is now handled by CSS clamp() for better performance
        
        // Adjust the span positioning to stay properly aligned
        if (span) {
          // Calculate responsive positioning for the span
          const baseBottom = 15;
          const baseRight = -10;
          const responsiveBottom = baseBottom * scaleFactor;
          const responsiveRight = baseRight * scaleFactor;
          
          span.style.bottom = `${responsiveBottom}px`;
          span.style.right = `${responsiveRight}px`;
        }
      }
    };

    // Initial adjustment
    adjustMargin();
    adjustNewsletterContent();

    // Create a ResizeObserver to watch for changes in newsletter height
    const resizeObserver = new ResizeObserver(() => {
      adjustMargin();
    });

    // Observe the newsletter element
    const newsletter = document.querySelector('.tw-newsletter');
    if (newsletter) {
      resizeObserver.observe(newsletter);
    }

    // Additional observer for MailerLite form content changes
    const formObserver = new MutationObserver(() => {
      // Small delay to allow form to fully render
      setTimeout(adjustMargin, 100);
    });

    // Observe the newsletter form for content changes
    const newsletterForm = document.querySelector('.tw-newsletter__form');
    if (newsletterForm) {
      formObserver.observe(newsletterForm, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Listen to window resize events with minimal debouncing for smoothness
    let resizeTimeout;
    const debouncedAdjust = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
    adjustMargin();
        adjustNewsletterContent();
      }, 16); // ~60fps for smooth animation
    };

    window.addEventListener('resize', debouncedAdjust);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      formObserver.disconnect();
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedAdjust);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <main className="tw-main">
        <div className="tw-wrapper" id="main-content">
        <Header />
        
        <div className="tw-hero">
          <div className="tw-hero__wrapper">
            <div className="tw-hero__top">
              <div className="tw-hero__shimmer-container">
                <div className="tw-hero__shimmer">
                  <span className="tw-hero__shimmer-text">Introducing </span><span className="tw-hero__shimmer-text--trustwards">Trustwards</span>
                  <div className='tw-hero__shimmer-arrow'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.0858 5.49995L5.4038 2.81794L6.1109 2.11084L10 5.99995L6.1109 9.889L5.4038 9.1819L8.0858 6.49995H2V5.49995H8.0858Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className='tw-hero__shimmer-background'>
                  <svg width="147" height="32" viewBox="0 0 147 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_1242_86)">
                    <ellipse cx="185.621" cy="92.2477" rx="153.621" ry="134.769" fill="url(#paint0_linear_1242_86)"/>
                    </g>
                    <defs>
                    <filter id="filter0_f_1242_86" x="0.648842" y="-73.8726" width="369.945" height="332.241" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="15.6756" result="effect1_foregroundBlur_1242_86"/>
                    </filter>
                    <linearGradient id="paint0_linear_1242_86" x1="185.621" y1="1.32467" x2="185.621" y2="227.017" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0088FF"/>
                    <stop offset="0.0856164" stopColor="#5499FF"/>
                    <stop offset="0.131849" stopColor="#FF3ED5"/>
                    <stop offset="0.205479" stopColor="#FFD900"/>
                    <stop offset="0.253425" stopColor="#FF061F"/>
                    </linearGradient>
                    </defs>
                  </svg>
                  <svg width="84" height="32" viewBox="0 0 84 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_1242_87)">
                    <ellipse cx="120.236" cy="41.9401" rx="88.6731" ry="86.9401" fill="url(#paint0_linear_1242_87)"/>
                    <ellipse cx="120.236" cy="41.9401" rx="88.6731" ry="86.9401" fill="url(#paint1_linear_1242_87)"/>
                    </g>
                    <defs>
                    <filter id="filter0_f_1242_87" x="0.211342" y="-76.3512" width="240.05" height="236.583" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="15.6756" result="effect1_foregroundBlur_1242_87"/>
                    </filter>
                    <linearGradient id="paint0_linear_1242_87" x1="120.236" y1="-45" x2="120.236" y2="79.5039" gradientUnits="userSpaceOnUse">
                    <stop offset="0.110627" stopColor="#5499FF"/>
                    <stop offset="0.228111" stopColor="#0099FE"/>
                    <stop offset="0.263543" stopColor="white"/>
                    <stop offset="0.309596" stopColor="#EEEEEE"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1242_87" x1="120.236" y1="-45" x2="120.236" y2="128.88" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EEEEEE" stopOpacity="0"/>
                    <stop offset="0.413043" stopColor="#202020"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>
                </div>
                <div className="tw-hero__shimmer-border-gradient"></div>
              </div>
              <h1 className="tw-hero__title">
                Consent should be easier and beautiful. Now it is.
              </h1>
              <button className="tw-cta tw-cta--mini">Try for free</button>
            </div>
            <div className="tw-features">
            <div className="tw-features__grid">
              <div 
                className="tw-feature-card"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Add click functionality here if needed
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="tw-feature-card__header">
                  <div className="tw-feature-card__icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1242_193)">
                      <path d="M11.2495 5H4.49811L4.48047 11.25H9.24952C10.3541 11.25 11.2495 10.3545 11.2495 9.25V5Z" fill="currentColor"/>
                      <path d="M3.98162 11.25L3.48095 11.2486L3.49858 5H0.75V9.25C0.75 10.3545 1.64543 11.25 2.75 11.25H3.98162Z" fill="currentColor"/>
                      <path d="M2.75 0.75C1.64543 0.75 0.75 1.64543 0.75 2.75V4H11.25V2.75C11.25 1.64543 10.3546 0.75 9.25 0.75H2.75Z" fill="currentColor"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_1242_193">
                      <rect width="12" height="12" fill="white"/>
                      </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="tw-feature-card__title">Builder & Themes</span>
                </div>
                <p className="tw-feature-card__description">Go with a ready made theme, or create your own in the builder.</p>
              </div>

              <div 
                className="tw-feature-card"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Add click functionality here if needed
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="tw-feature-card__header">
                  <div className="tw-feature-card__icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.99998 12C5.16998 12 4.38998 11.8426 3.65999 11.5278C2.92999 11.213 2.29499 10.7861 1.75499 10.2472C1.215 9.70827 0.787597 9.07406 0.472798 8.34457C0.158 7.61508 0.000399999 6.83606 0 6.00749C0 5.25843 0.144999 4.52434 0.434998 3.80524C0.724997 3.08614 1.13 2.44434 1.64999 1.87985C2.16999 1.31536 2.79499 0.860924 3.52499 0.516554C4.25498 0.172185 5.05498 0 5.92498 0C6.13498 0 6.34998 0.00998756 6.56998 0.0299626C6.78998 0.0499376 7.01498 0.0848939 7.24497 0.134831C7.15497 0.58427 7.18497 1.00874 7.33497 1.40824C7.48497 1.80774 7.70997 2.13973 8.00997 2.40419C8.30997 2.66866 8.66757 2.85104 9.08277 2.95131C9.49797 3.05159 9.92536 3.02662 10.365 2.8764C10.105 3.46567 10.1426 4.02996 10.4778 4.56929C10.813 5.10861 11.3104 5.38826 11.97 5.40824C11.98 5.5181 11.9876 5.62037 11.9928 5.71506C11.998 5.80974 12.0004 5.91221 12 6.02247C12 6.84145 11.8424 7.61288 11.5272 8.33678C11.212 9.06067 10.7846 9.69488 10.245 10.2394C9.70537 10.7839 9.07037 11.2134 8.33997 11.5278C7.60957 11.8422 6.82958 11.9996 5.99998 12ZM5.09998 4.80899C5.34998 4.80899 5.56258 4.7217 5.73778 4.54712C5.91298 4.37253 6.00038 4.1602 5.99998 3.91011C5.99958 3.66003 5.91218 3.44789 5.73778 3.27371C5.56338 3.09953 5.35078 3.01204 5.09998 3.01124C4.84918 3.01044 4.63678 3.09793 4.46278 3.27371C4.28878 3.44949 4.20119 3.66162 4.19999 3.91011C4.19879 4.1586 4.28638 4.37094 4.46278 4.54712C4.63918 4.7233 4.85158 4.81059 5.09998 4.80899ZM3.89999 7.80524C4.14999 7.80524 4.36258 7.71795 4.53778 7.54337C4.71298 7.36879 4.80038 7.15645 4.79998 6.90637C4.79958 6.65628 4.71218 6.44414 4.53778 6.26996C4.36338 6.09578 4.15079 6.00829 3.89999 6.00749C3.64919 6.00669 3.43679 6.09418 3.26279 6.26996C3.08879 6.44574 3.00119 6.65788 2.99999 6.90637C2.99879 7.15486 3.08639 7.36719 3.26279 7.54337C3.43919 7.71955 3.65159 7.80684 3.89999 7.80524ZM7.79997 8.40449C7.96997 8.40449 8.11257 8.34697 8.22777 8.23191C8.34297 8.11685 8.40037 7.97463 8.39997 7.80524C8.39957 7.63586 8.34197 7.49363 8.22717 7.37858C8.11237 7.26352 7.96997 7.20599 7.79997 7.20599C7.62997 7.20599 7.48757 7.26352 7.37277 7.37858C7.25797 7.49363 7.20037 7.63586 7.19997 7.80524C7.19957 7.97463 7.25717 8.11705 7.37277 8.23251C7.48837 8.34797 7.63077 8.40529 7.79997 8.40449Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="tw-feature-card__title">Auto Comply</span>
                </div>
                <p className="tw-feature-card__description">Install Trustwards on your site and start complying automatically.</p>
              </div>

              <div 
                className="tw-feature-card"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Add click functionality here if needed
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="tw-feature-card__header">
                  <div className="tw-feature-card__icon">
                    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_d_1242_200)">
                      <path d="M4 0H20V3.27273H4V0Z" fill="currentColor"/>
                      <path d="M8.26667 12V5.45455H14.6667L8.26667 12Z" fill="currentColor"/>
                      <path d="M12.5333 12V5.45455H17.8667L12.5333 12Z" fill="currentColor"/>
                      </g>
                      <defs>
                      <filter id="filter0_d_1242_200" x="0" y="0" width="24" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="4"/>
                      <feGaussianBlur stdDeviation="2"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1242_200"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1242_200" result="shape"/>
                      </filter>
                      </defs>
                    </svg>
                  </div>
                  <span className="tw-feature-card__title">Consent Management Platform</span>
                </div>
                <p className="tw-feature-card__description">Scan cookies, review your Proof of Consent, integrate Google Consent Mode v2 and more!</p>
              </div>
            </div>
            <div className="tw-video">
              <div className="tw-video__placeholder">
                <span>Video por seccion</span>
              </div>
            </div>
            </div>
          </div>
       </div>
       
       {/* Span Section */}
       <div className="tw-span-section">
         <div className="tw-span-section__wrapper">
           <h1 className="tw-span-section__h1">
           <span className="tw-span-section__highlight">Within 43 seconds:</span> Set beautiful Cookies. Comply with worldwide regulations.
           Scan your Cookies. Download user consents.
           </h1>
           <button className="tw-cta">Get started</button>
         </div>
       </div>

       {/* Platform Section */}
      <div className="tw-platform-section">
        <div className="tw-platform-section__wrapper">
          <div className="tw-platform-section__top-wrapper">
            <span className="tw-platform-section__brand">Trustwards</span>
            <h3 className="tw-platform-section__title">All-in-one consent platform</h3>
            <p className="tw-platform-section__paragraph">
              Trustwards combines all necessary features to comply regulations with a user-friendly interface, making it easy to design and manage consent on your website.
            </p>
          </div>
          <div className="tw-platform-features">
            <div className="tw-platform-features__grid">
              <div className="tw-platform-features__left-grid">
                <div className="tw-platform-feature-card tw-platform-feature-card--dashboard">
                  <span className="tw-platform-feature-card__label">Dashboard</span>
                </div>
                <div className="tw-platform-feature-card">
                  <span className="tw-platform-feature-card__label">Scanner</span>
                </div>
                <div className="tw-platform-feature-card">
                  <span className="tw-platform-feature-card__label">Multi-language</span>
                </div>
              </div>
              <div className="tw-platform-feature-card">
                <span className="tw-platform-feature-card__label">Scanner</span>
              </div>
            </div>
            <div className="tw-platform-feature__bottom-section">
              <div className="tw-platform-feature-card">
                <span className="tw-platform-feature-card__label">Academy</span>
              </div>
              <div className="tw-platform-feature-card tw-platform-feature-card--builder">
                <span className="tw-platform-feature-card__label">Builder</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Themes Section */}
      <div className="tw-themes-section">
        <div className="tw-themes-section__wrapper">
          <div className="tw-themes-section__header">
            <span className="tw-themes-section__label">Themes</span>
            <div className="tw-themes-section__header-content">
              <h2 className="tw-themes-section__title">Ready-made themes that fits your site.</h2>
              <button className="tw-cta">Start for free</button>
            </div>
            <p className="tw-themes-section__paragraph">
              Pick a theme you like, customize it to reflect your unique style without any coding, and publish it instantly with ease.
            </p>
          </div>
          
          <div className="tw-themes-section__bottom-content">
            <div className="tw-themes-marquee">
              {/* First marquee row */}
              <Marquee 
                speed={50} 
                reverse={false} 
                pauseOnHover={true}
                className="tw-themes-marquee__row"
                itemClassName="tw-themes-marquee__item"
              >
                <div className="tw-themes-marquee__item">Theme 1</div>
                <div className="tw-themes-marquee__item">Theme 2</div>
                <div className="tw-themes-marquee__item">Theme 3</div>
                <div className="tw-themes-marquee__item">Theme 4</div>
                <div className="tw-themes-marquee__item">Theme 5</div>
                <div className="tw-themes-marquee__item">Theme 6</div>
                <div className="tw-themes-marquee__item">Theme 7</div>
                <div className="tw-themes-marquee__item">Theme 8</div>
                <div className="tw-themes-marquee__item">Theme 9</div>
                <div className="tw-themes-marquee__item">Theme 10</div>
                <div className="tw-themes-marquee__item">Theme 11</div>
                <div className="tw-themes-marquee__item">Theme 12</div>
              </Marquee>
              
              {/* Second marquee row (reverse direction) */}
              <Marquee 
                speed={50} 
                reverse={true} 
                pauseOnHover={true}
                className="tw-themes-marquee__row"
                itemClassName="tw-themes-marquee__item"
              >
                <div className="tw-themes-marquee__item">Theme A</div>
                <div className="tw-themes-marquee__item">Theme B</div>
                <div className="tw-themes-marquee__item">Theme C</div>
                <div className="tw-themes-marquee__item">Theme D</div>
                <div className="tw-themes-marquee__item">Theme E</div>
                <div className="tw-themes-marquee__item">Theme F</div>
                <div className="tw-themes-marquee__item">Theme G</div>
                <div className="tw-themes-marquee__item">Theme H</div>
                <div className="tw-themes-marquee__item">Theme I</div>
                <div className="tw-themes-marquee__item">Theme J</div>
                <div className="tw-themes-marquee__item">Theme K</div>
                <div className="tw-themes-marquee__item">Theme L</div>
              </Marquee>
            </div>
            
            <Link href="#" className="tw-themes-section__browse-link">
              <UnderlineHover className="tw-underline-hover--blue">
                Browse themes →
              </UnderlineHover>
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      </div>
        {/* Newsletter Section */}
        <div className="tw-newsletter">
          <div className="tw-newsletter__content">
            <div className="tw-newsletter__logo">
              <svg width="100%" height="100%" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H300V60H0V0Z" fill="black"/>
                <path d="M80 220V100H200L80 220Z" fill="black"/>
                <path d="M160 220V100H260L160 220Z" fill="black"/>
              </svg>
            </div>
            <div className="tw-newsletter__right-wrapper">
              <div className="tw-newsletter__right-wrapper__content">
                <h2 className="tw-newsletter__title">Get Trustwards and regulations updates in your inbox</h2>
                <span className="tw-newsletter__span">no spam we promise =)</span>
              </div>
              <div className="tw-newsletter__form">
                {/* MailerLite Universal Script */}
                <Script id="mailerlite-universal" strategy="afterInteractive">
                  {`
                    (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
                    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
                    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
                    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
                    ml('account', '1445271');
                  `}
                </Script>
                <div className="ml-embedded" data-form="lSWt8Q"></div>
              </div>
            </div>
          </div>
        </div>
        

        
    </main>
  );
}

export default Web