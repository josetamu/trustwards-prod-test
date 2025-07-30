import React, { createContext, useState, useContext } from "react";

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

export const CanvasProvider = ({ children }) => {
    /*Canvas Context manages all actions related to the JSONtree*/

    //JSONtree by default
    const initialTree = {
        id: "tw-root",
        classList: [],
        tagName: "div",
        children: []
    };
      
    const [JSONtree, setJSONtree] = useState(initialTree); //Starts the JSONtree with the initialTree
    const [selectedId, setSelectedId] = useState("tw-root"); //Starts the root as the selectedId (Canvas.jsx will manage the selected element)

    /*
    * Add element in the JSONtree inside the current selectedId (Creation of the React element is managed by Canvas.jsx)
    * properties - Add the element in the JSONtree with its properties with format: {tagName: "div", children: [], etc..} - id and classList are created automatically
    */
    const addElement = (properties) => {
        const insert = (node, parent) => {
            if (node.id === selectedId) {
                if (node.children) {
                    node.children = [...node.children, { ...properties, id: generateUniqueId(JSONtree), classList: [] }]; //Node has children attribute. Put it as its child
                } else if (parent) {
                    const index = parent.children.findIndex(child => child.id === node.id);
                    parent.children.splice(index + 1, 0, { ...properties, id: generateUniqueId(JSONtree), classList: [] }); //Node has no children attribute. Put it as its first sibling
                }
            } else if (node.children) {
                node.children.forEach(child => insert(child, node));
            }
        };
        const updated = structuredClone(JSONtree);
        insert(updated, null);
        setJSONtree(updated);
    };

    /*
    * Delete element from the JSONtree (Delete of the React element is managed by Canvas.jsx)
    * id - The id of the element to delete from the JSONtree
    */
    const deleteElement = (id) => {
        const remove = (node) => {
            if (!node.children) return;
            node.children = node.children.filter((child) => child.id !== id);
            node.children.forEach(remove);
        };
        const updated = structuredClone(JSONtree);
        if (updated.id === id) {
            setJSONtree(null);
        } else {
            remove(updated);
            setJSONtree(updated);
        }
    };

    /*
    * Add class to an element
    * id - The id of the element to add the class to
    * className - The class to add to the element
    */
    const addClass = (id, className) => {
        const updated = structuredClone(JSONtree);
        const node = updated.children.find((child) => child.id === id);
        if (node) {
            node.classList.push(className);
        }
        setJSONtree(updated);
    }

    /*
    * Remove class from an element
    * id - The id of the element to remove the class from
    * className - The class to remove from the element
    */
    const removeClass = (id, className) => {
        const updated = structuredClone(JSONtree);
        const node = updated.children.find((child) => child.id === id);
        if (node) {
            node.classList = node.classList.filter((cls) => cls !== className);
        }
        setJSONtree(updated);
    }

    return (
        <CanvasContext.Provider value={{ JSONtree, setJSONtree, addElement, deleteElement, selectedId, setSelectedId, addClass, removeClass }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);