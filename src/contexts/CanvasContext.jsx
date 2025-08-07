'use client'

import React, { createContext, useReducer, useState, useContext, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../supabase/supabaseClient";

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

export const CanvasProvider = ({ children }) => {
    /*Canvas Context manages all actions related to the JSONtree*/
    const params = useParams();
    const siteSlug = params['site-slug'];
    const [siteData, setSiteData] = useState(null);

    useEffect(() => {
        const fetchSiteData = async () => {
            const { data, error } = await supabase.from('Site').select('*').eq('id', siteSlug).single();
            setSiteData(data);
        };
        fetchSiteData();
    }, [siteSlug]);

    const initialTree = {
        id: "tw-root",
        classList: [],
        tagName: "div",
        children: [],
    };

    const [state, dispatch] = useReducer(treeReducer, {
        past: [], //undo stack
        present: initialTree, // initially null until data is fetched
        future: [] //redo stack
    });

    useEffect(() => {
        if (siteData) {
            const userJSON = siteData.JSON;
            const initialState = {
                past: [], //undo stack
                present: userJSON ? userJSON : initialTree,
                future: [] //redo stack
            };
            // Directly set the state without using the SET action to avoid adding to the undo stack
            dispatch({ type: 'INIT', payload: initialState.present });
        }
    }, [siteData]);

    const JSONtree = state.present; //The real JSONtree at any moment (state.present)
    const [selectedId, setSelectedId] = React.useState("tw-root"); //Starts the root as the selectedId (Canvas.jsx will manage the selected element)

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
    * Add element in the JSONtree inside the current selectedId (Creation of the React element is managed by Canvas.jsx)
    * properties - Add the element in the JSONtree with its properties with format: {tagName: "div", children: [], etc..} - id and classList are created automatically
    */
    const addElement = (properties) => {
        const add = (node, parent) => {
            const currentSelectedId = selectedId || "tw-root"; // Ensure selectedId defaults to "tw-root" if empty
            if (node.id === currentSelectedId) {
                if (node.children) {
                    node.children = [...node.children, { ...properties, id: generateUniqueId(JSONtree) }]; //Node has children attribute. Put it as its child
                } else if (parent) {
                    const index = parent.children.findIndex(child => child.id === node.id);
                    parent.children.splice(index + 1, 0, { ...properties, id: generateUniqueId(JSONtree) }); //Node has no children attribute. Put it as its first sibling
                }
            } else if (node.children) {
                node.children.forEach(child => add(child, node));
            }
        };
        const updated = deepCopy(JSONtree); //Make a copy of the current JSONtree before the add
        add(updated, null); //Add the new element in the current JSONtree
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
        if (updated.id === id) {
            setJSONtree(null); //If the element to remove is the root, set the JSONtree to null
        } else {
            remove(updated); //Remove the element in the current JSONtree
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

    return (
        <CanvasContext.Provider value={{ JSONtree, setJSONtree, addElement, removeElement, selectedId, setSelectedId, addClass, removeClass }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);
