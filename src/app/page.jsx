'use client'

import './web.css'
import '@components/tooltip/Tooltip.css'
import Link from 'next/link'
import { useEffect } from 'react'

function Web() {
  useEffect(() => {
    let lastWidth = window.innerWidth;
    
    const adjustMargin = () => {
      const wrapper = document.querySelector('.tw-wrapper');
      if (wrapper) {
        // Calculate the margin-bottom based on the viewport width
        const viewportWidth = window.innerWidth;
        const maxMargin = 444; // Maximum margin
        const responsiveMargin = Math.min(maxMargin, viewportWidth * 0.3); // Maximum 500px or 30% of the viewport width
        wrapper.style.marginBottom = `${responsiveMargin}px`;
      }
    };

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only adjust if the width has changed (resize horizontal)
      if (currentWidth !== lastWidth) {
        adjustMargin();
        lastWidth = currentWidth;
      }
    };

    // Adjust when the page loads
    adjustMargin();

    // Only adjust on resize horizontal
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="tw-main">
      <div className="tw-wrapper">
        <header className="tw-header">
          {/* Banner */}
          <div className="tw-banner">
            <div className="tw-banner__wrapper">
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
              <span className="tw-banner__text">Lifetime deal available for a limited time</span>
              <Link href="#" className="tw-banner__pricing-btn">Pricing</Link>
            </div>
          </div>
          
          <div className="tw-header__wrapper">
            <div className="tw-header__left-wrapper">
              <div className="tw-header__logo">
                <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_1242_10)">
                  <path d="M4 0H27V4.63636H4V0Z" fill="url(#paint0_linear_1242_10)"/>
                  <path d="M10.1333 17V7.72727H19.3333L10.1333 17Z" fill="url(#paint1_linear_1242_10)"/>
                  <path d="M16.2667 17V7.72727H23.9333L16.2667 17Z" fill="url(#paint2_linear_1242_10)"/>
                  </g>
                  <defs>
                  <filter id="filter0_d_1242_10" x="0" y="0" width="31" height="25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1242_10"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1242_10" result="shape"/>
                  </filter>
                  <linearGradient id="paint0_linear_1242_10" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="#1C6DE8"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_1242_10" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="#1C6DE8"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_1242_10" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="#1C6DE8"/>
                  </linearGradient>
                  </defs>
                </svg>
              </div>
              <nav className="tw-header__nav">
                <Link href="#" className="tw-header__nav-item">Features</Link>
                <Link href="#" className="tw-header__nav-item">Useful</Link>
                <Link href="#" className="tw-header__nav-item">Pricing</Link>
              </nav>
            </div>
            <div className="tw-header__actions">
              <button className="tw-cta tw-cta--mini tw-header__cta">Login</button>
              <Link href="/dashboard" className="tw-cta tw-cta--mini">Dashboard</Link>
            </div>
          </div>
        </header>
        <div className="tw-hero">
          <div className="tw-hero__wrapper">
            <div className="tw-hero__top">
              <div className="tw-hero__shimmer">
                <span className="tw-hero__shimmer-text">Introducing </span><span className="tw-hero__shimmer-text--white">Trustwards</span>
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
              <h1 className="tw-hero__title">
                Consent should be easier and beautiful. Now it is.
              </h1>
              <button className="tw-cta tw-cta--mini">Try for free</button>
            </div>
            <div className="tw-features">
            <div className="tw-features__grid">
              <div className="tw-feature-card">
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

              <div className="tw-feature-card">
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

              <div className="tw-feature-card">
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
            <div className="tw-themes-section__grid">
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
              <div className="tw-theme-preview"></div>
            </div>
            
            <Link href="#" className="tw-themes-section__browse-link">Browse themes →</Link>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="tw-footer">
        <div className="tw-footer__wrapper">
          {/* FAQ Section */}
          <div className="tw-faq">
            <div className="tw-faq__wrapper">
              <div className="tw-faq__top-wrapper">
                <span className="tw-faq__label">FAQ</span>
                <h2 className="tw-faq__title"><span className="tw-faq__highlight">Questions?</span> Answers.</h2>
                <p className="tw-faq__paragraph">
                  Didn't find your question? 
                  <br></br>
                  Feel free to reach as to{' '}
                  <a href="mailto:team@trustwards.io" className="tw-faq__email">team@trustwards.io</a>
                </p>
              </div>
              <div className="tw-faq__accordion">
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">What is Trustwards?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>Trustwards is a comprehensive consent management platform that helps you comply with privacy regulations while providing a beautiful user experience for your website visitors.</p>
                  </div>
                </div>
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">Can I try Trustwards before purchasing?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>Yes! We offer a free trial with no credit card required. You can explore all features and see how Trustwards works with your website before making any commitment.</p>
                  </div>
                </div>
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">Do you have a community?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>Yes, we have an active community where users share tips, ask questions, and get support. You can join our community through our website or social media channels.</p>
                  </div>
                </div>
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">Can I downgrade or upgrade to a greater plan?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
                  </div>
                </div>
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">Will you be adding more themes?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>Yes! We regularly add new themes to our collection. You can also create custom themes using our builder to match your brand perfectly.</p>
                  </div>
                </div>
                <div className="tw-faq__item">
                  <button className="tw-faq__question">
                    <span className="tw-faq__icon">+</span>
                    <span className="tw-faq__question-text">Can I request a theme or feature?</span>
                  </button>
                  <div className="tw-faq__answer">
                    <p>We love hearing from our users! You can submit feature requests and theme suggestions through our contact form or by emailing us directly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-footer__bottom-wrapper">
            <div className="tw-footer__inner">
              <div className="tw-footer__left-wrapper">

                <div className="tw-footer__logo">
                  <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_1257_259)">
                    <path d="M4 0H27V4.63636H4V0Z" fill="url(#paint0_linear_1257_259)"/>
                    <path d="M10.1333 17V7.72727H19.3333L10.1333 17Z" fill="url(#paint1_linear_1257_259)"/>
                    <path d="M16.2667 17V7.72727H23.9333L16.2667 17Z" fill="url(#paint2_linear_1257_259)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_1257_259" x="0" y="0" width="31" height="25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1257_259"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1257_259" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_1257_259" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1257_259" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_1257_259" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="tw-footer__paragraph">Join Trustwards today. No credit card required.</p>
                  <button className="tw-cta tw-cta--mini">Get started</button>
              </div>

              <div className="tw-footer__right-wrapper">
                <div className="tw-footer__nav-column">
                  <span className="tw-footer__nav-title">Features</span>
                  <span className="tw-footer__nav-item">Builder</span>
                  <span className="tw-footer__nav-item">Themes</span>
                  <span className="tw-footer__nav-item">Scanner</span>
                  <span className="tw-footer__nav-item">Comply Map</span>
                  <span className="tw-footer__nav-item">Integrations</span>
                  <span className="tw-footer__nav-item">Localization</span>
                </div>

                <div className="tw-footer__nav-column">
                  <span className="tw-footer__nav-title">Useful</span>
                  <span className="tw-footer__nav-item">Pricing</span>
                  <span className="tw-footer__nav-item">Changelog</span>
                  <span className="tw-footer__nav-item">Roadmap</span>
                  <span className="tw-footer__nav-item">Academy</span>
                </div>

                <div className="tw-footer__nav-column">
                  <span className="tw-footer__nav-title">Community</span>
                  <span className="tw-footer__nav-item">Blog</span>
                  <span className="tw-footer__nav-item">Affiliates</span>
                  <span className="tw-footer__nav-item">Facebook</span>
                  <span className="tw-footer__nav-item">YouTube</span>
                </div>

                <div className="tw-footer__nav-column tw-footer__nav-column--double">
                  <div className="tw-footer__nav-column">
                    <span className="tw-footer__nav-title">Connect</span>
                    <span className="tw-footer__nav-item">Sales team</span>
                    <span className="tw-footer__nav-item">Contact</span>
                  </div>

                  <div className="tw-footer__nav-column">
                    <span className="tw-footer__nav-title">Legal</span>
                    <span className="tw-footer__nav-item">Terms & conditions</span>
                    <span className="tw-footer__nav-item">Privacy policy</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-footer__banner">
              <span className="tw-footer__copyright">© Trustwards 2025. All rights reserved</span>
              <div className="tw-footer__socials">
                <Link href="#" className="tw-footer__social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="currentColor"/>
                  </svg>
                </Link>
                <Link href="#" className="tw-footer__social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.8 4.4L13.2442 8.99222L17.4876 4H20.1124L14.4746 10.6328L20.3 18.4L21.5 20H15L14.7 19.6L11.0215 14.6953L6.51244 20H3.88756L9.79104 13.0547L4.2 5.6L3 4H9.5L9.8 4.4ZM11.8703 12.4937L7 6H8.5L12.3953 11.1938L17.5 18H16L11.8703 12.4937Z" fill="currentColor"/>
                  </svg>
                </Link>
                <Link href="#" className="tw-footer__social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5933 7.20301C21.4794 6.78041 21.2568 6.39501 20.9477 6.08518C20.6386 5.77534 20.2537 5.55187 19.8313 5.43701C18.2653 5.00701 12.0003 5.00001 12.0003 5.00001C12.0003 5.00001 5.73633 4.99301 4.16933 5.40401C3.74725 5.52415 3.36315 5.75078 3.0539 6.06214C2.74464 6.3735 2.52062 6.75913 2.40333 7.18201C1.99033 8.74801 1.98633 11.996 1.98633 11.996C1.98633 11.996 1.98233 15.26 2.39233 16.81C2.62233 17.667 3.29733 18.344 4.15533 18.575C5.73733 19.005 11.9853 19.012 11.9853 19.012C11.9853 19.012 18.2503 19.019 19.8163 18.609C20.2388 18.4943 20.6241 18.2714 20.934 17.9622C21.2439 17.653 21.4677 17.2682 21.5833 16.846C21.9973 15.281 22.0003 12.034 22.0003 12.034C22.0003 12.034 22.0203 8.76901 21.5933 7.20301ZM9.99633 15.005L10.0013 9.00501L15.2083 12.01L9.99633 15.005Z" fill="currentColor"/>
                  </svg>
                </Link>
                <Link href="#" className="tw-footer__social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3353 18.339H15.6697V14.1623C15.6697 13.1663 15.6495 11.8845 14.2808 11.8845C12.891 11.8845 12.6787 12.9682 12.6787 14.0887V18.339H10.0132V9.75H12.5738V10.9207H12.6082C12.966 10.2457 13.836 9.53325 15.1357 9.53325C17.8365 9.53325 18.336 11.3108 18.336 13.6245L18.3353 18.339ZM7.00275 8.57475C6.14475 8.57475 5.4555 7.88025 5.4555 7.026C5.4555 6.1725 6.1455 5.47875 7.00275 5.47875C7.85775 5.47875 8.55075 6.1725 8.55075 7.026C8.55075 7.88025 7.857 8.57475 7.00275 8.57475ZM8.33925 18.339H5.66625V9.75H8.33925V18.339ZM19.6688 3H4.32825C3.594 3 3 3.5805 3 4.29675V19.7032C3 20.4202 3.594 21 4.32825 21H19.6665C20.4 21 21 20.4202 21 19.7032V4.29675C21 3.5805 20.4 3 19.6665 3H19.6688Z" fill="currentColor"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      </div>
        {/* Newsletter Section */}
        <div className="tw-newsletter">
          <div className="tw-newsletter__content">
            <div className="tw-newsletter__logo">
              <svg width="300" height="220" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H300V60H0V0Z" fill="black"/>
                <path d="M80 220V100H200L80 220Z" fill="black"/>
                <path d="M160 220V100H260L160 220Z" fill="black"/>
              </svg>
            </div>
            <div className="tw-newsletter__right-wrapper">
              <div className="tw-newsletter__right-wrapper__content">
                <h2 className="tw-newsletter__title">Get Trustwards and regulations updates in your inbox</h2>
                <p className="tw-newsletter__span">no spam we promise :)</p>
              </div>
              <div className="tw-newsletter__form">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="tw-newsletter__input"
              />
              <button className="tw-cta">Subscribe</button>
            </div>
            </div>
          </div>
        </div>
    </main>
  );
}

export default Web