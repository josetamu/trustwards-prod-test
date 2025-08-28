import { useState, useEffect, useRef } from "react";
import "./BuilderClasses.css";
import { useCanvas } from "@contexts/CanvasContext";


export default function BuilderClasses({selectedId}) {
    const [isOpen, setIsOpen] = useState(false);
    const {classesCSSData, JSONtree, activeRoot} = useCanvas();
    const poolRef = useRef(null);

 // Function to find the element in the JSON tree
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
    
        // Get the selected element
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



    //search classes
    const [search, setSearch] = useState("");

    const AllClasses = classesCSSData
    .map(item => item.className)
    .filter(className => className.includes(search));

    const filteredClasses = selectedElement ? 
    selectedElement.classList.filter(className => 
        className.includes(search) && 
        classesCSSData.some(item => item.className === className)
    )
    : [];

    

    return (
        <div className="tw-builder__settings-classes">
            <span className="tw-builder__settings-id" onClick={() => {
                setIsOpen(!isOpen);
            }}>#{selectedId}</span>
            <div className="tw-builder__settings-classes-selected">
                {filteredClasses.map((className, index) => (
                    <div className="tw-builder__settings-class" key={index}>
                        <span className="tw-builder__settings-class-name">{className}</span>
                    </div>
                ))}
            </div>
            {isOpen && (
                <div className="tw-builder__settings-classes-pool" ref={poolRef}>
                    <div className="tw-builder__settings-classes-searcher">
                        <input className="tw-builder__settings-classes-search" type="text" placeholder="Class name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                   <div className="tw-builder__settings-classes-list">
                    {AllClasses.map((className, index) => (
                        <div className="tw-builder__settings-classes-item" key={index}>
                            <span className="tw-builder__settings-classes-item-name">{className}</span>
                        </div>
                    ))}
                    <div className="tw-builder__settings-classes-item--empty">
                        <span className="tw-builder__settings-classes-item-name">Create a new CSS class</span>
                    </div>
{/*                     {filteredClasses.length === 0 && (
                        <div className="tw-builder__settings-classes-item--empty">
                            <span className="tw-builder__settings-classes-item-name">Create a new CSS class</span>
                        </div>
                    )} */}
                    </div>
                </div>
            )}
        </div>
    )
}