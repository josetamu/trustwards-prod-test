import { useState, useEffect, useRef } from "react";
import "./BuilderClasses.css";
import { useCanvas } from "@contexts/CanvasContext";
import {Dropdown} from "@components/dropdown/Dropdown";
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimTypes } from '@animations/animations';



export default function BuilderClasses({selectedId,showNotification,externalActiveClass,onActiveClassChange}) {
    const [isOpen, setIsOpen] = useState(false);
    
    const [newClass, setNewClass] = useState("");
    const [search, setSearch] = useState("");
    const [activeClass, setActiveClass] = useState(null);
    const {addClass,JSONtree,activeRoot,removeClass,activeState,setActiveState} = useCanvas();
    const poolRef = useRef(null);
    const [isStatesOpen, setIsStatesOpen] = useState(false);

    const statesButtonRef = useRef(null);


    //If the externalActiveClass(given by the control component) is set, set the active class to it
    useEffect(() => {
        if(typeof externalActiveClass !== 'undefined' && externalActiveClass !== activeClass) {
            setActiveClass(externalActiveClass);
        }
    }, [externalActiveClass]);

    //sync when activeClass changes caused by externalActiveClass. Avoid infinite loop.
    useEffect(() => {
        if(typeof onActiveClassChange === 'function' && externalActiveClass !== activeClass) {
            onActiveClassChange(activeClass);
        }
    }, [activeClass]);

    //Function to find the element in the JSON tree
    const findElement = (node, targetId) => {
        //If the node is not found, return null
        if(!node) return null;
        //If find the element, return it
        if (node.id === targetId) {
            return node;
        }
        //If the element has children, search through them
        if (node.children) {
            for (const child of node.children) {
                const found = findElement(child, targetId);
                if (found) return found;
            }
        }
        //If nothing is found, return null
        return null;
    };

    // Get the selected element and store it selectedElement, if not set it to null
    let selectedElement = null;
    if(JSONtree && JSONtree.roots && selectedId) {
        const activeRootNode = JSONtree.roots.find(root => root.id === activeRoot);
        if(activeRootNode) {
            selectedElement = findElement(activeRootNode, selectedId);
        }
    }


    // Close pool when clicking outside or pressing Escape
    useEffect(() => {
        if (!isOpen) return;

        // Function to handle the click outside the pool
        const handleClickOutside = (event) => {
            if (
                poolRef.current &&
                !poolRef.current.contains(event.target) &&
                !event.target.classList.contains("tw-builder__settings-id")
            ) {
                setIsOpen(false);
            }
        };

        // Function to handle Escape key
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
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
    //Add the class to the selected element if it doesn't exist
    addClass(selectedId, newClass);
    //Set the active class to the new class to show it instead of the id(user can set styles in the class)
    setActiveClass(newClass);
    return true; // Indicate class was created
};

//Function to handle the add class. Created by enter key, if it doesn't exist, create it and show the notification, if it exists, set the active class to it.
const handleAddClass = (e) => {
    if (e.type === "click" || e.key === "Enter") {
        const created = createNewClass(newClass);
        if (created) {
            showNotification("Class created");
        } else if (newClass && selectedElement && selectedElement.classList.includes(newClass)) {
            setActiveClass(newClass);
        }
        //Reset the new class and close the pool
        setNewClass("");
        setIsOpen(false);
    }
}

//Function to eliminate a class from the selected element using the removeClass function in Canvas.jsx and then show the notification
const eliminateClass = (className) => {
    removeClass(selectedId, className);
    showNotification("Class removed");

}

//This useEffect desactivates the active class when we eliminate it. If this useEffect is not here, the active class will stay active even if it is eliminated.
useEffect(() => {
    if (selectedElement && activeClass && !selectedElement.classList.includes(activeClass)) {
        setActiveClass(null);
    }
}, [JSONtree, selectedId, activeClass]);

// Get all classes (array of objects {className, ...}) created by the user
const allClasses = JSONtree.classesCSSData || [];

// Filter all classes to show in the pool, using the search text
const poolClasses = allClasses
    .map(item => item.className)
    .filter(className => className.toLowerCase().includes((search || "").toLowerCase()));

// Filter the classes that the selected element has, but only if they really exist in allClasses
const allClassNames = allClasses.map(item => item.className);

const selectedClasses = selectedElement
    ? selectedElement.classList.filter(className => allClassNames.includes(className))
    : [];

    

        return (
			<div className="tw-builder__settings-classes">
				<span 
                className={`tw-builder__settings-id`} 
                tabIndex={isOpen ? -1 : 0}
                role="button"
                aria-label="Classes"
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        setIsOpen(!isOpen);
                    }
                }}
                onClick={() => {
					setIsOpen(!isOpen);
				}}>
                    {/*take the id or the class. Also if state is active, show it*/}
					{activeClass ? (
						`.${activeClass}${activeState ? `:${activeState}` : ''}`
					) : (
						`#${selectedId}${activeState ? `:${activeState}` : ''}`
					)}
                    {/*Dropdown to select the state*/}
					<Dropdown
						open={isStatesOpen}
						onClose={() => setIsStatesOpen(false)}
						className="tw-builder__states-dropdown"
						menu={
							<div className="tw-builder__settings-states-menu">
								<span className="tw-builder__settings-states-item" tabIndex={0} role="button" aria-label="hover" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setActiveState(':hover'); setIsStatesOpen(false); } }} onClick={(e) => { e.stopPropagation(); setActiveState(':hover'); setIsStatesOpen(false); }}>:hover</span>
								<span className="tw-builder__settings-states-item" tabIndex={0} role="button" aria-label="active" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setActiveState(':active'); setIsStatesOpen(false); } }} onClick={(e) => { e.stopPropagation(); setActiveState(':active'); setIsStatesOpen(false); }}>:active</span>
								<span className="tw-builder__settings-states-item" tabIndex={0} role="button" aria-label="focus" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setActiveState(':focus'); setIsStatesOpen(false); } }} onClick={(e) => { e.stopPropagation(); setActiveState(':focus'); setIsStatesOpen(false); }}>:focus</span>
							</div>
						}
					>
						<span
                            ref={statesButtonRef}
							className={`tw-builder__settings-states ${activeState ? `tw-builder__settings-states--active` : ''}`}
                            tabIndex={isOpen ? -1 : 0}
                            role="button"
                            aria-label="States"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation(); 
                                    if(activeState) {setActiveState(null); setIsStatesOpen(false);}
                                    else {setIsStatesOpen(v => !v);}
                                }
                            }}
							onClick={(e) => { 
                                e.stopPropagation(); 
                                //if the state is active, set it to null and close the dropdown
                                    if(activeState) {setActiveState(null); setIsStatesOpen(false);}
                                    //if the state is not active, open the dropdown
                                    else {setIsStatesOpen(v => !v);}
                                }}
						>
							<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1.57766 0.574219L8.05143 6.32286L5.21041 6.93272L6.42513 9.53129L4.60353 10.4284L3.32487 7.72532L0.947266 9.28255L1.57766 0.574219Z" fill="currentColor"/>
							</svg>
						</span>
					</Dropdown>
				</span>
                <div className="tw-builder__settings-classes-selected">
                    {activeClass && (
                        <div
                            className={`tw-builder__settings-class`}
                            onClick={() => {
                                setActiveClass(null);
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Select class ${activeClass}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setActiveClass(null);
                                }
                            }}
                        >
                            <span className="tw-builder__settings-class-name">#{selectedId}</span>
                        </div>
                    )}
                    {/*List of classes selected*/}
                    {selectedClasses
                        .filter((className) => className !== activeClass)
                        .map((className, index) => (
                            <div
                                className={`tw-builder__settings-class`}
                                key={index}
                                onClick={() => {
                                    setActiveClass(className);
                                }}
                                tabIndex={isOpen ? -1 : 0}
                                role="button"
                                aria-label={`Select class ${className}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setActiveClass(className);
                                    }
                                }}
                                >
                                <span className="tw-builder__settings-class-name">.{className}</span>
                                <span className="tw-builder__settings-class-remove" onClick={(e) => {
                                    e.stopPropagation();
                                    eliminateClass(className);
                                }}>x</span>
                            </div>
                        ))}
                </div>
                {/*Pool of classes*/}
                <AnimatePresence>
                {isOpen && (
                    <motion.div className="tw-builder__settings-classes-pool" ref={poolRef} {...getAnimTypes().find(anim => anim.name === 'SCALE_TOP')}>
                        <div className="tw-builder__settings-classes-adder">
                            <input className="tw-builder__settings-classes-add-input" tabIndex={0} type="text" placeholder="Class name..." value={newClass} onChange={(e) => setNewClass(e.target.value)} onKeyDown={handleAddClass}/>
                            <div className="tw-builder__settings-classes-add" tabIndex={0} role="button" aria-label="Add class" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleAddClass(e); } }} onClick={handleAddClass}>
                                <span className="tw-builder__settings-classes-add-span">Add</span>
                            </div>
                        </div>
                        <div className="tw-builder__settings-classes-divider"></div>
                        <div className="tw-builder__settings-classes-searcher">
                            <input className="tw-builder__settings-classes-search" tabIndex={0} type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </div>
                        <div className="tw-builder__settings-classes-list">
                            {poolClasses.map((className, index) => {
                                const isLastItem = index === poolClasses.length - 1;
                                
                                return (
                                    <div 
                                        className="tw-builder__settings-classes-item" 
                                        key={index} 
                                        tabIndex={0} 
                                        role="button" 
                                        aria-label={`Add class ${className}`}
                                        onKeyDown={(e) => {
                                            // Si presiona Tab en el último elemento
                                            if (e.key === 'Tab' && !e.shiftKey && isLastItem) {
                                                e.preventDefault();
                                                setIsOpen(false);
                                                setTimeout(() => {
                                                    statesButtonRef.current?.focus();
                                                }, 50);
                                            }
                                            // Enter o Espacio para añadir
                                            else if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                if(selectedId) {
                                                    addClass(selectedId, className);
                                                    setActiveClass(className);
                                                    setIsOpen(false);
                                                }
                                            }
                                        }} 
                                        onClick={(e) => {
                                            if(selectedId) {
                                                addClass(selectedId, className);
                                                setActiveClass(className);
                                                setIsOpen(false);
                                            }
                                        }}
                                    >
                                        <span className="tw-builder__settings-classes-item-name">.{className}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
}