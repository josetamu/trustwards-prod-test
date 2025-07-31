import './builderLeftPanel.css'
import { useState } from 'react'
import { Dropdown } from '../../../components/dropdown/Dropdown'

function BuilderLeftPanel() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleDropdownClose = () => {
        setIsDropdownOpen(false)
    }

    const dropdownMenu = (
        <>
            <button className="dropdown__item">
                <span>Go to Home</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item">
                <span>Site settings</span>
            </button>
            <button className="dropdown__item">
                <span>Theme</span>
            </button>
            <button className="dropdown__item">
                <span>Preferences</span>
            </button>
            <button className="dropdown__item">
                <span>Upgrade to pro</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item">
                <span>Help</span>
            </button>
        </>
    )

    return (
        <div className="tw-builder__left-panel">
            <div className="tw-builder__left-panel-header">
                <Dropdown
                    className="builder-logo-dropdown"
                    open={isDropdownOpen}
                    onClose={handleDropdownClose}
                    menu={dropdownMenu}
                >
                    <button 
                        className="tw-builder__logo-button"
                        onClick={handleDropdownToggle}
                    >
                        <div className="tw-builder__logo">
                            <div className="tw-builder__logo"></div>
                        </div>
                        <svg className="tw-builder__logo-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </Dropdown>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6667 8C14.6667 10.4594 14.6667 11.6891 14.1242 12.5608C13.9235 12.8833 13.6741 13.1638 13.3875 13.3896C12.6126 14 11.5196 14 9.33342 14H6.66675C4.48062 14 3.38755 14 2.61268 13.3896C2.32602 13.1638 2.07668 12.8833 1.87595 12.5608C1.33342 11.6891 1.33342 10.4594 1.33342 8C1.33342 5.5406 1.33342 4.31087 1.87595 3.4392C2.07668 3.11667 2.32602 2.8362 2.61268 2.61033C3.38755 2 4.48062 2 6.66675 2H9.33342C11.5196 2 12.6126 2 13.3875 2.61033C13.6741 2.8362 13.9235 3.11667 14.1242 3.4392C14.6667 4.31087 14.6667 5.5406 14.6667 8Z" stroke="#999999" strokeWidth="1.5"/>
                    <path d="M9.66675 14V2" stroke="#999999" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>

            </div>

            <div>Content</div>
            
            {/* Builder Search Section */}
            <div className="tw-builder__search-section">
                <div className="tw-builder__search-container">
                    <svg className="tw-builder__search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.3986 14.3986L11.3125 11.3125" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
                        <path d="M7.28866 12.9773C10.4304 12.9773 12.9773 10.4304 12.9773 7.28866C12.9773 4.14695 10.4304 1.6 7.28866 1.6C4.14695 1.6 1.6 4.14695 1.6 7.28866C1.6 10.4304 4.14695 12.9773 7.28866 12.9773Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
                    </svg>
                    <input 
                        className="tw-builder__search-input" 
                        type="text" 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default BuilderLeftPanel;