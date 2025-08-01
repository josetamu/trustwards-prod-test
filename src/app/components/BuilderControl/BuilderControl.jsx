import { useState } from 'react';
import './BuilderControl.css';
export default function BuilderControl({label, control}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="tw-builder__control">
            <div className="tw-builder__control-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="tw-builder__control-label">{label}</span>
                <div className="tw-builder__control-icons">
                    <span className={`tw-builder__control-icon ${!isOpen ? 'tw-builder__control-icon--active' : ''}`}>
                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="3.5" x2="7" y2="3.5" stroke="#222222"/>
                            <line x1="3.5" x2="3.5" y2="7" stroke="#222222"/>
                        </svg>
                    </span>
                    <span className={`tw-builder__control-icon ${isOpen ? 'tw-builder__control-icon--active' : ''}`}>
                        <svg width="7" height="1" viewBox="0 0 7 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="0.5" x2="7" y2="0.5" stroke="#222222" strokeWidth="1"/>
                        </svg>
                    </span>
                </div>
            </div>
            {isOpen && (
                <div className="tw-builder__control-content">
                    {control}
                </div>
            )}
        </div>
    )
}