'use client'

import React, { createContext, useReducer, useContext, useEffect, useState, useCallback } from "react";
import { JSfunctions } from '@contexts/JSfunctionsContext'; //Used by runElementScript() eval

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

export const CanvasProvider = ({ children, siteData, CallContextMenu = null, setIsFirstTime }) => {
    /*Canvas Context manages all actions related to the JSONtree*/
    const defaultTree = {
        idsCSSData: [], /*for each id, stores its right panel properties*/
        classesCSSData: [], /*for each class, stores its right panel properties*/
        activeRoot: "tw-root--banner", //stored active root
        isFirstTime: true, //stored if it is the first time on the builder to open the builder themes
        blockEvents: false, //to block user events until a decision is made
        blockScroll: false, //to block scroll until a decision is made
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
    
    const [state, dispatch] = useReducer(treeReducer, {
        past: [], //undo stack
        present: defaultTree, // initial tree until data is fetched
        future: [] //redo stack
    });

    useEffect(() => {
        if (siteData) {
            const userJSON = siteData.JSON;
            const initialState = {
                past: [],
                present: userJSON ? userJSON : defaultTree,
                future: []
            };
            dispatch({ type: 'INIT', payload: initialState.present });
            setActiveRoot(initialState.present.activeRoot); //Set the active root as the initial root
            setActiveTab(initialState.present.activeRoot); //Set the active root as the initial tab
            setIsFirstTime(initialState.present.isFirstTime); //Set the isFirstTime as the initial isFirstTime to open the builder themes
        }
    }, [siteData]);    

    const JSONtree = state.present; //The real JSONtree at any moment (state.present)
    const [selectedId, setSelectedId] = React.useState(null); //Starts the root as the selectedId (Canvas.jsx will manage the selected element)
    const [activeRoot, setActiveRoot] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState(null); //State to track which tab is currently active (banner or modal)
    const [selectedItem, setSelectedItem] = React.useState(null) //State to track which item is currently selected in the tree
    
    // State to track toolbar drag operations (only usable for detecting the creation of elements from toolbar into left panel's tree or canvas)
    const [isToolbarDragActive, setIsToolbarDragActive] = React.useState(false);
    const [previousSelectionBeforeToolbarDrag, setPreviousSelectionBeforeToolbarDrag] = React.useState(null);
    const [isCreatingElementFromToolbar, setIsCreatingElementFromToolbar] = React.useState(false);
    const [previousTreeStateBeforeCreation, setPreviousTreeStateBeforeCreation] = React.useState(null);

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
    * Add a CSS property (for CSS controls)
    * type - id or class
    * selector - #name, .name...
    * property - the CSS property: color, background-color, padding, margin, etc...
    * value - the value of the property (if empty string "", the property will be removed)
    */
    const addCSSProperty = (type, selector, propertyOrObject, value) => {
        let updatedIdsCSSData = JSONtree.idsCSSData;
        let updatedClassesCSSData = JSONtree.classesCSSData;
    
        // Normalize to object
        const propertiesToAdd =
            typeof propertyOrObject === "object" && propertyOrObject !== null
                ? propertyOrObject
                : { [propertyOrObject]: value };
    
        // If a property has value === "", we remove it
        const cleanProperties = (oldProps, newProps) => {
            const updated = { ...oldProps };
            Object.entries(newProps).forEach(([prop, val]) => {
                if (val === "") {
                    delete updated[prop];
                } else {
                    updated[prop] = val;
                }
            });
            return updated;
        };
    
        switch (type) {
            case "id": {
                const existingIdIndex = JSONtree.idsCSSData.findIndex(
                    (item) => item.id === selector
                );
    
                if (existingIdIndex !== -1) {
                    const updatedProperties = cleanProperties(
                        JSONtree.idsCSSData[existingIdIndex].properties,
                        propertiesToAdd
                    );
                    updatedIdsCSSData = [...JSONtree.idsCSSData];
                    updatedIdsCSSData[existingIdIndex] = {
                        ...JSONtree.idsCSSData[existingIdIndex],
                        properties: updatedProperties,
                    };
                } else {
                    updatedIdsCSSData = [
                        ...JSONtree.idsCSSData,
                        { id: selector, properties: propertiesToAdd },
                    ];
                }
                break;
            }
    
            case "class": {
                const existingClassIndex = JSONtree.classesCSSData.findIndex(
                    (item) => item.className === selector
                );
    
                if (existingClassIndex !== -1) {
                    const updatedProperties = cleanProperties(
                        JSONtree.classesCSSData[existingClassIndex].properties,
                        propertiesToAdd
                    );
                    updatedClassesCSSData = [...JSONtree.classesCSSData];
                    updatedClassesCSSData[existingClassIndex] = {
                        ...JSONtree.classesCSSData[existingClassIndex],
                        properties: updatedProperties,
                    };
                } else {
                    updatedClassesCSSData = [
                        ...JSONtree.classesCSSData,
                        { className: selector, properties: propertiesToAdd },
                    ];
                }
                break;
            }
        }
    
        const updated = deepCopy(JSONtree);
        updated.idsCSSData = updatedIdsCSSData;
        updated.classesCSSData = updatedClassesCSSData;
        setJSONtree(updated);
    };
    

    /*
    * Add a JSON property (for HTML and Javascript (attr) controls)
    * id - The id of the element to add the property to
    * property - The property to add
    * value - The value of the property
    */
    const addJSONProperty = (id, property, value) => {
        const findAndUpdateElement = (node) => { // Find the element with the given id and update its property
            if (node.id === id) {
                // If value is empty string, remove the property
                if (value === "") {
                    delete node[property];
                } else {
                    // Update the property with the new value
                    node[property] = value;
                }
                runElementScript(node); //re-run the javascript function of the node if it has one
                return true; // Element found and updated
            }
            
            // Recursively search through children
            if (node.children) {
                for (let child of node.children) {
                    if (findAndUpdateElement(child)) {
                        return true; // Element found in children
                    }
                }
            }
            return false; // Element not found
        };

        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the addProperty
        updated.roots.forEach(root => findAndUpdateElement(root)); // Search through all roots to find and update the element
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };
    //re-run the javascript function of a node if it has one
    const runElementScript = (node) => {
        if(node.script) {
            eval(node.script);
        }
    }

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
                addDefaultCSSProperties(newNode); //Add default CSS properties to the new node

                // Assign unique IDs to all children recursively
                const assignIdsRecursively = (children) => {
                    return children.map(child => {
                        const newChild = { ...child, id: generateUniqueId(JSONtree) };
                        addDefaultCSSProperties(newChild); //Add default CSS properties to the new child

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

        const idsCSSDataToMerge = [];
        const addDefaultCSSProperties = (node) => {
            if(node.defaultCSS) {
                idsCSSDataToMerge.push({ id: node.id, properties: node.defaultCSS }); //Add default width and height auto to img
            }
        }



        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the addElement
        add(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1], null); //Add the element in the current JSONtree, in the activeRoot

        //Update the idsCSSData with the default CSS on idsCSSDataToMerge
        //update the updated JSONtree with the new idsCSSData
        const finalIdsCSSData = [...JSONtree.idsCSSData, ...idsCSSDataToMerge];
        updated.idsCSSData = finalIdsCSSData;

        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };    

    /*
    * Remove element from the JSONtree (Delete of the React element is managed by Canvas.jsx)
    * id - The id of the element to remove from the JSONtree
    */
    const removeElement = (id) => {
        const idsDataToRemove = [];

        const remove = (node) => {
            if (!node.children) return;
            
            node.children = node.children.filter((child) => {
                if (child.id === id) {
                    idsDataToRemove.push(child.id);
                    return false;
                }

                remove(child);
                return true;
            });
        };

        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the remove
        remove(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]); //Remove the element in the current JSONtree

        //Update the idsCSSData by removing the id of the removed element
        //update the updated JSONtree with the new idsCSSData
        const finalIdsCSSData = JSONtree.idsCSSData.filter(item => !idsDataToRemove.includes(item.id));
        updated.idsCSSData = finalIdsCSSData;

        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree

        setSelectedId(null);
    };

    /*
    * Add class to an element (and to classesCSSData if it doesn't exist)
    * id - The id of the element to add the class to
    * className - The class to add to the element
    */
    const addClass = (id, className) => {
        const addClassToElement = (node) => {
            if (node.id === id) {
                // Only add the class to the element if it doesn't have it already
                if (!node.classList.includes(className)) {
                    node.classList.push(className);
                }
                return;
            }
            if (node.children) {
                node.children.forEach(addClassToElement);
            }
        };

        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the addClass
        addClassToElement(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]); //Add the class to the element in the current JSONtree

        // Check if the class exists in the updated classesCSSData, if not add it
        if (!updated.classesCSSData.some(item => item.className === className)) {
            updated.classesCSSData.push({
                className: className,
                properties: {}
            });
        }

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
        updateClass(activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1]); //Remove the class from the element in the current JSONtree

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
        // Element configurations
        const elementConfigs = {
            'block': {
                elementType: "block",
                icon: "block",
                tagName: "div",
                label: "Block",
                href: null,
                children: [],
                classList: ["tw-block"],
                nestable: true,
            },
            'image': {
                elementType: "image",
                icon: "image",
                tagName: "img",
                label: "Image",
                src: '/assets/builder-default-image.svg',
                defaultCSS: {
                    'width': '200px',
                    'height': '200px',
                    'display': 'block',
                    'object-fit': 'cover'
                },
                classList: ["tw-image"]
            },
            'divider': {
                elementType: "divider",
                icon: "divider",
                tagName: "div",
                label: "Divider",
                classList: ["tw-divider"],
                defaultCSS: { 'width': '100%', 'height': '2px', 'background-color': '#E6E6E6' }
            },
            'text': {
                elementType: "text",
                icon: "text",
                tagName: "h3",
                label: "Text",
                text: "New Text 2",
                classList: ["tw-text"],
                defaultCSS: { 'color': '#000000', 'width': 'fit-content', 'min-width': 'fit-content' },
            },
            'accept-all': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Accept all",
                text: "Accept all",
                classList: ["tw-accept-all"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#19D85C',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'reject-all': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Reject all",
                text: "Reject all",
                classList: ["tw-reject-all"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#FA243B',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'open-modal': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Open Modal",
                text: "Settings",
                classList: ["tw-open-modal"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#111111',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'enable-categories': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Enable Categories",
                text: "Enable all",
                classList: ["tw-enable-categories"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#111111',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'disable-categories': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Disable Categories",
                text: "Disable all",
                classList: ["tw-disable-categories"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#111111',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'save-categories': {
                elementType: "button",
                icon: "button",
                tagName: "div",
                label: "Save Categories",
                text: "Save",
                classList: ["tw-save-categories"],
                defaultCSS: { 
                    'font-size': '14px',
                    'color': '#fff',
                    'text-align': 'center',
                    'font-weight': '600',
                    'letter-spacing': '-0.02em',
                    'border-radius': '8px',
                    'background': '#0099FE',
                    'width': 'fit-content',
                    'padding': '6px 12px'
                }
            },
            'categories': {
                elementType: "categories",
                icon: "categories",
                tagName: "div",
                label: "Categories",
                classList: ["tw-block", "tw-categories"],
                script: 'categoriesElementsFunction()',
                attributes: {
                    'data-duration': '0.6s',
                },
                defaultCSS: {
                    "--expanded-icon-rotate": "45deg",
                    "--expanded-icon-duration": "0.2s"
                },
                children: [
                    {
                        elementType: "block",
                        icon: "block",
                        tagName: "div", //Expander
                        label: "Expander",
                        classList: ["tw-block", "tw-categories__expander"],
                        script: 'categoriesElementsFunction()',
                        defaultCSS: {
                            'display': 'flex',
                            'flex-direction': 'column',
                            'cursor': 'pointer'
                        },
                        children: [
                            {
                                elementType: "block",
                                icon: "block",
                                tagName: "div", //Expander Header
                                label: "Header",
                                classList: ["tw-block", "tw-categories__expander-header"],
                                defaultCSS: {
                                    'display': 'flex',
                                    'justify-content': 'space-between',
                                    'align-items': 'center'
                                },
                                children: [
                                    {
                                        elementType: "block",
                                        icon: "block",
                                        tagName: "div", //Expander Header Label
                                        label: "Label",
                                        classList: ["tw-block", "tw-categories__expander-header-title"],
                                        defaultCSS: {
                                            'display': 'flex',
                                            'align-items': 'center',
                                            'gap': '10px'
                                        },
                                        children: [
                                            {
                                                elementType: "icon",
                                                icon: "block",
                                                tagName: "div", //Expander Header Label Icon
                                                label: "Icon",
                                                classList: ["tw-categories__expander-icon"],
                                                defaultCSS: {
                                                    'width': "14px",
                                                    'height': "14px",
                                                    'color': "#000",
                                                    'display': "flex",
                                                    'align-items': "center",
                                                    'justify-content': "center"
                                                }
                                            },
                                            {
                                                elementType: "text",
                                                icon: "text",
                                                tagName: "span", //Expander Header Label Title
                                                label: "Text",
                                                classList: ["tw-text"],
                                                text: "Category",
                                                defaultCSS: { 'color': '#000000', 'width': 'fit-content', 'min-width': 'fit-content' }
                                            },
                                        ],
                                    },
                                    {
                                        elementType: "checkbox",
                                        icon: "block",
                                        tagName: "div", //Expander Switch
                                        label: "Checkbox",
                                        classList: ["tw-categories__expander-checkbox", "tw-categories__expander-checkbox--category"],
                                        defaultCSS: {
                                            'position': "relative",
                                            'width': "26px",
                                            'height': "16px",
                                            'background-color': "#555",
                                            'border-radius': "100px",
                                            'cursor': "pointer",
                                            'display': "flex",
                                            'align-items': "center",
                                            'transition': "background 0.2s",
                                            "--checked-color": "#0099FE",
                                            "--checked-left": "12px",
                                            "--switch-spacing": "2px",
                                            "--switch-size": "12px",
                                            "--switch-background": "#FFFFFF",
                                            "--switch-radius": "100px",
                                            "--switch-shadow": "0 4px 4px #00000020",
                                            "--switch-duration": "0.2s"
                                        }
                                    },
                                ],
                            },
                            {
                                elementType: "block",
                                icon: "block",
                                tagName: "div", //Expander content
                                label: "Block",
                                classList: ["tw-block", "tw-categories__expander-content"],
                                defaultCSS: {
                                    'height': "0",
                                    'overflow': "hidden",
                                    'transition': "height 0.2s"
                                },
                                children: [
                                    {
                                        elementType: "text",
                                        icon: "text",
                                        tagName: "p", //Expander Content Paragraph
                                        label: "Text",
                                        classList: ["tw-text"],
                                        text: "Here goes a great description of the category.",
                                        defaultCSS: { 'color': '#000000' }
                                    },
                                    
                                ],
                            },
                        ],
                    },
                ]
            }
        };

        // Get element configuration
        const config = elementConfigs[type];
        if (!config) return; // Invalid element type

        // Add element with appropriate parameters
        if (containerId && (insertIndex !== null && insertIndex !== undefined)) {
            // Added from drag&drop
            addElement(config, containerId, insertIndex);
        } else {
            // Added from toolbar
            addElement(config);
        }
    }

    /*
    * Toolbar drag management functions
    * NOTE: These functions are ONLY for use by Canvas and LeftPanel components
    */
    
    // Called when toolbar drag starts
    const handleToolbarDragStart = () => {
        setIsToolbarDragActive(true);
        // Save current selection to restore if drag is cancelled
        if (selectedId) {
            setPreviousSelectionBeforeToolbarDrag(selectedId);
            setSelectedId(null);
            setSelectedItem(null);
        }
    };
    
    // Called when toolbar drag ends (either successful or cancelled)
    const handleToolbarDragEnd = () => {
        setIsToolbarDragActive(false);
        // If we were creating an element, don't restore previous selection
        // The new element will be selected automatically
        if (!isCreatingElementFromToolbar && previousSelectionBeforeToolbarDrag) {
            // Use a small delay to allow any new element selection to complete
            setTimeout(() => {
                if (!selectedId) {
                    setSelectedId(previousSelectionBeforeToolbarDrag);
                    setSelectedItem(previousSelectionBeforeToolbarDrag);
                }
                setPreviousSelectionBeforeToolbarDrag(null);
            }, 50);
        } else if (isCreatingElementFromToolbar) {
            // Clear the creation state
            setIsCreatingElementFromToolbar(false);
            setPreviousTreeStateBeforeCreation(null);
            setPreviousSelectionBeforeToolbarDrag(null);
        }
    };
    
    // Called when canvas/left panel is about to create an element from toolbar
    const notifyElementCreatedFromToolbar = () => {
        setIsCreatingElementFromToolbar(true);
        // Save current tree state to detect the new element later
        const currentRoot = activeRoot === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1];
        setPreviousTreeStateBeforeCreation(JSON.stringify(currentRoot));
    };

    /*
    * Remove a JSON property (for HTML and Javascript (attr) controls)
    * id - The id of the element to remove the property from
    * property - The property to remove
    */
    const removeJSONProperty = (id, property) => {
        const findAndRemoveProperty = (node) => { // Find the element with the given id and remove its property
            if (node.id === id) {
                // Remove the property
                delete node[property];
                return true; // Element found and updated
            }
            
            // Recursively search through children
            if (node.children) {
                for (let child of node.children) {
                    if (findAndRemoveProperty(child)) {
                        return true; // Element found in children
                    }
                }
            }
            return false; // Element not found
        };

        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the removeProperty
        updated.roots.forEach(root => findAndRemoveProperty(root)); // Search through all roots to find and remove the property from the element
        setJSONtree(updated); //Update the JSONtree state with the changed JSONtree
    };

    // Effect to detect and select newly created elements from toolbar (AUTOMATIC - NO COMPONENT CALLS THIS)
    useEffect(() => {
        if (isCreatingElementFromToolbar && previousTreeStateBeforeCreation && JSONtree) {
            const currentRoot = activeRoot === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1];
            const previousRoot = JSON.parse(previousTreeStateBeforeCreation);
            
            // Find the newly created element by comparing current and previous tree states
            const findNewlyCreatedElement = (currentNode, previousNode) => {
                // If this is a new node (not in previous state), it's our target
                if (!previousNode) {
                    return currentNode;
                }
                
                // If this node has children, check them
                if (currentNode.children) {
                    for (let i = 0; i < currentNode.children.length; i++) {
                        const currentChild = currentNode.children[i];
                        const previousChild = previousNode?.children?.[i];
                        
                        // If this child is completely new (didn't exist before), it's our target
                        if (!previousChild) {
                            return currentChild;
                        }
                        
                        // If this child has a different ID, it's new
                        if (currentChild.id !== previousChild.id) {
                            return currentChild;
                        }
                        
                        // Recursively check children
                        const result = findNewlyCreatedElement(currentChild, previousChild);
                        if (result) return result;
                    }
                }
                
                return null;
            };
            
            const newElement = findNewlyCreatedElement(currentRoot, previousRoot);
            if (newElement) {
                setSelectedId(newElement.id);
                setSelectedItem(newElement.id);
                // Clear the creation state
                setIsCreatingElementFromToolbar(false);
                setPreviousTreeStateBeforeCreation(null);
                setPreviousSelectionBeforeToolbarDrag(null);
            }
        }
    }, [JSONtree, isCreatingElementFromToolbar, previousTreeStateBeforeCreation, activeRoot, setSelectedId, setSelectedItem]);

    return (
        <CanvasContext.Provider value={{ JSONtree, setJSONtree, addElement, removeElement, selectedId, setSelectedId, addClass, removeClass,
            moveElement, createElement, activeRoot, updateActiveRoot, activeTab, generateUniqueId, deepCopy, CallContextMenu, selectedItem, setSelectedItem,
            addCSSProperty, addJSONProperty, removeJSONProperty, runElementScript, handleToolbarDragStart, handleToolbarDragEnd, notifyElementCreatedFromToolbar, isToolbarDragActive }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);