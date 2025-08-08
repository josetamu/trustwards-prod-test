import './builderLeftPanel.css'
import { useState, useEffect } from 'react'
import { Dropdown } from '../../../components/dropdown/Dropdown'
import { useRouter } from 'next/navigation'
import { useCanvas } from "@contexts/CanvasContext";

function BuilderLeftPanel({ isPanelOpen, onPanelToggle, setModalType, setIsModalOpen, openChangeModal, isRightPanelOpen, setIsRightPanelOpen }) {
    const router = useRouter()
    const { selectedId, setSelectedId } = useCanvas();
    
    // State management for dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // State to track which tab is currently active (banner or modal)
    const [activeTab, setActiveTab] = useState('banner')
    // State to track which tree items are expanded/collapsed
    const [expandedItems, setExpandedItems] = useState(new Set(['banner', 'div', 'modal', 'modal-content']))
    // State to track which item is currently selected in the tree
    const [selectedItem, setSelectedItem] = useState(null)
    // State to track if user manually closed both panels
    const [userManuallyClosed, setUserManuallyClosed] = useState(false)
    
    // Drag and drop states
    const [draggedItem, setDraggedItem] = useState(null)
    const [dragOverItem, setDragOverItem] = useState(null)
    const [dragPosition, setDragPosition] = useState(null) // 'before', 'after', 'inside'

    // Handle right panel opening when an element is selected and both panels are closed
    useEffect(() => {
        if (selectedId && selectedId !== 'tw-root' && !isPanelOpen && !isRightPanelOpen && !userManuallyClosed) {
            setIsRightPanelOpen(true);
        }
    }, [selectedId, isPanelOpen, isRightPanelOpen, setIsRightPanelOpen, userManuallyClosed]);

    // Reset userManuallyClosed when user opens panels
    useEffect(() => {
        if (isPanelOpen || isRightPanelOpen) {
            setUserManuallyClosed(false);
        }
    }, [isPanelOpen, isRightPanelOpen]);

    // Panel toggle handler
    const handlePanelToggle = () => {
        // If both panels are open and there's a selected element, mark as manually closed
        if (isPanelOpen && isRightPanelOpen && selectedId && selectedId !== 'tw-root') {
            setUserManuallyClosed(true);
        }
        onPanelToggle()
    }

    // Dropdown handlers
    const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen)
    const handleDropdownClose = () => setIsDropdownOpen(false)

    // Dropdown navigation handlers
    const handleGoToHome = () => {
        router.push('/dashboard')
        setIsDropdownOpen(false)
    }

    const handleSiteSettings = () => {
        openChangeModal('settings')
        setIsDropdownOpen(false)
    }

    const handleTheme = () => {
        setModalType('Appearance')
        setIsModalOpen(true)
        setIsDropdownOpen(false)
    }

    const handlePreferences = () => {
        setModalType('Account')
        setIsModalOpen(true)
        setIsDropdownOpen(false)
    }

    const handleUpgradeToPro = () => {
        setModalType('Plan')
        setIsModalOpen(true)
        setIsDropdownOpen(false)
    }

    const handleHelp = () => {
        setModalType('Support')
        setIsModalOpen(true)
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
        setSelectedId(itemId)
    }

    // Click outside handler to deselect
    useEffect(() => {
        const handleClickOutside = (e) => {
            const leftPanel = document.querySelector('.tw-builder__left-panel')
            const treeContainer = e.target.closest('.tw-builder__tree-container')
            
            if ((leftPanel && !leftPanel.contains(e.target)) || 
                (e.target.closest('.tw-builder__tree-content') && !treeContainer)) {
                setSelectedItem(null)
                if (selectedId === selectedItem) {
                    setSelectedId(null)
                }
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [selectedId, selectedItem, setSelectedId])

    // Drag and drop handlers
    const handleDragStart = (e, item) => {
        setDraggedItem(item)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', '')
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
        setDragPosition(null)
    }

    const handleDragOver = (e, item) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        
        if (!draggedItem || draggedItem.id === item.id) return
        
        const rect = e.currentTarget.getBoundingClientRect()
        const y = e.clientY - rect.top
        const height = rect.height
        
        // Determine drop position
        let position = 'inside'
        if (y < height * 0.25) {
            position = 'before'
        } else if (y > height * 0.75) {
            position = 'after'
        }
        
        setDragOverItem(item)
        setDragPosition(position)
    }

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverItem(null)
            setDragPosition(null)
        }
    }

    const handleDrop = (e, targetItem) => {
        e.preventDefault()
        
        if (!draggedItem || draggedItem.id === targetItem.id) {
            setDraggedItem(null)
            setDragOverItem(null)
            setDragPosition(null)
            return
        }

        // Move the element in the current tree data
        moveElement(draggedItem.id, targetItem.id, dragPosition)
        
        // Set the dragged item as the new selected item
        setSelectedItem(draggedItem.id)
        setSelectedId(draggedItem.id)
        
        setDraggedItem(null)
        setDragOverItem(null)
        setDragPosition(null)
    }

    // Tree data manipulation
    const moveElement = (draggedId, targetId, position) => {
        const currentTreeData = activeTab === 'banner' ? bannerTreeData : modalTreeData
        const newTreeData = JSON.parse(JSON.stringify(currentTreeData))
        
        // Find and remove the dragged element
        const removeElement = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === draggedId) {
                    const [removed] = nodes.splice(i, 1)
                    return removed
                }
                if (nodes[i].children) {
                    const removed = removeElement(nodes[i].children)
                    if (removed) return removed
                }
            }
            return null
        }
        
        const draggedElement = removeElement(newTreeData)
        if (!draggedElement) return
        
        // Insert the element based on position
        const insertElement = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === targetId) {
                    if (position === 'inside') {
                        if (!nodes[i].children) nodes[i].children = []
                        nodes[i].children.unshift(draggedElement)
                    } else if (position === 'before') {
                        nodes.splice(i, 0, draggedElement)
                    } else if (position === 'after') {
                        nodes.splice(i + 1, 0, draggedElement)
                    }
                    return true
                }
                if (nodes[i].children) {
                    if (insertElement(nodes[i].children)) return true
                }
            }
            return false
        }
        
        insertElement(newTreeData)
        
        // Update the appropriate tree data
        if (activeTab === 'banner') {
            setBannerTreeData(newTreeData)
        } else {
            setModalTreeData(newTreeData)
        }
    }

    // Tree relationship helpers
    const isChildOfSelectedItem = (itemId, selectedId) => {
        const currentTreeData = activeTab === 'banner' ? bannerTreeData : modalTreeData
        
        // Function to check if targetId is a descendant of ancestorId
        const isDescendantOf = (tree, targetId, ancestorId) => {
            for (const item of tree) {
                if (item.id === targetId) return false
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
                if (child.id === targetId) return true
                if (child.children) {
                    if (findInChildren(child, targetId)) return true
                }
            }
            return false
        }

        return isDescendantOf(currentTreeData, itemId, selectedId)
    }

    // Check if an item is a descendant of the dragged item
    const isChildOfDraggedItem = (itemId) => {
        if (!draggedItem) return false
        
        const currentTreeData = activeTab === 'banner' ? bannerTreeData : modalTreeData
        
        // Function to check if targetId is a descendant of ancestorId
        const isDescendantOf = (tree, targetId, ancestorId) => {
            for (const item of tree) {
                if (item.id === targetId) return false
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

        const findInChildren = (parent, targetId) => {
            if (!parent.children) return false
            for (const child of parent.children) {
                if (child.id === targetId) return true
                if (child.children) {
                    if (findInChildren(child, targetId)) return true
                }
            }
            return false
        }

        return isDescendantOf(currentTreeData, itemId, draggedItem.id)
    }

    // Tree data structure for banner tab
    const [bannerTreeData, setBannerTreeData] = useState([
        {
            id: 'banner',
            label: 'Banner',
            type: 'container',
            children: [
                {
                    id: 'div',
                    label: 'Div',
                    type: 'container',
                    children: [
                        {
                            id: 'text',
                            label: 'Text',
                            type: 'text'
                        },
                        {
                            id: 'text-2',
                            label: 'Text 2',
                            type: 'text'
                        }
                    ]
                }
            ]
        }
    ])

    // Tree data structure for modal tab
    const [modalTreeData, setModalTreeData] = useState([
        {
            id: 'modal',
            label: 'Modal',
            type: 'container',
            children: [
                {
                    id: 'modal-content',
                    label: 'Modal Content',
                    type: 'container',
                    children: [
                        {
                            id: 'modal-text',
                            label: 'Text',
                            type: 'text'
                        }
                    ]
                }
            ]
        }
    ])

    // Tree item renderer
    const renderTreeItem = (item, level = 0, parentId = null) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.has(item.id)
        const isSelected = selectedItem === item.id
        const isChildOfSelected = selectedItem && item.id !== selectedItem && isChildOfSelectedItem(item.id, selectedItem)
        const isParentSelected = parentId && selectedItem === parentId
        const isDragging = draggedItem && draggedItem.id === item.id
        const isDragOver = dragOverItem && dragOverItem.id === item.id
        const isChildOfDragged = isChildOfDraggedItem(item.id)
        const isDraggingContainer = isDragging || isChildOfDragged

        // When dragging, only show selection for dragged item and its children
        const isDraggingActive = draggedItem !== null
        const shouldShowSelection = !isDraggingActive || isDragging || isChildOfDragged
        const shouldShowChildSelection = shouldShowSelection && isChildOfSelected
        const shouldShowParentSelection = shouldShowSelection && isParentSelected

        return (
            <div 
                key={item.id} 
                className={`tw-builder__tree-item ${isSelected && !isExpanded ? 'tw-builder__tree-item--collapsed' : ''} ${isDraggingContainer ? 'tw-builder__tree-item--dragging-container' : ''} ${hasChildren ? 'tw-builder__tree-item--has-children' : ''}`} 
                style={{ paddingLeft: `${level * 16}px`, position: 'relative' }}
            >
                {/* Drop line before */}
                {isDragOver && dragPosition === 'before' && draggedItem && !isChildOfDraggedItem(item.id) && draggedItem.id !== item.id && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--before"></div>
                )}
                
                {/* Background extend for selected parent */}
                {shouldShowParentSelection && (
                    <div className="tw-builder__tree-item-background-extend"></div>
                )}
                
                {/* Tree item header */}
                <div 
                    className={`tw-builder__tree-item-header ${isSelected && shouldShowSelection ? 'tw-builder__tree-item-header--selected' : ''} ${shouldShowChildSelection ? 'tw-builder__tree-item-header--child-selected' : ''} ${isSelected && !isExpanded ? 'tw-builder__tree-item-header--collapsed' : ''} ${isDragging ? 'tw-builder__tree-item-header--dragging' : ''} ${isDragOver ? 'tw-builder__tree-item-header--drag-over' : ''}`} 
                    style={{ position: 'relative', zIndex: 1 }}
                    onClick={() => handleItemClick(item.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item)}
                    data-position={isDragOver ? dragPosition : null}
                >
                    {/* Expand/collapse button for items with children */}
                    {hasChildren && (
                        <button 
                            className={`tw-builder__tree-expand-button ${isExpanded ? 'tw-builder__tree-expand-button--expanded' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(item.id);
                            }}
                        >
                            <svg width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.206446 1.11705L2.00994 2.80896C2.07436 2.86952 2.15088 2.91756 2.23512 2.95035C2.31936 2.98313 2.40966 3 2.50086 3C2.59206 3 2.68236 2.98313 2.7666 2.95035C2.85083 2.91756 2.92735 2.86952 2.99177 2.80896L4.79527 1.11705C5.23396 0.705507 4.92061 0 4.30088 0H0.693878C0.0741433 0 -0.232242 0.705507 0.206446 1.11705Z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}
                    
                    {/* Item icon */}
                    <div className="tw-builder__tree-item-icon">
                        {item.type === 'text' ? (
                            <span className="tw-builder__tree-item-text-icon">T</span>
                        ) : (
                            <div className="tw-builder__tree-item-square-icon"></div>
                        )}
                    </div>
                    
                    {/* Item label */}
                    <span className="tw-builder__tree-item-label">
                        {item.label}
                    </span>
                </div>
                
                {/* Render children if item is expanded */}
                {hasChildren && isExpanded && (
                    <div className="tw-builder__tree-children">
                        {item.children.map(child => renderTreeItem(child, level + 1, item.id))}
                    </div>
                )}
                
                {/* Drop line after */}
                {isDragOver && dragPosition === 'after' && draggedItem && !isChildOfDraggedItem(item.id) && draggedItem.id !== item.id && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--after"></div>
                )}
            </div>
        )
    }

    // Dropdown menu items
    const dropdownMenu = (
        <>
            <button className="dropdown__item tw-builder__dropdown-item tw-builder__dropdown-item--home" onClick={handleGoToHome}>
                <span>Go to Home</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={handleSiteSettings}>
                <span>Site settings</span>
            </button>
            <button className="tw-builder__dropdown-item dropdown__item" onClick={handleTheme}>
                <span>Theme</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={handlePreferences}>
                <span>Preferences</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={handleUpgradeToPro}>
                <span>Upgrade to pro</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item tw-builder__dropdown-item--help" onClick={handleHelp}>
                <span>Help</span>
            </button>
        </>
    )

    return (
        <div className={`tw-builder__left-panel ${!isPanelOpen ? 'tw-builder__left-panel--closed' : ''}`}>
            {/* Panel header */}
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
                        <div className="tw-builder__logo"></div> 
                        <svg className='tw-builder__logo-arrow' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </Dropdown>
                <button 
                    className="tw-builder__panel-toggle-btn"
                    onClick={handlePanelToggle}
                    title={isPanelOpen ? "Close panel" : "Open panel"}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6667 8C14.6667 10.4594 14.6667 11.6891 14.1242 12.5608C13.9235 12.8833 13.6741 13.1638 13.3875 13.3896C12.6126 14 11.5196 14 9.33342 14H6.66675C4.48062 14 3.38755 14 2.61268 13.3896C2.32602 13.1638 2.07668 12.8833 1.87595 12.5608C1.33342 11.6891 1.33342 10.4594 1.33342 8C1.33342 5.5406 1.33342 4.31087 1.87595 3.4392C2.07668 3.11667 2.32602 2.8362 2.61268 2.61033C3.38755 2 4.48062 2 6.66675 2H9.33342C11.5196 2 12.6126 2 13.3875 2.61033C13.6741 2.8362 13.9235 3.11667 14.1242 3.4392C14.6667 4.31087 14.6667 5.5406 14.6667 8Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M9.66675 14V2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Tab switching section with animated slider */}
            <div className="tw-builder__tab-section">
                <div className="tw-builder__tab-container">
                    <div 
                        className="tw-builder__tab-slider" 
                        style={{ transform: `translateX(${activeTab === 'banner' ? '0%' : '100%'})` }}
                    ></div>
                    <button 
                        className={`tw-builder__tab ${activeTab === 'banner' ? 'tw-builder__tab--active' : ''}`}
                        onClick={() => setActiveTab('banner')}
                    >
                        Banner
                    </button>
                    <button 
                        className={`tw-builder__tab ${activeTab === 'modal' ? 'tw-builder__tab--active' : ''}`}
                        onClick={() => setActiveTab('modal')}
                    >
                        Modal
                    </button>
                </div>
            </div>

            {/* Tree view content that changes based on active tab */}
            <div className="tw-builder__tree-content">
                <div className="tw-builder__tree-container">
                    {activeTab === 'banner' && bannerTreeData.map(item => renderTreeItem(item))}
                    {activeTab === 'modal' && modalTreeData.map(item => renderTreeItem(item))}
                </div>
            </div>
        </div>
    )
}

export default BuilderLeftPanel;