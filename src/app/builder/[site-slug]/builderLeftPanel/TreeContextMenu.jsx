import React from 'react';

// Tree context menu component
export function TreeContextMenu({ onCopy, onPaste, onDuplicate, onWrap, onRemove, canPaste }) {
    return (
        <>
            {/* Copy */}
            <button 
                className="context-menu__item context-menu__item--with-icon"
                onClick={onCopy}
            >
                <div className="context-menu__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H10C10.5523 14 11 13.5523 11 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6H14C14.5523 6 15 6.44772 15 7V15C15 15.5523 14.5523 16 14 16H6C5.44772 16 5 15.5523 5 15V7C5 6.44772 5.44772 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="context-menu__label">Copy</span>
                <span className="context-menu__shortcut">Ctrl+C</span>
            </button>

            {/* Paste */}
            <button 
                className={`context-menu__item context-menu__item--with-icon ${!canPaste ? 'context-menu__item--disabled' : ''}`}
                onClick={onPaste}
                disabled={!canPaste}
            >
                <div className="context-menu__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2H10C10.5523 2 11 2.44772 11 3V7H15V11C15 11.5523 14.5523 12 14 12H10C9.44772 12 9 11.5523 9 11V7H5V3C5 2.44772 5.44772 2 6 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="context-menu__label">Paste</span>
                <span className="context-menu__shortcut">Ctrl+V</span>
            </button>

            <div className="context-menu__divider"></div>

            {/* Duplicate */}
            <button 
                className="context-menu__item context-menu__item--with-icon"
                onClick={onDuplicate}
            >
                <div className="context-menu__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="context-menu__label">Duplicate</span>
                <span className="context-menu__shortcut">Ctrl+D</span>
            </button>

            {/* Wrap */}
            <button 
                className="context-menu__item context-menu__item--with-icon"
                onClick={onWrap}
            >
                <div className="context-menu__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H13V13H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6H10M6 9H10M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="context-menu__label">Wrap</span>
                <span className="context-menu__shortcut">Ctrl+W</span>
            </button>

            <div className="context-menu__divider"></div>

            {/* Remove */}
            <button 
                className="context-menu__item context-menu__item--with-icon context-menu__item--danger"
                onClick={onRemove}
            >
                <div className="context-menu__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H13M5 6V5C5 4.44772 5.44772 4 6 4H10C10.5523 4 11 4.44772 11 5V6M7 9V12M9 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="context-menu__label">Remove</span>
                <span className="context-menu__shortcut">Del</span>
            </button>
        </>
    );
}
