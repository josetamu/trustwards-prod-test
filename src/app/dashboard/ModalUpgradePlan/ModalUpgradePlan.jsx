import { Tooltip } from '../Tooltip/Tooltip';
import './ModalUpgradePlan.css';
import { useState } from 'react';
const ModalUpgradePlan = () => {
    const [yearly, setYearly] = useState(false);
    return (
        <div className="modalUpgradePlan">
            <div className="modalUpgradePlan__header">
                <span className="modalUpgradePlan__title">User Plan</span>
                <div className="modalUpgradePlan__sub">
                    <div className="modalUpgradePlan__infoContainer">
                        <span className="modalUpgradePlan__info">You are currently on a <span className="modalUpgradePlan__info--free">free</span> plan.</span>
                        <span className="modalUpgradePlan__info">An account can have up to 
                            <span className="modalUpgradePlan__info--underline"> 3 free sites
                                <Tooltip
                                    message={'All Pro plans include 3 free sites.'} 
                                    responsivePosition={{ desktop: 'upgrade', mobile: 'bottom' }}
                                    type='default'
                                >
                                </Tooltip>
                     
                               
                            </span>
                        
                        </span>
                    </div>
                    <div className="modalUpgradePlan__yearly">
                        <span className="modalUpgradePlan__yearly-text">Yearly</span>
                            <label className="modalUpgradePlan__label">
                                <input 
                                    className="modalUpgradePlan__input"
                                    type="checkbox" 
                                    checked={yearly}
                                    onChange={(e) => setYearly(e.target.checked)}
                                />
                                <span className="modalUpgradePlan__slider"></span>
                            </label>
                    </div>
                </div>
                <div className="modalUpgradePlan__divider"></div>
            </div>
            <div className="modalUpgradePlan__plans">
                <div className="modalUpgradePlan__plan">
                    <span className="modalUpgradePlan__plan__title">Free</span>
                    <span className="modalUpgradePlan__price">0<span className="modalUpgradePlan__currency">$</span></span>
                    <span className="modalUpgradePlan__plan__nsites">3 free sites</span>
                    <span className="modalUpgradePlan__plan__description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                </div>
                <div className="modalUpgradePlan__plan">
                    <span className="modalUpgradePlan__plan__title">Solo</span>
                    <span className="modalUpgradePlan__price">{yearly ? '5' : '6'}<span className="modalUpgradePlan__currency">$</span></span>
                    <span className="modalUpgradePlan__plan__nsites">1 pro site</span>
                    <span className="modalUpgradePlan__plan__description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modalUpgradePlan__subscribe">
                        <span className="modalUpgradePlan__subscribe__title">Subscribe</span>
                    </div>
                </div>
                <div className="modalUpgradePlan__plan">
                    <span className="modalUpgradePlan__plan__title">Scale</span>
                    <span className="modalUpgradePlan__price">{yearly ? '15' : '18'}<span className="modalUpgradePlan__currency">$</span></span>
                    <span className="modalUpgradePlan__plan__nsites">5 pro sites</span>
                    <span className="modalUpgradePlan__plan__description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modalUpgradePlan__subscribe">
                        <span className="modalUpgradePlan__subscribe__title">Subscribe</span>
                    </div>
                </div>
                <div className="modalUpgradePlan__plan">
                    <span className="modalUpgradePlan__plan__title">Trustwards<span className="modalUpgradePlan__plan__title--popular">Popular</span></span>
                    <span className="modalUpgradePlan__price">{yearly ? '29' : '35'}<span className="modalUpgradePlan__currency">$</span></span>
                    <span className="modalUpgradePlan__plan__nsites"><span className="modalUpgradePlan__plan__nsites--unlimited">Unlimited</span> pro sites</span>
                    <span className="modalUpgradePlan__plan__description">Per month, billed {yearly ? 'yearly' : 'monthly'}</span>
                    <div className="modalUpgradePlan__subscribe modalUpgradePlan__subscribe--popular">
                        <span className="modalUpgradePlan__subscribe__title modalUpgradePlan__subscribe__title--popular">Subscribe</span>
                    </div>
                </div>
            </div>
            <div className="modalUpgradePlan__divider"></div>
            <div className="modalUpgradePlan__site">
                <span className="modalUpgradePlan__site__title">Site</span>
                <div className="modalUpgradePlan__site__infos">
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">12 pages</span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">3 
                                <span className='modalUpgradePlan__site__info__title--underline'> scans
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                            </span>/month</span>
                        </div>    
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">1000 visitors/month</span>
                        </div>        
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited pages</span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">25 
                                <span className='modalUpgradePlan__site__info__title--underline'> scans
                                <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                            </span>/month</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited visitors</span>
                        </div>    
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited pages</span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">50 
                                <span className='modalUpgradePlan__site__info__title--underline'>scans 
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span>/month</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited visitors</span>
                        </div>    
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited pages</span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited scans</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Unlimited visitors</span>
                        </div>    
                    </div>                    
                </div>
            </div>
            <div className="modalUpgradePlan__divider"></div>
            <div className="modalUpgradePlan__site">
                <span className="modalUpgradePlan__site__title">Builder</span>
                <div className="modalUpgradePlan__site__infos">
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">3 
                                <span className='modalUpgradePlan__site__info__title--underline'> themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span>
                            </span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick modalUpgradePlan__site__info__title--noincluded">
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 1ZM1 1L6 6L1 1Z" fill="currentColor"/>
                                    <path d="M6 1L1 6M1 1L6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title modalUpgradePlan__site__info__title--noincluded">Acces to builder</span>
                        </div>    
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick modalUpgradePlan__site__info__title--noincluded">
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1L1 6L6 1ZM1 1L6 6L1 1Z" fill="currentColor"/>
                                    <path d="M6 1L1 6M1 1L6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title modalUpgradePlan__site__info__title--noincluded">
                                <span className='modalUpgradePlan__site__info__title--underline'> Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span> removed</span>
                        </div>        
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">All 
                                <span className='modalUpgradePlan__site__info__title--underline'> themes 
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span>
                            </span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Access to builder</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">
                                <span className='modalUpgradePlan__site__info__title--underline'> Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span> removed
                            </span>
                        </div>    
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">All 
                                <span className='modalUpgradePlan__site__info__title--underline'> themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span>
                            </span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Access to builder</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">
                                <span className='modalUpgradePlan__site__info__title--underline'>Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span> removed
                            </span>
                        </div>    
                    </div>
                    <div className="modalUpgradePlan__info__container">
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">All 
                                <span className='modalUpgradePlan__site__info__title--underline'> themes
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
                                </span>
                            </span>
                        </div>
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">Access to builder</span>
                        </div>  
                        <div className="modalUpgradePlan__site__info">
                            <span className="modalUpgradePlan__site__tick">
                                <svg className='modalUpgradePlan__tick__svg' width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73519 0.259953C6.85402 0.116133 7.02428 0.0243711 7.20975 0.0041998C7.39521 -0.0159715 7.58123 0.0370411 7.72819 0.151953C7.80036 0.207847 7.8606 0.277642 7.90534 0.357213C7.95008 0.436784 7.97841 0.524516 7.98867 0.615223C7.99892 0.705931 7.99089 0.797775 7.96504 0.885325C7.9392 0.972875 7.89606 1.05436 7.83819 1.12495L4.07819 5.74495C4.01527 5.82129 3.93718 5.88374 3.84888 5.92834C3.76058 5.97295 3.66398 5.99875 3.5652 6.00411C3.46642 6.00946 3.3676 5.99426 3.27499 5.95947C3.18238 5.92467 3.098 5.87104 3.02719 5.80195L0.207192 3.03195L0.158192 2.97995C-0.0678082 2.70795 -0.0518084 2.30695 0.207192 2.05295C0.466192 1.79895 0.875192 1.78295 1.15219 2.00495L1.20519 2.05295L3.47519 4.27295L6.74519 0.262953L6.73519 0.259953Z" fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="modalUpgradePlan__site__info__title">
                                <span className='modalUpgradePlan__site__info__title--underline'>Watermark
                                    <Tooltip
                                        message={'Here will be a beautiful explanation.'} 
                                        responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                                        type='default'
                                    ></Tooltip>
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
