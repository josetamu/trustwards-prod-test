import './ModalBuilderSettings.css';
import { useState, useRef, useCallback } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { Tooltip } from '@components/tooltip/Tooltip';

export const ModalBuilderSettings = ({onClose, showNotification}) => {
    const [activeTab, setActiveTab] = useState('Builder');
    const [color, setColor] = useState('#FFFFFF');
    const [copied, setCopied] = useState('');
    const colorTimeoutRef = useRef(null);
    const [activeTooltip, setActiveTooltip] = useState('');
    const{setJSONtree, JSONtree} = useCanvas();
    
    const handleColorChange = useCallback((e) => {
        const newColor = e.target.value;
        if(!JSONtree) return;
        
        // Clear previous timeout
        if (colorTimeoutRef.current) {
            clearTimeout(colorTimeoutRef.current);
        }
        
        // Set new timeout for debounced update
        colorTimeoutRef.current = setTimeout(() => {
            const updated = {...JSONtree, canvasColor: newColor};
            setJSONtree(updated);
        }, 150); // 150ms delay for smooth color picker experience
    }, [JSONtree, setJSONtree]);
    
    const handleLiveWebsiteChange = () => {
        if (!JSONtree) return;
        const updated = { ...JSONtree, liveWebsite: !JSONtree.liveWebsite };
        setJSONtree(updated);
        
    }
    const handleEventsChange = () => {
        if (!JSONtree) return;
        const updated = { ...JSONtree, blockEvents: !JSONtree.blockEvents };
        setJSONtree(updated);
    }
    const handleScrollChange = () => {
        if (!JSONtree) return;
        const updated = { ...JSONtree, blockScroll: !JSONtree.blockScroll };
        setJSONtree(updated);
    }
    const copyFromSubtitle = (e) => {
        const text = e.currentTarget.previousElementSibling.textContent.trim();
        navigator.clipboard.writeText(text);
        setCopied(text);
        showNotification(`Copied: ${text}`, false)
        
      };
      const handleMouseEnter = (tooltip) => {
        setActiveTooltip(tooltip);
      };
      const handleMouseLeave = () => {
        setActiveTooltip('');
      };
    return (
        <div className='modal-builder-settings'>
            <div className='modal-builder-settings__header'>
                <span className='modal-builder-settings__header-title'>Builder Settings</span>
                <span className='modal-builder-settings__header-close' onClick={onClose}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.55806 2.55806C2.80213 2.31398 3.19787 2.31398 3.44194 2.55806L6 5.1161L8.55805 2.55806C8.80215 2.31398 9.19785 2.31398 9.44195 2.55806C9.686 2.80213 9.686 3.19787 9.44195 3.44194L6.8839 6L9.44195 8.55805C9.686 8.80215 9.686 9.19785 9.44195 9.44195C9.19785 9.686 8.80215 9.686 8.55805 9.44195L6 6.8839L3.44194 9.44195C3.19787 9.686 2.80213 9.686 2.55806 9.44195C2.31398 9.19785 2.31398 8.80215 2.55806 8.55805L5.1161 6L2.55806 3.44194C2.31398 3.19787 2.31398 2.80213 2.55806 2.55806Z" fill="currentColor"/>
                    </svg>
                </span>
            </div>
            <div className='modal-builder-settings__divider'></div>
            <div className='modal-builder-settings__content'>
                <div className='modal-builder-settings__content-tabs'>
                    <span className={`modal-builder-settings__content-tab ${activeTab === 'Builder' ? 'modal-builder-settings__content-tab--active' : ''}`} onClick={() => setActiveTab('Builder')}>Builder</span>
                    <span className={`modal-builder-settings__content-tab ${activeTab === 'Consent' ? 'modal-builder-settings__content-tab--active' : ''}`} onClick={() => setActiveTab('Consent')}>Consent</span>
                    <span className={`modal-builder-settings__content-tab ${activeTab === 'Actions' ? 'modal-builder-settings__content-tab--active' : ''}`} onClick={() => setActiveTab('Actions')}>Actions</span>
                </div>
                <div className='modal-builder-settings__content-divider modal-builder-settings__content-divider--vertical'></div>
                <div className='modal-builder-settings__content-body'>
                    {activeTab === 'Builder' && (
                        <>
                            <span className='modal-builder-settings__content-body-title'>Canvas Background</span>
                            <div className='modal-builder-settings__content-body-setting'
>
                                <span className='modal-builder-settings__content-body-subtitle'>Live Website</span>
                                <label className="modal-builder-settings__content-body-label"                            onMouseEnter={() => handleMouseEnter('liveWebsite')} 
                            onMouseLeave={handleMouseLeave}>
                                    <input
                                        type="checkbox"
                                        className="modal-builder-settings__content-body-checkbox"
                                        checked={!!JSONtree.liveWebsite}
                                        onChange={handleLiveWebsiteChange}
                                    />
                                    <span className="modal-builder-settings__content-body-switch"></span>
                                    <Tooltip 
                                    message="May not work with bot blockers or anti-automation tools. Be patient, it may take a few seconds" 
                                    open={activeTooltip === 'liveWebsite'} 
                                    responsivePosition={{ desktop: 'left', mobile: 'left' }}
                                    width="auto"
                                    />
                                </label>
                            </div>
                            <div className='modal-builder-settings__content-body-setting'>
                                <span className='modal-builder-settings__content-body-subtitle'>Color</span>
                                <input type="color" className="modal-builder-settings__content-body-color" value={JSONtree.canvasColor || '#FFFFFF'} onChange={handleColorChange} />
                            </div>
                        </>

                    )}
                    {activeTab === 'Consent' && (
                        <>
                            <span className='modal-builder-settings__content-body-title'>Until a decision is made</span>
                            <div className='modal-builder-settings__content-body-setting'>
                                <span className='modal-builder-settings__content-body-subtitle'>Block events</span>
                                <label className="modal-builder-settings__content-body-label">
                                    <input
                                        id='event'
                                        type="checkbox"
                                        className="modal-builder-settings__content-body-checkbox"
                                        checked={!!JSONtree.blockEvents}
                                        onChange={handleEventsChange}
                                    />
                                    <span className="modal-builder-settings__content-body-switch"></span>
                                </label>
                            </div>
                            <div className='modal-builder-settings__content-body-setting'>
                                <span className='modal-builder-settings__content-body-subtitle'>Block scroll</span>
                                <label className="modal-builder-settings__content-body-label">
                                    <input
                                        id='scroll'
                                        type="checkbox"
                                        className="modal-builder-settings__content-body-checkbox"
                                        checked={!!JSONtree.blockScroll}
                                        onChange={handleScrollChange}
                                    />
                                    <span className="modal-builder-settings__content-body-switch"></span>
                                </label>
                            </div>
                        </>
                    )}
                    {activeTab === 'Actions' && (
                        <div className='modal-builder-settings__content-body-actions'>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Close banner</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-close-banner</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Open banner</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-open-banner</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Close modal</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-close-modal</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Open modal</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-open-modal</span>
                                    <span className='modal-builder-settings__content-body-clip'onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Enable all categories checkboxes</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-enable-all</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Disable all categories checkboxes</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-disable-all</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Save checkboxes</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-save-choices</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Accept a category</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-accept-category="name"</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Reject a category</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-reject-category="name"</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Accept all categories</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-accept-all</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="modal-builder-settings__content-body-action">
                                <span className='modal-builder-settings__content-body-title modal-builder-settings__content-body-title--active'>Reject all categories</span>
                                <div className="modal-builder-settings__content-body-clipper">
                                    <span className='modal-builder-settings__content-body-subtitle'>data-tw-reject-all</span>
                                    <span className='modal-builder-settings__content-body-clip' onClick={copyFromSubtitle}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.5 7.5C4.5 6.0858 4.5 5.3787 4.93934 4.93934C5.3787 4.5 6.0858 4.5 7.5 4.5H8C9.4142 4.5 10.1213 4.5 10.5606 4.93934C11 5.3787 11 6.0858 11 7.5V8C11 9.4142 11 10.1213 10.5606 10.5606C10.1213 11 9.4142 11 8 11H7.5C6.0858 11 5.3787 11 4.93934 10.5606C4.5 10.1213 4.5 9.4142 4.5 8V7.5Z" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.49995 4.5C8.49875 3.02146 8.4764 2.25561 8.046 1.73122C7.9629 1.62995 7.87005 1.53709 7.7688 1.45398C7.2156 1 6.39375 1 4.75 1C3.10626 1 2.28439 1 1.73122 1.45398C1.62995 1.53709 1.53709 1.62995 1.45398 1.73122C1 2.28439 1 3.10626 1 4.75C1 6.39375 1 7.2156 1.45398 7.7688C1.53709 7.87005 1.62995 7.9629 1.73122 8.046C2.25561 8.4764 3.02146 8.49875 4.5 8.49995" stroke="#AAAAAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
