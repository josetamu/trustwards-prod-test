import "./Toolbar.css";
import { useEffect, useRef, useState } from "react";
import { useCanvas } from "@contexts/CanvasContext";

export const Toolbar = () => {
    const { createElement } = useCanvas();
    const toolbarRef = useRef(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Handle ESC key to close any open dropdowns
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (openDropdown) {
                    // Close dropdown and return focus to the current button
                    setOpenDropdown(null);
                    const activeElement = document.activeElement;
                    if (toolbarRef.current && toolbarRef.current.contains(activeElement)) {
                        // Find the parent button of the focused element
                        const parentButton = activeElement.closest('[data-dropdown]');
                        if (parentButton) {
                            parentButton.focus();
                        }
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openDropdown]);

    return (
        <div ref={toolbarRef} className="tw-builder__toolbar" role="toolbar" aria-label="Element toolbar">
            <div 
                className="tw-builder__toolbar-icon tw-builder__toolbar-icon--layout"
                tabIndex={0}
                role="button"
                aria-label="Layout elements"
                aria-expanded={openDropdown === 'layout'}
                data-dropdown="layout"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (openDropdown === 'layout') {
                            setOpenDropdown(null);
                        } else {
                            setOpenDropdown('layout');
                        }
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                    <path d="M15.8753 6.5H5.74815L5.72168 15.875H12.8753C14.5321 15.875 15.8753 14.5318 15.8753 12.875V6.5Z" fill="var(--icons-color)"/>
                    <path d="M4.97243 15.875L4.22142 15.8729L4.24788 6.5H0.125V12.875C0.125 14.5318 1.46814 15.875 3.125 15.875H4.97243Z" fill="var(--icons-color)"/>
                    <path d="M3.125 0.125C1.46814 0.125 0.125 1.46814 0.125 3.125V5H15.875V3.125C15.875 1.46814 14.5318 0.125 12.875 0.125H3.125Z" fill="var(--icons-color)"/>
                </svg>

                {openDropdown === 'layout' && (
                    <div className="tw-builder__toolbar-dropdown" role="menu" aria-label="Layout elements menu">
                    <div className="tw-builder__toolbar-dropdown-column">

                        <div
                        onClick={() => createElement("block")} /*Create block on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("block");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add block element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "block"); /*Create block on drag (resposability transfered to canvas)*/
                        }}

                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--block">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--block"></div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Block
                            </div>
                        </div>
                        <div 
                        onClick={() => createElement("image")} /*Create image on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("image");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add image element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "image"); /*Create image on drag (resposability transfered to canvas)*/
                        }}
                        
                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--image">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--image">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.04346 0.875H6.9566C5.68731 0.874989 4.67532 0.874977 3.88191 0.981645C3.06269 1.09179 2.38964 1.32519 1.85742 1.85742C1.32519 2.38964 1.09179 3.06269 0.981645 3.88191C0.874977 4.67532 0.874989 5.68724 0.875 6.95654V7.04346C0.874989 8.31273 0.874977 9.3247 0.981645 10.1181C1.09179 10.9373 1.32519 11.6104 1.85742 12.1426C2.38964 12.6748 3.06269 12.9082 3.88191 13.0184C4.67533 13.125 5.68726 13.125 6.9566 13.125H7.0434C8.31273 13.125 9.32464 13.125 10.1181 13.0184C10.9373 12.9082 11.6104 12.6748 12.1426 12.1426C12.6748 11.6104 12.9082 10.9373 13.0184 10.1181C13.125 9.3247 13.125 8.31273 13.125 7.0434V6.9566C13.125 5.68726 13.125 4.67533 13.0184 3.88191C12.9082 3.06269 12.6748 2.38964 12.1426 1.85742C11.6104 1.32519 10.9373 1.09179 10.1181 0.981645C9.3247 0.874977 8.31273 0.874989 7.04346 0.875ZM3.20833 4.375C3.20833 3.73067 3.73067 3.20833 4.375 3.20833C5.01933 3.20833 5.54167 3.73067 5.54167 4.375C5.54167 5.01933 5.01933 5.54167 4.375 5.54167C3.73067 5.54167 3.20833 5.01933 3.20833 4.375ZM4.03773 11.8621C3.9666 11.8525 3.8987 11.8421 3.83382 11.8308C4.94496 10.4869 6.0774 9.12911 7.34936 8.27622C8.08436 7.78342 8.8403 7.47897 9.63906 7.44147C10.3393 7.40851 11.106 7.57907 11.9561 8.05729C11.9501 8.84537 11.9299 9.46108 11.8624 9.96263C11.7697 10.6525 11.5973 11.0383 11.318 11.3176C11.0386 11.597 10.6528 11.7693 9.96298 11.8621C9.25639 11.9571 8.32306 11.9583 7.00035 11.9583C5.67769 11.9583 4.74437 11.9571 4.03773 11.8621Z"/>
                                </svg>
                            </div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Image
                            </div>
                        </div>
                        <div
                        onClick={() => createElement("divider")} /*Create divider on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("divider");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add divider element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "divider"); /*Create divider on drag (resposability transfered to canvas)*/
                        }}
                        
                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--divider">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--divider"></div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Divider
                            </div>
                        </div>

                    </div>
                </div>
                )}
            </div>

            <div 
                className="tw-builder__toolbar-icon tw-builder__toolbar-icon--texts"
                tabIndex={0}
                role="button"
                aria-label="Text elements"
                aria-expanded={openDropdown === 'texts'}
                data-dropdown="texts"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (openDropdown === 'texts') {
                            setOpenDropdown(null);
                        } else {
                            setOpenDropdown('texts');
                        }
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="none">
                    <path d="M1 3.4375V1H14V3.4375M7.5 1V14M5.0625 14H9.9375" stroke="var(--icons-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {openDropdown === 'texts' && (
                    <div className="tw-builder__toolbar-dropdown" role="menu" aria-label="Text elements menu">
                    <div className="tw-builder__toolbar-dropdown-column">

                        <div
                        onClick={() => createElement("text")} /*Create text on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("text");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add text element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "text"); /*Create text on drag (resposability transfered to canvas)*/
                        }}
                        
                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--text">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--text">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" fill="none">
                                    <path d="M1 3.0625V1H12V3.0625M6.5 1V12M4.4375 12H8.5625" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Text
                            </div>
                        </div>

                    </div>
                </div>
                )}
            </div>

            <div className="tw-builder__toolbar-divider"></div>

            <div 
                className="tw-builder__toolbar-icon tw-builder__toolbar-icon--cookies"
                tabIndex={0}
                role="button"
                aria-label="Cookie elements"
                aria-expanded={openDropdown === 'cookies'}
                data-dropdown="cookies"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (openDropdown === 'cookies') {
                            setOpenDropdown(null);
                        } else {
                            setOpenDropdown('cookies');
                        }
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                    <path d="M6.99998 14C6.03165 14 5.12165 13.8164 4.26999 13.4491C3.41832 13.0818 2.67749 12.5838 2.04749 11.9551C1.4175 11.3263 0.918864 10.5864 0.551598 9.73533C0.184333 8.88426 0.000466665 7.9754 0 7.00874C0 6.13483 0.169166 5.2784 0.507498 4.43945C0.84583 3.6005 1.31833 2.85174 1.92499 2.19316C2.53166 1.53458 3.26082 1.00441 4.11249 0.602647C4.96415 0.200882 5.89748 0 6.91248 0C7.15747 0 7.40831 0.0116522 7.66497 0.0349564C7.92164 0.0582606 8.18414 0.0990429 8.45247 0.157303C8.34747 0.681648 8.38247 1.17686 8.55747 1.64295C8.73247 2.10903 8.99497 2.49635 9.34497 2.80489C9.69497 3.11344 10.1122 3.32621 10.5966 3.4432C11.081 3.56018 11.5796 3.53105 12.0925 3.35581C11.7891 4.04328 11.833 4.70162 12.2241 5.33084C12.6151 5.96005 13.1954 6.28631 13.965 6.30961C13.9766 6.43779 13.9855 6.5571 13.9916 6.66757C13.9976 6.77803 14.0004 6.89758 14 7.02622C14 7.98169 13.8161 8.8817 13.4484 9.72624C13.0806 10.5708 12.582 11.3107 11.9525 11.946C11.3229 12.5812 10.5821 13.0823 9.72997 13.4491C8.87784 13.8159 7.96784 13.9995 6.99998 14ZM5.94998 5.61049C6.24164 5.61049 6.48968 5.50865 6.69408 5.30497C6.89848 5.10129 7.00044 4.85357 6.99998 4.5618C6.99951 4.27003 6.89754 4.02254 6.69408 3.81933C6.49061 3.61611 6.24258 3.51404 5.94998 3.51311C5.65738 3.51218 5.40958 3.61425 5.20658 3.81933C5.00358 4.0244 4.90138 4.27189 4.89998 4.5618C4.89858 4.8517 5.00078 5.09943 5.20658 5.30497C5.41238 5.51051 5.66018 5.61235 5.94998 5.61049ZM4.54998 9.10612C4.84165 9.10612 5.08968 9.00428 5.29408 8.8006C5.49848 8.59692 5.60045 8.3492 5.59998 8.05743C5.59951 7.76566 5.49755 7.51817 5.29408 7.31496C5.09062 7.11174 4.84258 7.00967 4.54998 7.00874C4.25739 7.00781 4.00959 7.10988 3.80659 7.31496C3.60359 7.52003 3.50139 7.76752 3.49999 8.05743C3.49859 8.34733 3.60079 8.59506 3.80659 8.8006C4.01239 9.00614 4.26019 9.10798 4.54998 9.10612ZM9.09997 9.80524C9.2983 9.80524 9.46467 9.73813 9.59907 9.6039C9.73347 9.46966 9.80043 9.30374 9.79997 9.10612C9.7995 8.9085 9.7323 8.74257 9.59837 8.60834C9.46443 8.47411 9.2983 8.40699 9.09997 8.40699C8.90164 8.40699 8.7355 8.47411 8.60157 8.60834C8.46764 8.74257 8.40044 8.9085 8.39997 9.10612C8.3995 9.30374 8.4667 9.4699 8.60157 9.60459C8.73644 9.73929 8.90257 9.80618 9.09997 9.80524Z" fill="var(--icons-color)"/>
                </svg>

                {openDropdown === 'cookies' && (
                    <div className="tw-builder__toolbar-dropdown" role="menu" aria-label="Cookie elements menu">
                    <div className="tw-builder__toolbar-dropdown-column">
                        <span className="tw-builder__toolbar-dropdown-column-title">Cookies</span>

                        <div
                        onClick={() => createElement("accept-all")} /*Create accept all on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("accept-all");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add accept all element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "accept-all"); /*Create accept all on drag (resposability transfered to canvas)*/
                        }}
                        
                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--accept-all">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--accept-all"></div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Accept all
                            </div>
                        </div>

                        <div
                        onClick={() => createElement("reject-all")} /*Create reject all on click*/
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                createElement("reject-all");
                            }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label="Add reject all element"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("elementType", "reject-all"); /*Create reject all on drag (resposability transfered to canvas)*/
                        }}
                        
                        className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--reject-all">
                            <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--reject-all"></div>
                            <div className="tw-builder__toolbar-dropdown-item-title">
                                Reject all
                            </div>
                        </div>
                    </div>

                    <div className="tw-builder__toolbar-dropdown-divider"></div>

                    <div className="tw-builder__toolbar-dropdown-column tw-builder__toolbar-dropdown-column--categories">
                        <span className="tw-builder__toolbar-dropdown-column-title">Categories</span>

                        <div className="tw-builder__toolbar-dropdown-grid">
                            <div
                            onClick={() => createElement("open-modal")} /*Create open modal on click*/
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    createElement("open-modal");
                                }
                            }}
                            tabIndex={0}
                            role="menuitem"
                            aria-label="Add open modal element"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("elementType", "open-modal"); /*Create open modal on drag (resposability transfered to canvas)*/
                            }}
                            
                            className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--open-modal">
                                <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--open-modal"></div>
                                <div className="tw-builder__toolbar-dropdown-item-title">
                                    Open Modal
                                </div>
                            </div>

                            <div
                            onClick={() => createElement("save-categories")} /*Create save categories on click*/
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    createElement("save-categories");
                                }
                            }}
                            tabIndex={0}
                            role="menuitem"
                            aria-label="Add save categories element"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("elementType", "save-categories"); /*Create save categories on drag (resposability transfered to canvas)*/
                            }}
                            
                            className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--save-categories">
                                <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--save-categories"></div>
                                <div className="tw-builder__toolbar-dropdown-item-title">
                                    Save categ.
                                </div>
                            </div>

                            <div
                            onClick={() => createElement("categories")} /*Create categories on click*/
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    createElement("categories");
                                }
                            }}
                            tabIndex={0}
                            role="menuitem"
                            aria-label="Add categories element"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("elementType", "categories"); /*Create categories on drag (resposability transfered to canvas)*/
                            }}
                            
                            className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--categories">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 107" fill="none">
                                    <g filter="url(#filter0_d_1016_9)">
                                    <rect x="4" y="76" width="73" height="25" rx="6" fill="white"/>
                                    </g>
                                    <rect x="13" y="87" width="21" height="3" rx="1.5" fill="#0099FE"/>
                                    <g filter="url(#filter1_d_1016_9)">
                                    <rect x="60" y="86" width="10" height="5" rx="2.5" fill="white"/>
                                    </g>
                                    <rect x="66" y="87" width="3" height="3" rx="1.5" fill="#19D85C"/>
                                    <g filter="url(#filter2_d_1016_9)">
                                    <rect x="4" y="38" width="73" height="25" rx="6" fill="white"/>
                                    </g>
                                    <rect x="13" y="49" width="21" height="3" rx="1.5" fill="#0099FE"/>
                                    <g filter="url(#filter3_d_1016_9)">
                                    <rect x="60" y="48" width="10" height="5" rx="2.5" fill="white"/>
                                    </g>
                                    <rect x="66" y="49" width="3" height="3" rx="1.5" fill="#19D85C"/>
                                    <g filter="url(#filter4_d_1016_9)">
                                    <rect x="4" y="2" width="73" height="25" rx="6" fill="white"/>
                                    </g>
                                    <rect x="13" y="13" width="21" height="3" rx="1.5" fill="#0099FE"/>
                                    <g filter="url(#filter5_d_1016_9)">
                                    <rect x="60" y="12" width="10" height="5" rx="2.5" fill="white"/>
                                    </g>
                                    <rect x="66" y="13" width="3" height="3" rx="1.5" fill="#19D85C"/>
                                    <defs>
                                    <filter id="filter0_d_1016_9" x="0" y="74" width="81" height="33" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="2"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.6 0 0 0 0 0.996078 0 0 0 0.15 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    <filter id="filter1_d_1016_9" x="58" y="85" width="14" height="9" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="1"/>
                                    <feGaussianBlur stdDeviation="1"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    <filter id="filter2_d_1016_9" x="0" y="36" width="81" height="33" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="2"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.6 0 0 0 0 0.996078 0 0 0 0.15 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    <filter id="filter3_d_1016_9" x="58" y="47" width="14" height="9" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="1"/>
                                    <feGaussianBlur stdDeviation="1"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    <filter id="filter4_d_1016_9" x="0" y="0" width="81" height="33" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="2"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.6 0 0 0 0 0.996078 0 0 0 0.15 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    <filter id="filter5_d_1016_9" x="58" y="11" width="14" height="9" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="1"/>
                                    <feGaussianBlur stdDeviation="1"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1016_9"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1016_9" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>
                                <div className="tw-builder__toolbar-dropdown-item-title">
                                    Categories
                                </div>
                            </div>

                            <div
                            onClick={() => createElement("enable-categories")} /*Create enable categories on click*/
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    createElement("enable-categories");
                                }
                            }}
                            tabIndex={0}
                            role="menuitem"
                            aria-label="Add enable categories element"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("elementType", "enable-categories"); /*Create enable categories on drag (resposability transfered to canvas)*/
                            }}
                            
                            className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--enable-categories">
                                <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--enable-categories"></div>
                                <div className="tw-builder__toolbar-dropdown-item-title">
                                    Enable categ.
                                </div>
                            </div>

                            <div
                            onClick={() => createElement("disable-categories")} /*Create disable categories on click*/
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    createElement("disable-categories");
                                }
                            }}
                            tabIndex={0}
                            role="menuitem"
                            aria-label="Add disable categories element"
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("elementType", "disable-categories"); /*Create disable categories on drag (resposability transfered to canvas)*/
                            }}
                            
                            className="tw-builder__toolbar-dropdown-item tw-builder__toolbar-dropdown-item--disable-categories">
                                <div className="tw-builder__toolbar-dropdown-item-icon tw-builder__toolbar-dropdown-item-icon--disable-categories"></div>
                                <div className="tw-builder__toolbar-dropdown-item-title">
                                    Disable categ.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};