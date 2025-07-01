import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import './ModalAppearance.css';


export const ModalAppearance = ({ user, onSave, appearanceSettings}) => {
    const [selected, setSelected] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load user's current appearance settings
    useEffect(() => {
        // Always set the values, even if appearanceSettings is null/undefined
        setSelected(appearanceSettings?.['Theme'] || 'system');
        setSelectedColor(appearanceSettings?.['Accent Color'] || '');
        setReducedMotion(appearanceSettings?.['Reduced Motion'] || false);
        
        // Set data-color attribute based on current accent color
        if (appearanceSettings?.['Accent Color']) {
            document.documentElement.setAttribute('data-color', appearanceSettings['Accent Color']);
        } else {
            document.documentElement.removeAttribute('data-color');
        }
        
        // Set data-theme attribute based on current theme
        if (appearanceSettings?.['Theme']) {
            if (appearanceSettings['Theme'] === 'system') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', appearanceSettings['Theme']);
            }
        }
        
        // Mark as initialized after a short delay to prevent initial animation
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, [appearanceSettings]);

    // Save appearance settings to database
    const handleSave = async (newTheme = null, newColor = null, newReducedMotion = null) => {
        const themeToSave = newTheme !== null ? newTheme : selected;
        const colorToSave = newColor !== null ? newColor : selectedColor;
        const motionToSave = newReducedMotion !== null ? newReducedMotion : reducedMotion;
        
        try {
            const { error } = await supabase
                .from('Appearance')
                .update({
                    'Theme': themeToSave,
                    'Accent Color': colorToSave,
                    'Reduced Motion': motionToSave
                })
                .eq('userid', user.id);

            if (error) {
                console.error('Error saving appearance settings:', error);
            } else {
                // Update local state
                if (newTheme !== null) setSelected(newTheme);
                if (newColor !== null) setSelectedColor(newColor);
                if (newReducedMotion !== null) setReducedMotion(newReducedMotion);
                
                // Call the onSave prop to refresh user data in parent component
                if (onSave) {
                    onSave();
                }
            }
        } catch (error) {
            console.error('Error saving appearance settings:', error);
        }
    };

    // Handle color selection
    const handleColorSelect = (color) => {
        // Set data-color attribute on document
        if (color) {
            document.documentElement.setAttribute('data-color', color);
        } else {
            document.documentElement.removeAttribute('data-color');
        }
        
        handleSave(null, color, null);
    };

    // Handle reduced motion toggle
    const handleReducedMotionToggle = (checked) => {
        handleSave(null, null, checked);
    };

    const updateLocalStorageTheme = (theme) => {
        handleSave(theme, null, null);
        if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {

            document.documentElement.setAttribute('data-theme', theme);
        }
    };
    

    return (
        <div className={`modalAppearance__content ${isInitialized ? 'modalAppearance__content--initialized' : ''}`}>
            <div className="modalAppearance__mid">
                    <span className="modalAppearance__mid__title">
                        Theme
                    </span>
                    <div className="modalAppearance__choices">
                        <div className="modalAppearance__choice" onClick={() => updateLocalStorageTheme('light')}>
                            <div className={`modalAppearance__imgWrapper modalAppearance__imgWrapper--light ${selected === 'light' ? 'modalAppearance__choice--active' : ''}`}>
                                <svg className='modalAppearance__img' width="93" height="65" viewBox="0 0 93 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_410_350)">
                                    <path d="M4 6C4 3.79086 5.79086 2 8 2H109V64C109 66.7614 106.761 69 104 69H4V6Z" fill="white"/>
                                    </g>
                                    <rect x="22" y="18" width="69" height="3" rx="1.5" fill="#AFAFAF"/>
                                    <rect x="22" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="22" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="46" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="46" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="70" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="70" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="11" y="24" width="91" height="2" rx="1" fill="#E7E6E5"/>
                                    <rect x="17" y="28" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                    <rect x="17" y="61" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                    <path opacity="0.9" d="M4 6C4 3.79086 5.79086 2 8 2H109V11H4V6Z" fill="#F5F5F5"/>
                                    <rect x="8" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="12" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="16" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <defs>
                                    <filter id="filter0_d_410_350" x="0" y="0" width="113" height="75" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="2"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_410_350"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_410_350" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>

                                <span className="modalAppearence__choice__icon">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_254_2015)">
                                        <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                        <path className="modalAppearence__tick" fillRule="evenodd" clipRule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="currentColor"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_254_2015">
                                        <rect width="12" height="12" rx="6" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </span> 
                            </div>
                            <span className="modalAppearance__choice__title">
                                Light
                            </span>
                        </div>
                        <div className="modalAppearance__choice" onClick={() => updateLocalStorageTheme('dark')}>
                            <div className={`modalAppearance__imgWrapper modalAppearance__imgWrapper--dark ${selected === 'dark' ? 'modalAppearance__choice--active' : ''}`}>
                                <svg className='modalAppearance__img' width="93" height="65" viewBox="0 0 93 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_410_351)">
                                    <path d="M4 6C4 3.79086 5.79086 2 8 2H109V64C109 66.7614 106.761 69 104 69H4V6Z" fill="#555555"/>
                                    </g>
                                    <rect x="22" y="18" width="69" height="3" rx="1.5" fill="#AFAFAF"/>
                                    <rect x="11" y="24" width="91" height="2" rx="1" fill="#E7E6E5"/>
                                    <rect x="17" y="28" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                    <path opacity="0.9" d="M4 6C4 3.79086 5.79086 2 8 2H109V11H4V6Z" fill="#363636"/>
                                    <rect x="8" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="12" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="16" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="22" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="22" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="46" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="46" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="70" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                    <rect x="70" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                    <rect x="17" y="61" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                    <defs>
                                    <filter id="filter0_d_410_351" x="0" y="0" width="113" height="75" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="2"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_410_351"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_410_351" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>

                                    <span className="modalAppearence__choice__icon">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_254_2015)">
                                            <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                            <path className="modalAppearence__tick" fillRule="evenodd" clipRule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="currentColor"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_254_2015">
                                            <rect width="12" height="12" rx="6" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span> 
                            </div>
                            <span className="modalAppearance__choice__title">
                                Dark
                            </span>
                        </div>
                        <div className="modalAppearance__choice" onClick={() => updateLocalStorageTheme('system')}>
                            <div className="modalAppearance__imgWrapper modalAppearance__imgWrapper--system">
                                <div className={`modalAppearance__imgWrapper modalAppearance__imgWrapper--light ${selected === 'system' ? 'modalAppearance__choice--active' : ''}`}>
                                    <svg className='modalAppearance__img' width="93" height="65" viewBox="0 0 93 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g filter="url(#filter0_d_410_350)">
                                        <path d="M4 6C4 3.79086 5.79086 2 8 2H109V64C109 66.7614 106.761 69 104 69H4V6Z" fill="white"/>
                                        </g>
                                        <rect x="22" y="18" width="69" height="3" rx="1.5" fill="#AFAFAF"/>
                                        <rect x="22" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="22" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="46" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="46" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="70" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="70" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="11" y="24" width="91" height="2" rx="1" fill="#E7E6E5"/>
                                        <rect x="17" y="28" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                        <rect x="17" y="61" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                        <path opacity="0.9" d="M4 6C4 3.79086 5.79086 2 8 2H109V11H4V6Z" fill="#F5F5F5"/>
                                        <rect x="8" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="12" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="16" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <defs>
                                        <filter id="filter0_d_410_350" x="0" y="0" width="113" height="75" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="2"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_410_350"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_410_350" result="shape"/>
                                        </filter>
                                        </defs>
                                    </svg>
                                    <span className="modalAppearence__choice__icon">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_254_2015)">
                                            <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                            <path className="modalAppearence__tick" fillRule="evenodd" clipRule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="currentColor"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_254_2015">
                                            <rect width="12" height="12" rx="6" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                </div>
                                <div className={`modalAppearance__imgWrapper modalAppearance__imgWrapper--dark ${selected === 'system' ? 'modalAppearance__choice--active' : ''}`}>
                                    <svg className='modalAppearance__img' width="93" height="65" viewBox="0 0 93 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g filter="url(#filter0_d_410_351)">
                                        <path d="M4 6C4 3.79086 5.79086 2 8 2H109V64C109 66.7614 106.761 69 104 69H4V6Z" fill="#555555"/>
                                        </g>
                                        <rect x="22" y="18" width="69" height="3" rx="1.5" fill="#AFAFAF"/>
                                        <rect x="11" y="24" width="91" height="2" rx="1" fill="#E7E6E5"/>
                                        <rect x="17" y="28" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                        <path opacity="0.9" d="M4 6C4 3.79086 5.79086 2 8 2H109V11H4V6Z" fill="#363636"/>
                                        <rect x="8" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="12" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="16" y="6" width="2" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="22" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="22" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="46" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="46" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="70" y="37" width="20" height="2" rx="1" fill="#AFAFAF"/>
                                        <rect x="70" y="41" width="20" height="14" rx="1" fill="#E7E6E5"/>
                                        <rect x="17" y="61" width="80" height="2" rx="1" fill="#E7E6E5"/>
                                        <defs>
                                        <filter id="filter0_d_410_351" x="0" y="0" width="113" height="75" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="2"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_410_351"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_410_351" result="shape"/>
                                        </filter>
                                        </defs>
                                    </svg>
                                </div>
                                
                            </div>
                            <span className="modalAppearance__choice__title">
                                System
                            </span>
                        </div>
                    </div>
                    <div className="modalAppearance__divider"></div>
            
            </div>
            <div className="modalAppearance__bottom">
                <div className="modalAppearance__ancentColor">
                    <span className="modalAppearance__ancentColor__title">
                        Accent color
                    </span>
                    <div className="modalAppearance__ancentColor__choices">
                        <div className={`modalAppearance__ancentColor__choice modalAppearance__ancentColor__choice--green ${selectedColor === 'green' ? 'modalAppearance__ancentColor__choice--active' : ''}`} onClick={() => handleColorSelect('green')}></div>
                        <div className={`modalAppearance__ancentColor__choice modalAppearance__ancentColor__choice--purple ${selectedColor === 'purple' ? 'modalAppearance__ancentColor__choice--active' : ''}`} onClick={() => handleColorSelect('purple')}></div>
                        <div className={`modalAppearance__ancentColor__choice modalAppearance__ancentColor__choice--red ${selectedColor === 'red' ? 'modalAppearance__ancentColor__choice--active' : ''}`} onClick={() => handleColorSelect('red')}></div>
                        <div className={`modalAppearance__ancentColor__choice modalAppearance__ancentColor__choice--orange ${selectedColor === 'orange' ? 'modalAppearance__ancentColor__choice--active' : ''}`} onClick={() => handleColorSelect('orange')}></div>
                        <div className={`modalAppearance__ancentColor__choice modalAppearance__ancentColor__choice--blue ${selectedColor === 'blue' ? 'modalAppearance__ancentColor__choice--active' : ''}`} onClick={() => handleColorSelect('blue')}></div>    
                    </div>
                    
                </div>
                <div className="modalAppearance__divider"></div>
                <div className="modalAppearance__ReducedMotion">
                    <span className="modalAppearance__ReducedMotion__title">
                        Reduced motion
                    </span>
                    <label className="modalAppearance__ReducedMotion__label">
                        <input 
                            className="modalAppearance__ReducedMotion__input"
                            type="checkbox" 
                            checked={reducedMotion}
                            onChange={(e) => handleReducedMotionToggle(e.target.checked)}
                        />
                        <span className="modalAppearance__ReducedMotion__slider"></span>
                    </label>
                </div>
            </div>
    
        </div>
    )

}

