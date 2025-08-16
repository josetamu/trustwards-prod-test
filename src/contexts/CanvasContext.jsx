'use client'

import React, { createContext, useReducer, useContext, useEffect, useCallback } from "react";

const CanvasContext = createContext(null);

//Generate a unique not repeated id made by tw- and 6 random letters (e.g. tw-xhjkqu)
const generateUniqueId = (tree) => {
    const collectIds = (node, ids = new Set()) => {
        ids.add(node.id);
        if (node.children) {
            node.children.forEach(child => collectIds(child, ids));
        }
        return ids;
    };

    const existingIds = collectIds(tree);
    let newId;
    do {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let randomLetters = '';
        for (let i = 0; i < 6; i++) {
            randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        newId = `tw-${randomLetters}`;
    } while (existingIds.has(newId));
    return newId;
};

/*
* To add a builder action to the stack, we need to:
* 1. Make a copy of the current JSONtree before the action for undo/redo stacks (deepCopy)
* 2. Execute the action that changes the JSONtree (action addElement, removeElement, addClass, removeClass...)
* 3. Update the JSONtree state with the changed JSONtree using SET (setJSONtree)
*/
const deepCopy = (obj) => structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj)); //Creates a deep exact copy of the passed JSON (used to save the JSONtree in the undo/redo stacks)
function treeReducer(state, action) {
    const { past, present, future } = state;

    switch (action.type) {
        case 'INIT': //The JSONtree when loading the builder (prevents the initial tree from being added to the undo stack)
            return {
                past: [],
                present: action.payload,
                future: []
            };
        case 'SET': //Saves the current JSONtree in the undo stack, puts the new JSONtree in the present and clears the redo stack
            return {
                past: [...past, deepCopy(present)],
                present: action.payload,
                future: []
            };
        case 'UNDO': //Gets and remove the last JSONtree from the undo stack and puts it in the present state, puts the current JSONtree in the redo stack
            if (past.length === 0) return state;
            return {
                past: past.slice(0, -1),
                present: past[past.length - 1],
                future: [deepCopy(present), ...future]
            };
        case 'REDO': //Gets and remove the first JSONtree from the redo stack and puts it in the present state, puts the current JSONtree in the undo stack
            if (future.length === 0) return state;
            return {
                past: [...past, deepCopy(present)],
                present: future[0],
                future: future.slice(1)
            };
        default:
            return state;
    }
}

export const CanvasProvider = ({ children, siteData, CallContextMenu = null }) => {
    /*Canvas Context manages all actions related to the JSONtree*/
    
    const [state, dispatch] = useReducer(treeReducer, {
        past: [], //undo stack
        present: null, // initially null until data is fetched
        future: [] //redo stack
    });

    useEffect(() => {
        if (siteData && state.present === null) {
            const userJSON = siteData.JSON;
            const initialTree = {
                idsData: [], /*for each id, stores its right panel properties*/
                classesData: [], /*for each class, stores its right panel properties*/
                activeRoot: "tw-root--banner", //stored active root
                roots: [
                    {
                        id: "tw-root--banner", //banner root
                        elementType: "banner",
                        icon: "banner",
                        label: "Banner",
                        classList: [],
                        tagName: "div",
                        children: [],
                        nestable: true,
                    },
                    {
                        id: "tw-root--modal", //modal root
                        elementType: "modal",
                        icon: "modal",
                        label: "Modal",
                        classList: [],
                        tagName: "div",
                        children: [],
                        nestable: true,
                    }
                ]
            };
            const initialState = {
                past: [],
                present: userJSON ? userJSON : initialTree,
                future: []
            };
            dispatch({ type: 'INIT', payload: initialState.present });
            setActiveRoot(initialState.present.activeRoot); //Set the active root as the initial root
            setActiveTab(initialState.present.activeRoot); //Set the active root as the initial tab
        }
    }, [siteData, state.present]);    

    const JSONtree = state.present; //The real JSONtree at any moment (state.present)
    const [selectedId, setSelectedId] = React.useState(null); //Starts the root as the selectedId (Canvas.jsx will manage the selected element)
    const [activeRoot, setActiveRoot] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState(null); //State to track which tab is currently active (banner or modal)
    const [selectedItem, setSelectedItem] = React.useState(null) //State to track which item is currently selected in the tree

    //this happens when changing the tab: changes active root, nothing is selected, sets the active tab and updates the real JSONtree
    const updateActiveRoot = (newActiveRoot) => {
        setActiveRoot(newActiveRoot);
        setSelectedId(null); //Reset the selectedId when the active root changes
        setActiveTab(newActiveRoot);
        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the update
        updated.activeRoot = newActiveRoot;
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    }

    //Updates the real JSONtree
    const setJSONtree = useCallback((newTree, saveToHistory = true) => {
        if (saveToHistory) {
            dispatch({ type: 'SET', payload: newTree });
        } else {
            // Force direct update without history (rarely used)
            dispatch({ type: 'SET', payload: newTree, skipHistory: true });
        }
    }, []);

    //Undo and Redo JSONtree (Ctrl+Z / Ctrl+Y) or (Cmd+Z / Cmd+Y)
    const undo = useCallback(() => {
        dispatch({ type: 'UNDO' });
    }, []);
    const redo = useCallback(() => {
        dispatch({ type: 'REDO' });
    }, []);
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey; // Handles both Windows (Ctrl) and macOS (Cmd)

            if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            if ((isCtrlOrCmd && e.key === 'y') || (isCtrlOrCmd && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    /*
    * Add element in the JSONtree inside the parentId given (drag & drop system) or if not given, then the current selectedId (Creation of the React element is managed by Canvas.jsx)
    * properties - Add the element in the JSONtree with its properties with format: {tagName: "div", children: [], etc..} - id and classList are created automatically
    * parentId - The id of the parent where the element will be added (optional)
    * insertIndex - The index where the element will be added (optional - used by drag & drop)
    */
    const addElement = (properties, parentId, insertIndex = null) => {
        const add = (node, parent) => {
            const currentSelectedId = parentId || selectedId || activeRoot; //Put it inside the parentId directly if given, otherwise use the selected element, otherwise fallback to the root

            if (node.id === currentSelectedId) {
                const newNode = { ...properties, id: generateUniqueId(JSONtree) }; //Creates a new node with the properties given and a unique id

                // Assign unique IDs to all children recursively
                const assignIdsRecursively = (children) => {
                    return children.map(child => {
                        const newChild = { ...child, id: generateUniqueId(JSONtree) };
                        if (newChild.children) {
                            newChild.children = assignIdsRecursively(newChild.children);
                        }
                        return newChild;
                    });
                };
                if (newNode.children) {
                    newNode.children = assignIdsRecursively(newNode.children);
                }

                if (node.children) { //If the selected node has children
                    if (insertIndex === null || insertIndex >= node.children.length) { //If the insertIndex is null or exceeds the number of children, append the new node to the end
                        node.children = [...node.children, newNode];
                    } else { //If the insertIndex is valid, insert the new node at the specified index
                        node.children.splice(insertIndex, 0, newNode);
                    }
                } else if (parent) { //If the selected node has no children but has a parent, insert the new node immediately after the current node
                    const index = parent.children.findIndex(child => child.id === node.id);
                    parent.children.splice(index + 1, 0, newNode);
                }
            } else if (node.children) { // Recursively search through children to find the correct node for insertion
                node.children.forEach(child => add(child, node));
            }
        };

        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the addElement
        add(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1], null); //Add the element in the current JSONtree, in the activeRoot
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };    

    /*
    * Remove element from the JSONtree (Delete of the React element is managed by Canvas.jsx)
    * id - The id of the element to remove from the JSONtree
    */
    const removeElement = (id) => {
        const remove = (node) => {
            if (!node.children) return;
            node.children = node.children.filter((child) => child.id !== id);
            node.children.forEach(remove);
        };
        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the remove
        if (updated.id == 'tw-root--banner' || updated.id == 'tw-root--modal') {
            setJSONtree(null); //If the element to remove is the root, set the JSONtree to null
        } else {
            remove(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]); //Remove the element in the current JSONtree
            setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
        }
    };

    /*
    * Add class to an element
    * id - The id of the element to add the class to
    * className - The class to add to the element
    */
    const addClass = (id, className) => {
        const updateClass = (node) => {
            if (node.id === id) {
                node.classList.push(className);
                return;
            }
            if (node.children) {
                node.children.forEach(updateClass);
            }
        };
        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the addClass
        updateClass(updated); //Add the class to the element in the current JSONtree
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };

    /*
    * Remove class from an element
    * id - The id of the element to remove the class from
    * className - The class to remove from the element
    */
    const removeClass = (id, className) => {
        const updateClass = (node) => {
            if (node.id === id) {
                node.classList = node.classList.filter((cls) => cls !== className);
                return;
            }
            if (node.children) {
                node.children.forEach(updateClass);
            }
        };
        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the removeClass
        updateClass(updated); //Remove the class from the element in the current JSONtree
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };

    /*
    * Move element (used by drag & drop)
    * elementId - The id of the element to move
    * newParentId - The id of the new parent
    * insertIndex - The index where the element will be inserted
    */
    const moveElement = (elementId, newParentId, insertIndex) => {
        const updated = deepCopy(JSONtree);
        let elementToMove = null;
        let originalParentId = null;
        let originalIndex = null;
    
        const removeElementById = (node) => {
            if (!node.children) return;
    
            node.children = node.children.filter((child, index) => {
                if (child.id === elementId) {
                    elementToMove = child;
                    originalParentId = node.id;
                    originalIndex = index;
                    return false;
                }
                return true;
            });
    
            node.children.forEach(removeElementById);
        };
    
        const insertElementById = (node) => {
            if (node.id === newParentId) {
                if (!node.children) node.children = [];
    
                if (newParentId === originalParentId && originalIndex < insertIndex) {
                    insertIndex -= 1;
                }
    
                if (insertIndex >= node.children.length) {
                    node.children.push(elementToMove);
                } else {
                    node.children.splice(insertIndex, 0, elementToMove);
                }
            } else if (node.children) {
                node.children.forEach(insertElementById);
            }
        };
    
        removeElementById(updated.activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]);
        insertElementById(updated.activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]);
        setJSONtree(updated);
    };   

    /*
    * Elements creation
    */
    const createElement = (type, containerId, insertIndex) => {
        switch(type) {
            case 'block': //Block
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "block",
                        icon: "block",
                        tagName: "div",
                        label: "Block",
                        children: [],
                        classList: ["tw-block"],
                        nestable: true,
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "block",
                        icon: "block",
                        tagName: "div",
                        label: "Block",
                        children: [],
                        classList: ["tw-block"],
                        nestable: true,
                    });
                }
            break;
            case 'image': //Image
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "image",
                        icon: "image",
                        tagName: "img",
                        label: "Image",
                        src: '/assets/builder-default-image.svg',
                        classList: ["tw-image"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "image",
                        icon: "image",
                        tagName: "img",
                        label: "Image",
                        src: '/assets/builder-default-image.svg',
                        classList: ["tw-image"]
                    });
                }
            break;
            case 'divider': //Divider
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "divider",
                        icon: "divider",
                        tagName: "div",
                        label: "Divider",
                        classList: ["tw-divider"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "divider",
                        icon: "divider",
                        tagName: "div",
                        label: "Divider",
                        classList: ["tw-divider"]
                    });
                }
            break;
            case 'text': //Text
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "text",
                        icon: "text",
                        tagName: "h3",
                        label: "Text",
                        text: "New Text",
                        classList: ["tw-text"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "text",
                        icon: "text",
                        tagName: "h3",
                        label: "Text",
                        text: "New Text",
                        classList: ["tw-text"]
                    });
                }
            break;
            case 'accept-all': //Accept all
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Accept all",
                        text: "Accept all",
                        classList: ["tw-accept-all"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Accept all",
                        text: "Accept all",
                        classList: ["tw-accept-all"]
                    });
                }
            break;
            case 'reject-all': //Reject all
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Reject all",
                        text: "Reject all",
                        classList: ["tw-reject-all"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Reject all",
                        text: "Reject all",
                        classList: ["tw-reject-all"]
                    });
                }
            break;
            case 'open-modal': //Open modal
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Open Modal",
                        text: "Settings",
                        classList: ["tw-open-modal"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Open Modal",
                        text: "Settings",
                        classList: ["tw-open-modal"]
                    });
                }
            break;
            case 'enable-categories': //Enable categories
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Enable Categories",
                        text: "Enable all",
                        classList: ["tw-enable-categories"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Enable Categories",
                        text: "Enable all",
                        classList: ["tw-enable-categories"]
                    });
                }
            break;
            case 'disable-categories': //Disable categories
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Disable Categories",
                        text: "Disable all",
                        classList: ["tw-disable-categories"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Disable Categories",
                        text: "Disable all",
                        classList: ["tw-disable-categories"]
                    });
                }
            break;
            case 'save-categories': //Save categories
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Save Categories",
                        text: "Save",
                        classList: ["tw-save-categories"]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        elementType: "button",
                        icon: "button",
                        tagName: "div",
                        label: "Save Categories",
                        text: "Save",
                        classList: ["tw-save-categories"]
                    });
                }
            break;
            case 'categories': //Categories (block type)
                if(containerId && insertIndex) { //Added from drag&drop
                    addElement({
                        elementType: "categories",
                        icon: "categories",
                        tagName: "div",
                        label: "Categories",
                        classList: ["tw-block", "tw-categories"],
                        children: [
                            {
                                elementType: "block",
                                icon: "block",
                                tagName: "div", //Expander
                                label: "Expander",
                                classList: ["tw-block", "tw-categories__expander"],
                                children: [
                                    {
                                        elementType: "block",
                                        icon: "block",
                                        tagName: "div", //Expander Header
                                        label: "Header",
                                        classList: ["tw-block", "tw-categories__expander-header"],
                                        children: [
                                            {
                                                elementType: "block",
                                                icon: "block",
                                                tagName: "div", //Expander Header Label
                                                label: "Label",
                                                classList: ["tw-block", "tw-categories__expander-header-title"],
                                                children: [
                                                    {
                                                        elementType: "block",
                                                        icon: "block",
                                                        tagName: "div", //Expander Header Label Icon
                                                        label: "Icon",
                                                        children: [
                                                            {
                                                                tagName: "svg",
                                                                attributes: {
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    viewBox: "0 0 24 24",
                                                                    color: "currentColor",
                                                                    fill: "none"
                                                                },
                                                                classList: [],
                                                                draggable: false,
                                                                children: [
                                                                    {
                                                                        tagName: "path",
                                                                        attributes: {
                                                                            fillRule: "evenodd",
                                                                            clipRule: "evenodd",
                                                                            d: "M12 2.75C12.6904 2.75 13.25 3.30964 13.25 4V10.75H20C20.6904 10.75 21.25 11.3096 21.25 12C21.25 12.6904 20.6904 13.25 20 13.25H13.25V20C13.25 20.6904 12.6904 21.25 12 21.25C11.3096 21.25 10.75 20.6904 10.75 20V13.25H4C3.30964 13.25 2.75 12.6904 2.75 12C2.75 11.3096 3.30964 10.75 4 10.75H10.75V4C10.75 3.30964 11.3096 2.75 12 2.75Z",
                                                                            fill: "currentColor"
                                                                        },
                                                                        classList: [],
                                                                        draggable: false,
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        classList: ["tw-categories__expander-icon"],
                                                    },
                                                    {
                                                        elementType: "text",
                                                        icon: "text",
                                                        tagName: "span", //Expander Header Label Title
                                                        label: "Text",
                                                        classList: ["tw-text"],
                                                        text: "Category",
                                                    },
                                                ],
                                            },
                                            {
                                                elementType: "block",
                                                icon: "block",
                                                tagName: "div", //Expander Switch
                                                label: "Switch",
                                                children: [
                                                    {
                                                        tagName: "input",
                                                        attributes: {
                                                            type: "checkbox",
                                                            name: "category",
                                                        },
                                                        classList: ["tw-categories__expander-checkbox", "tw-categories__expander-checkbox--category"],
                                                        draggable: false,
                                                    },
                                                    {
                                                        tagName: "span",
                                                        classList: ["tw-categories__expander-toggle-icon"],
                                                        draggable: false,
                                                    }
                                                ],
                                                classList: ["tw-categories__expander-toggle", "tw-categories__expander-toggle--category"],
                                            },
                                        ],
                                    },
                                    {
                                        elementType: "block",
                                        icon: "block",
                                        tagName: "div", //Expander content
                                        label: "Block",
                                        classList: ["tw-block", "tw-categories__expander-content"],
                                        children: [
                                            {
                                                elementType: "text",
                                                icon: "text",
                                                tagName: "p", //Expander Content Paragraph
                                                label: "Text",
                                                classList: ["tw-text"],
                                                text: "Here goes a great description of the category.",
                                            },
                                            
                                        ],
                                    },
                                ],
                            },
                        ]
                    }, containerId, insertIndex);
                } else { //Added from toolbar
                    addElement({
                        type: "categories",
                        icon: "categories",
                        tagName: "div",
                        label: "Categories",
                        classList: ["tw-block", "tw-categories"],
                        children: [
                            {
                                elementType: "block",
                                icon: "block",
                                tagName: "div", //Expander
                                label: "Expander",
                                classList: ["tw-block", "tw-categories__expander"],
                                children: [
                                    {
                                        elementType: "block",
                                        icon: "block",
                                        tagName: "div", //Expander Header
                                        label: "Header",
                                        classList: ["tw-block", "tw-categories__expander-header"],
                                        children: [
                                            {
                                                elementType: "block",
                                                icon: "block",
                                                tagName: "div", //Expander Header Label
                                                label: "Label",
                                                classList: ["tw-block", "tw-categories__expander-header-title"],
                                                children: [
                                                    {
                                                        elementType: "block",
                                                        icon: "block",
                                                        tagName: "div", //Expander Header Label Icon
                                                        label: "Icon",
                                                        children: [
                                                            {
                                                                tagName: "svg",
                                                                attributes: {
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    viewBox: "0 0 24 24",
                                                                    color: "currentColor",
                                                                    fill: "none"
                                                                },
                                                                classList: [],
                                                                draggable: false, //cant be displayed, selectable or draggable
                                                                children: [
                                                                    {
                                                                        tagName: "path",
                                                                        attributes: {
                                                                            fillRule: "evenodd",
                                                                            clipRule: "evenodd",
                                                                            d: "M12 2.75C12.6904 2.75 13.25 3.30964 13.25 4V10.75H20C20.6904 10.75 21.25 11.3096 21.25 12C21.25 12.6904 20.6904 13.25 20 13.25H13.25V20C13.25 20.6904 12.6904 21.25 12 21.25C11.3096 21.25 10.75 20.6904 10.75 20V13.25H4C3.30964 13.25 2.75 12.6904 2.75 12C2.75 11.3096 3.30964 10.75 4 10.75H10.75V4C10.75 3.30964 11.3096 2.75 12 2.75Z",
                                                                            fill: "currentColor"
                                                                        },
                                                                        classList: [],
                                                                        draggable: false, //cant be displayed, selectable or draggable
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        classList: ["tw-categories__expander-icon"],
                                                    },
                                                    {
                                                        elementType: "text",
                                                        icon: "text",
                                                        tagName: "span", //Expander Header Label Title
                                                        label: "Text",
                                                        classList: ["tw-text"],
                                                        text: "Category",
                                                    },
                                                ],
                                            },
                                            {
                                                elementType: "switch",
                                                icon: "switch",
                                                tagName: "div", //Expander Switch
                                                label: "Switch",
                                                children: [
                                                    {
                                                        tagName: "input",
                                                        attributes: {
                                                            type: "checkbox",
                                                            name: "category",
                                                        },
                                                        classList: ["tw-categories__expander-checkbox", "tw-categories__expander-checkbox--category"],
                                                        draggable: false, //cant be displayed, selectable or draggable
                                                    },
                                                    {
                                                        tagName: "span",
                                                        classList: ["tw-categories__expander-toggle-icon"],
                                                        draggable: false, //cant be displayed, selectable or draggable
                                                    }
                                                ],
                                                classList: ["tw-categories__expander-toggle", "tw-categories__expander-toggle--category"],
                                            },
                                        ],
                                    },
                                    {
                                        elementType: "block",
                                        icon: "block",
                                        tagName: "div", //Expander content
                                        label: "Block",
                                        classList: ["tw-block", "tw-categories__expander-content"],
                                        children: [
                                            {
                                                elementType: "text",
                                                icon: "text",
                                                tagName: "p", //Expander Content Paragraph
                                                label: "Text",
                                                classList: ["tw-text"],
                                                text: "Here goes a great description of the category.",
                                            },
                                            
                                        ],
                                    },
                                ],
                            },
                        ]
                    });
                }
            break;
        }
    }

    return (
        <CanvasContext.Provider value={{ JSONtree, setJSONtree, addElement, removeElement, selectedId, setSelectedId, addClass, removeClass,
        moveElement, createElement, activeRoot, updateActiveRoot, activeTab, generateUniqueId, deepCopy, CallContextMenu, selectedItem, setSelectedItem }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);