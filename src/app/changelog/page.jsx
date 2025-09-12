'use client'

import './Changelog.css'
import Header from '../websiteComponents/Header/Header'
import Footer from '../websiteComponents/Footer/Footer'

function Changelog() {
  return (
    <main className="tw-main">
      <div className="tw-wrapper" id="main-content">
        <Header />
        
        <div className="tw-changelog">
          <div className="tw-changelog__wrapper">
            <div className="tw-changelog__header">
              <h1 className="tw-changelog__title">Changelog</h1>
              <p className="tw-changelog__subtitle">
                Stay updated with the latest features, improvements, and fixes we're bringing to Trustwards.
              </p>
            </div>

            <div className="tw-changelog__content">
              {/* Version 2.1.0 */}
              <div className="tw-changelog__version">
                <div className="tw-changelog__version-header">
                  <h2 className="tw-changelog__version-title">Version 2.1.0</h2>
                  <span className="tw-changelog__version-date">December 15, 2024</span>
                </div>
                <div className="tw-changelog__version-content">
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">🚀 New Features</h3>
                    <ul className="tw-changelog__list">
                      <li>Advanced theme builder with drag-and-drop functionality</li>
                      <li>Real-time preview for all customizations</li>
                      <li>Multi-language support for 15+ languages</li>
                      <li>Dark mode toggle for all themes</li>
                      <li>Custom CSS injection for advanced users</li>
                    </ul>
                  </div>
                  
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">✨ Improvements</h3>
                    <ul className="tw-changelog__list">
                      <li>50% faster loading times across all components</li>
                      <li>Enhanced mobile responsiveness</li>
                      <li>Improved accessibility compliance (WCAG 2.1 AA)</li>
                      <li>Better error handling and user feedback</li>
                      <li>Optimized bundle size reduction</li>
                    </ul>
                  </div>
                  
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">🐛 Bug Fixes</h3>
                    <ul className="tw-changelog__list">
                      <li>Fixed newsletter positioning on mobile devices</li>
                      <li>Resolved marquee animation stuttering</li>
                      <li>Fixed underline hover effects in footer</li>
                      <li>Corrected form validation messages</li>
                      <li>Fixed theme switching edge cases</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Version 2.0.5 */}
              <div className="tw-changelog__version">
                <div className="tw-changelog__version-header">
                  <h2 className="tw-changelog__version-title">Version 2.0.5</h2>
                  <span className="tw-changelog__version-date">November 28, 2024</span>
                </div>
                <div className="tw-changelog__version-content">
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">✨ Improvements</h3>
                    <ul className="tw-changelog__list">
                      <li>Enhanced newsletter subscription flow</li>
                      <li>Improved cookie scanning accuracy</li>
                      <li>Better integration with popular CMS platforms</li>
                    </ul>
                  </div>
                  
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">🐛 Bug Fixes</h3>
                    <ul className="tw-changelog__list">
                      <li>Fixed responsive layout issues on tablets</li>
                      <li>Resolved JavaScript errors in older browsers</li>
                      <li>Fixed theme preview not updating correctly</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Version 2.0.0 */}
              <div className="tw-changelog__version">
                <div className="tw-changelog__version-header">
                  <h2 className="tw-changelog__version-title">Version 2.0.0</h2>
                  <span className="tw-changelog__version-date">October 15, 2024</span>
                </div>
                <div className="tw-changelog__version-content">
                  <div className="tw-changelog__section">
                    <h3 className="tw-changelog__section-title">🎉 Major Release</h3>
                    <ul className="tw-changelog__list">
                      <li>Complete UI/UX redesign</li>
                      <li>New component-based architecture</li>
                      <li>Advanced analytics dashboard</li>
                      <li>GDPR compliance automation</li>
                      <li>API v2 with enhanced endpoints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default Changelog;
