import './OffcanvasPricing.css';
import { useState } from 'react';
import { Tooltip } from '../tooltip/Tooltip';

const OffcanvasPricing = ({ onClose, user, currentPlan, setModalType, setIsModalOpen, setIsOffcanvasOpen, setCheckoutPlan }) => {
    const [isYearly, setIsYearly] = useState(false);
    const [flexPay, setFlexPay] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    
    const plans = [
        {
            name: 'Basic',
            price: { monthly: 7, yearly: 5.8 },
            currency: '€',
            featuresSites: [
                '10 pages',
                '5 scans/month',
                '5000 visitors/month'
            ],
            featuresBuilder: [
                '2 themes',
            ],
            limitationsBuilder: [
                'Watermark removed'
            ],
            cta: currentPlan === 'Basic' ? 'Current Plan' : 'Contact support',
            current: currentPlan === 'Basic',
            limited: false,
        },
        {
            name: 'Pro',
            price: { monthly: 15, yearly: 12.5 },
            currency: '€',
            featuresSites: [
                'Unlimited pages',
                '50 scans/month',
                'Unlimited visitors'
            ],
            featuresBuilder: [
                'All themes',
                'Watermark removed'
            ],
            
            cta: currentPlan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro',
            current: currentPlan === 'Pro',
            limited: false,
        },
        {
            name: 'Pro LTD',
            price: { oneTime: 449 },
            currency: '€',
            featuresSites: [
                'Unlimited pages',
                '25 scans/month',
                'Unlimited visitors'
            ],
            featuresBuilder: [
                'All themes',
                'Watermark removed'
            ],
            lifetimeFeatures: [
                'Unlimited Pro sites',
                'No suscriptions',
            ],
            cta: currentPlan === 'Pro LTD' ? 'Current Plan' : 'Upgrade to Pro LTD',
            current: currentPlan === 'Pro LTD',
            limited: true,
        }
    ];
    const enterpriseFeatures = [
        'Custom limits',
        'Private slack channel',
        'Enterprise theme',
        'Designated Support Manager',
        'Daily to monthly reports',
        'End-to-end integrations',
    ];
    // Function helper to render text with keywords
    const renderFeatureText = (text, planName, featureIndex) => {
        const keywords = {
            scans: 'Security scans to check your site\'s compliance',
            themes: 'Pre-designed templates for your cookies',
            watermark: 'Remove "Powered by Trustwards" branding'
        };

        // Detect what keyword contains the text
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
                        className={`offcanvas-pricing__content-plan-features-text--keyword`}
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

    const handleUpgrade = (planName) => {
        if (planName === currentPlan) return;
        const plan = plans.find(p => p.name === planName);
        setCheckoutPlan({ plan});
        setModalType('Upgrade');
        setIsModalOpen(true);
        setIsOffcanvasOpen(false);
      };

    const handleFlexPayChange = () => {
        setFlexPay(!flexPay);
    };

    return (
        <div className="offcanvas-pricing">
            <div className="offcanvas-pricing__header">
                <span className='offcanvas-pricing__header-icon'>
                <svg width="48" height="37" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_1766_316)">
                    <path d="M4 0H44V7.90909H4V0Z" fill="url(#paint0_linear_1766_316)"/>
                    <path d="M14.6667 29V13.1818H30.6667L14.6667 29Z" fill="url(#paint1_linear_1766_316)"/>
                    <path d="M25.3333 29V13.1818H38.6667L25.3333 29Z" fill="url(#paint2_linear_1766_316)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_1766_316" x="0" y="0" width="48" height="37" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1766_316"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1766_316" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_1766_316" x1="24" y1="0" x2="24" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1766_316" x1="24" y1="0" x2="24" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_1766_316" x1="24" y1="0" x2="24" y2="29" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#1C6DE8"/>
                    </linearGradient>
                    </defs>
                    </svg>
                </span>
                <span className="offcanvas-pricing__header-title">Choose Untitled Plan</span>
                <div className="offcanvas-pricing__header-billing">
                    <div className="offcanvas-pricing__header-billing-slider" style={{transform: `translateX(${isYearly ? '100%' : '0%'})`}}></div>
                    <span className="offcanvas-pricing__header-billing-time" onClick={() => setIsYearly(false)}>Monthly</span>
                    <span className="offcanvas-pricing__header-billing-time" onClick={() => setIsYearly(true)}>Yearly</span>
                    <span className="offcanvas-pricing__header-billing-discount">-20%</span>
                </div>
            </div>
            <div className="offcanvas-pricing__content">
                {plans.map((plan) => (
                    <div className="offcanvas-pricing__content-plan" key={plan.name}>
                        <div className="offcanvas-pricing__content-plan-header">
                        <span className="offcanvas-pricing__content-plan-name">{plan.name}</span>
                        {plan.limited && (
                            <span className="offcanvas-pricing__content-plan-limited">Expires soon</span>
                        )}
                        </div>
                        {plan.name !== 'Pro LTD' ? (
                            <>
                                <span className="offcanvas-pricing__content-plan-price">{isYearly ? plan.price.yearly : plan.price.monthly} <span className="offcanvas-pricing__content-plan-price-currency">{plan.currency}</span></span>
                                <span className="offcanvas-pricing__content-plan-billed">Per month, billed {isYearly ? 'yearly' : 'monthly'}</span>
                            </>
                        ) : (
                            <>
                            <div className="offcanvas-pricing__content-plan-price-container">
                                <span className="offcanvas-pricing__content-plan-price">{flexPay ? '79' : plan.price.oneTime} <span className="offcanvas-pricing__content-plan-price-currency">{plan.currency}</span></span>
                                <span className="offcanvas-pricing__content-plan-billed">{flexPay ? 'per month' : 'One-time payment'}</span>
                            </div>
                            <div className="offcanvas-pricing__content-plan-flexpay">
                            <label className="offcanvas-pricing__content-plan-flexpay-toggle" tabIndex={0} role="button" aria-label="Toggle flex pay" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleFlexPayChange(); }}}>
                                        <input
                                            tabIndex={-1}
                                            type="checkbox"
                                            className="offcanvas-pricing__content-plan-flexpay-toggle-checkbox"
                                            checked={!!flexPay}
                                            onChange={handleFlexPayChange}
                                        />
                                        <span className="offcanvas-pricing__content-plan-flexpay-toggle-action"></span>
                                    </label>
                                <span className="offcanvas-pricing__content-plan-flexpay-text">Flex-pay in 6 months</span>
                            </div>

                                
                            
                            </>
                        )}

                        <div className={`offcanvas-pricing__content-plan-cta ${plan.current ? 'offcanvas-pricing__content-plan-cta--current' : ''}`} onClick={() => {if(plan.name !== currentPlan){handleUpgrade(plan.name)}}}>
                            <span className="offcanvas-pricing__content-plan-cta-text">{plan.cta}</span>
                        </div>
                        {plan.lifetimeFeatures && (
                            <>
                                <div className="offcanvas-pricing__content-plan-features">
                                    <span className="offcanvas-pricing__content-plan-features-title">Lifetime deal</span>
                                    {plan.lifetimeFeatures.map((feature, index) => (
                                        
                                        <div className="offcanvas-pricing__content-plan-features-item" key={`${plan.name}-lifetime-${index}`}>
                                            <span className="offcanvas-pricing__content-plan-features-icon offcanvas-pricing__content-plan-features-icon--pro">
                                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                                </svg>
                                            </span>
                                            <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                                {renderFeatureText(feature, plan.name, index)}
                                            </span>
                                        </div>
                                        
                                    ))}
                                </div>
                                <div className="offcanvas-pricing__conent-divider"></div>
                            </>
                        )}
                        <div  className="offcanvas-pricing__content-plan-features">
                            <span className="offcanvas-pricing__content-plan-features-title">Site</span>
                                {plan.featuresSites.map((feature, index) => (
                                    <div className="offcanvas-pricing__content-plan-features-item" key={`${plan.name}-site-${index}`}>
                                        <span className={`offcanvas-pricing__content-plan-features-icon ${plan.name !== 'Basic' ? 'offcanvas-pricing__content-plan-features-icon--pro' : ''}`}>
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>

                                        </span>
                                        <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                            {renderFeatureText(feature, plan.name, index)}
                                        </span>
                                    </div>
                               
                                    
                                ))}
                        </div>
                        <div className="offcanvas-pricing__conent-divider"></div>   
                        <div className="offcanvas-pricing__content-plan-features">
                        <span className="offcanvas-pricing__content-plan-features-title">Builder</span>
                           {plan.featuresBuilder.map((feature, index) => (

                                <div className="offcanvas-pricing__content-plan-features-item" key={`${plan.name}-builder-${index}`}>
                                    <span className={`offcanvas-pricing__content-plan-features-icon ${plan.name !== 'Basic' ? 'offcanvas-pricing__content-plan-features-icon--pro' : ''}`}>
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <span className="offcanvas-pricing__content-plan-features-text" key={feature}>
                                        {renderFeatureText(feature, plan.name, index)}
                                    </span>
                                </div>
                            ))}
                                {plan.limitationsBuilder?.map((limitation, index) => (
                                    <div className="offcanvas-pricing__content-plan-features-item" key={`${plan.name}-builder-${index}`}>
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
                ))}
            </div>

            <div className="offcanvas-pricing__footer">
                <div className="offcanvas-pricing__footer-enterprise">
                    <span className="offcanvas-pricing__footer-enterprise-title">Enterprise</span>
                    <div className="offcanvas-pricing__footer-enterprise-content">
                        <div className="offcanvas-pricing__footer-enterprise-block">
                            <span className="offcanvas-pricing__content-plan-features-text">Customized solutions designed
                            for large scale applications.
                            </span>
                            <div className={`offcanvas-pricing__content-plan-cta offcanvas-pricing__content-plan-cta--current`} onClick={() => {handleUpgrade('Enterprise')}}>
                                <span className="offcanvas-pricing__content-plan-cta-text">Contact us</span>
                            </div>
                        </div>
                        <div className="offcanvas-pricing__footer-enterprise-block">
                            {enterpriseFeatures.slice(0, 3).map((feature, index) => (
                                <div className="offcanvas-pricing__content-plan-features-item" key={`${feature}-col1-${index}`}>
                                    <span className="offcanvas-pricing__content-plan-features-icon offcanvas-pricing__content-plan-features-icon--pro">
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <span className="offcanvas-pricing__content-plan-features-text">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <div className="offcanvas-pricing__footer-enterprise-block">
                            {enterpriseFeatures.slice(3, 6).map((feature, index) => (
                                <div className="offcanvas-pricing__content-plan-features-item" key={`${feature}-col2-${index}`}>
                                    <span className="offcanvas-pricing__content-plan-features-icon offcanvas-pricing__content-plan-features-icon--pro">
                                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <span className="offcanvas-pricing__content-plan-features-text">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffcanvasPricing;