import './ModalUpgradePlan.css';

import { Tooltip } from '../tooltip/Tooltip';

import { useState } from 'react';
const ModalUpgradePlan = ({ userPlan }) => {
    const [yearly, setYearly] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    
    const plan = userPlan || 'Free';
    
    return (
        <div className="modal-upgrade-plan">
            <div className="modal-upgrade-plan__header">
                <span className="modal-upgrade-plan__title">User Plan</span>
                <div className="modal-upgrade-plan__sub">
                    <div className="modal-upgrade-plan__info-container">
                        <span className="modal-upgrade-plan__info">You are currently on a <span className={`modal-upgrade-plan__info--${plan.toLowerCase()}`}>{plan}</span> plan.</span>
                        <span className="modal-upgrade-plan__info">An account can have up to 
                            <span 
                                className="modal-upgrade-plan__info--underline"
                                onMouseEnter={() => setIsHovered('freeSites')}
                                onMouseLeave={() => setIsHovered(null)}
                            > 3 free sites
                                <Tooltip
                                    message={'All Pro plans include 3 free sites.'}
                                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                    open={isHovered === 'freeSites'}
                                    animationType="SCALE_BOTTOM"
                                />
                            </span>
                        </span>
                    </div>
                    <div className="modal-upgrade-plan__yearly-wrapper">
                        <span className="modal-upgrade-plan__yearly-text">Yearly</span>
                            <label className="modal-upgrade-plan__label">
                                <input 
                                    className="modal-upgrade-plan__input"
                                    type="checkbox" 
                                    checked={yearly}
                                    onChange={(e) => setYearly(e.target.checked)}
                                />
                                <span className="modal-upgrade-plan__slider"></span>
                            </label>
                    </div>
                </div>
                <div className="modal-upgrade-plan__divider"></div>
            </div>
            <div className="modal-upgrade-plan__plans">
                <div className="modal-upgrade-plan__plan">
                    <span className="modal-upgrade-plan__plan-title">Free</span>
                    <span className="modal-upgrade-plan__plan-price">0<span className="modal-upgrade-plan__plan-currency">$</span></span>
                    <span className="modal-upgrade-plan__plan-nsites">3 free sites</span>
                    <span className="modal-upgrade-plan__plan-description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                </div>
                <div className="modal-upgrade-plan__plan">
                    <span className="modal-upgrade-plan__plan-title">Solo</span>
                    <span className="modal-upgrade-plan__plan-price">{yearly ? '5' : '6'}<span className="modal-upgrade-plan__plan-currency">$</span></span>
                    <span className="modal-upgrade-plan__plan-nsites">1 pro site</span>
                    <span className="modal-upgrade-plan__plan-description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modal-upgrade-plan__subscribe">
                        <span className="modal-upgrade-plan__subscribe-title">Subscribe</span>
                    </div>
                </div>
                <div className="modal-upgrade-plan__plan">
                    <span className="modal-upgrade-plan__plan-title">Scale</span>
                    <span className="modal-upgrade-plan__plan-price">{yearly ? '15' : '18'}<span className="modal-upgrade-plan__plan-currency">$</span></span>
                    <span className="modal-upgrade-plan__plan-nsites">5 pro sites</span>
                    <span className="modal-upgrade-plan__plan-description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modal-upgrade-plan__subscribe">
                        <span className="modal-upgrade-plan__subscribe-title">Subscribe</span>
                    </div>
                </div>
                <div className="modal-upgrade-plan__plan">
                    <span className="modal-upgrade-plan__plan-title">Trustwards<span className="modal-upgrade-plan__plan-title--popular">Popular</span></span>
                    <span className="modal-upgrade-plan__plan-price">{yearly ? '29' : '35'}<span className="modal-upgrade-plan__plan-currency">$</span></span>
                    <span className="modal-upgrade-plan__plan-nsites"><span className="modal-upgrade-plan__plan-nsites--unlimited">Unlimited</span> pro sites</span>
                    <span className="modal-upgrade-plan__plan-description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modal-upgrade-plan__subscribe modal-upgrade-plan__subscribe--popular">
                        <span className="modal-upgrade-plan__subscribe-title modal-upgrade-plan__subscribe-title--popular">Subscribe</span>
                    </div>
                </div>
            </div>
            <div className="modal-upgrade-plan__divider"></div>
            <div className="modal-upgrade-plan__site">
                <span className="modal-upgrade-plan__site-title">Site</span>
                <div className="modal-upgrade-plan__site-infos">
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">12 pages</span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">3 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('siteScans')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > scans
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'siteScans'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>/month</span>
                        </div>    
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">1000 visitors/month</span>
                        </div>        
                    </div>
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited pages</span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">25 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('siteProScans')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > scans
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'siteProScans'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>/month</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited visitors</span>
                        </div>    
                    </div>
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited pages</span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">50 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('siteScaleScans')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > scans
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'siteScaleScans'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>/month</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited visitors</span>
                        </div>    
                    </div>
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited pages</span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited scans</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Unlimited visitors</span>
                        </div>    
                    </div>                    
                </div>
            </div>
            <div className="modal-upgrade-plan__divider"></div>
            <div className="modal-upgrade-plan__site">
                <span className="modal-upgrade-plan__site-title">Builder</span>
                <div className="modal-upgrade-plan__site-infos">
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">3 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderThemes')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderThemes'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>
                            </span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick modal-upgrade-plan__site-info-title--noincluded">
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 1ZM1 1L6 6L1 1Z" fill="currentColor"/>
                                    <path d="M6 1L1 6M1 1L6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title modal-upgrade-plan__site-info-title--noincluded">Acces to builder</span>
                        </div>    
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick modal-upgrade-plan__site-info-title--noincluded">
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 1ZM1 1L6 6L1 1Z" fill="currentColor"/>
                                    <path d="M6 1L1 6M1 1L6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title modal-upgrade-plan__site-info-title--noincluded">
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderWatermark')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderWatermark'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span> removed</span>
                        </div>        
                    </div>
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">All 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderAllThemes')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderAllThemes'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>
                            </span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Access to builder</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderWatermarkAll')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderWatermarkAll'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span> removed
                            </span>
                        </div>    
                    </div>
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">All 
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderAllThemes2')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderAllThemes2'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>
                            </span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Access to builder</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderWatermarkAll2')}
                                    onMouseLeave={() => setIsHovered(null)}
                                >Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderWatermarkAll2'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span> removed
                            </span>
                        </div>    
                    </div>                  
                    <div className="modal-upgrade-plan__info-container">
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">All
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderAllThemes3')}
                                    onMouseLeave={() => setIsHovered(null)}
                                > themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderAllThemes3'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span>
                            </span>
                        </div>
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">Access to builder</span>
                        </div>  
                        <div className="modal-upgrade-plan__site-info">
                            <span className="modal-upgrade-plan__site-tick">
                                <svg className='modal-upgrade-plan__tick-svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modal-upgrade-plan__site-info-title">
                                <span className='modal-upgrade-plan__site-info-title--underline'
                                    onMouseEnter={() => setIsHovered('builderWatermarkAll3')}
                                    onMouseLeave={() => setIsHovered(null)}
                                >Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'}
                                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                        open={isHovered === 'builderWatermarkAll3'}
                                        animationType="SCALE_BOTTOM"
                                    />
                                </span> removed
                            </span>
                        </div>    
                    </div>     
                </div>
            </div>
        </div>
    )
}
export default ModalUpgradePlan;
