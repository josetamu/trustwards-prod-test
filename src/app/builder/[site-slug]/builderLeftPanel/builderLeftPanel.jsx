import './builderLeftPanel.css'
import { useState, useEffect } from 'react'
import { Dropdown } from '../../../components/dropdown/Dropdown'
import Link from 'next/link'
import { useCanvas } from "@contexts/CanvasContext";

import BuilderThemes from '@components/BuilderThemes/BuilderThemes'

function BuilderLeftPanel({ isPanelOpen, onPanelToggle, setModalType, setIsModalOpen, openChangeModal, isRightPanelOpen, setIsRightPanelOpen, showNotification, CallContextMenu, setIsManualThemesOpen }) {
    const router = useRouter()
    const { JSONtree, activeRoot, updateActiveRoot, activeTab, selectedId, setSelectedId, selectedItem, setSelectedItem, removeElement, addElement, setJSONtree, createElement, moveElement } = useCanvas();
    
    // State management for dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    // State to track which tree items are expanded/collapsed
    const [expandedItems, setExpandedItems] = useState(new Set(['tw-root--banner', 'div', 'tw-root--modal', 'modal-content']))
    // State to track if user manually closed both panels
    const [userManuallyClosed, setUserManuallyClosed] = useState(false)
    
    // Drag and drop states
    const [draggedItem, setDraggedItem] = useState(null)
    const [dragOverItem, setDragOverItem] = useState(null)
    const [dragPosition, setDragPosition] = useState(null) // 'before', 'after', 'inside'
    
    // New state for toolbar element drag and drop
    const [toolbarDragOverItem, setToolbarDragOverItem] = useState(null)
    const [toolbarDragPosition, setToolbarDragPosition] = useState(null)
    const [isToolbarDrag, setIsToolbarDrag] = useState(false)
    
    // State to track previous selection when internal tree drag starts
    const [previousTreeSelection, setPreviousTreeSelection] = useState(null)
    
    // State to track previous selection when toolbar drag starts
    const [previousToolbarSelection, setPreviousToolbarSelection] = useState(null)
    
    // State to track when we're creating a new element from toolbar
    const [isCreatingElement, setIsCreatingElement] = useState(false)
    const [pendingElementType, setPendingElementType] = useState(null)
    const [previousTreeState, setPreviousTreeState] = useState(null)

    // Handle right panel opening when an element is selected and both panels are closed
    useEffect(() => {
        if (selectedId && selectedId !== activeRoot && !isPanelOpen && !isRightPanelOpen && !userManuallyClosed) {
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
        if (isPanelOpen && isRightPanelOpen && selectedId && selectedId !== activeRoot) {
            setUserManuallyClosed(true);
        }
        onPanelToggle()
    }

    // Dropdown handlers
    const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen)
    const handleDropdownClose = () => setIsDropdownOpen(false)

    // Dropdown navigation handlers
    const handleDropdownAction = (action) => {
        setIsDropdownOpen(false)
        
        switch (action) {
            case 'home':
                router.push('/dashboard')
                break
            case 'settings':
                openChangeModal('settings')
                break
            case 'theme':
                setIsManualThemesOpen(true)
                break
            case 'appearance':
                setModalType('Appearance')
                setIsModalOpen(true)
                break
            case 'upgrade':
                setModalType('Plan')
                setIsModalOpen(true)
                break
            case 'help':
                setModalType('Support')
                setIsModalOpen(true)
                break
            default:
                break
        }
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

    // Sync selection from canvas to tree
    useEffect(() => {
        if (selectedId && selectedId !== selectedItem) {
            setSelectedItem(selectedId)
        }
    }, [selectedId, selectedItem])

    // Global drag detection for toolbar elements
    useEffect(() => {
        const handleGlobalDragStart = (e) => {
            // Check if this is a toolbar element drag
            if (e.dataTransfer.types.includes("elementtype")) {
                setIsToolbarDrag(true)
                // Clear internal tree drag states when toolbar drag starts
                setDraggedItem(null)
                setDragOverItem(null)
                setDragPosition(null)
                
                // Deselect the element that was selected when drag starts from toolbar
                if (selectedItem) {
                    // Save the previous selection to restore it if drag is cancelled
                    setPreviousToolbarSelection(selectedItem)
                    setSelectedItem(null)
                    setSelectedId(null)
                }
            }
        }

        const handleGlobalDragEnd = () => {
            // If toolbar drag was cancelled (no drop occurred), restore the previous selection
            if (isToolbarDrag && previousToolbarSelection) {
                setSelectedItem(previousToolbarSelection)
                setSelectedId(previousToolbarSelection)
                setPreviousToolbarSelection(null)
            }
            setIsToolbarDrag(false)
        }

        document.addEventListener('dragstart', handleGlobalDragStart)
        document.addEventListener('dragend', handleGlobalDragEnd)

        return () => {
            document.removeEventListener('dragstart', handleGlobalDragStart)
            document.removeEventListener('dragend', handleGlobalDragEnd)
        }
    }, [selectedItem, setSelectedItem, setSelectedId, previousToolbarSelection])

    // New functions for toolbar element drag and drop
    const handleToolbarDragOver = (e, item) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
        
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
        
        // Check if the item can have children (only allow 'inside' for nestable elements)
        if (position === 'inside' && !item.children && !item.nestable) {
            // If item can't have children, force position to 'after' instead
            position = 'after'
        }
        
        setToolbarDragOverItem(item)
        setToolbarDragPosition(position)
        setIsToolbarDrag(true)
    }

    const handleToolbarDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setToolbarDragOverItem(null)
            setToolbarDragPosition(null)
            setIsToolbarDrag(false)
        }
    }

    const handleToolbarDrop = (e, targetItem) => {
        e.preventDefault()
        
        const elementType = e.dataTransfer.getData("elementType")
        if (!elementType) return

        // Calculate position at drop time for accuracy
        const rect = e.currentTarget.getBoundingClientRect()
        const y = e.clientY - rect.top
        const height = rect.height
        
        let position = 'inside'
        if (y < height * 0.25) {
            position = 'before'
        } else if (y > height * 0.75) {
            position = 'after'
        }

        // Determine where to insert the element based on position
        let containerId = null
        let insertIndex = null

        if (position === 'inside') {
            // Check if the target item allows children
            if (targetItem.nestable) {
                // Insert inside the target item as a child
                containerId = targetItem.id
                // If the target has children, add at the end. If not, use 0 to insert as first child
                insertIndex = targetItem.children && targetItem.children.length > 0 ? targetItem.children.length : 0
            } else {
                // If target doesn't allow children, insert after it instead
                const currentTreeData = activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]]
                const parentInfo = findParentById(currentTreeData, targetItem.id)
                
                if (parentInfo) {
                    containerId = parentInfo.parent ? parentInfo.parent.id : activeRoot
                    insertIndex = parentInfo.index + 1
                } else {
                    containerId = activeRoot
                    insertIndex = null
                }
            }
        } else {
            // Insert before or after the target item
            const currentTreeData = activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]]
            const parentInfo = findParentById(currentTreeData, targetItem.id)
            
            if (parentInfo) {
                containerId = parentInfo.parent ? parentInfo.parent.id : activeRoot
                // Calculate the correct insert index
                if (position === 'before') {
                    insertIndex = parentInfo.index
                } else { // 'after'
                    insertIndex = parentInfo.index + 1
                }
            } else {
                // If no parent found, add to root
                containerId = activeRoot
                insertIndex = null
            }
        }

        // Save the current tree state before creating the element
        const currentRoot = activeTab === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1]
        setPreviousTreeState(JSON.stringify(currentRoot))
        
        // Create the element using createElement from canvas context for permanent storage
        createElement(elementType, containerId, insertIndex)
        
        // The element will be automatically added to JSONtree and persisted
        // We need to track that we're creating a new element to select it later
        setIsCreatingElement(true)
        setPendingElementType(elementType)
        
        // Reset toolbar drag states
        setToolbarDragOverItem(null)
        setToolbarDragPosition(null)
        setIsToolbarDrag(false)
        
        // Clear previous toolbar selection since drop was successful
        setPreviousToolbarSelection(null)
    }

    // Drag and drop handlers
    const handleDragStart = (e, item) => {
        setDraggedItem(item)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', '')
        
        // Deselect the element that was selected when the drag starts
        if (selectedItem && selectedItem !== item.id) {
            // Save the previous selection to restore it if drag is cancelled
            setPreviousTreeSelection(selectedItem)
            setSelectedItem(null)
            setSelectedId(null)
        }
    }

    const handleDragEnd = () => {
        // If drag was cancelled (no drop occurred), restore the previous selection
        if (draggedItem && selectedItem !== draggedItem.id && previousTreeSelection) {
            setSelectedItem(previousTreeSelection)
            setSelectedId(previousTreeSelection)
            setPreviousTreeSelection(null)
        }
        
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
            // Restore previous selection since no move occurred
            restoreSelectionAndCleanup()
            return
        }

        // Check if target item allows children (has children attribute)
        if (dragPosition === 'inside' && !targetItem.children) {
            // Restore previous selection since no move occurred
            restoreSelectionAndCleanup()
            return
        }

        // Check if trying to drop in the exact same position (prevent unnecessary moves)
        const currentParent = findParentById(activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]], draggedItem.id)
        const targetParent = dragPosition === 'inside' ? targetItem : findParentById(activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]], targetItem.id)
        
        // Prevent move if dropping on the same element
        if (targetItem.id === draggedItem.id) {
            // Restore previous selection since no move occurred
            restoreSelectionAndCleanup()
            return
        }
        
        // Prevent move if dropping inside the same container (same parent)
        if (dragPosition === 'inside' && currentParent && 
            currentParent.parent === targetItem) {
            // Same container, don't move
            // Restore previous selection since no move occurred
            restoreSelectionAndCleanup()
            return
        }
        
        // Only prevent move if it's the same parent AND same position (before/after the same element)
        if (dragPosition !== 'inside' && currentParent && targetParent && 
            currentParent.parent === targetParent.parent && 
            currentParent.index === targetParent.index) {
            // Same parent and same position, don't move
            // Restore previous selection since no move occurred
            restoreSelectionAndCleanup()
            return
        }

        // Move the element using canvas context moveElement
        const success = moveElementFromCanvas(draggedItem.id, targetItem.id, dragPosition)
        if (!success) {
            // If the drop was invalid (e.g., dropping inside a root element),
            // restore previous selection and do not clear drag states.
            restoreSelectionAndCleanup()
            return
        }
        
        // Set the dragged item as the new selected item
        setSelectedItem(draggedItem.id)
        setSelectedId(draggedItem.id)
        
        // Clear previous selection since drop was successful
        setPreviousTreeSelection(null)
        
        setDraggedItem(null)
        setDragOverItem(null)
        setDragPosition(null)
    }

    // Context menu handler - now receives onContextMenu from builder
    const handleContextMenu = (e, item) => {
        e.preventDefault()
        e.stopPropagation()
        
        setSelectedItem(item.id)
        setSelectedId(item.id)
        
        // Call the context menu handler from builder with current selected item
        if(item.id !== "tw-root--banner" && item.id !== "tw-root--modal") {
            CallContextMenu(e, item)
        }
    }



    // Helper function to find parent of an element
    const findParentById = (nodes, targetId, parent = null) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === targetId) {
                return { parent, index: i }
            }
            if (nodes[i].children) {
                const result = findParentById(nodes[i].children, targetId, nodes[i])
                if (result) return result
            }
        }
        return null
    }
    
    // Helper function to restore previous selection and clean up drag state
    const restoreSelectionAndCleanup = () => {
        if (previousTreeSelection) {
            setSelectedItem(previousTreeSelection)
            setSelectedId(previousTreeSelection)
            setPreviousTreeSelection(null)
        }
        setDraggedItem(null)
        setDragOverItem(null)
        setDragPosition(null)
    }

    // Tree data manipulation using canvas context
    const moveElementFromCanvas = (draggedId, targetId, position) => {
        // Get the current tree data from canvas context
        const currentRoot = activeTab === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1]
        
        // Find the target item to determine the parent and index
        const findTargetInfo = (node, targetId) => {
            if (node.id === targetId) {
                return { node, parent: null, index: 0 }
            }
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    if (node.children[i].id === targetId) {
                        return { node: node.children[i], parent: node, index: i }
                    }
                    const result = findTargetInfo(node.children[i], targetId)
                    if (result) return result
                }
            }
            return null
        }
        
        const targetInfo = findTargetInfo(currentRoot, targetId)
        if (!targetInfo) return
        
        let containerId, insertIndex
        
        if (position === 'inside') {
            // Drop inside the target item
            containerId = targetId
            insertIndex = targetInfo.node.children ? targetInfo.node.children.length : 0
        } else {
            // Drop before or after the target item
            // Check if this is a valid drop operation
            if (!targetInfo.parent) {
                // Target is a root element, this is an invalid drop operation
                // Return false to indicate the drop should be cancelled
                return false
            }
            
            containerId = targetInfo.parent.id
            if (position === 'before') {
                insertIndex = targetInfo.index
            } else { // 'after'
                insertIndex = targetInfo.index + 1
            }
        }
        
        // Use the canvas context moveElement function
        moveElement(draggedId, containerId, insertIndex)
        return true
    }

    // Check if an item is a descendant of the dragged item
    const isChildOfDraggedItem = (itemId) => {
        if (!draggedItem) return false
        
        const currentTreeData = activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]]
        
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

    // Check if an item is a descendant of the selected item
    const isDescendantOfSelected = (itemId, selectedId) => {
        if (!selectedId || itemId === selectedId) return false
        
        const currentTreeData = activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]]
        
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

        return isDescendantOf(currentTreeData, itemId, selectedId)
    }

    // Auto-expand blocks when JSONtree changes and they have children
    useEffect(() => {
        if(JSONtree) {
            // Auto-expand blocks that now have children
            const autoExpandBlocks = (nodes) => {
                nodes.forEach(node => {
                    if (node.children && node.children.length > 0) {
                        // If this node has children and wasn't expanded before, expand it
                        if (!expandedItems.has(node.id)) {
                            setExpandedItems(prev => new Set([...prev, node.id]))
                        }
                        // Recursively check children
                        autoExpandBlocks(node.children)
                    }
                })
            }
            
            // Check both banner and modal trees
            if (JSONtree.roots[0]) autoExpandBlocks([JSONtree.roots[0]])
            if (JSONtree.roots[1]) autoExpandBlocks([JSONtree.roots[1]])
        }
    },[JSONtree]);

    // Effect to detect newly created elements and select them
    useEffect(() => {
        if (JSONtree && selectedId) {
            // Find the selected element in the current tree
            const findElement = (nodes, targetId) => {
                for (const node of nodes) {
                    if (node.id === targetId) return node
                    if (node.children) {
                        const found = findElement(node.children, targetId)
                        if (found) return found
                    }
                }
                return null
            }
            
            const currentRoot = activeTab === 'tw-root--banner' ? [JSONtree.roots[0]] : [JSONtree.roots[1]]
            const element = findElement(currentRoot, selectedId)
            
            // If element exists, ensure it's selected
            if (element) {
                setSelectedItem(selectedId)
            }
        }
    }, [JSONtree, selectedId, activeTab]);

    // Effect to detect and select newly created elements from toolbar
    useEffect(() => {
        if (isCreatingElement && pendingElementType && JSONtree && previousTreeState) {
            const currentRoot = activeTab === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1]
            const previousRoot = JSON.parse(previousTreeState)
            
            // Find the newly created element by comparing the previous and current tree states
            const findNewlyCreatedElement = (currentNode, previousNode, targetType) => {
                // If this is a new node (not in previous state), check if it's the right type
                if (!previousNode) {
                    if (currentNode.elementType === targetType || currentNode.icon === targetType) {
                        return currentNode
                    }
                }
                
                // If this node has children, check them
                if (currentNode.children) {
                    for (let i = 0; i < currentNode.children.length; i++) {
                        const currentChild = currentNode.children[i]
                        const previousChild = previousNode?.children?.[i]
                        
                        // If this child is new or different, check if it's the right type
                        if (!previousChild || JSON.stringify(currentChild) !== JSON.stringify(previousChild)) {
                            if (currentChild.elementType === targetType || currentChild.icon === targetType) {
                                return currentChild
                            }
                            
                            // Recursively check children
                            const result = findNewlyCreatedElement(currentChild, previousChild, targetType)
                            if (result) return result
                        }
                    }
                }
                
                return null
            }
            
            const newElement = findNewlyCreatedElement(currentRoot, previousRoot, pendingElementType)
            if (newElement) {
                console.log('🎯 Found and selecting newly created element:', newElement.id)
                setSelectedItem(newElement.id)
                setSelectedId(newElement.id)
                setIsCreatingElement(false)
                setPendingElementType(null)
                setPreviousTreeState(null)
            }
        }
    }, [JSONtree, isCreatingElement, pendingElementType, activeTab, setSelectedItem, setSelectedId, previousTreeState]);
    



    // Tree item renderer
    const renderTreeItem = (item, level = 0, parentId = null, isLastChild = false) => {
        const draggableChildren = item.children ? item.children.filter(child => child.draggable !== false) : []
        const hasChildren = draggableChildren.length > 0
        const isExpanded = expandedItems.has(item.id)
        const isSelected = selectedItem === item.id
        const isParentSelected = parentId && selectedItem === parentId
        const isDragging = draggedItem && draggedItem.id === item.id
        const isDragOver = dragOverItem && dragOverItem.id === item.id
        
        // New toolbar drag over states
        const isToolbarDragOver = toolbarDragOverItem && toolbarDragOverItem.id === item.id

        // Determine which classes to apply
        let headerClasses = ['tw-builder__tree-item-header']
        
        if (isSelected) {
            headerClasses.push('tw-builder__tree-item-header--selected')
            if (!isExpanded) {
                headerClasses.push('tw-builder__tree-item-header--collapsed')
            }
        } else if (hasChildren && !isExpanded && selectedItem && isDescendantOfSelected(selectedItem, item.id)) {
            // If this is a collapsed parent that has a selected descendant, show as collapsed parent with selected child
            headerClasses.push('tw-builder__tree-item-header--collapsed-parent-with-selected-child')
        } else if (isParentSelected || (selectedItem && isDescendantOfSelected(item.id, selectedItem))) {
            // This is either a direct child or any descendant of the selected item
            if (isParentSelected && isLastChild) {
                headerClasses.push('tw-builder__tree-item-header--child-selected')
            } else {
                headerClasses.push('tw-builder__tree-item-header--child-selected-intermediate')
            }
        }

        if (isDragging) {
            headerClasses.push('tw-builder__tree-item-header--dragging')
        }
        
        if (isDragOver) {
            // Only apply drag over styling if the item can actually receive children
            if (dragPosition === 'inside') {
                if (item.children || item.nestable) {
                    headerClasses.push('tw-builder__tree-item-header--drag-over')
                }
                // Don't apply any styling if item can't have children
            } else {
                // For 'before' and 'after' positions, always apply styling
                headerClasses.push('tw-builder__tree-item-header--drag-over')
            }
        }

        // Add toolbar drag over classes
        if (isToolbarDragOver) {
            // Only apply toolbar drag over styling if the item can actually receive children
            if (toolbarDragPosition === 'inside') {
                if (item.children || item.nestable) {
                    headerClasses.push('tw-builder__tree-item-header--toolbar-drag-over')
                }
                // Don't apply any styling if item can't have children
            } else {
                // For 'before' and 'after' positions, always apply styling
                headerClasses.push('tw-builder__tree-item-header--toolbar-drag-over')
            }
        }

        // Determine container classes
        let containerClasses = ['tw-builder__tree-item']
        if (isSelected && !isExpanded) {
            containerClasses.push('tw-builder__tree-item--collapsed')
        }
        if (isDragging || isChildOfDraggedItem(item.id)) {
            containerClasses.push('tw-builder__tree-item--dragging-container')
        }
        if (hasChildren) {
            containerClasses.push('tw-builder__tree-item--has-children')
        }
        if (level >= 8) {
            containerClasses.push('tw-builder__tree-item--deep-nesting')
        }

        // Ensure item.id exists for React key prop
        const itemKey = item.id || `item-${Math.random()}`;
        
        return (
            <div 
                key={itemKey} 
                className={containerClasses.join(' ')}
                style={{ 
                    // After level 2, items maintain the same padding and use horizontal overflow
                    paddingLeft: `${Math.min(level, 1) * 16}px`, 
                    position: 'relative',
                    '--drag-indent': `${Math.min(level, 1) * 16}px` // CSS variable for drag state
                }}
            >
                {/* Drop line before */}
                {isDragOver && dragPosition === 'before' && draggedItem && !isChildOfDraggedItem(item.id) && draggedItem.id !== item.id && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--before"></div>
                )}
                
                {/* Toolbar drop line before */}
                {isToolbarDragOver && toolbarDragPosition === 'before' && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--before tw-builder__drop-line--toolbar"></div>
                )}
                
                {/* Tree item header */}
                <div 
                    className={headerClasses.join(' ')}
                    onClick={() => handleItemClick(item.id)}
                    draggable={!isToolbarDrag} // Disable internal drag when toolbar drag is active
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => {
                        if (isToolbarDrag) {
                            // Handle toolbar drag
                            handleToolbarDragOver(e, item)
                        } else {
                            // Handle internal tree drag
                            handleDragOver(e, item)
                        }
                    }}
                    onDragLeave={(e) => {
                        if (isToolbarDrag) {
                            // Handle toolbar drag
                            handleToolbarDragLeave(e)
                        } else {
                            // Handle internal tree drag
                            handleDragLeave(e)
                        }
                    }}
                    onDrop={(e) => {
                        // Check if this is a toolbar element drop
                        const elementType = e.dataTransfer.getData("elementType")
                        if (elementType) {
                            handleToolbarDrop(e, item)
                        } else {
                            handleDrop(e, item)
                        }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    data-position={isDragOver ? dragPosition : null}
                    data-toolbar-position={isToolbarDragOver ? toolbarDragPosition : null}
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
                        {(() => {
                            switch (item.icon) {
                                case 'text':
                                    return <span className="tw-builder__tree-item-text-icon">T</span>;
                                case 'block':
                                    return <div className="tw-builder__tree-item-square-icon"></div>;
                                case 'image':
                                    return  <svg className="tw-builder__tree-item-image-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.04346 0.875H6.9566C5.68731 0.874989 4.67532 0.874977 3.88191 0.981645C3.06269 1.09179 2.38964 1.32519 1.85742 1.85742C1.32519 2.38964 1.09179 3.06269 0.981645 3.88191C0.874977 4.67532 0.874989 5.68724 0.875 6.95654V7.04346C0.874989 8.31273 0.874977 9.3247 0.981645 10.1181C1.09179 10.9373 1.32519 11.6104 1.85742 12.1426C2.38964 12.6748 3.06269 12.9082 3.88191 13.0184C4.67533 13.125 5.68726 13.125 6.9566 13.125H7.0434C8.31273 13.125 9.32464 13.125 10.1181 13.0184C10.9373 12.9082 11.6104 12.6748 12.1426 12.1426C12.6748 11.6104 12.9082 10.9373 13.0184 10.1181C13.125 9.3247 13.125 8.31273 13.125 7.0434V6.9566C13.125 5.68726 13.125 4.67533 13.0184 3.88191C12.9082 3.06269 12.6748 2.38964 12.1426 1.85742C11.6104 1.32519 10.9373 1.09179 10.1181 0.981645C9.3247 0.874977 8.31273 0.874989 7.04346 0.875ZM3.20833 4.375C3.20833 3.73067 3.73067 3.20833 4.375 3.20833C5.01933 3.20833 5.54167 3.73067 5.54167 4.375C5.54167 5.01933 5.01933 5.54167 4.375 5.54167C3.73067 5.54167 3.20833 5.01933 3.20833 4.375ZM4.03773 11.8621C3.9666 11.8525 3.8987 11.8421 3.83382 11.8308C4.94496 10.4869 6.0774 9.12911 7.34936 8.27622C8.08436 7.78342 8.8403 7.47897 9.63906 7.44147C10.3393 7.40851 11.106 7.57907 11.9561 8.05729C11.9501 8.84537 11.9299 9.46108 11.8624 9.96263C11.7697 10.6525 11.5973 11.0383 11.318 11.3176C11.0386 11.597 10.6528 11.7693 9.96298 11.8621C9.25639 11.9571 8.32306 11.9583 7.00035 11.9583C5.67769 11.9583 4.74437 11.9571 4.03773 11.8621Z"/>
                                            </svg>;
                                case 'divider':
                                    return <div className="tw-builder__tree-item-divider-icon"></div>;
                                case 'button':
                                    return <div className="tw-builder__tree-item-button-icon"></div>;
                                default:
                                    return <div className="tw-builder__tree-item-square-icon"></div>;
                            }
                        })()}
                    </div>
                    
                    {/* Item label */}
                    <span className="tw-builder__tree-item-label">
                        {item.label}
                    </span>
                </div>
                
                {/* Toolbar drop line inside - positioned over the item */}
                {isToolbarDragOver && toolbarDragPosition === 'inside' && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--toolbar tw-builder__drop-line--inside"></div>
                )}
                
                {/* Background extend for selected parent */}
                {isParentSelected && (
                    <div className="tw-builder__tree-item-background-extend"></div>
                )}
                
                {/* Render children if item is expanded */}
                {hasChildren && isExpanded && (
                    <div className="tw-builder__tree-children">
                        {item.children
                            .filter(child => child.draggable !== false) // Filter out non-draggable elements
                            .map((child, index, filteredChildren) => renderTreeItem(child, level + 1, item.id, index === filteredChildren.length - 1))}
                    </div>
                )}
                
                {/* Drop line after */}
                {isDragOver && dragPosition === 'after' && draggedItem && !isChildOfDraggedItem(item.id) && draggedItem.id !== item.id && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--after"></div>
                )}
                
                {/* Toolbar drop line after */}
                {isToolbarDragOver && toolbarDragPosition === 'after' && (
                    <div className="tw-builder__drop-line tw-builder__drop-line--after tw-builder__drop-line--toolbar"></div>
                )}
            </div>
        )
    }

    // Dropdown menu items
    const dropdownMenu = (
        <>
            <Link href="/dashboard" className="dropdown__item tw-builder__dropdown-item tw-builder__dropdown-item--home" onClick={() => handleDropdownAction('home')}>
                <span>Back to Dashboard</span>
            </Link>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={() => handleDropdownAction('settings')}>
                <span>Site settings</span>
            </button>
            <button className="tw-builder__dropdown-item dropdown__item" onClick={() => handleDropdownAction('theme')}>
                <span>Theme</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={() => handleDropdownAction('appearance')}>
                <span>Appearance</span>
            </button>
            <button className="dropdown__item tw-builder__dropdown-item" onClick={() => handleDropdownAction('upgrade')}>
                <span>Upgrade to pro</span>
            </button>
            <div className="dropdown__divider"></div>
            <button className="dropdown__item tw-builder__dropdown-item tw-builder__dropdown-item--help" onClick={() => handleDropdownAction('help')}>
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

            {/* Tab and Tree container */}
            <div className='tw-builder__tab-tree-container'>
                {/* Tab switching section with animated slider */}
                <div className="tw-builder__tab-section">
                    <div className="tw-builder__tab-container">
                        <div 
                            className="tw-builder__tab-slider" 
                            style={{ transform: `translateX(${activeTab === 'tw-root--banner' ? '0%' : '100%'})` }}
                        ></div>
                        <button 
                            className={`tw-builder__tab ${activeTab === 'tw-root--banner' ? 'tw-builder__tab--active' : ''}`}
                            onClick={() => {
                                updateActiveRoot('tw-root--banner');
                                setSelectedId(null);
                                setSelectedItem(null);
                            }}
                        >
                            Banner
                        </button>
                        <button 
                            className={`tw-builder__tab ${activeTab === 'tw-root--modal' ? 'tw-builder__tab--active' : ''}`}
                            onClick={() => {
                                updateActiveRoot('tw-root--modal');
                                setSelectedId(null);
                                setSelectedItem(null);
                            }}
                        >
                            Modal
                        </button>
                    </div>
                </div>

                <div className='tw-builder__tab-tree-divider'></div>

                {/* Tree view content that changes based on active tab */}
                <div className="tw-builder__tree-content">
                    <div 
                        className="tw-builder__tree-container"
                        onDragOver={(e) => {
                            // Detect toolbar drag at container level
                            if (e.dataTransfer.types.includes("elementtype")) {
                                setIsToolbarDrag(true)
                            }
                        }}
                        onDragLeave={(e) => {
                            // Reset toolbar drag state when leaving container
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setIsToolbarDrag(false)
                            }
                        }}
                    >

                        {activeTab === 'tw-root--banner' && JSONtree.roots[0] && [JSONtree.roots[0]].map((item, index) => renderTreeItem(item, 0, null, index === 0))}
                        {activeTab === 'tw-root--modal' && JSONtree.roots[1] && [JSONtree.roots[1]].map((item, index) => renderTreeItem(item, 0, null, index === 0))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuilderLeftPanel;
