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

      <footer className="tw-footer">
        <div className="tw-footer__separator"></div>
        
        <div className="tw-footer__content">
          <div className="tw-footer__left">
            <div className="tw-footer__logo">
              <div className="tw-footer__logo-icon"></div>
            </div>
            <div className="tw-footer__cta">
              <p className="tw-footer__cta-text">Join Trustwards today.</p>
              <p className="tw-footer__cta-subtext">No credit card required.</p>
              <button className="tw-footer__cta-button">Get started</button>
            </div>
          </div>

          <div className="tw-footer__navigation">
            <div className="tw-footer__nav-column">
              <h3 className="tw-footer__nav-title">Features</h3>
              <ul className="tw-footer__nav-list">
                <li><Link href="#" className="tw-footer__nav-link">Builder</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Themes</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Scanner</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Comply Map</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Integrations</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Localization</Link></li>
              </ul>
            </div>

            <div className="tw-footer__nav-column">
              <h3 className="tw-footer__nav-title">Useful</h3>
              <ul className="tw-footer__nav-list">
                <li><Link href="#" className="tw-footer__nav-link">Pricing</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Changelog</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Roadmap</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Academy</Link></li>
              </ul>
            </div>

            <div className="tw-footer__nav-column">
              <h3 className="tw-footer__nav-title">Community</h3>
              <ul className="tw-footer__nav-list">
                <li><Link href="#" className="tw-footer__nav-link">Blog</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Affiliates</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Facebook</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">YouTube</Link></li>
              </ul>
            </div>

            <div className="tw-footer__nav-column">
              <h3 className="tw-footer__nav-title">Connect</h3>
              <ul className="tw-footer__nav-list">
                <li><Link href="#" className="tw-footer__nav-link">Sales team</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Contact</Link></li>
              </ul>
            </div>

            <div className="tw-footer__nav-column">
              <h3 className="tw-footer__nav-title">Legal</h3>
              <ul className="tw-footer__nav-list">
                <li><Link href="#" className="tw-footer__nav-link">Terms & conditions</Link></li>
                <li><Link href="#" className="tw-footer__nav-link">Privacy policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="tw-footer__bottom">
          <p className="tw-footer__copyright">© Trustwards 2025. All rights reserved</p>
          <div className="tw-footer__social">
            <Link href="#" className="tw-footer__social-link">f</Link>
            <Link href="#" className="tw-footer__social-link">𝕏</Link>
            <Link href="#" className="tw-footer__social-link">▶</Link>
            <Link href="#" className="tw-footer__social-link">in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Web