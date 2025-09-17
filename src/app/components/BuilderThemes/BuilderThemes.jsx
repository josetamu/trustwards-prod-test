import './BuilderThemes.css';
import { useState, useEffect, useCallback } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { supabase } from '@supabase/supabaseClient';
import { createCDN } from '@contexts/CDNsContext';

import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '@animations/animations';

export default function BuilderThemes({isFirstTime, setIsFirstTime, isManualThemesOpen, setIsManualThemesOpen, showNotification, siteSlug}) {
    const { setJSONtree } = useCanvas();
    const [activeTheme, setActiveTheme] = useState(null);

    const blank = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const trustwardsLight = {"roots": [{"id": "tw-root--banner", "icon": "banner", "label": "Banner", "tagName": "div", "children": [{"id": "tw-vghhri", "icon": "text", "text": "New Text", "label": "Text", "tagName": "h3", "classList": ["tw-text"], "elementType": "text"}, {"id": "tw-ycsvhl", "icon": "text", "text": "New Text", "label": "Text", "tagName": "h3", "classList": ["tw-text"], "elementType": "text"}, {"id": "tw-loyhvd", "icon": "text", "text": "New Text", "label": "Text", "tagName": "h3", "classList": ["tw-text"], "elementType": "text"}, {"id": "tw-ljdyrs", "icon": "text", "text": "New Text", "label": "Text", "tagName": "h3", "classList": ["tw-text"], "elementType": "text"}], "nestable": true, "classList": [], "elementType": "banner"}, {"id": "tw-root--modal", "icon": "modal", "label": "Modal", "tagName": "div", "children": [], "nestable": true, "classList": [], "elementType": "modal"}], "activeRoot": "tw-root--banner", "idsCSSData": [], "isFirstTime": false, "classesCSSData": []}
    const trustwardsDark = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const oregano = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const nebula = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const quiero = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const avocado = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const mito = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const grainient = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    const brutal = {"idsCSSData": [], "classesCSSData": [], "activeRoot": "tw-root--banner", "isFirstTime": false, "roots": [{"id": "tw-root--banner", "elementType": "banner", "icon": "banner", "label": "Banner", "classList": [], "tagName": "div", "children": [], "nestable": true}, {"id": "tw-root--modal", "elementType": "modal", "icon": "modal", "label": "Modal", "classList": [], "tagName": "div", "children": [], "nestable": true}]};
    /*
    * When clicking Save button, update the theme in real time, save it on the site DB, and declare first time as false to close the themes modal
    * Set JSONtree structure
    */
    const saveTheme = () => {
        if(activeTheme || !isFirstTime){
            switch(activeTheme){
                case 'blank':
                    setJSONtree(blank);
                    save(blank);
                    break;
                case 'trustwards-light':
                    setJSONtree(trustwardsLight);
                    save(trustwardsLight);
                    break;
                case 'trustwards-dark':
                    setJSONtree(trustwardsDark);
                    save(trustwardsDark);
                    break;
                case 'oregano':
                    setJSONtree(oregano);
                    save(oregano);
                    break;
                case 'nebula':
                    setJSONtree(nebula);
                    save(nebula);
                    break;
                case 'quiero':
                    setJSONtree(quiero);
                    save(quiero);
                    break;
                case 'avocado':
                    setJSONtree(avocado);
                    save(avocado);
                    break;
                case 'mito':
                    setJSONtree(mito);
                    save(mito);
                    break;
                case 'grainient':
                    setJSONtree(grainient);
                    save(grainient);
                    break;
                case 'brutal':
                    setJSONtree(brutal);
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

    return (
        <AnimatePresence>
        {(isFirstTime || isManualThemesOpen) && (
            <div className="tw-builder-themes">
                <div className="tw-builder-themes__backdrop-click" onClick={() => {
                    if (isFirstTime) {
                        showNotification('Please select a theme', 'top', false);
                    } else {
                        setIsManualThemesOpen(false);
                    }
                }}></div>
                <motion.div
                    {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
                    className={`tw-builder-themes__modal`}
                >
                    <div className="tw-builder-themes__modal-header">
                        <span className="tw-builder-themes__header-title">Themes</span>
                        <div className="tw-builder-themes__save-button" onClick={() => {
                            saveTheme();
                        }}>Save</div>
                    </div>

                    <div className="tw-builder-themes__grid">
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="blank" onClick={() => {
                                setActiveThemeFunction('blank');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Blank</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="trustwards-light" onClick={() => {
                                setActiveThemeFunction('trustwards-light');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Trustwards Light</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="trustwards-dark" onClick={() => {
                                setActiveThemeFunction('trustwards-dark');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Trustwards Dark</span>
                                <span className="tw-builder-themes__theme-info-free">FREE</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="oregano" onClick={() => {
                                setActiveThemeFunction('oregano');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Oregano</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="nebula" onClick={() => {
                                setActiveThemeFunction('nebula');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Nebula</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="quiero" onClick={() => {
                                setActiveThemeFunction('quiero');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Quiero</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="avocado" onClick={() => {
                                setActiveThemeFunction('avocado');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Avocado</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="mito" onClick={() => {
                                setActiveThemeFunction('mito');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Mito</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="grainient" onClick={() => {
                                setActiveThemeFunction('grainient');
                            }}></div>
                            <div className="tw-builder-themes__theme-info">
                                <span className="tw-builder-themes__theme-info-title">Grainient</span>
                                <span className="tw-builder-themes__theme-info-pro">PRO</span>
                            </div>
                        </div>
                        <div className="tw-builder-themes__theme">
                            <div className="tw-builder-themes__theme-preview" id="brutal" onClick={() => {
                                setActiveThemeFunction('brutal');
                            }}></div>
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