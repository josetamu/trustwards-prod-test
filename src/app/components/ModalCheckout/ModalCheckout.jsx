import './ModalCheckout.css';
import '../OffcanvasPricing/OffcanvasPricing.css';
import { Tooltip } from '../tooltip/Tooltip';

import { useState } from 'react';

export const ModalCheckout = ({ currentPlan, selectedPlan}) => {
    const [activeTooltip, setActiveTooltip] = useState(null);

    const renderFeatureTextModal = (text, planName, featureIndex) => {
        const keywords = {
            scans: 'Security scans to check your site\'s compliance',
            themes: 'Pre-designed templates for your cookies',
            watermark: 'Remove "Powered by Trustwards" branding'
        };

        let keyword = null;
        let parts = [text];

        if (text.includes('scans')) {
            keyword = 'scans';
            parts = text.split(/(scans)/gi);
        } else if (text.includes('themes')) {
            keyword = 'themes';
            parts = text.split(/(themes)/gi);
        } else if (text.includes('Watermark')) {
            keyword = 'watermark';
            parts = text.split(/(Watermark)/gi);
        }

        if (!keyword) return text;

        const tooltipId = `${planName}-${featureIndex}-${keyword}`;

        return parts.map((part, index) => {
            if (part.toLowerCase() === keyword.toLowerCase()) {
                return (
                    <span
                        key={index}
                        className="offcanvas-pricing__content-plan-features-text--keyword"
                        onMouseEnter={() => setActiveTooltip(tooltipId)}
                        onMouseLeave={() => setActiveTooltip(null)}
                    >
                        {part}
                        <Tooltip
                            message={keywords[keyword]}
                            open={activeTooltip === tooltipId}
                            animationType="SCALE_TOP"
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        />
                    </span>
                );
            }
            return part;
        });
    };
    return (
        <div className="modal-checkout">
           <div className="modal-checkout__main">
                <div className="modal-checkout__main-header">
                    <input type="text" className="modal-checkout__main-card" placeholder="Card Number" />
                </div>
                <div className="modal-checkout__main-content">
                <span className="modal-checkout__main-content-title">
                    Stripe checkout
                </span>
                </div>
           </div>
           <div className="modal-checkout__divider"></div>
           <div className="modal-checkout__aside">
                <span className="modal-checkout__aside-title">
                    Upgrade {currentPlan} to {selectedPlan.name}
                </span>
                <div className="offcanvas-pricing__content-plan" key={selectedPlan.name}>
                <span className="modal-checkout__aside-title">
                    Features:
                </span>
                {selectedPlan.lifetimeFeatures && (
                            <>
                                <div className="offcanvas-pricing__content-plan-features">
                                    <span className="offcanvas-pricing__content-plan-features-title">Lifetime deal</span>
                                    {selectedPlan.lifetimeFeatures.map((feature, index) => (
                                        
                                        <div className="offcanvas-pricing__content-plan-features-item" key={`${selectedPlan.name}-lifetime-${index}`}>
                                            <span className="offcanvas-pricing__content-plan-features-icon offcanvas-pricing__content-plan-features-icon--pro">
                                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                                </svg>
                                            </span>
                                            <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                                {renderFeatureTextModal(feature, selectedPlan.name, index)}
                                            </span>
                                        </div>
                                        
                                    ))}
                                </div>
                                <div className="offcanvas-pricing__conent-divider"></div>
                            </>
                        )}
                        <div  className="offcanvas-pricing__content-plan-features">
                            <span className="offcanvas-pricing__content-plan-features-title">Site</span>
                                {selectedPlan.featuresSites.map((feature, index) => (
                                    <div className="offcanvas-pricing__content-plan-features-item" key={`${selectedPlan.name}-site-${index}`}>
                                        <span className={`offcanvas-pricing__content-plan-features-icon ${selectedPlan.name !== 'Basic' ? 'offcanvas-pricing__content-plan-features-icon--pro' : ''}`}>
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>

                                        </span>
                                        <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                            {renderFeatureTextModal(feature, selectedPlan.name, index)}
                                        </span>
                                    </div>
                               
                                    
                                ))}
                        </div>
                        <div className="offcanvas-pricing__conent-divider"></div>   
                        <div className="offcanvas-pricing__content-plan-features">
                        <span className="offcanvas-pricing__content-plan-features-title">Builder</span>
                           {selectedPlan.featuresBuilder.map((feature, index) => (

                                <div className="offcanvas-pricing__content-plan-features-item" key={`${selectedPlan.name}-builder-${index}`}>
                                    <span className={`offcanvas-pricing__content-plan-features-icon ${selectedPlan.name !== 'Basic' ? 'offcanvas-pricing__content-plan-features-icon--pro' : ''}`}>
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                        {renderFeatureTextModal(feature, selectedPlan.name, index)}
                                    </span>
                                </div>
                            ))}
                                {selectedPlan.limitationsBuilder?.map((limitation, index) => (
                                    <div className="offcanvas-pricing__content-plan-features-item" key={`${selectedPlan.name}-builder-${index}`}>
                                        <span className="offcanvas-pricing__content-plan-features-icon offcanvas-pricing__content-plan-features-icon--cross">
                                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 1L1 6L6 1ZM1 1L6 6L1 1Z" fill="currentColor"/>
                                                <path d="M6 1L1 6M1 1L6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span className="offcanvas-pricing__content-plan-features-text offcanvas-pricing__content-plan-features-text--cross" key={limitation}>{limitation}</span>
                                    </div>
                                ))}   
                        </div>
                    </div>
                </div>
            </div>
    );
}