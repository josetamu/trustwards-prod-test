import React, { useState } from 'react';
import Banner from './Banner';
import './Header.css';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`tw-header ${className}`}>
      <Banner>
        <span className="tw-banner__text">
          🎉 ¡Nueva funcionalidad disponible! Descubre las últimas mejoras.
        </span>
      </Banner>
      
      <div className="tw-header__nav">
        <div className="tw-header__container">
          <div className="tw-header__logo">
            <img src="/assets/logo-light-mode.svg" alt="Trustwards" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="tw-header__nav-desktop">
            <ul className="tw-header__nav-list">
              <li><a href="#inicio" className="tw-header__nav-link">Inicio</a></li>
              <li><a href="#servicios" className="tw-header__nav-link">Servicios</a></li>
              <li><a href="#precios" className="tw-header__nav-link">Precios</a></li>
              <li><a href="#contacto" className="tw-header__nav-link">Contacto</a></li>
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="tw-header__cta-desktop">
            <a href="#demo" className="tw-cta">Ver Demo</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="tw-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`tw-header__nav-mobile ${isMobileMenuOpen ? 'tw-header__nav-mobile--open' : ''}`}>
          <ul className="tw-header__nav-mobile-list">
            <li><a href="#inicio" className="tw-header__nav-mobile-link">Inicio</a></li>
            <li><a href="#servicios" className="tw-header__nav-mobile-link">Servicios</a></li>
            <li><a href="#precios" className="tw-header__nav-mobile-link">Precios</a></li>
            <li><a href="#contacto" className="tw-header__nav-mobile-link">Contacto</a></li>
            <li><a href="#demo" className="tw-cta tw-cta--mobile">Ver Demo</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
