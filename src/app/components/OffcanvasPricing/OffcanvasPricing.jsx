import './OffcanvasPricing.css';
import { useState } from 'react';

const OffcanvasPricing = ({ onClose, user, currentPlan }) => {
    const [isYearly, setIsYearly] = useState(false);
    
    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for getting started',
            features: [
                '1 Website',
                'Basic Analytics',
                'Community Support',
                '100 Monthly Visitors'
            ],
            limitations: [
                'Trustwards Branding',
                'Limited Customization'
            ],
            cta: 'Current Plan',
            current: currentPlan === 'Free'
        },
        {
            name: 'Pro',
            price: { monthly: 29, yearly: 290 },
            description: 'For professionals and growing businesses',
            features: [
                'Unlimited Websites',
                'Advanced Analytics',
                'Priority Support',
                'Unlimited Visitors',
                'Custom Domain',
                'Remove Branding',
                'Advanced Customization',
                'A/B Testing',
                'Team Collaboration'
            ],
            cta: 'Upgrade to Pro',
            current: currentPlan === 'Pro',
            popular: true
        }
    ];

    const handleUpgrade = (planName) => {
        if (planName === currentPlan) return;
        
        // Aquí irá la lógica de upgrade (Stripe, etc.)
        console.log(`Upgrading to ${planName}`);
    };

    return (
        <div className="offcanvas-pricing">
            <div className="offcanvas-pricing__header">
                <div className="offcanvas-pricing__header-top">
                    <span className="offcanvas-pricing__title">Choose Your Plan</span>
                    <button 
                        className="offcanvas-pricing__close" 
                        onClick={onClose}
                        aria-label="Close pricing"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2.55806 2.55806C2.80213 2.31398 3.19787 2.31398 3.44194 2.55806L7 6.1161L10.5581 2.55806C10.8021 2.31398 11.1979 2.31398 11.4419 2.55806C11.686 2.80213 11.686 3.19787 11.4419 3.44194L7.8839 7L11.4419 10.5581C11.686 10.8021 11.686 11.1979 11.4419 11.4419C11.1979 11.686 10.8021 11.686 10.5581 11.4419L7 7.8839L3.44194 11.4419C3.19787 11.686 2.80213 11.686 2.55806 11.4419C2.31398 11.1979 2.31398 10.8021 2.55806 10.5581L6.1161 7L2.55806 3.44194C2.31398 3.19787 2.31398 2.80213 2.55806 2.55806Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                
                <div className="offcanvas-pricing__toggle">
                    <span className={`offcanvas-pricing__toggle-label ${!isYearly ? 'offcanvas-pricing__toggle-label--active' : ''}`}>
                        Monthly
                    </span>
                    <button 
                        className="offcanvas-pricing__toggle-switch"
                        onClick={() => setIsYearly(!isYearly)}
                        aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
                    >
                        <span className={`offcanvas-pricing__toggle-slider ${isYearly ? 'offcanvas-pricing__toggle-slider--active' : ''}`}></span>
                    </button>
                    <span className={`offcanvas-pricing__toggle-label ${isYearly ? 'offcanvas-pricing__toggle-label--active' : ''}`}>
                        Yearly
                        <span className="offcanvas-pricing__toggle-save">Save 17%</span>
                    </span>
                </div>
            </div>

            <div className="offcanvas-pricing__content">
                {plans.map((plan) => (
                    <div 
                        key={plan.name}
                        className={`offcanvas-pricing__plan ${plan.popular ? 'offcanvas-pricing__plan--popular' : ''} ${plan.current ? 'offcanvas-pricing__plan--current' : ''}`}
                    >
                        {plan.popular && (
                            <div className="offcanvas-pricing__badge">Most Popular</div>
                        )}
                        
                        <div className="offcanvas-pricing__plan-header">
                            <h3 className="offcanvas-pricing__plan-name">{plan.name}</h3>
                            <p className="offcanvas-pricing__plan-description">{plan.description}</p>
                        </div>

                        <div className="offcanvas-pricing__plan-price">
                            <span className="offcanvas-pricing__currency">$</span>
                            <span className="offcanvas-pricing__amount">
                                {isYearly ? Math.floor(plan.price.yearly / 12) : plan.price.monthly}
                            </span>
                            <span className="offcanvas-pricing__period">/month</span>
                        </div>
                        
                        {isYearly && plan.price.yearly > 0 && (
                            <p className="offcanvas-pricing__billed">
                                Billed ${plan.price.yearly} yearly
                            </p>
                        )}

                        <button 
                            className={`offcanvas-pricing__cta ${plan.current ? 'offcanvas-pricing__cta--current' : ''}`}
                            onClick={() => handleUpgrade(plan.name)}
                            disabled={plan.current}
                        >
                            {plan.current ? 'Current Plan' : plan.cta}
                        </button>

                        <div className="offcanvas-pricing__features">
                            <p className="offcanvas-pricing__features-title">What's included:</p>
                            <ul className="offcanvas-pricing__features-list">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="offcanvas-pricing__feature">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="8" cy="8" r="8" fill="#10B981"/>
                                            <path d="M11.3327 5.5L6.74935 10.0833L4.66602 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            {plan.limitations && plan.limitations.length > 0 && (
                                <ul className="offcanvas-pricing__limitations">
                                    {plan.limitations.map((limitation, idx) => (
                                        <li key={idx} className="offcanvas-pricing__limitation">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="8" cy="8" r="8" fill="#EF4444"/>
                                                <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            <span>{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="offcanvas-pricing__footer">
                <p className="offcanvas-pricing__footer-text">
                    Need help choosing? <a href="mailto:support@trustwards.com" className="offcanvas-pricing__footer-link">Contact us</a>
                </p>
            </div>
        </div>
    );
};

export default OffcanvasPricing;