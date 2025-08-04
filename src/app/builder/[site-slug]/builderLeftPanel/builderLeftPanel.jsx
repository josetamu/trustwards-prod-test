import './builderLeftPanel.css'
import { useState } from 'react'
import { Dropdown } from '../../../components/dropdown/Dropdown'

function BuilderLeftPanel() {
    // State management for dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // State for search functionality
    const [searchQuery, setSearchQuery] = useState('')
    // State to track which tab is currently active (banner or modal)
    const [activeTab, setActiveTab] = useState('banner')
    // State to track which tree items are expanded/collapsed
    const [expandedItems, setExpandedItems] = useState(new Set(['banner', 'div', 'modal', 'modal-content']))
    // State to track which item is currently selected in the tree
    const [selectedItem, setSelectedItem] = useState(null)
    // State to control if the left panel is open or closed
    const [isPanelOpen, setIsPanelOpen] = useState(true)

    // Toggle panel visibility
    const handlePanelToggle = () => {
        setIsPanelOpen(!isPanelOpen)
    }

    // Toggle dropdown visibility
    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close dropdown when clicking outside
    const handleDropdownClose = () => {
        setIsDropdownOpen(false)
    }

    // Toggle expansion state of tree items (expand/collapse)
    const toggleExpanded = (itemId) => {
        const newExpanded = new Set(expandedItems)
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId)
        } else {
            newExpanded.add(itemId)
        }
        setExpandedItems(newExpanded)
    }

    // Handle selection of tree items
    const handleItemClick = (itemId) => {
        setSelectedItem(itemId)
    }

    // Dropdown menu items
    const dropdownMenu = (
        <>
            <button className="dropdown__item tw-builder__dropdown-item--home">
                <span>Go to Home</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item">
                <span>Site settings</span>
            </button>
            <button className="tw-builder__dropdown-item dropdown__item ">
                <span>Theme</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item">
                <span>Preferences</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item">
                <span>Upgrade to pro</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item--help">
                <span>Help</span>
            </button>
        </>
    )

    // Recursive function to render tree items with proper indentation and styling
    const renderTreeItem = (item, level = 0, parentId = null) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.has(item.id)
        const isSelected = selectedItem === item.id
        const isChildOfSelected = selectedItem && item.id !== selectedItem && isChildOfSelectedItem(item.id, selectedItem)
        // El padre de este item está seleccionado
        const isParentSelected = parentId && selectedItem === parentId

        return (
            <div key={item.id} className="tree-item" style={{ paddingLeft: `${level * 16}px`, position: 'relative' }}>
                {isParentSelected && (
                    <div className="tree-item-bg-extend"></div>
                )}
                <div className={`tree-item-header ${isSelected ? 'selected' : ''} ${isChildOfSelected ? 'child-selected' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
                    {/* Expand/collapse button for items with children */}
                    {hasChildren && (
                        <button 
                            className={`tree-expand-button ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleExpanded(item.id)}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                    {/* Icon for different item types (text or container) */}
                    <div className="tree-item-icon">
                        {item.type === 'text' ? (
                            <span className="text-icon">T</span>
                        ) : (
                            <div className="square-icon"></div>
                        )}
                    </div>
                    {/* Clickable item label */}
                    <span 
                        className="tree-item-label"
                        onClick={() => handleItemClick(item.id)}
                    >
                        {item.name}
                    </span>
                </div>
                {/* Render children if item is expanded */}
                {hasChildren && isExpanded && (
                    <div className="tree-children">
                        {item.children.map(child => renderTreeItem(child, level + 1, item.id))}
                    </div>
                )}
            </div>
        )
    }

    // Check if an item is a descendant of the selected item
    const isChildOfSelectedItem = (itemId, selectedId) => {
        const currentTreeData = activeTab === 'banner' ? bannerTreeData : modalTreeData
        
        // Function to check if targetId is a descendant of ancestorId
        const isDescendantOf = (tree, targetId, ancestorId) => {
            for (const item of tree) {
                if (item.id === targetId) {
                    return false // It's not a descendant of itself
                }
                if (item.id === ancestorId) {
                    // Check if targetId is in the children of this ancestor
                    return findInChildren(item, targetId)
                }
                if (item.children) {
                    if (isDescendantOf(item.children, targetId, ancestorId)) {
                        return true
                    }
                }
            }
            return false
        }

        // Helper function to search for targetId in children recursively
        const findInChildren = (parent, targetId) => {
            if (!parent.children) return false
            for (const child of parent.children) {
                if (child.id === targetId) {
                    return true
                }
                if (child.children) {
                    if (findInChildren(child, targetId)) {
                        return true
                    }
                }
            }
            return false
        }

        return isDescendantOf(currentTreeData, itemId, selectedId)
    }

    // Tree data structure for banner tab
    const bannerTreeData = [
        {
            id: 'banner',
            name: 'Banner',
            type: 'container',
            children: [
                {
                    id: 'div',
                    name: 'Div',
                    type: 'container',
                    children: [
                        {
                            id: 'text',
                            name: 'Text',
                            type: 'text'
                        }
                    ]
                }
            ]
        }
    ]

    // Tree data structure for modal tab
    const modalTreeData = [
        {
            id: 'modal',
            name: 'Modal',
            type: 'container',
            children: [
                {
                    id: 'modal-content',
                    name: 'Modal Content',
                    type: 'container',
                    children: [
                        {
                            id: 'modal-text',
                            name: 'Text',
                            type: 'text'
                        }
                    ]
                }
            ]
        }
    ]

    return (
        <div className={`tw-builder__left-panel ${!isPanelOpen ? 'tw-builder__left-panel--closed' : ''}`}>
            {/* Header section with logo dropdown and settings icon */}
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
                <button 
                    className="tw-builder__panel-toggle-btn"
                    onClick={handlePanelToggle}
                    title={isPanelOpen ? "Close panel" : "Open panel"}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6667 8C14.6667 10.4594 14.6667 11.6891 14.1242 12.5608C13.9235 12.8833 13.6741 13.1638 13.3875 13.3896C12.6126 14 11.5196 14 9.33342 14H6.66675C4.48062 14 3.38755 14 2.61268 13.3896C2.32602 13.1638 2.07668 12.8833 1.87595 12.5608C1.33342 11.6891 1.33342 10.4594 1.33342 8C1.33342 5.5406 1.33342 4.31087 1.87595 3.4392C2.07668 3.11667 2.32602 2.8362 2.61268 2.61033C3.38755 2 4.48062 2 6.66675 2H9.33342C11.5196 2 12.6126 2 13.3875 2.61033C13.6741 2.8362 13.9235 3.11667 14.1242 3.4392C14.6667 4.31087 14.6667 5.5406 14.6667 8Z" stroke="#999999" strokeWidth="1.5"/>
                        <path d="M9.66675 14V2" stroke="#999999" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Tab switching section with animated slider */}
            <div className="tw-builder__tab-section">
                <div className="tw-builder__tab-container">
                    {/* Animated slider that moves based on active tab */}
                    <div className="tw-builder__tab-slider" style={{ 
                        transform: `translateX(${activeTab === 'banner' ? '0%' : '100%'})` 
                    }}></div>
                    <button 
                        className={`tw-builder__tab ${activeTab === 'banner' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banner')}
                    >
                        Banner
                    </button>
                    <button 
                        className={`tw-builder__tab ${activeTab === 'modal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('modal')}
                    >
                        Modal
                    </button>
                </div>
            </div>

            {/* Tree view content that changes based on active tab */}
            <div className="tw-builder__tree-content">
                {activeTab === 'banner' && (
                    <div className="tree-container">
                        {bannerTreeData.map(item => renderTreeItem(item))}
                    </div>
                )}
                {activeTab === 'modal' && (
                    <div className="tree-container">
                        {modalTreeData.map(item => renderTreeItem(item))}
                    </div>
                )}
            </div>
            
            {/* Search section with input field */}
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