import { useState } from 'react';
import './BuilderControl.css';
import {Tooltip} from '@components/tooltip/Tooltip';
// Component to render the control(label with + and -) Pass the label(title) and the control to render
export default function BuilderControl({label, controls, whatType, activeRoot}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);

    //get the name of the active root to show in the tooltip
    const activeRootName = {
        'tw-root--banner': 'Banner',
        'tw-root--modal': 'Modal',
    }

    return (
        <div className="tw-builder__control">
            <div className="tw-builder__control-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="tw-builder__control-label">{label}
                    {/*if the label is Enter Animation, show the tooltip */}
                    {label === 'Enter Animation' && isOpen && (
                        <span className="tw-builder__control-info" onMouseEnter={() => setActiveTooltip('enter-animation')} onMouseLeave={() => setActiveTooltip(null)}>
                            i
                            <Tooltip
                            message={`The following properties will be applied when “${activeRootName[activeRoot]}” shows up.`}
                            open={activeTooltip === 'enter-animation'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </span>
                    )}
                </span>
                <div className="tw-builder__control-icons">
                    <span className={`tw-builder__control-icon ${!isOpen ? 'tw-builder__control-icon--active' : ''}`}>
                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="3.5" x2="7" y2="3.5" stroke="currentColor"/>
                            <line x1="3.5" x2="3.5" y2="7" stroke="currentColor"/>
                        </svg>
                    </span>
                    <span className={`tw-builder__control-icon ${isOpen ? 'tw-builder__control-icon--active' : ''}`}>
                        <svg width="7" height="1" viewBox="0 0 7 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="0.5" x2="7" y2="0.5" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                    </span>
                </div>
            </div>
            {/* If the control is open, show the content */}
            {isOpen && (
                <div className="tw-builder__control-content">
                    {/* Map the controls and show the correct inputs */}
                    {controls.map((control, index) => whatType(control, index))}
                </div>
            )}
        </div>
    )
}