import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Banner from '../Banner/Banner';
import './Header.css';

const Header = ({ className = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUsefulDropdownOpen, setIsUsefulDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const usefulDropdownRef = useRef(null);
  const usefulDropdownButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const burgerButtonRef = useRef(null);

  // Keyboard navigation handlers - following project patterns
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsUsefulDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
    setIsUsefulDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !burgerButtonRef.current?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`tw-header ${className} ${isMobileMenuOpen ? 'tw-header--mobile-menu-open' : ''}`}>
      {/* Banner */}
      <Banner></Banner>
      <div className="tw-header__wrapper">
            <div className="tw-header__inner">
              <div className="tw-header__left-wrapper">
                <Link href="/" className="tw-header__logo">
                  <svg width="31" height="17" viewBox="0 0 31 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_1242_10)">
                    <path d="M4 0H27V4.63636H4V0Z" fill="url(#paint0_linear_1242_10)"/>
                    <path d="M10.1333 17V7.72727H19.3333L10.1333 17Z" fill="url(#paint1_linear_1242_10)"/>
                    <path d="M16.2667 17V7.72727H23.9333L16.2667 17Z" fill="url(#paint2_linear_1242_10)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_1242_10" x="0" y="0" width="31" height="17" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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
                </Link>
                <nav className="tw-header__nav">
                  <div 
                    className="tw-header__nav-item tw-header__nav-item--dropdown"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      ref={dropdownButtonRef}
                      className="tw-header__nav-item tw-header__nav-item--dropdown"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      Features
                    </button>
                  <div 
                    ref={dropdownRef}
                    className={`tw-dropdown ${isDropdownOpen ? 'tw-dropdown--open' : ''}`}
                  >
                          <Link 
                            href="#" 
                            className="tw-dropdown__item"
                          >
                            <svg className="tw-dropdown__item-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <g clipPath="url(#clip0_1214_90)">
                              <path d="M11.2495 5H4.49811L4.48047 11.25H9.24952C10.3541 11.25 11.2495 10.3545 11.2495 9.25V5Z" fill="currentColor"/>
                              <path d="M3.98162 11.25L3.48095 11.2486L3.49858 5H0.75V9.25C0.75 10.3545 1.64543 11.25 2.75 11.25H3.98162Z" fill="currentColor"/>
                              <path d="M2.75 0.75C1.64543 0.75 0.75 1.64543 0.75 2.75V4H11.25V2.75C11.25 1.64543 10.3546 0.75 9.25 0.75H2.75Z" fill="currentColor"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_1214_90">
                              <rect width="12" height="12" fill="currentColor"/>
                              </clipPath>
                              </defs>
                            </svg>
                            <span className="tw-dropdown__item-text">Builder</span>
                          </Link>
                        <Link href="#" className="tw-dropdown__item">
                          <svg className="tw-dropdown__item-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.75" y="0.75" width="8.5" height="8.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                          <span className="tw-dropdown__item-text">Themes</span>
                        </Link>
                        <Link href="#" className="tw-dropdown__item">
                          <svg className='tw-dropdown__item-icon' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.99998 10C4.30832 10 3.65832 9.86883 3.04999 9.60649C2.44166 9.34415 1.91249 8.98843 1.46249 8.53933C1.0125 8.09022 0.656331 7.56171 0.393999 6.95381C0.131666 6.3459 0.000333332 5.69671 0 5.00624C0 4.38202 0.120833 3.77029 0.362499 3.17104C0.604164 2.57179 0.941663 2.03695 1.375 1.56654C1.80833 1.09613 2.32916 0.717436 2.93749 0.430462C3.54582 0.143487 4.21249 0 4.93748 0C5.11248 0 5.29165 0.00832296 5.47498 0.0249688C5.65831 0.0416147 5.84581 0.0707449 6.03748 0.11236C5.96248 0.486891 5.98748 0.840616 6.11248 1.17353C6.23748 1.50645 6.42498 1.7831 6.67498 2.0035C6.92498 2.22389 7.22297 2.37586 7.56897 2.45943C7.91497 2.54299 8.27114 2.52218 8.63747 2.397C8.4208 2.88806 8.45214 3.3583 8.73147 3.80774C9.0108 4.25718 9.4253 4.49022 9.97497 4.50687C9.9833 4.59842 9.98963 4.68365 9.99397 4.76255C9.9983 4.84145 10.0003 4.92684 9.99996 5.01873C9.99996 5.70121 9.86863 6.34407 9.60597 6.94732C9.3433 7.55056 8.98714 8.07907 8.53747 8.53283C8.0878 8.9866 7.55864 9.34449 6.94998 9.60649C6.34131 9.8685 5.69131 9.99967 4.99998 10ZM4.24999 4.00749C4.45832 4.00749 4.63548 3.93475 4.78148 3.78926C4.92748 3.64378 5.00032 3.46683 4.99998 3.25843C4.99965 3.05002 4.92682 2.87324 4.78148 2.72809C4.63615 2.58294 4.45898 2.51003 4.24999 2.50936C4.04099 2.5087 3.86399 2.58161 3.71899 2.72809C3.57399 2.87457 3.50099 3.05135 3.49999 3.25843C3.49899 3.4655 3.57199 3.64245 3.71899 3.78926C3.86599 3.93608 4.04299 4.00882 4.24999 4.00749ZM3.24999 6.50437C3.45832 6.50437 3.63549 6.43163 3.78149 6.28614C3.92749 6.14066 4.00032 5.96371 3.99999 5.75531C3.99965 5.5469 3.92682 5.37012 3.78149 5.22497C3.63615 5.07982 3.45899 5.00691 3.24999 5.00624C3.04099 5.00558 2.86399 5.07849 2.71899 5.22497C2.57399 5.37145 2.50099 5.54823 2.49999 5.75531C2.49899 5.96238 2.57199 6.13933 2.71899 6.28614C2.86599 6.43296 3.04299 6.5057 3.24999 6.50437ZM6.49998 7.00375C6.64164 7.00375 6.76048 6.95581 6.85648 6.85992C6.95248 6.76404 7.00031 6.64553 6.99998 6.50437C6.99964 6.36321 6.95164 6.24469 6.85598 6.14881C6.76031 6.05293 6.64164 6.00499 6.49998 6.00499C6.35831 6.00499 6.23965 6.05293 6.14398 6.14881C6.04831 6.24469 6.00031 6.36321 5.99998 6.50437C5.99965 6.64553 6.04765 6.76421 6.14398 6.86042C6.24031 6.95664 6.35898 7.00441 6.49998 7.00375Z" fill="white"/>
                          </svg>
                          <span className="tw-dropdown__item-text">Scanner</span>
                        </Link>
                        <Link href="#" className="tw-dropdown__item">
                          <svg className='tw-dropdown__item-icon' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1214_110)">
                            <path d="M5.1594 1.5926C5.42385 1.53891 5.59475 1.28099 5.54105 1.01652C5.48735 0.752052 5.22945 0.581177 4.96498 0.634862C2.48885 1.13749 0.625 3.32588 0.625 5.95066C0.625 8.94646 3.05355 11.375 6.0493 11.375C8.6741 11.375 10.8625 9.51116 11.3652 7.03501C11.4188 6.77056 11.248 6.51266 10.9835 6.45896C10.719 6.40526 10.4611 6.57616 10.4074 6.84061C10.2828 7.45461 10.0316 8.02261 9.6822 8.51631C9.666 8.53926 9.64355 8.55706 9.61725 8.56691C9.54635 8.59356 9.47155 8.61561 9.3929 8.63286C8.93855 8.72091 8.46495 8.64456 8.30275 8.59966C8.05415 8.54196 7.75545 8.44191 7.47625 8.31961C7.097 8.17646 6.53115 7.81091 6.2875 7.63771L6.2849 7.63586C6.1833 7.56496 5.96005 7.39886 5.95775 7.39716C5.85565 7.32106 5.7495 7.24201 5.64605 7.16926C5.17715 6.82596 4.5696 6.52466 4.32425 6.41606C3.94455 6.25631 3.59986 6.16616 3.28337 6.12926C3.01047 6.07686 2.72042 6.10416 2.48597 6.14806C2.24332 6.19351 2.02625 6.26336 1.8917 6.31811C1.86875 6.32721 1.84463 6.33716 1.81973 6.34771C1.72502 6.38801 1.61681 6.32731 1.61056 6.22461C1.60506 6.13401 1.60227 6.04266 1.60227 5.95066C1.60227 3.7998 3.12974 2.00459 5.1594 1.5926Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.2503 0.625C7.0301 0.625 5.8589 1.33302 5.3661 2.46412C4.90532 3.52179 5.15955 4.42612 5.66975 5.18326C6.08235 5.79556 6.6842 6.34181 7.2121 6.82092C7.3119 6.91147 7.40905 6.99962 7.50175 7.08537L7.50255 7.08617C7.7061 7.27327 7.97445 7.37502 8.2503 7.37502C8.5261 7.37502 8.7945 7.27326 8.99805 7.08611C9.08585 7.00541 9.1775 6.92251 9.27155 6.83741C9.8049 6.35511 10.4149 5.80356 10.8318 5.18351C11.3414 4.42566 11.5947 3.52049 11.1345 2.46412C10.6417 1.33302 9.4705 0.625 8.2503 0.625ZM8.25 2.5C8.8713 2.5 9.375 3.00368 9.375 3.625C9.375 4.24632 8.8713 4.75 8.25 4.75C7.6287 4.75 7.125 4.24632 7.125 3.625C7.125 3.00368 7.6287 2.5 8.25 2.5Z" fill="white"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_1214_110">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                            </defs>
                          </svg>
                          <span className="tw-dropdown__item-text">Comply Map</span>
                        </Link>
                        <Link href="#" className="tw-dropdown__item">
                            <svg className='tw-dropdown__item-icon' width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.625 2.979C9.625 3.73839 9.00941 4.354 8.25 4.354C7.49059 4.354 6.875 3.73839 6.875 2.979C6.875 2.21961 7.49059 1.604 8.25 1.604C9.00941 1.604 9.625 2.21961 9.625 2.979Z" stroke="currentColor" strokeLinejoin="round"/>
                            <path d="M4.125 5.5C4.125 6.25941 3.50939 6.875 2.75 6.875C1.99061 6.875 1.375 6.25941 1.375 5.5C1.375 4.74059 1.99061 4.125 2.75 4.125C3.50939 4.125 4.125 4.74059 4.125 5.5Z" stroke="currentColor" strokeLinejoin="round"/>
                            <path d="M9.625 8.021C9.625 8.78041 9.00941 9.396 8.25 9.396C7.49059 9.396 6.875 8.78041 6.875 8.021C6.875 7.26158 7.49059 6.646 8.25 6.646C9.00941 6.646 9.625 7.26158 9.625 8.021Z" stroke="currentColor" strokeLinejoin="round"/>
                            <path d="M3.89453 4.81227L6.8737 3.4375M3.89453 5.95833L6.8737 7.3331" stroke="currentColor" strokeLinejoin="round"/>
                          </svg>
                          <span className="tw-dropdown__item-text">Integrations</span>
                        </Link>
                  </div>
                  </div>
                  <div 
                    className="tw-header__nav-item tw-header__nav-item--dropdown"
                    onMouseEnter={() => setIsUsefulDropdownOpen(true)}
                    onMouseLeave={() => setIsUsefulDropdownOpen(false)}
                  >
                    <button
                      ref={usefulDropdownButtonRef}
                      className="tw-header__nav-item tw-header__nav-item--dropdown"
                      onClick={() => setIsUsefulDropdownOpen(!isUsefulDropdownOpen)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      Useful
                    </button>
                    <div 
                      ref={usefulDropdownRef}
                      className={`tw-dropdown ${isUsefulDropdownOpen ? 'tw-dropdown--open' : ''}`}
                    >
                              <Link 
                                href="/changelog" 
                                className="tw-dropdown__item"
                                role="menuitem"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.currentTarget.click();
                                  }
                                }}
                              >
                                <svg className='tw-dropdown__item-icon' width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path d="M1.755 7V1.357L1.872 0.7H2.934V7H1.755ZM0.423 2.689V1.573C0.573 1.585 0.735 1.549 0.909 1.465C1.083 1.375 1.254 1.261 1.422 1.123C1.596 0.979 1.746 0.835 1.872 0.691L2.655 1.456C2.439 1.696 2.211 1.915 1.971 2.113C1.731 2.305 1.482 2.455 1.224 2.563C0.972 2.671 0.705 2.713 0.423 2.689ZM4.64288 7.135C4.44488 7.135 4.27388 7.063 4.12988 6.919C3.99188 6.775 3.92288 6.604 3.92288 6.406C3.92288 6.214 3.99188 6.046 4.12988 5.902C4.27388 5.758 4.44488 5.686 4.64288 5.686C4.84088 5.686 5.00888 5.758 5.14688 5.902C5.29088 6.046 5.36288 6.214 5.36288 6.406C5.36288 6.604 5.29088 6.775 5.14688 6.919C5.00888 7.063 4.84088 7.135 4.64288 7.135ZM8.4053 7.108C7.8953 7.108 7.4453 6.97 7.0553 6.694C6.6653 6.412 6.3593 6.028 6.1373 5.542C5.9153 5.05 5.8043 4.486 5.8043 3.85C5.8043 3.214 5.9153 2.653 6.1373 2.167C6.3593 1.675 6.6623 1.291 7.0463 1.015C7.4363 0.733 7.8863 0.592 8.3963 0.592C8.9063 0.592 9.3563 0.733 9.7463 1.015C10.1423 1.291 10.4513 1.675 10.6733 2.167C10.8953 2.653 11.0063 3.214 11.0063 3.85C11.0063 4.486 10.8953 5.05 10.6733 5.542C10.4513 6.028 10.1453 6.412 9.7553 6.694C9.3653 6.97 8.9153 7.108 8.4053 7.108ZM8.4053 5.992C8.6753 5.992 8.9153 5.902 9.1253 5.722C9.3413 5.536 9.5093 5.284 9.6293 4.966C9.7493 4.642 9.8093 4.27 9.8093 3.85C9.8093 3.43 9.7493 3.058 9.6293 2.734C9.5093 2.41 9.3413 2.158 9.1253 1.978C8.9153 1.792 8.6723 1.699 8.3963 1.699C8.1263 1.699 7.8863 1.792 7.6763 1.978C7.4663 2.158 7.3013 2.41 7.1813 2.734C7.0673 3.058 7.0103 3.43 7.0103 3.85C7.0103 4.27 7.0673 4.642 7.1813 4.966C7.3013 5.284 7.4663 5.536 7.6763 5.722C7.8923 5.902 8.1353 5.992 8.4053 5.992Z" fill="currentColor"/>
                                </svg>
                              <span className="tw-dropdown__item-text">Changelog</span>
                              </Link>
                              <Link 
                                href="/roadmap" 
                                className="tw-dropdown__item"
                              >
                                <svg className="tw-dropdown__item-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <g clipPath="url(#clip0_1214_166)">
                                  <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M3.05928 4.01744C3.00801 3.7548 2.75166 3.58309 2.48671 3.63391C2.05234 3.71724 1.67623 3.86604 1.36146 4.14343C0.959841 4.49735 0.783516 4.94944 0.702056 5.4834C0.624966 5.9887 0.624981 6.6281 0.625001 7.4072V7.48435C0.624981 8.26345 0.624966 8.9029 0.702056 9.4082C0.783516 9.94215 0.959841 10.3943 1.36146 10.7482C1.75482 11.0948 2.24331 11.2402 2.82007 11.3085C3.38136 11.375 4.09647 11.375 4.99045 11.375H7.00955C7.90355 11.375 8.61865 11.375 9.17995 11.3085C9.7567 11.2402 10.2452 11.0948 10.6386 10.7482C11.0402 10.3943 11.2165 9.94215 11.298 9.4082C11.3751 8.90285 11.375 8.26345 11.375 7.4843V7.4072C11.375 6.6281 11.3751 5.9887 11.298 5.4834C11.2165 4.94944 11.0402 4.49735 10.6386 4.14343C10.3238 3.86604 9.94765 3.71724 9.5133 3.63391C9.24835 3.58309 8.992 3.7548 8.9407 4.01744C8.88945 4.28007 9.06265 4.53419 9.3276 4.58501C9.65015 4.64688 9.84505 4.74039 9.98925 4.86743C10.1601 5.018 10.27 5.2241 10.3317 5.62825C10.3964 6.0527 10.3978 6.6185 10.3978 7.4458C10.3978 8.2731 10.3964 8.83885 10.3317 9.2633C10.27 9.66745 10.1601 9.8736 9.98925 10.0242C9.8101 10.182 9.5517 10.2889 9.06395 10.3466C8.5675 10.4055 7.91095 10.4063 6.97725 10.4063H5.02275C4.08903 10.4063 3.43252 10.4055 2.93605 10.3466C2.44832 10.2889 2.18988 10.182 2.01077 10.0242C1.83991 9.8736 1.73 9.66745 1.66834 9.2633C1.60358 8.83885 1.60228 8.2731 1.60228 7.4458C1.60228 6.6185 1.60358 6.0527 1.66834 5.62825C1.73 5.2241 1.83991 5.018 2.01077 4.86743C2.15493 4.74039 2.34986 4.64688 2.67238 4.58501C2.93733 4.53419 3.11056 4.28007 3.05928 4.01744ZM3 7C2.72386 7 2.5 7.22385 2.5 7.5C2.5 7.77615 2.72386 8 3 8H3.5C3.77614 8 4 7.77615 4 7.5C4 7.22385 3.77614 7 3.5 7H3ZM5.75 7C5.47385 7 5.25 7.22385 5.25 7.5C5.25 7.77615 5.47385 8 5.75 8H6.25C6.52615 8 6.75 7.77615 6.75 7.5C6.75 7.22385 6.52615 7 6.25 7H5.75ZM8.5 7C8.22385 7 8 7.22385 8 7.5C8 7.77615 8.22385 8 8.5 8H9C9.27615 8 9.5 7.77615 9.5 7.5C9.5 7.22385 9.27615 7 9 7H8.5Z" fill="currentColor"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M5.99608 0.625C4.68088 0.625 3.62109 1.7009 3.62109 3.02016C3.62109 3.77959 3.92831 4.37361 4.49739 4.8779C4.81963 5.16345 5.22308 5.6527 5.46163 6.04395C5.55738 6.201 5.73278 6.375 5.99278 6.375C6.24858 6.375 6.42498 6.2059 6.52428 6.0539C6.78398 5.6565 7.17698 5.15955 7.49483 4.8779C8.06388 4.37361 8.37108 3.77959 8.37108 3.02016C8.37108 1.7009 7.31133 0.625 5.99608 0.625ZM5.99218 2.125C5.51108 2.125 5.12108 2.51675 5.12108 3C5.12108 3.48325 5.51108 3.875 5.99218 3.875H6.00003C6.48108 3.875 6.87108 3.48325 6.87108 3C6.87108 2.51675 6.48108 2.125 6.00003 2.125H5.99218Z" fill="white"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_1214_166">
                                  <rect width="12" height="12" fill="currentColor"/>
                                  </clipPath>
                                  </defs>
                                </svg>
                              <span className="tw-dropdown__item-text">Roadmap</span>
                              </Link>
                              <Link href="#" className="tw-dropdown__item">
                                <svg className="tw-dropdown__item-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M10.2502 4.375C10.4574 4.375 10.6252 4.5429 10.6252 4.75V8.1729L11.3125 9.7738C11.5314 10.2838 11.153 10.875 10.586 10.875H9.9145C9.34745 10.875 8.96905 10.2838 9.18795 9.7738L9.8752 8.1729V4.75C9.8752 4.5429 10.0431 4.375 10.2502 4.375Z" fill="white"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M5.88615 1.1333C5.96235 1.12224 6.03765 1.12224 6.11385 1.1333C6.89485 1.24662 7.845 1.62778 8.71265 2.04539C9.5891 2.46723 10.4167 2.94385 10.9623 3.27297C11.5126 3.60487 11.5126 4.39513 10.9623 4.72703C10.4167 5.05615 9.5891 5.53275 8.71265 5.9546C7.845 6.3722 6.89485 6.7534 6.11385 6.8667C6.03765 6.87775 5.96235 6.87775 5.88615 6.8667C5.10515 6.7534 4.15501 6.3722 3.28735 5.9546C2.41092 5.53275 1.5833 5.05615 1.03767 4.72703C0.487443 4.39513 0.487443 3.60487 1.03767 3.27297C1.5833 2.94385 2.41092 2.46723 3.28735 2.04539C4.15501 1.62778 5.10515 1.24662 5.88615 1.1333Z" fill="white"/>
                                  <path d="M2.79297 6.54883L3.12843 8.56158C3.14362 8.65273 3.19225 8.73528 3.2644 8.79303L3.26485 8.79338L3.2661 8.79438L3.26998 8.79743L3.2831 8.80768C3.29421 8.81628 3.30998 8.82833 3.33012 8.84338C3.37037 8.87343 3.42819 8.91543 3.50109 8.96543C3.6466 9.06523 3.85391 9.19788 4.1031 9.33078C4.59294 9.59203 5.28275 9.87493 5.99835 9.87493C6.7139 9.87493 7.4037 9.59203 7.89355 9.33078C8.14275 9.19788 8.35005 9.06523 8.49555 8.96543C8.56845 8.91543 8.6263 8.87343 8.66655 8.84338C8.68665 8.82833 8.70245 8.81628 8.71355 8.80768L8.7267 8.79743L8.73055 8.79438L8.7318 8.79338L8.7326 8.79273C8.80475 8.73503 8.85305 8.65273 8.86825 8.56158L9.2037 6.54883C9.14815 6.57618 9.0923 6.60333 9.03625 6.63033C8.15665 7.05368 7.12035 7.47818 6.2199 7.60883C6.07225 7.63028 5.92445 7.63028 5.7768 7.60883C4.87636 7.47818 3.84005 7.05368 2.96044 6.63033C2.90438 6.60333 2.84854 6.57613 2.79297 6.54883Z" fill="currentColor"/>
                                </svg>
                              <span className="tw-dropdown__item-text">Academy</span>
                              </Link>
                              <Link href="#" className="tw-dropdown__item">
                                <svg className="tw-dropdown__item-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.15704 2.13235C3.11855 1.44555 4.45573 1.125 6 1.125C7.54425 1.125 8.88145 1.44555 9.84295 2.13235C10.8217 2.8315 11.375 3.8855 11.375 5.25C11.375 6.6145 10.8217 7.6685 9.84295 8.36765C8.96015 8.9982 7.7607 9.32005 6.375 9.36855V10.5C6.375 10.6186 6.31895 10.7301 6.22385 10.8008C6.12875 10.8716 6.0058 10.8932 5.89225 10.8592L5.8857 10.8568C5.73635 10.804 5.3109 10.6536 5.07205 10.5521C4.58837 10.3466 3.94062 10.0311 3.2902 9.59205C2.00137 8.7221 0.625 7.3112 0.625 5.25C0.625 3.8855 1.17823 2.8315 2.15704 2.13235Z" fill="currentColor"/>
                                </svg>
                          <span className="tw-dropdown__item-text">Contact</span>
                        </Link>
                    </div>
                  </div>
                  <Link href="#" className="tw-header__nav-item" tabIndex={0}>Pricing</Link>
                </nav>
              </div>
              <div className="tw-header__actions">
                <button className="tw-cta tw-cta--mini tw-header__cta">Login</button>
                <Link href="/dashboard" className="tw-cta tw-cta--mini">Dashboard</Link>
              </div>
              
              {/* Mobile Burger Menu Button */}
              <button
                ref={burgerButtonRef}
                className={`tw-header__burger ${isMobileMenuOpen ? 'tw-header__burger--open' : ''}`}
                onClick={toggleMobileMenu}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMobileMenu();
                  }
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="tw-header__burger-line"></span>
                <span className="tw-header__burger-line"></span>
                <span className="tw-header__burger-line"></span>
              </button>
            </div>
            
            {/* Mobile Navigation Menu */}
            <div 
              ref={mobileMenuRef}
              id="mobile-menu"
              className={`tw-header__mobile-menu ${isMobileMenuOpen ? 'tw-header__mobile-menu--open' : ''}`}
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Mobile Menu Header */}
              <div className="tw-header__mobile-header">
                <Link href="/" className="tw-header__mobile-logo" onClick={closeMobileMenu}>
                  <svg width="31" height="17" viewBox="0 0 31 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_1242_10_mobile)">
                    <path d="M4 0H27V4.63636H4V0Z" fill="url(#paint0_linear_1242_10_mobile)"/>
                    <path d="M10.1333 17V7.72727H19.3333L10.1333 17Z" fill="url(#paint1_linear_1242_10_mobile)"/>
                    <path d="M16.2667 17V7.72727H23.9333L16.2667 17Z" fill="url(#paint2_linear_1242_10_mobile)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_1242_10_mobile" x="0" y="0" width="31" height="17" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1242_10_mobile"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1242_10_mobile" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_1242_10_mobile" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1242_10_mobile" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_1242_10_mobile" x1="15.5" y1="0" x2="15.5" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </Link>
                <button
                  className="tw-header__mobile-close"
                  onClick={closeMobileMenu}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      closeMobileMenu();
                    }
                  }}
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <nav className="tw-header__mobile-nav">
                {/* Features Dropdown for Mobile */}
                <div className="tw-header__mobile-nav-section">
                  <button
                    className="tw-header__mobile-nav-title"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsDropdownOpen(!isDropdownOpen);
                      }
                    }}
                    aria-expanded={isDropdownOpen}
                    aria-controls="mobile-features-dropdown"
                  >
                    Features
                    <svg 
                      className={`tw-header__mobile-nav-arrow ${isDropdownOpen ? 'tw-header__mobile-nav-arrow--open' : ''}`}
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div 
                    id="mobile-features-dropdown"
                    className={`tw-header__mobile-dropdown ${isDropdownOpen ? 'tw-header__mobile-dropdown--open' : ''}`}
                  >
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1214_90)">
                        <path d="M11.2495 5H4.49811L4.48047 11.25H9.24952C10.3541 11.25 11.2495 10.3545 11.2495 9.25V5Z" fill="currentColor"/>
                        <path d="M3.98162 11.25L3.48095 11.2486L3.49858 5H0.75V9.25C0.75 10.3545 1.64543 11.25 2.75 11.25H3.98162Z" fill="currentColor"/>
                        <path d="M2.75 0.75C1.64543 0.75 0.75 1.64543 0.75 2.75V4H11.25V2.75C11.25 1.64543 10.3546 0.75 9.25 0.75H2.75Z" fill="currentColor"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1214_90">
                        <rect width="12" height="12" fill="currentColor"/>
                        </clipPath>
                        </defs>
                      </svg>
                      <span>Builder</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.75" y="0.75" width="8.5" height="8.5" rx="2.25" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span>Themes</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.99998 10C4.30832 10 3.65832 9.86883 3.04999 9.60649C2.44166 9.34415 1.91249 8.98843 1.46249 8.53933C1.0125 8.09022 0.656331 7.56171 0.393999 6.95381C0.131666 6.3459 0.000333332 5.69671 0 5.00624C0 4.38202 0.120833 3.77029 0.362499 3.17104C0.604164 2.57179 0.941663 2.03695 1.375 1.56654C1.80833 1.09613 2.32916 0.717436 2.93749 0.430462C3.54582 0.143487 4.21249 0 4.93748 0C5.11248 0 5.29165 0.00832296 5.47498 0.0249688C5.65831 0.0416147 5.84581 0.0707449 6.03748 0.11236C5.96248 0.486891 5.98748 0.840616 6.11248 1.17353C6.23748 1.50645 6.42498 1.7831 6.67498 2.0035C6.92498 2.22389 7.22297 2.37586 7.56897 2.45943C7.91497 2.54299 8.27114 2.52218 8.63747 2.397C8.4208 2.88806 8.45214 3.3583 8.73147 3.80774C9.0108 4.25718 9.4253 4.49022 9.97497 4.50687C9.9833 4.59842 9.98963 4.68365 9.99397 4.76255C9.9983 4.84145 10.0003 4.92684 9.99996 5.01873C9.99996 5.70121 9.86863 6.34407 9.60597 6.94732C9.3433 7.55056 8.98714 8.07907 8.53747 8.53283C8.0878 8.9866 7.55864 9.34449 6.94998 9.60649C6.34131 9.8685 5.69131 9.99967 4.99998 10ZM4.24999 4.00749C4.45832 4.00749 4.63548 3.93475 4.78148 3.78926C4.92748 3.64378 5.00032 3.46683 4.99998 3.25843C4.99965 3.05002 4.92682 2.87324 4.78148 2.72809C4.63615 2.58294 4.45898 2.51003 4.24999 2.50936C4.04099 2.5087 3.86399 2.58161 3.71899 2.72809C3.57399 2.87457 3.50099 3.05135 3.49999 3.25843C3.49899 3.4655 3.57199 3.64245 3.71899 3.78926C3.86599 3.93608 4.04299 4.00882 4.24999 4.00749ZM3.24999 6.50437C3.45832 6.50437 3.63549 6.43163 3.78149 6.28614C3.92749 6.14066 4.00032 5.96371 3.99999 5.75531C3.99965 5.5469 3.92682 5.37012 3.78149 5.22497C3.63615 5.07982 3.45899 5.00691 3.24999 5.00624C3.04099 5.00558 2.86399 5.07849 2.71899 5.22497C2.57399 5.37145 2.50099 5.54823 2.49999 5.75531C2.49899 5.96238 2.57199 6.13933 2.71899 6.28614C2.86599 6.43296 3.04299 6.5057 3.24999 6.50437ZM6.49998 7.00375C6.64164 7.00375 6.76048 6.95581 6.85648 6.85992C6.95248 6.76404 7.00031 6.64553 6.99998 6.50437C6.99964 6.36321 6.95164 6.24469 6.85598 6.14881C6.76031 6.05293 6.64164 6.00499 6.49998 6.00499C6.35831 6.00499 6.23965 6.05293 6.14398 6.14881C6.04831 6.24469 6.00031 6.36321 5.99998 6.50437C5.99965 6.64553 6.04765 6.76421 6.14398 6.86042C6.24031 6.95664 6.35898 7.00441 6.49998 7.00375Z" fill="white"/>
                      </svg>
                      <span>Scanner</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1214_110)">
                        <path d="M5.1594 1.5926C5.42385 1.53891 5.59475 1.28099 5.54105 1.01652C5.48735 0.752052 5.22945 0.581177 4.96498 0.634862C2.48885 1.13749 0.625 3.32588 0.625 5.95066C0.625 8.94646 3.05355 11.375 6.0493 11.375C8.6741 11.375 10.8625 9.51116 11.3652 7.03501C11.4188 6.77056 11.248 6.51266 10.9835 6.45896C10.719 6.40526 10.4611 6.57616 10.4074 6.84061C10.2828 7.45461 10.0316 8.02261 9.6822 8.51631C9.666 8.53926 9.64355 8.55706 9.61725 8.56691C9.54635 8.59356 9.47155 8.61561 9.3929 8.63286C8.93855 8.72091 8.46495 8.64456 8.30275 8.59966C8.05415 8.54196 7.75545 8.44191 7.47625 8.31961C7.097 8.17646 6.53115 7.81091 6.2875 7.63771L6.2849 7.63586C6.1833 7.56496 5.96005 7.39886 5.95775 7.39716C5.85565 7.32106 5.7495 7.24201 5.64605 7.16926C5.17715 6.82596 4.5696 6.52466 4.32425 6.41606C3.94455 6.25631 3.59986 6.16616 3.28337 6.12926C3.01047 6.07686 2.72042 6.10416 2.48597 6.14806C2.24332 6.19351 2.02625 6.26336 1.8917 6.31811C1.86875 6.32721 1.84463 6.33716 1.81973 6.34771C1.72502 6.38801 1.61681 6.32731 1.61056 6.22461C1.60506 6.13401 1.60227 6.04266 1.60227 5.95066C1.60227 3.7998 3.12974 2.00459 5.1594 1.5926Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.2503 0.625C7.0301 0.625 5.8589 1.33302 5.3661 2.46412C4.90532 3.52179 5.15955 4.42612 5.66975 5.18326C6.08235 5.79556 6.6842 6.34181 7.2121 6.82092C7.3119 6.91147 7.40905 6.99962 7.50175 7.08537L7.50255 7.08617C7.7061 7.27327 7.97445 7.37502 8.2503 7.37502C8.5261 7.37502 8.7945 7.27326 8.99805 7.08611C9.08585 7.00541 9.1775 6.92251 9.27155 6.83741C9.8049 6.35511 10.4149 5.80356 10.8318 5.18351C11.3414 4.42566 11.5947 3.52049 11.1345 2.46412C10.6417 1.33302 9.4705 0.625 8.2503 0.625ZM8.25 2.5C8.8713 2.5 9.375 3.00368 9.375 3.625C9.375 4.24632 8.8713 4.75 8.25 4.75C7.6287 4.75 7.125 4.24632 7.125 3.625C7.125 3.00368 7.6287 2.5 8.25 2.5Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1214_110">
                        <rect width="12" height="12" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                      <span>Comply Map</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.625 2.979C9.625 3.73839 9.00941 4.354 8.25 4.354C7.49059 4.354 6.875 3.73839 6.875 2.979C6.875 2.21961 7.49059 1.604 8.25 1.604C9.00941 1.604 9.625 2.21961 9.625 2.979Z" stroke="currentColor" strokeLinejoin="round"/>
                        <path d="M4.125 5.5C4.125 6.25941 3.50939 6.875 2.75 6.875C1.99061 6.875 1.375 6.25941 1.375 5.5C1.375 4.74059 1.99061 4.125 2.75 4.125C3.50939 4.125 4.125 4.74059 4.125 5.5Z" stroke="currentColor" strokeLinejoin="round"/>
                        <path d="M9.625 8.021C9.625 8.78041 9.00941 9.396 8.25 9.396C7.49059 9.396 6.875 8.78041 6.875 8.021C6.875 7.26158 7.49059 6.646 8.25 6.646C9.00941 6.646 9.625 7.26158 9.625 8.021Z" stroke="currentColor" strokeLinejoin="round"/>
                        <path d="M3.89453 4.81227L6.8737 3.4375M3.89453 5.95833L6.8737 7.3331" stroke="currentColor" strokeLinejoin="round"/>
                      </svg>
                      <span>Integrations</span>
                    </Link>
                  </div>
                </div>

                {/* Useful Dropdown for Mobile */}
                <div className="tw-header__mobile-nav-section">
                  <button
                    className="tw-header__mobile-nav-title"
                    onClick={() => setIsUsefulDropdownOpen(!isUsefulDropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsUsefulDropdownOpen(!isUsefulDropdownOpen);
                      }
                    }}
                    aria-expanded={isUsefulDropdownOpen}
                    aria-controls="mobile-useful-dropdown"
                  >
                    Useful
                    <svg 
                      className={`tw-header__mobile-nav-arrow ${isUsefulDropdownOpen ? 'tw-header__mobile-nav-arrow--open' : ''}`}
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div 
                    id="mobile-useful-dropdown"
                    className={`tw-header__mobile-dropdown ${isUsefulDropdownOpen ? 'tw-header__mobile-dropdown--open' : ''}`}
                  >
                    <Link href="/changelog" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.755 7V1.357L1.872 0.7H2.934V7H1.755ZM0.423 2.689V1.573C0.573 1.585 0.735 1.549 0.909 1.465C1.083 1.375 1.254 1.261 1.422 1.123C1.596 0.979 1.746 0.835 1.872 0.691L2.655 1.456C2.439 1.696 2.211 1.915 1.971 2.113C1.731 2.305 1.482 2.455 1.224 2.563C0.972 2.671 0.705 2.713 0.423 2.689ZM4.64288 7.135C4.44488 7.135 4.27388 7.063 4.12988 6.919C3.99188 6.775 3.92288 6.604 3.92288 6.406C3.92288 6.214 3.99188 6.046 4.12988 5.902C4.27388 5.758 4.44488 5.686 4.64288 5.686C4.84088 5.686 5.00888 5.758 5.14688 5.902C5.29088 6.046 5.36288 6.214 5.36288 6.406C5.36288 6.604 5.29088 6.775 5.14688 6.919C5.00888 7.063 4.84088 7.135 4.64288 7.135ZM8.4053 7.108C7.8953 7.108 7.4453 6.97 7.0553 6.694C6.6653 6.412 6.3593 6.028 6.1373 5.542C5.9153 5.05 5.8043 4.486 5.8043 3.85C5.8043 3.214 5.9153 2.653 6.1373 2.167C6.3593 1.675 6.6623 1.291 7.0463 1.015C7.4363 0.733 7.8863 0.592 8.3963 0.592C8.9063 0.592 9.3563 0.733 9.7463 1.015C10.1423 1.291 10.4513 1.675 10.6733 2.167C10.8953 2.653 11.0063 3.214 11.0063 3.85C11.0063 4.486 10.8953 5.05 10.6733 5.542C10.4513 6.028 10.1453 6.412 9.7553 6.694C9.3653 6.97 8.9153 7.108 8.4053 7.108ZM8.4053 5.992C8.6753 5.992 8.9153 5.902 9.1253 5.722C9.3413 5.536 9.5093 5.284 9.6293 4.966C9.7493 4.642 9.8093 4.27 9.8093 3.85C9.8093 3.43 9.7493 3.058 9.6293 2.734C9.5093 2.41 9.3413 2.158 9.1253 1.978C8.9153 1.792 8.6723 1.699 8.3963 1.699C8.1263 1.699 7.8863 1.792 7.6763 1.978C7.4663 2.158 7.3013 2.41 7.1813 2.734C7.0673 3.058 7.0103 3.43 7.0103 3.85C7.0103 4.27 7.0673 4.642 7.1813 4.966C7.3013 5.284 7.4663 5.536 7.6763 5.722C7.8923 5.902 8.1353 5.992 8.4053 5.992Z" fill="currentColor"/>
                      </svg>
                      <span>Changelog</span>
                    </Link>
                    <Link href="/roadmap" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1214_166)">
                        <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M3.05928 4.01744C3.00801 3.7548 2.75166 3.58309 2.48671 3.63391C2.05234 3.71724 1.67623 3.86604 1.36146 4.14343C0.959841 4.49735 0.783516 4.94944 0.702056 5.4834C0.624966 5.9887 0.624981 6.6281 0.625001 7.4072V7.48435C0.624981 8.26345 0.624966 8.9029 0.702056 9.4082C0.783516 9.94215 0.959841 10.3943 1.36146 10.7482C1.75482 11.0948 2.24331 11.2402 2.82007 11.3085C3.38136 11.375 4.09647 11.375 4.99045 11.375H7.00955C7.90355 11.375 8.61865 11.375 9.17995 11.3085C9.7567 11.2402 10.2452 11.0948 10.6386 10.7482C11.0402 10.3943 11.2165 9.94215 11.298 9.4082C11.3751 8.90285 11.375 8.26345 11.375 7.4843V7.4072C11.375 6.6281 11.3751 5.9887 11.298 5.4834C11.2165 4.94944 11.0402 4.49735 10.6386 4.14343C10.3238 3.86604 9.94765 3.71724 9.5133 3.63391C9.24835 3.58309 8.992 3.7548 8.9407 4.01744C8.88945 4.28007 9.06265 4.53419 9.3276 4.58501C9.65015 4.64688 9.84505 4.74039 9.98925 4.86743C10.1601 5.018 10.27 5.2241 10.3317 5.62825C10.3964 6.0527 10.3978 6.6185 10.3978 7.4458C10.3978 8.2731 10.3964 8.83885 10.3317 9.2633C10.27 9.66745 10.1601 9.8736 9.98925 10.0242C9.8101 10.182 9.5517 10.2889 9.06395 10.3466C8.5675 10.4055 7.91095 10.4063 6.97725 10.4063H5.02275C4.08903 10.4063 3.43252 10.4055 2.93605 10.3466C2.44832 10.2889 2.18988 10.182 2.01077 10.0242C1.83991 9.8736 1.73 9.66745 1.66834 9.2633C1.60358 8.83885 1.60228 8.2731 1.60228 7.4458C1.60228 6.6185 1.60358 6.0527 1.66834 5.62825C1.73 5.2241 1.83991 5.018 2.01077 4.86743C2.15493 4.74039 2.34986 4.64688 2.67238 4.58501C2.93733 4.53419 3.11056 4.28007 3.05928 4.01744ZM3 7C2.72386 7 2.5 7.22385 2.5 7.5C2.5 7.77615 2.72386 8 3 8H3.5C3.77614 8 4 7.77615 4 7.5C4 7.22385 3.77614 7 3.5 7H3ZM5.75 7C5.47385 7 5.25 7.22385 5.25 7.5C5.25 7.77615 5.47385 8 5.75 8H6.25C6.52615 8 6.75 7.77615 6.75 7.5C6.75 7.22385 6.52615 7 6.25 7H5.75ZM8.5 7C8.22385 7 8 7.22385 8 7.5C8 7.77615 8.22385 8 8.5 8H9C9.27615 8 9.5 7.77615 9.5 7.5C9.5 7.22385 9.27615 7 9 7H8.5Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.99608 0.625C4.68088 0.625 3.62109 1.7009 3.62109 3.02016C3.62109 3.77959 3.92831 4.37361 4.49739 4.8779C4.81963 5.16345 5.22308 5.6527 5.46163 6.04395C5.55738 6.201 5.73278 6.375 5.99278 6.375C6.24858 6.375 6.42498 6.2059 6.52428 6.0539C6.78398 5.6565 7.17698 5.15955 7.49483 4.8779C8.06388 4.37361 8.37108 3.77959 8.37108 3.02016C8.37108 1.7009 7.31133 0.625 5.99608 0.625ZM5.99218 2.125C5.51108 2.125 5.12108 2.51675 5.12108 3C5.12108 3.48325 5.51108 3.875 5.99218 3.875H6.00003C6.48108 3.875 6.87108 3.48325 6.87108 3C6.87108 2.51675 6.48108 2.125 6.00003 2.125H5.99218Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1214_166">
                        <rect width="12" height="12" fill="currentColor"/>
                        </clipPath>
                        </defs>
                      </svg>
                      <span>Roadmap</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.2502 4.375C10.4574 4.375 10.6252 4.5429 10.6252 4.75V8.1729L11.3125 9.7738C11.5314 10.2838 11.153 10.875 10.586 10.875H9.9145C9.34745 10.875 8.96905 10.2838 9.18795 9.7738L9.8752 8.1729V4.75C9.8752 4.5429 10.0431 4.375 10.2502 4.375Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.88615 1.1333C5.96235 1.12224 6.03765 1.12224 6.11385 1.1333C6.89485 1.24662 7.845 1.62778 8.71265 2.04539C9.5891 2.46723 10.4167 2.94385 10.9623 3.27297C11.5126 3.60487 11.5126 4.39513 10.9623 4.72703C10.4167 5.05615 9.5891 5.53275 8.71265 5.9546C7.845 6.3722 6.89485 6.7534 6.11385 6.8667C6.03765 6.87775 5.96235 6.87775 5.88615 6.8667C5.10515 6.7534 4.15501 6.3722 3.28735 5.9546C2.41092 5.53275 1.5833 5.05615 1.03767 4.72703C0.487443 4.39513 0.487443 3.60487 1.03767 3.27297C1.5833 2.94385 2.41092 2.46723 3.28735 2.04539C4.15501 1.62778 5.10515 1.24662 5.88615 1.1333Z" fill="white"/>
                        <path d="M2.79297 6.54883L3.12843 8.56158C3.14362 8.65273 3.19225 8.73528 3.2644 8.79303L3.26485 8.79338L3.2661 8.79438L3.26998 8.79743L3.2831 8.80768C3.29421 8.81628 3.30998 8.82833 3.33012 8.84338C3.37037 8.87343 3.42819 8.91543 3.50109 8.96543C3.6466 9.06523 3.85391 9.19788 4.1031 9.33078C4.59294 9.59203 5.28275 9.87493 5.99835 9.87493C6.7139 9.87493 7.4037 9.59203 7.89355 9.33078C8.14275 9.19788 8.35005 9.06523 8.49555 8.96543C8.56845 8.91543 8.6263 8.87343 8.66655 8.84338C8.68665 8.82833 8.70245 8.81628 8.71355 8.80768L8.7267 8.79743L8.73055 8.79438L8.7318 8.79338L8.7326 8.79273C8.80475 8.73503 8.85305 8.65273 8.86825 8.56158L9.2037 6.54883C9.14815 6.57618 9.0923 6.60333 9.03625 6.63033C8.15665 7.05368 7.12035 7.47818 6.2199 7.60883C6.07225 7.63028 5.92445 7.63028 5.7768 7.60883C4.87636 7.47818 3.84005 7.05368 2.96044 6.63033C2.90438 6.60333 2.84854 6.57613 2.79297 6.54883Z" fill="currentColor"/>
                      </svg>
                      <span>Academy</span>
                    </Link>
                    <Link href="#" className="tw-header__mobile-dropdown-item" onClick={closeMobileMenu}>
                      <svg className="tw-header__mobile-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.15704 2.13235C3.11855 1.44555 4.45573 1.125 6 1.125C7.54425 1.125 8.88145 1.44555 9.84295 2.13235C10.8217 2.8315 11.375 3.8855 11.375 5.25C11.375 6.6145 10.8217 7.6685 9.84295 8.36765C8.96015 8.9982 7.7607 9.32005 6.375 9.36855V10.5C6.375 10.6186 6.31895 10.7301 6.22385 10.8008C6.12875 10.8716 6.0058 10.8932 5.89225 10.8592L5.8857 10.8568C5.73635 10.804 5.3109 10.6536 5.07205 10.5521C4.58837 10.3466 3.94062 10.0311 3.2902 9.59205C2.00137 8.7221 0.625 7.3112 0.625 5.25C0.625 3.8855 1.17823 2.8315 2.15704 2.13235Z" fill="currentColor"/>
                      </svg>
                      <span>Contact</span>
                    </Link>
                  </div>
                </div>

                {/* Pricing Link */}
                <Link href="#" className="tw-header__mobile-nav-item" onClick={closeMobileMenu}>
                  Pricing
                </Link>
              </nav>

              {/* Mobile Actions */}
              <div className="tw-header__mobile-actions">
                <button 
                  className="tw-header__mobile-cta" 
                  onClick={closeMobileMenu}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      closeMobileMenu();
                    }
                  }}
                >
                  Login
                </button>
                <Link 
                  href="/dashboard" 
                  className="tw-header__mobile-cta tw-header__mobile-cta--primary" 
                  onClick={closeMobileMenu}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      closeMobileMenu();
                    }
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </div>
      </div>
    </header>
  );
};

export default Header;
