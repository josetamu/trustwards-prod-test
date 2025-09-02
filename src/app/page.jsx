'use client'

import './web.css'
import '@components/tooltip/Tooltip.css'
import Link from 'next/link'

function Web() {
  return (
    <div className="tw-root">
      <div className="tw-root__header">
        <Link href="/dashboard" className="tw-root__dashboard-button">Dashboard</Link>
      </div>
      
      <main className="tw-main-content">
        <h1>Web</h1>
      </main>

      <div className="tw-footer-container">
        <footer className="tw-footer">
          
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
              <div className="tw-footer__button-wrapper">
                <button className="tw-footer__button">Get started</button>
              </div>
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
        </footer>

        {/* Newsletter Section - Parte blanca que se revela */}
        <div className="tw-newsletter">
          <div className="tw-newsletter__content">
            <div className="tw-newsletter__logo">
              <svg width="60" height="48" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_1257_259_newsletter)">
                <path d="M4 0H27V4.63636H4V0Z" fill="url(#paint0_linear_1257_259_newsletter)"/>
                <path d="M10.1333 17V7.72727H19.3333L10.1333 17Z" fill="url(#paint1_linear_1257_259_newsletter)"/>
                <path d="M16.2667 17V7.72727H23.9333L16.2667 17Z" fill="url(#paint2_linear_1257_259_newsletter)"/>
                </g>
                <defs>
                <filter id="filter0_d_1257_259_newsletter" x="0" y="0" width="31" height="25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1257_259"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1257_259" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_1257_259_newsletter" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C6DE8"/>
                <stop offset="1" stopColor="#1C6DE8"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1257_259_newsletter" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C6DE8"/>
                <stop offset="1" stopColor="#1C6DE8"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1257_259_newsletter" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C6DE8"/>
                <stop offset="1" stopColor="#1C6DE8"/>
                </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="tw-newsletter__text">
              <h2 className="tw-newsletter__title">Get Trustwards and regulations updates in your inbox</h2>
              <p className="tw-newsletter__subtitle">no spam we promise :)</p>
            </div>
            <div className="tw-newsletter__form">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="tw-newsletter__input"
              />
              <button className="tw-newsletter__button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espacio extra para activar el scroll y el efecto */}
      <div style={{ height: '100vh' }}></div>
    </div>
  );
}

export default Web