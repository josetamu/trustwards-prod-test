'use client'

import './Roadmap.css'
import Header from '../websiteComponents/Header/Header'
import Footer from '../websiteComponents/Footer/Footer'

function Roadmap() {
  return (
    <main className="tw-main">
      <div className="tw-wrapper" id="main-content">
        <Header />
        
        <div className="tw-roadmap">
          <div className="tw-roadmap__wrapper">
            <div className="tw-roadmap__header">
              <h1 className="tw-roadmap__title">Roadmap</h1>
              <p className="tw-roadmap__subtitle">
                Discover what's coming next to Trustwards. We're constantly working on new features and improvements.
              </p>
            </div>

            <div className="tw-roadmap__content">
              {/* Q1 2025 */}
              <div className="tw-roadmap__quarter">
                <div className="tw-roadmap__quarter-header">
                  <h2 className="tw-roadmap__quarter-title">Q1 2025</h2>
                  <span className="tw-roadmap__quarter-status tw-roadmap__quarter-status--in-progress">In Progress</span>
                </div>
                <div className="tw-roadmap__features">
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">AI-Powered Theme Generator</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--in-progress">In Development</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Generate custom themes automatically using AI based on your website's design and branding.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Advanced Analytics Dashboard</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Comprehensive analytics to track consent rates, user behavior, and compliance metrics.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Mobile App</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Native mobile app for managing your consent banners and viewing analytics on the go.
                    </p>
                  </div>
                </div>
              </div>

              {/* Q2 2025 */}
              <div className="tw-roadmap__quarter">
                <div className="tw-roadmap__quarter-header">
                  <h2 className="tw-roadmap__quarter-title">Q2 2025</h2>
                  <span className="tw-roadmap__quarter-status tw-roadmap__quarter-status--planned">Planned</span>
                </div>
                <div className="tw-roadmap__features">
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Multi-Site Management</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Manage multiple websites from a single dashboard with centralized settings and analytics.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Advanced Integrations</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Deep integrations with popular platforms like Shopify, WordPress, and custom CMS solutions.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">White-Label Solution</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Complete white-label solution for agencies and resellers to offer under their own brand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Q3 2025 */}
              <div className="tw-roadmap__quarter">
                <div className="tw-roadmap__quarter-header">
                  <h2 className="tw-roadmap__quarter-title">Q3 2025</h2>
                  <span className="tw-roadmap__quarter-status tw-roadmap__quarter-status--planned">Planned</span>
                </div>
                <div className="tw-roadmap__features">
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Blockchain Consent Verification</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Immutable consent records using blockchain technology for enhanced compliance verification.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Advanced A/B Testing</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--planned">Planned</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Built-in A/B testing tools to optimize consent rates and user experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed Features */}
              <div className="tw-roadmap__completed">
                <h2 className="tw-roadmap__completed-title">Recently Completed</h2>
                <div className="tw-roadmap__features">
                  <div className="tw-roadmap__feature tw-roadmap__feature--completed">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Theme Builder v2.0</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--completed">Completed</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Complete redesign of the theme builder with drag-and-drop functionality and real-time preview.
                    </p>
                  </div>
                  
                  <div className="tw-roadmap__feature tw-roadmap__feature--completed">
                    <div className="tw-roadmap__feature-header">
                      <h3 className="tw-roadmap__feature-title">Multi-Language Support</h3>
                      <span className="tw-roadmap__feature-status tw-roadmap__feature-status--completed">Completed</span>
                    </div>
                    <p className="tw-roadmap__feature-description">
                      Support for 15+ languages with automatic translation and localization features.
                    </p>
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

export default Roadmap;
