import { useState, useEffect, useRef } from "react";
import "./BuilderClasses.css";
import { useCanvas } from "@contexts/CanvasContext";



export default function BuilderClasses({selectedId,showNotification}) {
    const [isOpen, setIsOpen] = useState(false);
    //search classes
    const [search, setSearch] = useState("");
    const [activeClass, setActiveClass] = useState(null);
    const {addClass,JSONtree,activeRoot,removeClass} = useCanvas();
    const poolRef = useRef(null);
    
    const findElement = (node, targetId) => {
        if(!node) return null;
        if (node.id === targetId) {
            return node;
        }
        if (node.children) {
            for (const child of node.children) {
                const found = findElement(child, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    // Get the selected element (se recalcula cada vez que cambie JSONtree o selectedId)
    let selectedElement = null;
    if(JSONtree && JSONtree.roots && selectedId) {
        const activeRootNode = JSONtree.roots.find(root => root.id === activeRoot);
        if(activeRootNode) {
            selectedElement = findElement(activeRootNode, selectedId);
        }
    }

 
    //close pool when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (poolRef.current && !poolRef.current.contains(event.target) && !event.target.classList.contains("tw-builder__settings-id")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

const createNewClass = (newClass) => {
    // Check if the class already exists in the selected element's classList
    if (
        !selectedElement ||
        !newClass ||
        selectedElement.classList.includes(newClass)
    ) {
        return false; // Indicate class was not created
    }
    addClass(selectedId, newClass);
    setActiveClass(newClass);
    return true; // Indicate class was created
};

const handleKeyPress = (e) => {
    if (e.key === "Enter") {
        const created = createNewClass(search);
        if (created) {
            showNotification("Class created");
        }
        setSearch("");
        setIsOpen(false);
    }
}

const eliminateClass = (className) => {
    removeClass(selectedId, className);
    showNotification("Class removed");

}

useEffect(() => {
    if (selectedElement && activeClass && !selectedElement.classList.includes(activeClass)) {
        setActiveClass(null);
    }
}, [JSONtree, selectedId, activeClass]);

//filter All classes to see in the pool
    const AllClasses = JSONtree.classesCSSData
    .map(item => item.className)
    .filter(className => className.includes(search));

    //filter element's classes, excluding those that are not in AllClasses
    const filteredClasses = selectedElement
        ? selectedElement.classList
            .filter(className => AllClasses.includes(className))
        : [];

    

    return (
        <div className="tw-builder__settings-classes">
            <span className={`tw-builder__settings-id ${activeClass ? 'tw-builder__settings-id--active' : ''}`} onClick={() => {
                setIsOpen(!isOpen);
            }}>
                {activeClass ? (
                    <>
                        .{activeClass}
                        <span
                            className="tw-builder__settings-class-unactive"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveClass(null);
                            }}
                        >
                            x
                        </span>
                    </>
                ) : (
                    `#${selectedId}`
                )}
            </span>
            <div className="tw-builder__settings-classes-selected">
                {filteredClasses.map((className, index) => (
                    <div className={`tw-builder__settings-class ${activeClass === className ? 'tw-builder__settings-class--active' : ''}`} key={index} onClick={() => {
                        setActiveClass(className);
                    }}>
                        <span className="tw-builder__settings-class-name">.{className}</span>
                        <span className="tw-builder__settings-class-remove" onClick={() => {
                           /*  e.stopPropagation(); */
                            eliminateClass(className);
                        }}>x</span>
                    </div>
                ))}
            </div>
            {isOpen && (
                <div className="tw-builder__settings-classes-pool" ref={poolRef}>
                    <div className="tw-builder__settings-classes-adder">
                        <input className="tw-builder__settings-classes-add" type="text" placeholder="Class name..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyPress}/>
                        <div className="tw-builder__settings-classes-add">
                            <span className="tw-builder__settings-classes-add-span">Add</span>
                        </div>
                    </div>
                   <div className="tw-builder__settings-classes-list">
                    {AllClasses.map((className, index) => (
                        <div className="tw-builder__settings-classes-item" key={index} onClick={(e) => {
                            if(selectedId) {
                                addClass(selectedId, className);
                                setActiveClass(className);
                                setIsOpen(false);
                            }
                        }}>
                            <span className="tw-builder__settings-classes-item-name">.{className}</span>
                        </div>
                    ))}
                    <div className="tw-builder__settings-classes-item--empty">
                        <span className="tw-builder__settings-classes-item-name">Create a new CSS class</span>
                    </div>
                    </div>
                </div>
            )}
        </div>
    )
}