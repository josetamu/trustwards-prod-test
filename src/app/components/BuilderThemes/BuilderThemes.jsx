import './BuilderThemes.css';
import { useState, useEffect, useCallback } from 'react';
import { useCanvas, applyDefaults } from '@contexts/CanvasContext';
import { supabase } from '@supabase/supabaseClient';
import { createCDN } from '@contexts/CDNsContext';

import { motion, AnimatePresence } from 'framer-motion';
import { getAnimTypes } from '@animations/animations';

// Import groupControls for applying defaults
import { bannerGroupControls } from '@builderElements/Banner/Banner';
import { modalGroupControls } from '@builderElements/Modal/Modal';

export default function BuilderThemes({isFirstTime, setIsFirstTime, isManualThemesOpen, setIsManualThemesOpen, showNotification, siteSlug}) {
    const { setJSONtree } = useCanvas();
    const [activeTheme, setActiveTheme] = useState(null);

    // Helper function to create base theme structure with applied defaults
    const createTheme = (customRoots = []) => {
        const defaultBannerRoot = {
            id: "tw-root--banner",
            elementType: "banner",
            icon: "banner",
            label: "Banner",
            classList: ["tw-banner"],
            tagName: "div",
            children: [],
            nestable: true,
            ...applyDefaults(bannerGroupControls)
        };

        const defaultModalRoot = {
            id: "tw-root--modal",
            elementType: "modal",
            icon: "modal",
            label: "Modal",
            classList: ["tw-modal"],
            tagName: "div",
            children: [],
            nestable: true,
            ...applyDefaults(modalGroupControls)
        };

        // If custom roots are provided, merge defaults into them
        const roots = customRoots.length > 0 ? customRoots.map(root => {
            if (root.elementType === 'banner') {
                return { ...defaultBannerRoot, ...root };
            } else if (root.elementType === 'modal') {
                return { ...defaultModalRoot, ...root };
            }
            return root;
        }) : [defaultBannerRoot, defaultModalRoot];

        // Create idsCSSData with defaults from roots
        const idsCSSData = roots.map(root => {
            const entry = { id: root.id };
            
            if (root.defaultCSS) {
                entry.properties = root.defaultCSS;
            }
            
            if (root.defaultNested) {
                entry.nested = {};
                Object.entries(root.defaultNested).forEach(([selector, props]) => {
                    entry.nested[selector] = { properties: props };
                });
            }
            
            return (entry.properties || entry.nested) ? entry : null;
        }).filter(Boolean);

        return {
            idsCSSData,
            classesCSSData: [],
            activeRoot: "tw-root--banner",
            isFirstTime: false,
            blockEvents: false,
            blockScroll: false,
            liveWebsite: false,
            canvasColor: "#FFFFFF",
            canvasMaxWidth: null,
            breakpoints: { tablet: "1024px", mobile: "767px" },
            responsive: { 
                tablet: { idsCSSData: [], classesCSSData: [] }, 
                mobile: { idsCSSData: [], classesCSSData: [] } 
            },
            roots
        };
    };

    const blank = createTheme();
    
    // TrustwardsLight theme with custom styles
    const trustwardsLight = {
        roots: [
            {
                id: "tw-root--banner",
                icon: "banner",
                label: "Banner",
                tagName: "div",
                children: [],
                nestable: true,
                classList: ["tw-banner"],
                attributes: {},
                defaultCSS: {
                    width: "300",
                    display: "flex",
                    "--filter-blur": "10px",
                    "--backdrop-color": "#000000"
                },
                elementType: "banner",
                defaultNested: {
                    ".tw-categories__expander-switch": {
                        "background-color": "#FFFFFF"
                    }
                }
            },
            {
                id: "tw-root--modal",
                icon: "modal",
                label: "Modal",
                tagName: "div",
                children: [],
                nestable: true,
                classList: ["tw-modal"],
                attributes: {},
                defaultCSS: {},
                elementType: "modal"
            }
        ],
        activeRoot: "tw-root--banner",
        idsCSSData: [
            {
                id: "tw-root--banner",
                nested: {
                    ".tw-categories__expander-switch": {
                        properties: {
                            "background-color": "#FFFFFF"
                        }
                    }
                },
                properties: {
                    width: "100",
                    display: "flex",
                    "--filter-blur": "10px",
                    "--backdrop-color": "#000000"
                }
            },
            {
                id: "tw-root--modal",
                properties: {}
            }
        ],
        responsive: {
            mobile: {
                idsCSSData: [],
                classesCSSData: []
            },
            tablet: {
                idsCSSData: [],
                classesCSSData: []
            }
        },
        blockEvents: false,
        blockScroll: false,
        breakpoints: {
            mobile: "767px",
            tablet: "1024px"
        },
        canvasColor: "#FFFFFF",
        isFirstTime: false,
        liveWebsite: false,
        canvasMaxWidth: null,
        classesCSSData: []
    };
    const trustwardsDark = createTheme();
    const oregano = createTheme();
    const nebula = createTheme();
    const quiero = createTheme();
    const avocado = createTheme();
    const mito = createTheme();
    const grainient = createTheme();
    const brutal = createTheme();
    /*
    * When clicking Save button, update the theme in real time, save it on the site DB, and declare first time as false to close the themes modal
    * Set JSONtree structure
    */
    const saveTheme = () => {
        if(activeTheme || !isFirstTime){
            switch(activeTheme){
                case 'blank':
                    setJSONtree(blank, !isFirstTime);
                    save(blank);
                    break;
                case 'trustwards-light':
                    setJSONtree(trustwardsLight, !isFirstTime);
                    save(trustwardsLight);
                    break;
                case 'trustwards-dark':
                    setJSONtree(trustwardsDark, !isFirstTime);
                    save(trustwardsDark);
                    break;
                case 'oregano':
                    setJSONtree(oregano, !isFirstTime);
                    save(oregano);
                    break;
                case 'nebula':
                    setJSONtree(nebula, !isFirstTime);
                    save(nebula);
                    break;
                case 'quiero':
                    setJSONtree(quiero, !isFirstTime);
                    save(quiero);
                    break;
                case 'avocado':
                    setJSONtree(avocado, !isFirstTime);
                    save(avocado);
                    break;
                case 'mito':
                    setJSONtree(mito, !isFirstTime);
                    save(mito);
                    break;
                case 'grainient':
                    setJSONtree(grainient, !isFirstTime);
                    save(grainient);
                    break;
                case 'brutal':
                    setJSONtree(brutal, !isFirstTime);
                    save(brutal);
                    break;
                default:
                    break;
            }
            setIsFirstTime(false);
            setIsManualThemesOpen(false);
        }else{
            showNotification('Please select a theme', 'top', false);
        }
    }

    // Function to save the changes. This function is used by the button and the keyboard shortcut(Ctrl+S or Cmd+S)
    const save = useCallback(async (theme) => {
        try {
            // Simulate a delay of saving (replace)
            await new Promise(resolve => setTimeout(resolve));
            const {data, error} = await supabase
                .from('Site')
                .update({JSON: theme})
                .eq('id', siteSlug);

            createCDN(siteSlug); //Finally, update the CDN
        } catch (error) {
            showNotification('Error saving changes');
        }
    }, [siteSlug, showNotification]);

    //When clicking a theme preview, it will be set as active
    const setActiveThemeFunction = (theme) => {
        setActiveTheme(theme);
        document.querySelectorAll('.tw-builder-themes__theme-preview').forEach(preview => {
            preview.classList.remove('tw-builder-themes__theme-preview--active');
        });
        document.getElementById(theme).classList.add('tw-builder-themes__theme-preview--active');
    }

    useEffect(() => {
        // Handle ESC key press
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (isFirstTime) {
                    showNotification('Please select a theme', 'top', false);
                } else {
                    setIsManualThemesOpen(false);
                }
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleEscape);

        // Cleanup event listener
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isFirstTime]);


    // Focus trap for keyboard navigation
    useEffect(() => {
        if (!isFirstTime && !isManualThemesOpen) return;

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            const modal = document.querySelector('.tw-builder-themes__modal');
            const saveButton = document.querySelector('.tw-builder-themes__save-button');
            const themePreviews = document.querySelectorAll('.tw-builder-themes__theme-preview');
            
            if (!modal || !saveButton || themePreviews.length === 0) return;

            const focusableElements = [saveButton, ...Array.from(themePreviews)];
            const activeElement = document.activeElement;
            const activeIndex = focusableElements.indexOf(activeElement);

            // If focus is outside the modal, focus the save button
            if (!modal.contains(activeElement)) {
                e.preventDefault();
                saveButton.focus();
                return;
            }

            if (e.shiftKey) {
                // Shift + Tab: move backwards
                if (activeIndex <= 0) {
                    e.preventDefault();
                    focusableElements[focusableElements.length - 1].focus();
                }
            } else {
                // Tab: move forwards
                if (activeIndex >= focusableElements.length - 1) {
                    e.preventDefault();
                    focusableElements[0].focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFirstTime, isManualThemesOpen]);

    return (
        <AnimatePresence>
        {(isFirstTime || isManualThemesOpen) && (
            <div className="tw-builder-themes">
                <motion.div
                    {...getAnimTypes().find(anim => anim.name === 'OVERLAY_FADE')} 
                    className="tw-builder-themes__backdrop-click" onClick={() => {
                        if (isFirstTime) {
                            showNotification('Please select a theme', 'top', false);
                        } else {
                            setIsManualThemesOpen(false);
                        }
                    }}
                ></motion.div>
                <motion.div
                    {...getAnimTypes().find(anim => anim.name === 'SCALE_TOP')}
                    className={`tw-builder-themes__modal`}
                >
                    <div className="tw-builder-themes__modal-header">
                        <span className="tw-builder-themes__header-title">Themes</span>
                        <div 
                            className="tw-builder-themes__save-button" 
                            onClick={() => {
                                saveTheme();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    saveTheme();
                                }
                            }}
                            tabIndex={0}
                            aria-label="Save selected theme"
                        >
                            Save
                        </div>
                    </div>

                    <div className="tw-builder-themes__grid">
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="blank" 
                                onClick={() => {
                                    setActiveThemeFunction('blank');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('blank');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Blank theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Blank</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="trustwards-light" 
                                onClick={() => {
                                    setActiveThemeFunction('trustwards-light');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('trustwards-light');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Trustwards Light theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Trustwards Light</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="trustwards-dark" 
                                onClick={() => {
                                    setActiveThemeFunction('trustwards-dark');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('trustwards-dark');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Trustwards Dark theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Trustwards Dark</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="oregano" 
                                onClick={() => {
                                    setActiveThemeFunction('oregano');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('oregano');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Oregano theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Oregano</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="nebula" 
                                onClick={() => {
                                    setActiveThemeFunction('nebula');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('nebula');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Nebula theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Nebula</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="quiero" 
                                onClick={() => {
                                    setActiveThemeFunction('quiero');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('quiero');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Quiero theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Quiero</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="avocado" 
                                onClick={() => {
                                    setActiveThemeFunction('avocado');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('avocado');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Avocado theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Avocado</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="mito" 
                                onClick={() => {
                                    setActiveThemeFunction('mito');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('mito');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Mito theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Mito</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="grainient" 
                                onClick={() => {
                                    setActiveThemeFunction('grainient');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('grainient');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Grainient theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Grainient</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div 
                                className="tw-builder-themes__theme-preview" 
                                id="brutal" 
                                onClick={() => {
                                    setActiveThemeFunction('brutal');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveThemeFunction('brutal');
                                    }
                                }}
                                tabIndex={0}
                                aria-label="Select Brutal theme"
                            ></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Brutal</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
        </AnimatePresence>
    )
}