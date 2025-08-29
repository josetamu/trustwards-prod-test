'use client'
import { Tooltip } from '@components/tooltip/Tooltip';
import { useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';
import BuilderControl from '../BuilderControl/BuilderControl';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderClasses from '../BuilderClasses/BuilderClasses';
import { jsx } from 'react/jsx-runtime';




//This component is the master component for all the controls. It is used to render the controls for the selected element.

const TextType = ({name, value, placeholder, index, cssProperty, applyGlobalCSSChange, getGlobalCSSValue, autoUnit, applyGlobalJSONChange, getGlobalJSONValue, JSONProperty}) => {
    
    const [textValue, setTextValue] = useState(() => {
        const savedJSONValue = JSONProperty ? getGlobalJSONValue?.(JSONProperty) : null;
        const savedCSSValue = cssProperty ? getGlobalCSSValue?.(cssProperty) : null;
        const savedValue = savedJSONValue || savedCSSValue;


        if (!savedValue && value) {
            setTimeout(() => {
                if (JSONProperty && applyGlobalJSONChange) {
                    applyGlobalJSONChange(JSONProperty, value);
                } else if (cssProperty && applyGlobalCSSChange) {
                    const cssValue = autoUnit && value ? processValueForCSS(value) : value;
                    applyGlobalCSSChange(cssProperty, cssValue);
                }
            }, 0);
        }
        return savedValue || value || '';
    });

    useEffect(() => {
        const savedJSONValue = JSONProperty ? getGlobalJSONValue?.(JSONProperty) : null;
        const savedCSSValue = cssProperty ? getGlobalCSSValue?.(cssProperty) : null;
        const savedValue = savedJSONValue || savedCSSValue;
        setTextValue(savedValue || value || '');
    }, [getGlobalJSONValue, getGlobalCSSValue, JSONProperty, cssProperty, value]);


    const processValueForCSS = (inputValue) => {
        if (!autoUnit || !inputValue) return inputValue;

        const trimmedValue = inputValue.trim();
        
        // Lista de unidades CSS válidas
        const validUnits = [
            'px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', '%', 
            'cm', 'mm', 'in', 'pt', 'pc', 'ex', 'ch', 'fr',
            's', 'ms', 'deg', 'rad', 'grad', 'turn', 'hz', 'khz'
        ];
        
        // Regex para detectar número seguido de texto
        const numberWithTextRegex = /^(-?\d*\.?\d+)(.*)$/;
        const match = trimmedValue.match(numberWithTextRegex);
        
        if (match) {
            const numberPart = match[1];
            const unitPart = match[2];
            
            // Si no hay unidad o la unidad no es válida, añadir unidad automática
            if (!unitPart || !validUnits.includes(unitPart)) {
                return `${numberPart}${autoUnit}`;
            }
            
            // Si tiene una unidad válida, devolver tal como está
            return trimmedValue;
        }
        
        // Si no es un número con texto, devolver tal como está
        return inputValue;
    }

    const handleChange = (e) => {
        const newValue = e.target.value;
        setTextValue(newValue);
        
        // Priorizar JSON sobre CSS
        if (JSONProperty && applyGlobalJSONChange) {
            applyGlobalJSONChange(JSONProperty, newValue);
        } else if (cssProperty && applyGlobalCSSChange) {
            const cssValue = processValueForCSS(newValue);
            applyGlobalCSSChange(cssProperty, cssValue);
        }
    };
    const handleBlur = (e) => {
        const inputValue = e.target.value;
        
        if (autoUnit && inputValue) {
            const cssValue = processValueForCSS(inputValue);
            
            if(cssProperty && applyGlobalCSSChange) {
                applyGlobalCSSChange(cssProperty, cssValue);
            }
        }
    }
    

    return (
        <div className="tw-builder__settings-setting" key={index}>
            <span className="tw-builder__settings-subtitle">{name}</span>
            <input 
            type="text" 
            className="tw-builder__settings-input" 
            value={textValue} 
            placeholder={placeholder} 
            onChange={handleChange}
            onBlur={handleBlur}
            />
        </div>
    )
}



const SelectType = ({name, value, options, index, cssProperty, applyGlobalCSSChange, getGlobalCSSValue}) => {

    // Initialize with saved value from global CSS system
    const [selectValue, setSelectValue] = useState(() => {
        return getGlobalCSSValue?.(cssProperty) || value || '';
    });
    
    const measureRef = useRef(null);
    const [selectWidth, setSelectWidth] = useState(undefined);

    // Update when selected element changes
    useEffect(() => {
        if (getGlobalCSSValue && cssProperty) {
            const savedValue = getGlobalCSSValue(cssProperty);
            setSelectValue(savedValue || value || '');
        }
    }, [getGlobalCSSValue, cssProperty, value]);

    useEffect(() => {
        if (!measureRef.current) return;    
        setSelectWidth(measureRef.current.offsetWidth + 4);
    }, [selectValue, options]);

    useEffect(() => {
        const onResize = () => {
            if (!measureRef.current) return;
            setSelectWidth(measureRef.current.offsetWidth + 4);
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Handle select change with global CSS application
    const handleSelectChange = (e) => {
        const newValue = e.target.value;
        setSelectValue(newValue);
        
        // Apply to global CSS system
        if (cssProperty && applyGlobalCSSChange) {
            applyGlobalCSSChange(cssProperty, newValue);
        }
    };
    return (
        <div className="tw-builder__settings-setting" key={index}>
            <span className="tw-builder__settings-subtitle">{name}</span>
            <div className="tw-builder__settings-select-container">
                <span
                    ref={measureRef}
                    className="tw-builder__settings-select"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        height: 0,
                        overflow: 'hidden'
                    }}
                >
                    {selectValue || value}
                </span>

                <select
                    className="tw-builder__settings-select"
                    style={{ width: selectWidth }}
                    value={selectValue}
                    onChange={handleSelectChange}
                >
                    {options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                    ))}
                </select>

                <span className="tw-builder__settings-arrow">
                    <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                        <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                    </svg>
                </span>
            </div>
        </div>
    );
};

const SuperSelectType = ({name, index, value, category, cssProperty, applyGlobalCSSChange, getGlobalCSSValue, selectedId, selectedElementData, applyGlobalJSONChange, getGlobalJSONValue, JSONProperty}) => {
    const [superSelectValue, setSuperSelectValue] = useState(() => {
        const savedJSONValue = JSONProperty ? getGlobalJSONValue?.(JSONProperty) : null;
        const savedCSSValue = cssProperty ? getGlobalCSSValue?.(cssProperty) : null;
        const savedValue = savedJSONValue || savedCSSValue;
        return savedValue || value || '';
    });
    const measureRef = useRef(null);
    const wrapMeasureRef = useRef(null);
    const flowMeasureRef = useRef(null);
    const [selectWidth, setSelectWidth] = useState(undefined);
    const [wrapSelectWidth, setWrapSelectWidth] = useState(undefined);
    const [flowSelectWidth, setFlowSelectWidth] = useState(undefined);

    const wrapSelectRef = useRef(null);
    const [selectedWrap, setSelectedWrap] = useState(() =>{
        return getGlobalCSSValue?.('flex-wrap') || 'wrap';
    });
    const [selectedDirection, setSelectedDirection] = useState(() => {
        return getGlobalCSSValue?.('flex-direction') || 'column';
    });
    const [selectedAlign, setSelectedAlign] = useState(() => {
        return getGlobalCSSValue?.('align-items') || 'flex-start';
    });
    const [selectedJustify, setSelectedJustify] = useState(() => {
        return getGlobalCSSValue?.('justify-content') || 'flex-start';
    });
    const [isReverse, setIsReverse] = useState(() => {
        const flexDirection = getGlobalCSSValue?.('flex-direction') || '';
        return flexDirection.includes('-reverse');
    });
    const [selectedFlow, setSelectedFlow] = useState(() => {
        return getGlobalCSSValue?.('grid-auto-flow') || 'row';
    });
    const flowSelectRef = useRef(null);
    const [activeTooltip, setActiveTooltip] = useState(null);

// Update when selected element changes
useEffect(() => {
    if(!selectedElementData) return;

    let savedValue = null;
    if(JSONProperty && getGlobalJSONValue) {
        savedValue = getGlobalJSONValue(JSONProperty);
    } else if (cssProperty && getGlobalCSSValue) {
        savedValue = getGlobalCSSValue(cssProperty);
    }
    setSuperSelectValue(savedValue || value || '');

    const flexDirection = getGlobalCSSValue?.('flex-direction') || 'column';
    const isCurrentlyReverse = flexDirection.includes('-reverse');
    const baseDirection = isCurrentlyReverse 
        ? flexDirection.replace('-reverse', '') 
        : flexDirection;
    
    setIsReverse(isCurrentlyReverse);
    setSelectedDirection(baseDirection);

    setSelectedWrap(getGlobalCSSValue?.('flex-wrap') || 'wrap');
    setSelectedAlign(getGlobalCSSValue?.('align-items') || 'flex-start');
    setSelectedJustify(getGlobalCSSValue?.('justify-content') || 'flex-start');
    setSelectedFlow(getGlobalCSSValue?.('grid-auto-flow') || 'row');
}, [selectedId,selectedElementData, getGlobalCSSValue, cssProperty, value, getGlobalJSONValue, JSONProperty]);

    
    // Auto-apply default value when no saved value exists
    const hasAppliedDefaultSuper = useRef(false);
    
    useEffect(() => {
        // Reset flag when selectedId changes
        hasAppliedDefaultSuper.current = false;
    }, [selectedId]);
    
    useEffect(() => {
        // Solo ejecutar si selectedElementData está disponible y no hemos aplicado el default
        if (!selectedElementData || hasAppliedDefaultSuper.current) return;
        
        let savedValue = null;

        if(JSONProperty && getGlobalJSONValue) {
            savedValue = getGlobalJSONValue(JSONProperty);
        } else if (cssProperty && getGlobalCSSValue) {
            savedValue = getGlobalCSSValue(cssProperty);
        }

        if (!savedValue && value) {
            hasAppliedDefaultSuper.current = true;
            if (JSONProperty && applyGlobalJSONChange) {
                applyGlobalJSONChange(JSONProperty, value);
            } else if (cssProperty && applyGlobalCSSChange) {
                applyGlobalCSSChange(cssProperty, value);
            }
        }
    }, [selectedElementData, JSONProperty, cssProperty, value]);


    const handleMouseEnter = (tooltipId) => {
        setActiveTooltip(tooltipId);
    };
    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };




    const handleDirectionChange = (direction) => {
        setSelectedDirection(direction);
        if (applyGlobalCSSChange) {
            const finalDirection = isReverse ? `${direction}-reverse` : direction;
            applyGlobalCSSChange('flex-direction', finalDirection);
        }
    };
    const handleJustifyChange = (justify) => {
        setSelectedJustify(justify);
        if (applyGlobalCSSChange) {
            applyGlobalCSSChange('justify-content', justify);
        }
    };
    const handleFlowSelectChange = (flow) => {
        setSelectedFlow(flow);
        if (applyGlobalCSSChange) {
            applyGlobalCSSChange('grid-auto-flow', flow);
        }
    };
    const handleReverseChange = () => {
        const newReverse = !isReverse;
        setIsReverse(newReverse);
    
        if (applyGlobalCSSChange) {

            const finalDirection = newReverse ? `${selectedDirection}-reverse` : selectedDirection;
            applyGlobalCSSChange('flex-direction', finalDirection);
        }
    };
    

    const handleAlignChange = (align) => {
        setSelectedAlign(align);
        if (applyGlobalCSSChange) {
            applyGlobalCSSChange('align-items', align);
        }
    };
    const handleWrapChange = (wrap) => {
        setSelectedWrap(wrap);
        if (applyGlobalCSSChange) {
            applyGlobalCSSChange('flex-wrap', wrap);
        }
    };
    const handleSuperSelectChange = (newValue) => {
        setSuperSelectValue(newValue);
        if(JSONProperty && applyGlobalJSONChange){
            applyGlobalJSONChange(JSONProperty,newValue);
        }else if (cssProperty && applyGlobalCSSChange) {
            applyGlobalCSSChange(cssProperty, newValue);
        }
    };

    useEffect(() => {
        if (!measureRef.current) return;
        setSelectWidth(measureRef.current.offsetWidth + 3);
    }, [superSelectValue]);

    useEffect(() => {
        if (!wrapMeasureRef.current) return;
        setWrapSelectWidth(wrapMeasureRef.current.offsetWidth + 7);
    }, [selectedWrap]);

    useEffect(() => {
        if (!flowMeasureRef.current) return;
        setFlowSelectWidth(flowMeasureRef.current.offsetWidth + 3);
    }, [selectedFlow, superSelectValue]);

    useEffect(() => {
        const onResize = () => {
            if (!measureRef.current) return;
            setSelectWidth(measureRef.current.offsetWidth + 3);
            if (!wrapMeasureRef.current) return;
            setWrapSelectWidth(wrapMeasureRef.current.offsetWidth + 7);
            if (!flowMeasureRef.current) return;
            setFlowSelectWidth(flowMeasureRef.current.offsetWidth + 3);
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <React.Fragment key={index}>
        <div className="tw-builder__settings-setting" key={index}>
            <span className="tw-builder__settings-subtitle">{name}</span>
            <div className="tw-builder__settings-select-container">
                <span
                    ref={measureRef}
                    className="tw-builder__settings-select"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        height: 0,
                        overflow: 'hidden'
                    }}
                >
                    {superSelectValue || value}
                </span>
                <select className="tw-builder__settings-select" value={superSelectValue} onChange={(e) => handleSuperSelectChange(e.target.value)} style={{ width: selectWidth }}>
                    {category === 'text' && (
                        <>
                            <option className="tw-builder__settings-option" value="div">div</option>
                            <option className="tw-builder__settings-option" value="a">a</option>
                            <option className="tw-builder__settings-option" value="section">section</option>
                            <option className="tw-builder__settings-option" value="article">article</option>
                            <option className="tw-builder__settings-option" value="aside">aside</option>
                            <option className="tw-builder__settings-option" value="nav">nav</option>
                            </>
                            )
                    }
                    {category === 'display' && (
                        <>
                            <option className="tw-builder__settings-option" value="flex">Flex</option>
                            <option className="tw-builder__settings-option" value="grid">Grid</option>
                            <option className="tw-builder__settings-option" value="block">Block</option>
                            <option className="tw-builder__settings-option" value="inline-block">Inline Block</option>
                            <option className="tw-builder__settings-option" value="inline">Inline</option>
                            <option className="tw-builder__settings-option" value="none">None</option>
                        </>
                    )}
                </select>
                <span className="tw-builder__settings-arrow">
                    <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                        <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                    </svg>
                </span>
            </div>
        </div>
        {superSelectValue === 'a' && (
           <TextType
           name="Link to"
           value=""
           placeholder="URL..."
           JSONProperty="href"
           applyGlobalJSONChange={applyGlobalJSONChange}
           getGlobalJSONValue={getGlobalJSONValue}
           selectedId={selectedId}
           index="href"
        />
        )}
        {superSelectValue === 'flex' && (
                    <>
                    <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Wrap</span>
                    <div className="tw-builder__settings-select-container">
                    <span
                    ref={wrapMeasureRef}
                    className="tw-builder__settings-select"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        height: 0,
                        overflow: 'hidden'
                    }}
                >
                    {selectedWrap}
                </span>
                    <select 
                        ref={wrapSelectRef}
                        className="tw-builder__settings-select"
                        value={selectedWrap}
                        onChange={(e) => handleWrapChange(e.target.value)}
                        style={{ width: wrapSelectWidth }}
                    >   
                        <option className="tw-builder__settings-option" value="nowrap">No Wrap</option>
                        <option className="tw-builder__settings-option" value="wrap">Wrap</option>
                        <option className="tw-builder__settings-option" value="wrap-reverse">Wrap reverse</option>
                    </select>
                    <span className="tw-builder__settings-arrow">
                            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                                <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                            </svg>
                    </span>
                    </div>
                    </div>
                    <div className="tw-builder__settings-setting">
                        <span className="tw-builder__settings-subtitle">Direction</span>
                        <div className="tw-builder__settings-actions">
                            <button className={`tw-builder__settings-action ${selectedDirection === 'column' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleDirectionChange('column')} onMouseEnter={() => handleMouseEnter('column')} onMouseLeave={handleMouseLeave}>
                                <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.00134172 2C-0.00151758 1.78086 -0.00630757 1.37951 0.0645315 1.1168C0.156314 0.776369 0.384806 0.417969 0.917786 0.185477C1.16804 0.0763693 1.43357 0.0356924 1.70173 0.0173539C1.95531 9.16995e-08 2.26431 0 2.62258 0H8.37743C8.7357 0 9.04469 9.16995e-08 9.29828 0.0173539C9.56645 0.0356924 9.83193 0.0763693 10.0822 0.185477C10.6152 0.417969 10.8437 0.776369 10.9355 1.1168C11.0063 1.37951 11.0016 1.78086 10.9986 2C11.0016 2.21914 11.0063 2.62049 10.9355 2.8832C10.8437 3.22363 10.6152 3.58203 10.0822 3.81452C9.83193 3.92363 9.56645 3.96431 9.29828 3.98265C9.04469 4 8.7357 4 8.37743 4H2.62258C2.26431 4 1.95531 4 1.70173 3.98265C1.43357 3.96431 1.16804 3.92363 0.917786 3.81452C0.384806 3.58203 0.156314 3.22363 0.0645315 2.8832C-0.00630757 2.62049 -0.00151758 2.21914 0.00134172 2Z" fill="currentColor"/>
                                    <path d="M0.00134172 7C-0.00151758 6.78086 -0.00630757 6.37951 0.0645315 6.1168C0.156314 5.77637 0.384806 5.41797 0.917786 5.18548C1.16804 5.07637 1.43357 5.03569 1.70173 5.01735C1.95531 5 2.26431 5 2.62258 5H8.37743C8.7357 5 9.04469 5 9.29828 5.01735C9.56645 5.03569 9.83193 5.07637 10.0822 5.18548C10.6152 5.41797 10.8437 5.77637 10.9355 6.1168C11.0063 6.37951 11.0016 6.78086 10.9986 7C11.0016 7.21914 11.0063 7.62049 10.9355 7.8832C10.8437 8.22363 10.6152 8.58203 10.0822 8.81452C9.83193 8.92363 9.56645 8.96431 9.29828 8.98265C9.04469 9 8.7357 9 8.37743 9H2.62258C2.26431 9 1.95531 9 1.70173 8.98265C1.43357 8.96431 1.16804 8.92363 0.917786 8.81452C0.384806 8.58203 0.156314 8.22363 0.0645315 7.8832C-0.00630757 7.62049 -0.00151758 7.21914 0.00134172 7Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Column'}
                                open={activeTooltip === 'column'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedDirection === 'row' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleDirectionChange('row')} onMouseEnter={() => handleMouseEnter('row')} onMouseLeave={handleMouseLeave}>
                                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 0.000975796C7.21914 -0.0011037 7.62049 -0.00458732 7.8832 0.046932C8.22363 0.113683 8.58203 0.279859 8.81452 0.66748C8.92363 0.849487 8.96431 1.0426 8.98265 1.23762C9 1.42205 9 1.64677 9 1.90733V6.09268C9 6.35324 9 6.57795 8.98265 6.76238C8.96431 6.95742 8.92363 7.1505 8.81452 7.3325C8.58203 7.72014 8.22363 7.88632 7.8832 7.95309C7.62049 8.00457 7.21914 8.00113 7 7.999C6.78086 8.00113 6.37951 8.00457 6.1168 7.95309C5.77637 7.88632 5.41797 7.72014 5.18548 7.3325C5.07637 7.1505 5.03569 6.95742 5.01735 6.76238C5 6.57795 5 6.35324 5 6.09268V1.90733C5 1.64677 5 1.42204 5.01735 1.23762C5.03569 1.0426 5.07637 0.849487 5.18548 0.66748C5.41797 0.279859 5.77637 0.113683 6.1168 0.046932C6.37951 -0.00458732 6.78086 -0.0011037 7 0.000975796Z" fill="currentColor"/>
                                    <path d="M2 0.000975796C2.21914 -0.0011037 2.62049 -0.00458732 2.8832 0.046932C3.22363 0.113683 3.58203 0.279859 3.81452 0.66748C3.92363 0.849487 3.96431 1.0426 3.98265 1.23762C4 1.42205 4 1.64677 4 1.90733V6.09268C4 6.35324 4 6.57795 3.98265 6.76238C3.96431 6.95742 3.92363 7.1505 3.81452 7.3325C3.58203 7.72014 3.22363 7.88632 2.8832 7.95309C2.62049 8.00457 2.21914 8.00113 2 7.999C1.78086 8.00113 1.37951 8.00457 1.1168 7.95309C0.776369 7.88632 0.417969 7.72014 0.185476 7.3325C0.0763686 7.1505 0.0356922 6.95742 0.0173538 6.76238C0 6.57795 0 6.35324 0 6.09268V1.90733C0 1.64677 0 1.42204 0.0173538 1.23762C0.0356922 1.0426 0.0763686 0.849487 0.185476 0.66748C0.417969 0.279859 0.776369 0.113683 1.1168 0.046932C1.37951 -0.00458732 1.78086 -0.0011037 2 0.000975796Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Row'}
                                open={activeTooltip === 'row'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${isReverse ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleReverseChange(!isReverse)} onMouseEnter={() => handleMouseEnter('reverse')} onMouseLeave={handleMouseLeave}>
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V4V3.5ZM13.1936 4.35355C13.3889 4.15829 13.3889 3.84171 13.1936 3.64645L10.0117 0.464466C9.81641 0.269204 9.49982 0.269204 9.30456 0.464466C9.1093 0.659728 9.1093 0.976311 9.30456 1.17157L12.133 4L9.30456 6.82843C9.1093 7.02369 9.1093 7.34027 9.30456 7.53553C9.49982 7.7308 9.81641 7.7308 10.0117 7.53553L13.1936 4.35355ZM1 4V4.5H12.8401V4V3.5H1V4Z" fill="currentColor"/>
                                    <path d="M12.8398 11.5C13.116 11.5 13.3398 11.2761 13.3398 11C13.3398 10.7239 13.116 10.5 12.8398 10.5V11V11.5ZM0.646195 10.6464C0.450933 10.8417 0.450933 11.1583 0.646195 11.3536L3.82818 14.5355C4.02344 14.7308 4.34002 14.7308 4.53528 14.5355C4.73054 14.3403 4.73054 14.0237 4.53528 13.8284L1.70686 11L4.53528 8.17157C4.73054 7.97631 4.73054 7.65973 4.53528 7.46447C4.34002 7.2692 4.02344 7.2692 3.82818 7.46447L0.646195 10.6464ZM12.8398 11V10.5L0.999749 10.5V11V11.5L12.8398 11.5V11Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Reverse'}
                                open={activeTooltip === 'reverse'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
                        <span className="tw-builder__settings-subtitle">Justify</span>
                        <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                            <button className={`tw-builder__settings-action ${selectedJustify === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-start')} onMouseEnter={() => handleMouseEnter('start')} onMouseLeave={handleMouseLeave}>
                                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Start'}
                                open={activeTooltip === 'start'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedJustify === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Center'}
                                open={activeTooltip === 'center'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedJustify === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-end')} onMouseEnter={() => handleMouseEnter('end')} onMouseLeave={handleMouseLeave}>
                                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'End'}
                                open={activeTooltip === 'end'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedJustify === 'space-between' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-between')} onMouseEnter={() => handleMouseEnter('between')} onMouseLeave={handleMouseLeave}>
                                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.08581 10.0201C2.86671 10.0246 2.46541 10.0324 2.20217 9.98366C1.86104 9.92057 1.50087 9.75826 1.26422 9.37317C1.15316 9.19234 1.11041 8.99968 1.08998 8.80486C1.07064 8.62064 1.06822 8.39593 1.06542 8.13539L1.0204 3.95028C1.0176 3.68973 1.01518 3.46503 1.03055 3.28042C1.04679 3.0852 1.08539 2.8917 1.19253 2.70853C1.42084 2.31842 1.77743 2.14839 2.11712 2.07796C2.37926 2.02366 2.78063 2.02278 2.99978 2.02255C3.21888 2.01806 3.62018 2.01031 3.88342 2.05896C4.22455 2.12207 4.58472 2.28438 4.82137 2.6695C4.93243 2.85031 4.97518 3.04294 4.99561 3.23777C5.01495 3.422 5.01737 3.64671 5.02017 3.90725L5.06519 8.09236C5.06799 8.3529 5.07041 8.57762 5.05504 8.76221C5.0388 8.95743 5.0002 9.15096 4.89306 9.33413C4.66475 9.72423 4.30816 9.89425 3.96847 9.96466C3.70633 10.019 3.30496 10.0198 3.08581 10.0201Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.499971 0.00536387C0.223847 0.00833421 0.00262689 0.254939 0.00586725 0.556165L0.123212 11.4646C0.126453 11.7659 0.352927 12.0076 0.629051 12.0047C0.905175 12.0017 1.12639 11.7551 1.12315 11.4539L1.00581 0.545409C1.00257 0.244182 0.776095 0.00239353 0.499971 0.00536387Z" fill="currentColor"/>
                                    <path d="M9.00012 2.02154C9.21922 2.01721 9.62052 2.0096 9.88374 2.05842C10.2248 2.12166 10.5849 2.28414 10.8214 2.66935C10.9324 2.85023 10.975 3.04291 10.9954 3.23774C11.0146 3.42197 11.0169 3.64668 11.0196 3.90723L11.0627 8.09236C11.0653 8.3529 11.0677 8.57761 11.0522 8.7622C11.0359 8.95742 10.9972 9.1509 10.8899 9.33402C10.6615 9.72403 10.3048 9.89389 9.96505 9.96415C9.70289 10.0183 9.30152 10.019 9.08237 10.0191C8.86327 10.0235 8.46197 10.0311 8.19875 9.98232C7.85765 9.91905 7.49756 9.75657 7.26109 9.37134C7.15012 9.19047 7.10746 8.99782 7.08711 8.80299C7.06786 8.61874 7.06555 8.39404 7.06287 8.13349L7.01983 3.94836C7.01715 3.68782 7.01484 3.4631 7.03029 3.27852C7.04662 3.08331 7.08531 2.88979 7.19254 2.70668C7.42104 2.31668 7.77771 2.14683 8.11744 2.07658C8.3796 2.02236 8.78097 2.02172 9.00012 2.02154Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.6231 12.0059C11.8992 12.003 12.1205 11.7565 12.1174 11.4553L12.0052 0.546793C12.0021 0.245554 11.7758 0.00366949 11.4997 0.00650944C11.2235 0.0093494 11.0022 0.255839 11.0053 0.557077L11.1175 11.4656C11.1206 11.7668 11.3469 12.0087 11.6231 12.0059Z" fill="currentColor"/>
                                </svg>

                                <Tooltip
                                message={'Between'}
                                open={activeTooltip === 'between'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedJustify === 'space-around' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-around')} onMouseEnter={() => handleMouseEnter('around')} onMouseLeave={handleMouseLeave}>
                                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 9.99902C3.78086 10.0011 3.37951 10.0046 3.1168 9.95307C2.77637 9.88632 2.41797 9.72014 2.18548 9.33252C2.07637 9.15051 2.03569 8.9574 2.01735 8.76238C2 8.57795 2 8.35323 2 8.09267L2 3.90732C2 3.64676 2 3.42205 2.01735 3.23762C2.03569 3.04258 2.07637 2.8495 2.18548 2.6675C2.41797 2.27986 2.77637 2.11368 3.1168 2.04691C3.37951 1.99543 3.78086 1.99887 4 2.001C4.21914 1.99887 4.62049 1.99543 4.8832 2.04691C5.22363 2.11368 5.58203 2.27986 5.81452 2.6675C5.92363 2.8495 5.96431 3.04258 5.98265 3.23762C6 3.42205 6 3.64676 6 3.90732L6 8.09267C6 8.35323 6 8.57796 5.98265 8.76238C5.96431 8.9574 5.92363 9.15051 5.81452 9.33252C5.58203 9.72014 5.22363 9.88632 4.8832 9.95307C4.62049 10.0046 4.21914 10.0011 4 9.99902Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                                    <path d="M10 9.99902C9.78086 10.0011 9.37951 10.0046 9.1168 9.95307C8.77637 9.88632 8.41797 9.72014 8.18548 9.33252C8.07637 9.15051 8.03569 8.9574 8.01735 8.76238C8 8.57795 8 8.35323 8 8.09267L8 3.90732C8 3.64676 8 3.42204 8.01735 3.23762C8.03569 3.04258 8.07637 2.8495 8.18548 2.6675C8.41797 2.27986 8.77637 2.11368 9.1168 2.04691C9.37951 1.99543 9.78086 1.99887 10 2.001C10.2191 1.99887 10.6205 1.99543 10.8832 2.04691C11.2236 2.11368 11.582 2.27986 11.8145 2.6675C11.9236 2.8495 11.9643 3.04258 11.9826 3.23762C12 3.42204 12 3.64676 12 3.90732V8.09267C12 8.35323 12 8.57796 11.9826 8.76238C11.9643 8.9574 11.9236 9.15051 11.8145 9.33252C11.582 9.72014 11.2236 9.88632 10.8832 9.95307C10.6205 10.0046 10.2191 10.0011 10 9.99902Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.5 0.00622559C13.2239 0.00622559 13 0.250436 13 0.55168V11.4608C13 11.762 13.2239 12.0062 13.5 12.0062C13.7761 12.0062 14 11.762 14 11.4608V0.55168C14 0.250436 13.7761 0.00622559 13.5 0.00622559Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Around'}
                                open={activeTooltip === 'around'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedJustify === 'space-evenly' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-evenly')} onMouseEnter={() => handleMouseEnter('evenly')} onMouseLeave={handleMouseLeave}>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 9.99902C4.78086 10.0011 4.37951 10.0046 4.1168 9.95307C3.77637 9.88632 3.41797 9.72014 3.18548 9.33252C3.07637 9.15051 3.03569 8.9574 3.01735 8.76238C3 8.57795 3 8.35323 3 8.09267L3 3.90732C3 3.64676 3 3.42205 3.01735 3.23762C3.03569 3.04258 3.07637 2.8495 3.18548 2.6675C3.41797 2.27986 3.77637 2.11368 4.1168 2.04691C4.37951 1.99543 4.78086 1.99887 5 2.001C5.21914 1.99887 5.62049 1.99543 5.8832 2.04691C6.22363 2.11368 6.58203 2.27986 6.81452 2.6675C6.92363 2.8495 6.96431 3.04258 6.98265 3.23762C7 3.42205 7 3.64676 7 3.90732L7 8.09267C7 8.35323 7 8.57796 6.98265 8.76238C6.96431 8.9574 6.92363 9.15051 6.81452 9.33252C6.58203 9.72014 6.22363 9.88632 5.8832 9.95307C5.62049 10.0046 5.21914 10.0011 5 9.99902Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                                    <path d="M11 9.99902C10.7809 10.0011 10.3795 10.0046 10.1168 9.95307C9.77637 9.88632 9.41797 9.72014 9.18548 9.33252C9.07637 9.15051 9.03569 8.9574 9.01735 8.76238C9 8.57795 9 8.35323 9 8.09267V3.90732C9 3.64676 9 3.42204 9.01735 3.23762C9.03569 3.04258 9.07637 2.8495 9.18548 2.6675C9.41797 2.27986 9.77637 2.11368 10.1168 2.04691C10.3795 1.99543 10.7809 1.99887 11 2.001C11.2191 1.99887 11.6205 1.99543 11.8832 2.04691C12.2236 2.11368 12.582 2.27986 12.8145 2.6675C12.9236 2.8495 12.9643 3.04258 12.9826 3.23762C13 3.42204 13 3.64676 13 3.90732V8.09267C13 8.35323 13 8.57796 12.9826 8.76238C12.9643 8.9574 12.9236 9.15051 12.8145 9.33252C12.582 9.72014 12.2236 9.88632 11.8832 9.95307C11.6205 10.0046 11.2191 10.0011 11 9.99902Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.5 0.00622559C15.2239 0.00622559 15 0.250436 15 0.55168V11.4608C15 11.762 15.2239 12.0062 15.5 12.0062C15.7761 12.0062 16 11.762 16 11.4608V0.55168C16 0.250436 15.7761 0.00622559 15.5 0.00622559Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Evenly'}
                                open={activeTooltip === 'evenly'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
                        <span className="tw-builder__settings-subtitle">Align</span>
                        <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                            <button className={`tw-builder__settings-action tw-builder__settings-action--start ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')} onMouseEnter={() => handleMouseEnter('start')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 4C1.9989 3.78086 1.99541 3.37951 2.04693 3.1168C2.11368 2.77637 2.27986 2.41797 2.66748 2.18548C2.84949 2.07637 3.0426 2.03569 3.23762 2.01735C3.42205 2 3.64677 2 3.90733 2H8.09268C8.35324 2 8.57795 2 8.76238 2.01735C8.95742 2.03569 9.1505 2.07637 9.3325 2.18548C9.72014 2.41797 9.88632 2.77637 9.95309 3.1168C10.0046 3.37951 10.0011 3.78086 9.999 4C10.0011 4.21914 10.0046 4.62049 9.95309 4.8832C9.88632 5.22363 9.72014 5.58203 9.3325 5.81452C9.1505 5.92363 8.95742 5.96431 8.76238 5.98265C8.57795 6 8.35324 6 8.09268 6H3.90733C3.64677 6 3.42204 6 3.23762 5.98265C3.0426 5.96431 2.84949 5.92363 2.66748 5.81452C2.27986 5.58203 2.11368 5.22363 2.04693 4.8832C1.99541 4.62049 1.9989 4.21914 2.00098 4Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.22386 11.7558 0 11.4545 0H0.545454C0.2442 0 0 0.22386 0 0.5C0 0.77614 0.2442 1 0.545454 1H11.4545C11.7558 1 12 0.77614 12 0.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Start'}
                                open={activeTooltip === 'start'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 2.5C1.9989 2.22608 1.99541 1.72438 2.04693 1.396C2.11368 0.970462 2.27986 0.522462 2.66748 0.231846C2.84949 0.0954617 3.0426 0.0446155 3.23762 0.0216924C3.42205 1.14624e-07 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 1.14624e-07 8.76238 0.0216924C8.95742 0.0446155 9.1505 0.0954617 9.3325 0.231846C9.72014 0.522462 9.88632 0.970462 9.95309 1.396C10.0046 1.72438 10.0011 2.22608 9.999 2.5C10.0011 2.77392 10.0046 3.27562 9.95309 3.604C9.88632 4.02954 9.72014 4.47754 9.3325 4.76815C9.1505 4.90454 8.95742 4.95538 8.76238 4.97831C8.57795 5 8.35324 5 8.09268 5H3.90733C3.64677 5 3.42204 5 3.23762 4.97831C3.0426 4.95538 2.84949 4.90454 2.66748 4.76815C2.27986 4.47754 2.11368 4.02954 2.04693 3.604C1.99541 3.27562 1.9989 2.77392 2.00098 2.5Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7558 2 11.4545 2H0.545454C0.2442 2 0 2.22386 0 2.5C0 2.77614 0.2442 3 0.545454 3H11.4545C11.7558 3 12 2.77614 12 2.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Center'}
                                open={activeTooltip === 'center'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action tw-builder__settings-action--end ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')} onMouseEnter={() => handleMouseEnter('end')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 2C1.9989 1.78086 1.99541 1.37951 2.04693 1.1168C2.11368 0.776369 2.27986 0.417969 2.66748 0.185477C2.84949 0.0763693 3.0426 0.0356924 3.23762 0.0173539C3.42205 9.16995e-08 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 9.16995e-08 8.76238 0.0173539C8.95742 0.0356924 9.1505 0.0763693 9.3325 0.185477C9.72014 0.417969 9.88632 0.776369 9.95309 1.1168C10.0046 1.37951 10.0011 1.78086 9.999 2C10.0011 2.21914 10.0046 2.62049 9.95309 2.8832C9.88632 3.22363 9.72014 3.58203 9.3325 3.81452C9.1505 3.92363 8.95742 3.96431 8.76238 3.98265C8.57795 4 8.35324 4 8.09268 4H3.90733C3.64677 4 3.42204 4 3.23762 3.98265C3.0426 3.96431 2.84949 3.92363 2.66748 3.81452C2.27986 3.58203 2.11368 3.22363 2.04693 2.8832C1.99541 2.62049 1.9989 2.21914 2.00098 2Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 5.5C12 5.22386 11.7558 5 11.4545 5H0.545454C0.2442 5 0 5.22386 0 5.5C0 5.77614 0.2442 6 0.545454 6H11.4545C11.7558 6 12 5.77614 12 5.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'End'}
                                open={activeTooltip === 'end'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action tw-builder__settings-action--stretch ${selectedAlign === 'stretch' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('stretch')} onMouseEnter={() => handleMouseEnter('stretch')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 11.5C12 11.2239 11.7558 11 11.4545 11H0.545454C0.2442 11 -3.57628e-07 11.2239 -3.57628e-07 11.5C-3.57628e-07 11.7761 0.2442 12 0.545454 12H11.4545C11.7558 12 12 11.7761 12 11.5Z" fill="currentColor"/>
                                    <path d="M10.0098 5.95261C10.013 6.3857 10.0187 7.1789 9.96855 7.69823C9.90363 8.37122 9.73938 9.07999 9.35301 9.54052C9.17159 9.75665 8.9787 9.83757 8.78377 9.87434C8.59944 9.90914 8.37472 9.90975 8.11416 9.91046L3.92883 9.92183C3.66827 9.92254 3.44355 9.92315 3.25903 9.88935C3.0639 9.85364 2.8706 9.77377 2.68802 9.55863C2.29913 9.10021 2.13103 8.39234 2.06243 7.71972C2.00953 7.20066 2.01082 6.40744 2.01177 5.97435C2.00846 5.54126 2.00287 4.74806 2.05294 4.22873C2.11788 3.55574 2.28214 2.84697 2.66853 2.38644C2.84994 2.17031 3.0428 2.08939 3.23774 2.05262C3.42207 2.01782 3.64679 2.01721 3.90735 2.0165L8.09268 2.00513C8.35324 2.00442 8.57797 2.00381 8.76248 2.03761C8.9576 2.07332 9.15093 2.15319 9.33352 2.36833C9.72239 2.82675 9.89049 3.53462 9.95907 4.20724C10.012 4.7263 10.0107 5.51952 10.0098 5.95261Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.00157098 0.532595C0.00232137 0.808734 0.24714 1.03193 0.548382 1.03111L11.4574 1.00147C11.7587 1.00065 12.0023 0.776125 12.0015 0.499986C12.0008 0.223847 11.756 0.000651104 11.4547 0.00146974L0.545665 0.0311142C0.244422 0.0319328 0.000820595 0.256456 0.00157098 0.532595Z" fill="currentColor"/>
                                </svg>

                                <Tooltip
                                message={'Stretch'}
                                open={activeTooltip === 'stretch'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                        </div>
                    </div>
                    <TextType 
                    name="Column Gap"
                    value=""
                    placeholder="normal"
                    cssProperty="column-gap"
                    autoUnit="px"
                    applyGlobalCSSChange={applyGlobalCSSChange}
                    getGlobalCSSValue={getGlobalCSSValue}
                    selectedId={selectedId}
                    index="column-gap"
                    />
                    <TextType 
                        name="Row Gap"
                        value=""
                        placeholder="normal"
                        cssProperty="row-gap"
                        autoUnit="px"
                        applyGlobalCSSChange={applyGlobalCSSChange}
                        getGlobalCSSValue={getGlobalCSSValue}
                        selectedId={selectedId}
                        index="row-gap"
                    />
                    <TextType 
                        name="Flex grow"
                        value=""
                        placeholder="0"
                        cssProperty="flex-grow"
                        applyGlobalCSSChange={applyGlobalCSSChange}
                        getGlobalCSSValue={getGlobalCSSValue}
                        selectedId={selectedId}
                        index="flex-grow"
                    />
                    <TextType 
                        name="Flex shrink"
                        value=""
                        placeholder="1"
                        cssProperty="flex-shrink"
                        applyGlobalCSSChange={applyGlobalCSSChange}
                        getGlobalCSSValue={getGlobalCSSValue}
                        selectedId={selectedId}
                        index="flex-shrink"
                    />
                    <TextType 
                        name="Flex basis"
                        value=""
                        placeholder="auto"
                        cssProperty="flex-basis"
                        autoUnit="px"
                        applyGlobalCSSChange={applyGlobalCSSChange}
                        getGlobalCSSValue={getGlobalCSSValue}
                        selectedId={selectedId}
                        index="flex-basis"
                    />
                    <TextType 
                        name="Order"
                        value=""
                        placeholder="0"
                        cssProperty="order"
                        applyGlobalCSSChange={applyGlobalCSSChange}
                        getGlobalCSSValue={getGlobalCSSValue}
                        selectedId={selectedId}
                        index="order"
                    />
                    </>
                )}
        {superSelectValue === 'grid' && (
            <>
        <TextType 
            name="Gap"
            value=""
            placeholder="0"
            cssProperty="gap"
            autoUnit="px"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="gap"
        />
        <TextType 
            name="Template columns"
            value=""
            placeholder="none"
            cssProperty="grid-template-columns"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="grid-template-columns"
        />
        <TextType 
            name="Template rows"
            value=""
            placeholder="none"
            cssProperty="grid-template-rows"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="grid-template-rows"
        />
        <TextType 
            name="Auto columns"
            value=""
            placeholder="none"
            cssProperty="grid-auto-columns"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="grid-auto-columns"
        />
        <TextType 
            name="Auto rows"
            value=""
            placeholder="none"
            cssProperty="grid-auto-rows"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="grid-auto-rows"
        />
            <div className="tw-builder__settings-setting">
                <span className="tw-builder__settings-subtitle">Auto flow</span>
                <div className="tw-builder__settings-select-container">
                <span
                    ref={flowSelectRef}
                    className="tw-builder__settings-select"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        height: 0,
                        overflow: 'hidden'
                    }}
                >
                    {selectedFlow}
                </span>
                <span
                    ref={flowMeasureRef}
                    className="tw-builder__settings-select"
                    aria-hidden
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        height: 0,
                        overflow: 'hidden'
                    }}
                >
                    {selectedFlow}
                </span>
                <select 
                    ref={flowSelectRef}
                    className="tw-builder__settings-select"
                    value={selectedFlow}
                    onChange={(e) => handleFlowSelectChange(e.target.value)}
                    style={{ width: flowSelectWidth }}
                >
                    <option className="tw-builder__settings-option" value="row">Row</option>
                    <option className="tw-builder__settings-option" value="column">Column</option>
                    <option className="tw-builder__settings-option" value="dense">Dense</option>
                </select>
                <span className="tw-builder__settings-arrow">
                    <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                            <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                        </svg>
                    </span>
                </div>
            </div>
            <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
                <span className="tw-builder__settings-subtitle">Justify</span>
                <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                    <button className={`tw-builder__settings-action ${selectedJustify === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-start')} onMouseEnter={() => handleMouseEnter('jstart')} onMouseLeave={handleMouseLeave}>
                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Start'}
                        open={activeTooltip === 'jstart'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedJustify === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('center')} onMouseEnter={() => handleMouseEnter('jcenter')} onMouseLeave={handleMouseLeave}>
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Center'}
                        open={activeTooltip === 'jcenter'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedJustify === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-end')} onMouseEnter={() => handleMouseEnter('jend')} onMouseLeave={handleMouseLeave}>
                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'End'}
                        open={activeTooltip === 'jend'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedJustify === 'space-between' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-between')} onMouseEnter={() => handleMouseEnter('jbetween')} onMouseLeave={handleMouseLeave}>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.08581 10.0201C2.86671 10.0246 2.46541 10.0324 2.20217 9.98366C1.86104 9.92057 1.50087 9.75826 1.26422 9.37317C1.15316 9.19234 1.11041 8.99968 1.08998 8.80486C1.07064 8.62064 1.06822 8.39593 1.06542 8.13539L1.0204 3.95028C1.0176 3.68973 1.01518 3.46503 1.03055 3.28042C1.04679 3.0852 1.08539 2.8917 1.19253 2.70853C1.42084 2.31842 1.77743 2.14839 2.11712 2.07796C2.37926 2.02366 2.78063 2.02278 2.99978 2.02255C3.21888 2.01806 3.62018 2.01031 3.88342 2.05896C4.22455 2.12207 4.58472 2.28438 4.82137 2.6695C4.93243 2.85031 4.97518 3.04294 4.99561 3.23777C5.01495 3.422 5.01737 3.64671 5.02017 3.90725L5.06519 8.09236C5.06799 8.3529 5.07041 8.57762 5.05504 8.76221C5.0388 8.95743 5.0002 9.15096 4.89306 9.33413C4.66475 9.72423 4.30816 9.89425 3.96847 9.96466C3.70633 10.019 3.30496 10.0198 3.08581 10.0201Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.499971 0.00536387C0.223847 0.00833421 0.00262689 0.254939 0.00586725 0.556165L0.123212 11.4646C0.126453 11.7659 0.352927 12.0076 0.629051 12.0047C0.905175 12.0017 1.12639 11.7551 1.12315 11.4539L1.00581 0.545409C1.00257 0.244182 0.776095 0.00239353 0.499971 0.00536387Z" fill="currentColor"/>
                            <path d="M9.00012 2.02154C9.21922 2.01721 9.62052 2.0096 9.88374 2.05842C10.2248 2.12166 10.5849 2.28414 10.8214 2.66935C10.9324 2.85023 10.975 3.04291 10.9954 3.23774C11.0146 3.42197 11.0169 3.64668 11.0196 3.90723L11.0627 8.09236C11.0653 8.3529 11.0677 8.57761 11.0522 8.7622C11.0359 8.95742 10.9972 9.1509 10.8899 9.33402C10.6615 9.72403 10.3048 9.89389 9.96505 9.96415C9.70289 10.0183 9.30152 10.019 9.08237 10.0191C8.86327 10.0235 8.46197 10.0311 8.19875 9.98232C7.85765 9.91905 7.49756 9.75657 7.26109 9.37134C7.15012 9.19047 7.10746 8.99782 7.08711 8.80299C7.06786 8.61874 7.06555 8.39404 7.06287 8.13349L7.01983 3.94836C7.01715 3.68782 7.01484 3.4631 7.03029 3.27852C7.04662 3.08331 7.08531 2.88979 7.19254 2.70668C7.42104 2.31668 7.77771 2.14683 8.11744 2.07658C8.3796 2.02236 8.78097 2.02172 9.00012 2.02154Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.6231 12.0059C11.8992 12.003 12.1205 11.7565 12.1174 11.4553L12.0052 0.546793C12.0021 0.245554 11.7758 0.00366949 11.4997 0.00650944C11.2235 0.0093494 11.0022 0.255839 11.0053 0.557077L11.1175 11.4656C11.1206 11.7668 11.3469 12.0087 11.6231 12.0059Z" fill="currentColor"/>
                        </svg>

                        <Tooltip
                        message={'Between'}
                        open={activeTooltip === 'jbetween'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedJustify === 'space-around' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-around')} onMouseEnter={() => handleMouseEnter('jaround')} onMouseLeave={handleMouseLeave}>
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 9.99902C3.78086 10.0011 3.37951 10.0046 3.1168 9.95307C2.77637 9.88632 2.41797 9.72014 2.18548 9.33252C2.07637 9.15051 2.03569 8.9574 2.01735 8.76238C2 8.57795 2 8.35323 2 8.09267L2 3.90732C2 3.64676 2 3.42205 2.01735 3.23762C2.03569 3.04258 2.07637 2.8495 2.18548 2.6675C2.41797 2.27986 2.77637 2.11368 3.1168 2.04691C3.37951 1.99543 3.78086 1.99887 4 2.001C4.21914 1.99887 4.62049 1.99543 4.8832 2.04691C5.22363 2.11368 5.58203 2.27986 5.81452 2.6675C5.92363 2.8495 5.96431 3.04258 5.98265 3.23762C6 3.42205 6 3.64676 6 3.90732L6 8.09267C6 8.35323 6 8.57796 5.98265 8.76238C5.96431 8.9574 5.92363 9.15051 5.81452 9.33252C5.58203 9.72014 5.22363 9.88632 4.8832 9.95307C4.62049 10.0046 4.21914 10.0011 4 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                            <path d="M10 9.99902C9.78086 10.0011 9.37951 10.0046 9.1168 9.95307C8.77637 9.88632 8.41797 9.72014 8.18548 9.33252C8.07637 9.15051 8.03569 8.9574 8.01735 8.76238C8 8.57795 8 8.35323 8 8.09267L8 3.90732C8 3.64676 8 3.42204 8.01735 3.23762C8.03569 3.04258 8.07637 2.8495 8.18548 2.6675C8.41797 2.27986 8.77637 2.11368 9.1168 2.04691C9.37951 1.99543 9.78086 1.99887 10 2.001C10.2191 1.99887 10.6205 1.99543 10.8832 2.04691C11.2236 2.11368 11.582 2.27986 11.8145 2.6675C11.9236 2.8495 11.9643 3.04258 11.9826 3.23762C12 3.42204 12 3.64676 12 3.90732V8.09267C12 8.35323 12 8.57796 11.9826 8.76238C11.9643 8.9574 11.9236 9.15051 11.8145 9.33252C11.582 9.72014 11.2236 9.88632 10.8832 9.95307C10.6205 10.0046 10.2191 10.0011 10 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.5 0.00622559C13.2239 0.00622559 13 0.250436 13 0.55168V11.4608C13 11.762 13.2239 12.0062 13.5 12.0062C13.7761 12.0062 14 11.762 14 11.4608V0.55168C14 0.250436 13.7761 0.00622559 13.5 0.00622559Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Around'}
                        open={activeTooltip === 'jaround'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedJustify === 'space-evenly' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('space-evenly')} onMouseEnter={() => handleMouseEnter('jevenly')} onMouseLeave={handleMouseLeave}>
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 9.99902C4.78086 10.0011 4.37951 10.0046 4.1168 9.95307C3.77637 9.88632 3.41797 9.72014 3.18548 9.33252C3.07637 9.15051 3.03569 8.9574 3.01735 8.76238C3 8.57795 3 8.35323 3 8.09267L3 3.90732C3 3.64676 3 3.42205 3.01735 3.23762C3.03569 3.04258 3.07637 2.8495 3.18548 2.6675C3.41797 2.27986 3.77637 2.11368 4.1168 2.04691C4.37951 1.99543 4.78086 1.99887 5 2.001C5.21914 1.99887 5.62049 1.99543 5.8832 2.04691C6.22363 2.11368 6.58203 2.27986 6.81452 2.6675C6.92363 2.8495 6.96431 3.04258 6.98265 3.23762C7 3.42205 7 3.64676 7 3.90732L7 8.09267C7 8.35323 7 8.57796 6.98265 8.76238C6.96431 8.9574 6.92363 9.15051 6.81452 9.33252C6.58203 9.72014 6.22363 9.88632 5.8832 9.95307C5.62049 10.0046 5.21914 10.0011 5 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                            <path d="M11 9.99902C10.7809 10.0011 10.3795 10.0046 10.1168 9.95307C9.77637 9.88632 9.41797 9.72014 9.18548 9.33252C9.07637 9.15051 9.03569 8.9574 9.01735 8.76238C9 8.57795 9 8.35323 9 8.09267V3.90732C9 3.64676 9 3.42204 9.01735 3.23762C9.03569 3.04258 9.07637 2.8495 9.18548 2.6675C9.41797 2.27986 9.77637 2.11368 10.1168 2.04691C10.3795 1.99543 10.7809 1.99887 11 2.001C11.2191 1.99887 11.6205 1.99543 11.8832 2.04691C12.2236 2.11368 12.582 2.27986 12.8145 2.6675C12.9236 2.8495 12.9643 3.04258 12.9826 3.23762C13 3.42204 13 3.64676 13 3.90732V8.09267C13 8.35323 13 8.57796 12.9826 8.76238C12.9643 8.9574 12.9236 9.15051 12.8145 9.33252C12.582 9.72014 12.2236 9.88632 11.8832 9.95307C11.6205 10.0046 11.2191 10.0011 11 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.5 0.00622559C15.2239 0.00622559 15 0.250436 15 0.55168V11.4608C15 11.762 15.2239 12.0062 15.5 12.0062C15.7761 12.0062 16 11.762 16 11.4608V0.55168C16 0.250436 15.7761 0.00622559 15.5 0.00622559Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Evenly'}
                        open={activeTooltip === 'jevenly'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                </div>
            </div>
            <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
                <span className="tw-builder__settings-subtitle">Align</span>
                <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                    <button className={`tw-builder__settings-action tw-builder__settings-action--start ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')} onMouseEnter={() => handleMouseEnter('astart')} onMouseLeave={handleMouseLeave}>
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00098 4C1.9989 3.78086 1.99541 3.37951 2.04693 3.1168C2.11368 2.77637 2.27986 2.41797 2.66748 2.18548C2.84949 2.07637 3.0426 2.03569 3.23762 2.01735C3.42205 2 3.64677 2 3.90733 2H8.09268C8.35324 2 8.57795 2 8.76238 2.01735C8.95742 2.03569 9.1505 2.07637 9.3325 2.18548C9.72014 2.41797 9.88632 2.77637 9.95309 3.1168C10.0046 3.37951 10.0011 3.78086 9.999 4C10.0011 4.21914 10.0046 4.62049 9.95309 4.8832C9.88632 5.22363 9.72014 5.58203 9.3325 5.81452C9.1505 5.92363 8.95742 5.96431 8.76238 5.98265C8.57795 6 8.35324 6 8.09268 6H3.90733C3.64677 6 3.42204 6 3.23762 5.98265C3.0426 5.96431 2.84949 5.92363 2.66748 5.81452C2.27986 5.58203 2.11368 5.22363 2.04693 4.8832C1.99541 4.62049 1.9989 4.21914 2.00098 4Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.22386 11.7558 0 11.4545 0H0.545454C0.2442 0 0 0.22386 0 0.5C0 0.77614 0.2442 1 0.545454 1H11.4545C11.7558 1 12 0.77614 12 0.5Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Start'}
                        open={activeTooltip === 'astart'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')} onMouseEnter={() => handleMouseEnter('acenter')} onMouseLeave={handleMouseLeave}>
                        <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00098 2.5C1.9989 2.22608 1.99541 1.72438 2.04693 1.396C2.11368 0.970462 2.27986 0.522462 2.66748 0.231846C2.84949 0.0954617 3.0426 0.0446155 3.23762 0.0216924C3.42205 1.14624e-07 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 1.14624e-07 8.76238 0.0216924C8.95742 0.0446155 9.1505 0.0954617 9.3325 0.231846C9.72014 0.522462 9.88632 0.970462 9.95309 1.396C10.0046 1.72438 10.0011 2.22608 9.999 2.5C10.0011 2.77392 10.0046 3.27562 9.95309 3.604C9.88632 4.02954 9.72014 4.47754 9.3325 4.76815C9.1505 4.90454 8.95742 4.95538 8.76238 4.97831C8.57795 5 8.35324 5 8.09268 5H3.90733C3.64677 5 3.42204 5 3.23762 4.97831C3.0426 4.95538 2.84949 4.90454 2.66748 4.76815C2.27986 4.47754 2.11368 4.02954 2.04693 3.604C1.99541 3.27562 1.9989 2.77392 2.00098 2.5Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7558 2 11.4545 2H0.545454C0.2442 2 0 2.22386 0 2.5C0 2.77614 0.2442 3 0.545454 3H11.4545C11.7558 3 12 2.77614 12 2.5Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Center'}
                        open={activeTooltip === 'acenter'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action tw-builder__settings-action--end ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')} onMouseEnter={() => handleMouseEnter('aend')} onMouseLeave={handleMouseLeave}>
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00098 2C1.9989 1.78086 1.99541 1.37951 2.04693 1.1168C2.11368 0.776369 2.27986 0.417969 2.66748 0.185477C2.84949 0.0763693 3.0426 0.0356924 3.23762 0.0173539C3.42205 9.16995e-08 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 9.16995e-08 8.76238 0.0173539C8.95742 0.0356924 9.1505 0.0763693 9.3325 0.185477C9.72014 0.417969 9.88632 0.776369 9.95309 1.1168C10.0046 1.37951 10.0011 1.78086 9.999 2C10.0011 2.21914 10.0046 2.62049 9.95309 2.8832C9.88632 3.22363 9.72014 3.58203 9.3325 3.81452C9.1505 3.92363 8.95742 3.96431 8.76238 3.98265C8.57795 4 8.35324 4 8.09268 4H3.90733C3.64677 4 3.42204 4 3.23762 3.98265C3.0426 3.96431 2.84949 3.92363 2.66748 3.81452C2.27986 3.58203 2.11368 3.22363 2.04693 2.8832C1.99541 2.62049 1.9989 2.21914 2.00098 2Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 5.5C12 5.22386 11.7558 5 11.4545 5H0.545454C0.2442 5 0 5.22386 0 5.5C0 5.77614 0.2442 6 0.545454 6H11.4545C11.7558 6 12 5.77614 12 5.5Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'End'}
                        open={activeTooltip === 'aend'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action tw-builder__settings-action--stretch ${selectedAlign === 'stretch' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('stretch')} onMouseEnter={() => handleMouseEnter('astretch')} onMouseLeave={handleMouseLeave}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 11.5C12 11.2239 11.7558 11 11.4545 11H0.545454C0.2442 11 -3.57628e-07 11.2239 -3.57628e-07 11.5C-3.57628e-07 11.7761 0.2442 12 0.545454 12H11.4545C11.7558 12 12 11.7761 12 11.5Z" fill="currentColor"/>
                            <path d="M10.0098 5.95261C10.013 6.3857 10.0187 7.1789 9.96855 7.69823C9.90363 8.37122 9.73938 9.07999 9.35301 9.54052C9.17159 9.75665 8.9787 9.83757 8.78377 9.87434C8.59944 9.90914 8.37472 9.90975 8.11416 9.91046L3.92883 9.92183C3.66827 9.92254 3.44355 9.92315 3.25903 9.88935C3.0639 9.85364 2.8706 9.77377 2.68802 9.55863C2.29913 9.10021 2.13103 8.39234 2.06243 7.71972C2.00953 7.20066 2.01082 6.40744 2.01177 5.97435C2.00846 5.54126 2.00287 4.74806 2.05294 4.22873C2.11788 3.55574 2.28214 2.84697 2.66853 2.38644C2.84994 2.17031 3.0428 2.08939 3.23774 2.05262C3.42207 2.01782 3.64679 2.01721 3.90735 2.0165L8.09268 2.00513C8.35324 2.00442 8.57797 2.00381 8.76248 2.03761C8.9576 2.07332 9.15093 2.15319 9.33352 2.36833C9.72239 2.82675 9.89049 3.53462 9.95907 4.20724C10.012 4.7263 10.0107 5.51952 10.0098 5.95261Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.00157098 0.532595C0.00232137 0.808734 0.24714 1.03193 0.548382 1.03111L11.4574 1.00147C11.7587 1.00065 12.0023 0.776125 12.0015 0.499986C12.0008 0.223847 11.756 0.000651104 11.4547 0.00146974L0.545665 0.0311142C0.244422 0.0319328 0.000820595 0.256456 0.00157098 0.532595Z" fill="currentColor"/>
                        </svg>

                        <Tooltip
                        message={'Stretch'}
                        open={activeTooltip === 'astretch'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                </div>
            </div>
            <TextType 
            name="Order"
            value=""
            placeholder="0"
            cssProperty="order"
            applyGlobalCSSChange={applyGlobalCSSChange}
            getGlobalCSSValue={getGlobalCSSValue}
            selectedId={selectedId}
            index="grid-order"
            />
            </>
        )}
        {(superSelectValue === 'block' || superSelectValue === 'inline-block' || superSelectValue === 'inline') && (
            <div className="tw-builder__settings-setting">
                <span className="tw-builder__settings-subtitle">Order</span>
                <input type="text" className="tw-builder__settings-input" placeholder="0" />
            </div>
        )}
        </React.Fragment>
    )
}

const PanelType = ({name, index, cssProperty, applyGlobalCSSChange, getGlobalCSSValue, autoUnit, selectedElementData}) => {
    const [topValue, setTopValue] = useState(() => {
        const saved = getGlobalCSSValue?.(`${cssProperty}-top`);
        return saved || '';
    });
    
    const [rightValue, setRightValue] = useState(() => {
        const saved = getGlobalCSSValue?.(`${cssProperty}-right`);
        return saved || '';
    });
    
    const [bottomValue, setBottomValue] = useState(() => {
        const saved = getGlobalCSSValue?.(`${cssProperty}-bottom`);
        return saved || '';
    });
    
    const [leftValue, setLeftValue] = useState(() => {
        const saved = getGlobalCSSValue?.(`${cssProperty}-left`);
        return saved || '';
    });

        // Función para procesar valores con unidades (igual que en TextType)
        const processValueForCSS = (inputValue) => {
            if (!autoUnit || !inputValue) return inputValue;
            const trimmedValue = inputValue.trim();
            const validUnits = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', '%', 'cm', 'mm', 'in', 'pt', 'pc', 'ex', 'ch', 'fr'];
            const numberWithTextRegex = /^(-?\d*\.?\d+)(.*)$/;
            const match = trimmedValue.match(numberWithTextRegex);
            
            if (match) {
                const [, numberPart, unitPart] = match;
                if (!unitPart || !validUnits.includes(unitPart)) {
                    return `${numberPart}${autoUnit}`;
                }
                return trimmedValue;
            }
            return inputValue;
        };
    
        // Handlers para cada input
        const handleTopChange = (e) => {
            const newValue = e.target.value;
            setTopValue(newValue);
            if (cssProperty && applyGlobalCSSChange) {
                const cssValue = processValueForCSS(newValue);
                applyGlobalCSSChange(`${cssProperty}-top`, cssValue);
            }
        };
    
        const handleRightChange = (e) => {
            const newValue = e.target.value;
            setRightValue(newValue);
            if (cssProperty && applyGlobalCSSChange) {
                const cssValue = processValueForCSS(newValue);
                applyGlobalCSSChange(`${cssProperty}-right`, cssValue);
            }
        };
    
        const handleBottomChange = (e) => {
            const newValue = e.target.value;
            setBottomValue(newValue);
            if (cssProperty && applyGlobalCSSChange) {
                const cssValue = processValueForCSS(newValue);
                applyGlobalCSSChange(`${cssProperty}-bottom`, cssValue);
            }
        };
    
        const handleLeftChange = (e) => {
            const newValue = e.target.value;
            setLeftValue(newValue);
            if (cssProperty && applyGlobalCSSChange) {
                const cssValue = processValueForCSS(newValue);
                applyGlobalCSSChange(`${cssProperty}-left`, cssValue);
            }
        };

    return (
        <div className="tw-builder__settings-setting tw-builder__settings-setting--column" key={index}>
        <span className="tw-builder__settings-subtitle">{name}</span>
        <div className="tw-builder__settings-spacing">
            <input type="text" className="tw-builder__spacing-input" value={rightValue} onChange={handleRightChange}/>
            <div className="tw-builder__settings-spacing-mid">
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid" value={topValue} onChange={handleTopChange}/>
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid" value={bottomValue} onChange={handleBottomChange}/>
            </div>
            <input type="text" className="tw-builder__spacing-input" value={leftValue} onChange={handleLeftChange}/>
        </div>
    </div>
    )
}
const ColorType = ({name, value, opacity, index, elementId, cssProperty, selectedElementData, applyGlobalCSSChange, getGlobalCSSValue}) => {

    const colorInputRef = useRef(null);

    const getSavedValue = useCallback(() => {
        const savedValue = getGlobalCSSValue?.(cssProperty);
        if(!savedValue) return { color: ``, hex: ``, percentage: `` };

        if(savedValue.startsWith('rgba(')) {
            const rgbaMatch = savedValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if(rgbaMatch) {
                const [, r, g, b, a] = rgbaMatch;
                const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
                const opacityPercent = Math.round(parseFloat(a) * 100);
        
                return {
                    color: hexColor,
                    hex: hexColor.toUpperCase().replace('#', ''),
                    percentage: `${opacityPercent}%`
                };
            }
        } else if(savedValue.startsWith('#')) {
            return {
                color: savedValue,
                hex: savedValue.toUpperCase().replace('#', ''),
                percentage: '100%'
            };
        }
        return { color: ``, hex: ``, percentage: `` };
    }, [getGlobalCSSValue, cssProperty]);
    
    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    
        // Initialize states with saved values
        const initialValues = getSavedValue();
        const [color, setColor] = useState(initialValues.color);
        const [hex, setHex] = useState(initialValues.hex);
        const [percentage, setPercentage] = useState(initialValues.percentage);
    
        // Effect to update the values when the element is selected
        useEffect(() => {
            const newValues = getSavedValue();
            setColor(newValues.color);
            setHex(newValues.hex);
            setPercentage(newValues.percentage);
        }, [selectedElementData]); 

    //Function to convert hex to rgba with opacity
    const hexToRgba = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };

     // Function to apply the CSS style
     const applyCSSChange = (newColor, newOpacity) => {
        if (!cssProperty) return;

        const opacityValue = parseInt(newOpacity.replace('%', ''));
        let finalValue;
        
        if (opacityValue < 100) {
            // If there is transparency, use rgba
            finalValue = hexToRgba(newColor, opacityValue);
        } else {
            // If there is no transparency, use hex
            finalValue = newColor;
        }
        
        // Apply the change using global function
        if (applyGlobalCSSChange) {
            applyGlobalCSSChange(cssProperty, finalValue);
        }
    };

    // Add RAF throttling
    const rafRef = useRef(null);

    //Function to change the color
    const handleColorChange = useCallback((e) => {
        const newColor = e.target.value;
        
        // Update visual state immediately for responsive UI
        setColor(newColor);
        setHex(newColor.replace('#', '').toUpperCase());
        
        // Use requestAnimationFrame to throttle CSS updates to display refresh rate
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        
        rafRef.current = requestAnimationFrame(() => {
            applyCSSChange(newColor, percentage);
        });
    }, [percentage, applyCSSChange]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    //Function to change the color with the text input
    const handleHexChange = (e) => {
        let hexValue = e.target.value.toUpperCase().replace('#', '');

        //If the hex value is longer than 6, cut it to 6
        if(hexValue.length > 6){
            hexValue = hexValue.slice(0, 6);
        }
        setHex(hexValue);

        //Check if the hex value is valid
        const hexPattern = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        //If the hex value is valid, set the color
        if(hexPattern.test(hexValue)) {
            const formattedHex = `#${hexValue}`;
            setColor(formattedHex);

            //If the hex value is 3 characters, expand it to 6 (ex: #fff -> #ffffff)
            if (hexValue.length === 3) {
                const expandedHex = hexValue.split('').map(char => char + char).join('');
                const formattedHex = `#${expandedHex}`;
                setColor(formattedHex);


            } else {
                const formattedHex = `#${hexValue}`;
                setColor(formattedHex);
            }
            applyCSSChange(formattedHex, percentage);
        }
    };
    //Function to change the color when the user is not typing
    const handleHexBlur = (e) => {
        const hexValue = e.target.value.trim();
        if(hexValue === ''){
            setHex('');
            setColor('');
            applyCSSChange('', '');
        } 
    };
    //Function to change the transparency with the percentage input
    const handlePercentageChange = (e) => {
        let value = e.target.value.replace('%', '');
        if(value === '' && e.type === 'blur'){
            value = 100;
        } 
        if(value < 0) value = 0;
        if(value > 100) value = 100;
        if(isNaN(value)) value = 0;

        if(value !== 0 || e.type === 'blur') {
            const finalValue = `${value}%`;
            setPercentage(finalValue);
            e.target.value = finalValue;
            applyCSSChange(color, finalValue);
        }
    };
    //Function to open the color picker(native html input)
    const handleColorClick = () => {
        if(colorInputRef.current){
            colorInputRef.current.click();
        }
    };
    //Function to get the final color. This is used to mix the color with the transparency
    const finalColor = color && color !== '' ? hexToRgba(color, parseInt(percentage.replace('%', ''))) : 'transparent';

    return (
        <div className="tw-builder__settings-setting tw-builder__settings-setting--column" key={index}>
            <span className="tw-builder__settings-subtitle">{name}</span>
        <div className="tw-builder__settings-background">
            <div className="tw-builder__settings-colors">
                <input  ref={colorInputRef} type="color" className="tw-builder__settings-color-input" value={color} onChange={handleColorChange} />
                <div className="tw-builder__settings-color" onClick={handleColorClick} style={{
                        backgroundColor: finalColor, 
                    }}>
                </div>
                <input type="text" className="tw-builder__settings-hex" value={hex} onChange={handleHexChange} onBlur={handleHexBlur} onInput={handleHexChange} placeholder="Hex here..."/>
            </div>
            <div className="tw-builder__settings-percentages">
                <input type="text" value={percentage} min={0} max={100} className="tw-builder__settings-percentage" onBlur={handlePercentageChange} onChange={handlePercentageChange} />
            </div>
        </div>
    </div>
    )
}
const ImageType = ({name, index}) => {
    return (
        <div className="tw-builder__settings-setting tw-builder__settings-setting--column" key={index}>
        <span className="tw-builder__settings-subtitle">{name}</span>
        <img src="/assets/builder-default-image.svg" alt="Image" className="tw-builder__settings-image" />
    </div>
    )
}
const ChooseType = ({name, index, category, cssProperty, applyGlobalCSSChange, getGlobalCSSValue}) => {

    const [selectedChoose, setSelectedChoose] = useState(getGlobalCSSValue?.(cssProperty) || category || '');
    const [isReverse, setIsReverse] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Update when selected element changes
    useEffect(() => {
        if (getGlobalCSSValue && cssProperty) {
            const savedValue = getGlobalCSSValue(cssProperty);
            setSelectedChoose(savedValue || category || '');
        }
    }, [getGlobalCSSValue, cssProperty, category]);

    const handleMouseEnter = (tooltipId) => {
        setActiveTooltip(tooltipId);
    };
    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };
    const handleChooseChange = useCallback((choose) => {
        setSelectedChoose(choose);
        if (cssProperty && applyGlobalCSSChange) {
            let finalValue = choose;
            if(category === 'flex-direction' && isReverse) {
                finalValue = choose === 'row'? 'row-reverse' : 'column-reverse';
            }
            applyGlobalCSSChange(cssProperty, finalValue);
        }
    }, [cssProperty, applyGlobalCSSChange, category, isReverse]);

    const handleReverseToggle = useCallback(() => {
        const newReverse = !isReverse;
        setIsReverse(newReverse);
        
        // Apply reverse to CSS immediately if we have a direction selected
        if (cssProperty && applyGlobalCSSChange && selectedChoose) {
            const finalValue = newReverse 
                ? (selectedChoose === 'row' ? 'row-reverse' : 'column-reverse')
                : selectedChoose;
            applyGlobalCSSChange(cssProperty, finalValue);
        }
    }, [isReverse, cssProperty, applyGlobalCSSChange, selectedChoose]);

    switch (category) {
        case 'direction':
            return (
                <div className="tw-builder__settings-setting" key={index}>
                    <span className="tw-builder__settings-subtitle">{name}</span>
                    <div className="tw-builder__settings-actions">
                        <button className={`tw-builder__settings-action ${selectedChoose === 'column' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('column')} onMouseEnter={() => handleMouseEnter('column')} onMouseLeave={handleMouseLeave}>
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.00134172 2C-0.00151758 1.78086 -0.00630757 1.37951 0.0645315 1.1168C0.156314 0.776369 0.384806 0.417969 0.917786 0.185477C1.16804 0.0763693 1.43357 0.0356924 1.70173 0.0173539C1.95531 9.16995e-08 2.26431 0 2.62258 0H8.37743C8.7357 0 9.04469 9.16995e-08 9.29828 0.0173539C9.56645 0.0356924 9.83193 0.0763693 10.0822 0.185477C10.6152 0.417969 10.8437 0.776369 10.9355 1.1168C11.0063 1.37951 11.0016 1.78086 10.9986 2C11.0016 2.21914 11.0063 2.62049 10.9355 2.8832C10.8437 3.22363 10.6152 3.58203 10.0822 3.81452C9.83193 3.92363 9.56645 3.96431 9.29828 3.98265C9.04469 4 8.7357 4 8.37743 4H2.62258C2.26431 4 1.95531 4 1.70173 3.98265C1.43357 3.96431 1.16804 3.92363 0.917786 3.81452C0.384806 3.58203 0.156314 3.22363 0.0645315 2.8832C-0.00630757 2.62049 -0.00151758 2.21914 0.00134172 2Z" fill="currentColor"/>
                                <path d="M0.00134172 7C-0.00151758 6.78086 -0.00630757 6.37951 0.0645315 6.1168C0.156314 5.77637 0.384806 5.41797 0.917786 5.18548C1.16804 5.07637 1.43357 5.03569 1.70173 5.01735C1.95531 5 2.26431 5 2.62258 5H8.37743C8.7357 5 9.04469 5 9.29828 5.01735C9.56645 5.03569 9.83193 5.07637 10.0822 5.18548C10.6152 5.41797 10.8437 5.77637 10.9355 6.1168C11.0063 6.37951 11.0016 6.78086 10.9986 7C11.0016 7.21914 11.0063 7.62049 10.9355 7.8832C10.8437 8.22363 10.6152 8.58203 10.0822 8.81452C9.83193 8.92363 9.56645 8.96431 9.29828 8.98265C9.04469 9 8.7357 9 8.37743 9H2.62258C2.26431 9 1.95531 9 1.70173 8.98265C1.43357 8.96431 1.16804 8.92363 0.917786 8.81452C0.384806 8.58203 0.156314 8.22363 0.0645315 7.8832C-0.00630757 7.62049 -0.00151758 7.21914 0.00134172 7Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Column'}
                            open={activeTooltip === 'column'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'row' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('row')} onMouseEnter={() => handleMouseEnter('row')} onMouseLeave={handleMouseLeave}>
                            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0.000975796C7.21914 -0.0011037 7.62049 -0.00458732 7.8832 0.046932C8.22363 0.113683 8.58203 0.279859 8.81452 0.66748C8.92363 0.849487 8.96431 1.0426 8.98265 1.23762C9 1.42205 9 1.64677 9 1.90733V6.09268C9 6.35324 9 6.57795 8.98265 6.76238C8.96431 6.95742 8.92363 7.1505 8.81452 7.3325C8.58203 7.72014 8.22363 7.88632 7.8832 7.95309C7.62049 8.00457 7.21914 8.00113 7 7.999C6.78086 8.00113 6.37951 8.00457 6.1168 7.95309C5.77637 7.88632 5.41797 7.72014 5.18548 7.3325C5.07637 7.1505 5.03569 6.95742 5.01735 6.76238C5 6.57795 5 6.35324 5 6.09268V1.90733C5 1.64677 5 1.42204 5.01735 1.23762C5.03569 1.0426 5.07637 0.849487 5.18548 0.66748C5.41797 0.279859 5.77637 0.113683 6.1168 0.046932C6.37951 -0.00458732 6.78086 -0.0011037 7 0.000975796Z" fill="currentColor"/>
                                <path d="M2 0.000975796C2.21914 -0.0011037 2.62049 -0.00458732 2.8832 0.046932C3.22363 0.113683 3.58203 0.279859 3.81452 0.66748C3.92363 0.849487 3.96431 1.0426 3.98265 1.23762C4 1.42205 4 1.64677 4 1.90733V6.09268C4 6.35324 4 6.57795 3.98265 6.76238C3.96431 6.95742 3.92363 7.1505 3.81452 7.3325C3.58203 7.72014 3.22363 7.88632 2.8832 7.95309C2.62049 8.00457 2.21914 8.00113 2 7.999C1.78086 8.00113 1.37951 8.00457 1.1168 7.95309C0.776369 7.88632 0.417969 7.72014 0.185476 7.3325C0.0763686 7.1505 0.0356922 6.95742 0.0173538 6.76238C0 6.57795 0 6.35324 0 6.09268V1.90733C0 1.64677 0 1.42204 0.0173538 1.23762C0.0356922 1.0426 0.0763686 0.849487 0.185476 0.66748C0.417969 0.279859 0.776369 0.113683 1.1168 0.046932C1.37951 -0.00458732 1.78086 -0.0011037 2 0.000975796Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Row'}
                            open={activeTooltip === 'row'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                    </div>
                </div>
            );
        case 'flex-direction':
            return (
                <div className="tw-builder__settings-setting" key={index}>
                    <span className="tw-builder__settings-subtitle">{name}</span>
                    <div className="tw-builder__settings-actions">
                        <button className={`tw-builder__settings-action ${selectedChoose === 'column' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('column')} onMouseEnter={() => handleMouseEnter('column')} onMouseLeave={handleMouseLeave}>
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.00134172 2C-0.00151758 1.78086 -0.00630757 1.37951 0.0645315 1.1168C0.156314 0.776369 0.384806 0.417969 0.917786 0.185477C1.16804 0.0763693 1.43357 0.0356924 1.70173 0.0173539C1.95531 9.16995e-08 2.26431 0 2.62258 0H8.37743C8.7357 0 9.04469 9.16995e-08 9.29828 0.0173539C9.56645 0.0356924 9.83193 0.0763693 10.0822 0.185477C10.6152 0.417969 10.8437 0.776369 10.9355 1.1168C11.0063 1.37951 11.0016 1.78086 10.9986 2C11.0016 2.21914 11.0063 2.62049 10.9355 2.8832C10.8437 3.22363 10.6152 3.58203 10.0822 3.81452C9.83193 3.92363 9.56645 3.96431 9.29828 3.98265C9.04469 4 8.7357 4 8.37743 4H2.62258C2.26431 4 1.95531 4 1.70173 3.98265C1.43357 3.96431 1.16804 3.92363 0.917786 3.81452C0.384806 3.58203 0.156314 3.22363 0.0645315 2.8832C-0.00630757 2.62049 -0.00151758 2.21914 0.00134172 2Z" fill="currentColor"/>
                                <path d="M0.00134172 7C-0.00151758 6.78086 -0.00630757 6.37951 0.0645315 6.1168C0.156314 5.77637 0.384806 5.41797 0.917786 5.18548C1.16804 5.07637 1.43357 5.03569 1.70173 5.01735C1.95531 5 2.26431 5 2.62258 5H8.37743C8.7357 5 9.04469 5 9.29828 5.01735C9.56645 5.03569 9.83193 5.07637 10.0822 5.18548C10.6152 5.41797 10.8437 5.77637 10.9355 6.1168C11.0063 6.37951 11.0016 6.78086 10.9986 7C11.0016 7.21914 11.0063 7.62049 10.9355 7.8832C10.8437 8.22363 10.6152 8.58203 10.0822 8.81452C9.83193 8.92363 9.56645 8.96431 9.29828 8.98265C9.04469 9 8.7357 9 8.37743 9H2.62258C2.26431 9 1.95531 9 1.70173 8.98265C1.43357 8.96431 1.16804 8.92363 0.917786 8.81452C0.384806 8.58203 0.156314 8.22363 0.0645315 7.8832C-0.00630757 7.62049 -0.00151758 7.21914 0.00134172 7Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Column'}
                            open={activeTooltip === 'column'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'row' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('row')} onMouseEnter={() => handleMouseEnter('row')} onMouseLeave={handleMouseLeave}>
                            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0.000975796C7.21914 -0.0011037 7.62049 -0.00458732 7.8832 0.046932C8.22363 0.113683 8.58203 0.279859 8.81452 0.66748C8.92363 0.849487 8.96431 1.0426 8.98265 1.23762C9 1.42205 9 1.64677 9 1.90733V6.09268C9 6.35324 9 6.57795 8.98265 6.76238C8.96431 6.95742 8.92363 7.1505 8.81452 7.3325C8.58203 7.72014 8.22363 7.88632 7.8832 7.95309C7.62049 8.00457 7.21914 8.00113 7 7.999C6.78086 8.00113 6.37951 8.00457 6.1168 7.95309C5.77637 7.88632 5.41797 7.72014 5.18548 7.3325C5.07637 7.1505 5.03569 6.95742 5.01735 6.76238C5 6.57795 5 6.35324 5 6.09268V1.90733C5 1.64677 5 1.42204 5.01735 1.23762C5.03569 1.0426 5.07637 0.849487 5.18548 0.66748C5.41797 0.279859 5.77637 0.113683 6.1168 0.046932C6.37951 -0.00458732 6.78086 -0.0011037 7 0.000975796Z" fill="currentColor"/>
                                <path d="M2 0.000975796C2.21914 -0.0011037 2.62049 -0.00458732 2.8832 0.046932C3.22363 0.113683 3.58203 0.279859 3.81452 0.66748C3.92363 0.849487 3.96431 1.0426 3.98265 1.23762C4 1.42205 4 1.64677 4 1.90733V6.09268C4 6.35324 4 6.57795 3.98265 6.76238C3.96431 6.95742 3.92363 7.1505 3.81452 7.3325C3.58203 7.72014 3.22363 7.88632 2.8832 7.95309C2.62049 8.00457 2.21914 8.00113 2 7.999C1.78086 8.00113 1.37951 8.00457 1.1168 7.95309C0.776369 7.88632 0.417969 7.72014 0.185476 7.3325C0.0763686 7.1505 0.0356922 6.95742 0.0173538 6.76238C0 6.57795 0 6.35324 0 6.09268V1.90733C0 1.64677 0 1.42204 0.0173538 1.23762C0.0356922 1.0426 0.0763686 0.849487 0.185476 0.66748C0.417969 0.279859 0.776369 0.113683 1.1168 0.046932C1.37951 -0.00458732 1.78086 -0.0011037 2 0.000975796Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Row'}
                            open={activeTooltip === 'row'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${isReverse ? 'tw-builder__settings-action--active' : ''}`} onClick={handleReverseToggle} onMouseEnter={() => handleMouseEnter('reverse')} onMouseLeave={handleMouseLeave}>
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V4V3.5ZM13.1936 4.35355C13.3889 4.15829 13.3889 3.84171 13.1936 3.64645L10.0117 0.464466C9.81641 0.269204 9.49982 0.269204 9.30456 0.464466C9.1093 0.659728 9.1093 0.976311 9.30456 1.17157L12.133 4L9.30456 6.82843C9.1093 7.02369 9.1093 7.34027 9.30456 7.53553C9.49982 7.7308 9.81641 7.7308 10.0117 7.53553L13.1936 4.35355ZM1 4V4.5H12.8401V4V3.5H1V4Z" fill="currentColor"/>
                                    <path d="M12.8398 11.5C13.116 11.5 13.3398 11.2761 13.3398 11C13.3398 10.7239 13.116 10.5 12.8398 10.5V11V11.5ZM0.646195 10.6464C0.450933 10.8417 0.450933 11.1583 0.646195 11.3536L3.82818 14.5355C4.02344 14.7308 4.34002 14.7308 4.53528 14.5355C4.73054 14.3403 4.73054 14.0237 4.53528 13.8284L1.70686 11L4.53528 8.17157C4.73054 7.97631 4.73054 7.65973 4.53528 7.46447C4.34002 7.2692 4.02344 7.2692 3.82818 7.46447L0.646195 10.6464ZM12.8398 11V10.5L0.999749 10.5V11V11.5L12.8398 11.5V11Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Reverse'}
                                open={activeTooltip === 'reverse'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                    </div>
                </div>
            );
        case 'justify':
            return (
                <div className="tw-builder__settings-setting" key={index}>
                    <span className="tw-builder__settings-subtitle">{name}</span>
                    <div className="tw-builder__settings-actions">
                        <button className={`tw-builder__settings-action ${selectedChoose === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-start')} onMouseEnter={() => handleMouseEnter('flex-start')} onMouseLeave={handleMouseLeave}>
                            <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Start'}
                            open={activeTooltip === 'flex-start'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Center'}
                            open={activeTooltip === 'center'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-end')} onMouseEnter={() => handleMouseEnter('end')} onMouseLeave={handleMouseLeave}>
                            <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'End'}
                            open={activeTooltip === 'end'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                    </div>
                </div>
            );
        case 'align':
            return (
                <div className="tw-builder__settings-setting" key={index}>
                    <span className="tw-builder__settings-subtitle">{name}</span>
                    <div className="tw-builder__settings-actions">
                        <button className={`tw-builder__settings-action tw-builder__settings-action--start ${selectedChoose === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-start')} onMouseEnter={() => handleMouseEnter('flex-start')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00098 4C1.9989 3.78086 1.99541 3.37951 2.04693 3.1168C2.11368 2.77637 2.27986 2.41797 2.66748 2.18548C2.84949 2.07637 3.0426 2.03569 3.23762 2.01735C3.42205 2 3.64677 2 3.90733 2H8.09268C8.35324 2 8.57795 2 8.76238 2.01735C8.95742 2.03569 9.1505 2.07637 9.3325 2.18548C9.72014 2.41797 9.88632 2.77637 9.95309 3.1168C10.0046 3.37951 10.0011 3.78086 9.999 4C10.0011 4.21914 10.0046 4.62049 9.95309 4.8832C9.88632 5.22363 9.72014 5.58203 9.3325 5.81452C9.1505 5.92363 8.95742 5.96431 8.76238 5.98265C8.57795 6 8.35324 6 8.09268 6H3.90733C3.64677 6 3.42204 6 3.23762 5.98265C3.0426 5.96431 2.84949 5.92363 2.66748 5.81452C2.27986 5.58203 2.11368 5.22363 2.04693 4.8832C1.99541 4.62049 1.9989 4.21914 2.00098 4Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.22386 11.7558 0 11.4545 0H0.545454C0.2442 0 0 0.22386 0 0.5C0 0.77614 0.2442 1 0.545454 1H11.4545C11.7558 1 12 0.77614 12 0.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Start'}
                            open={activeTooltip === 'flex-start'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00098 2.5C1.9989 2.22608 1.99541 1.72438 2.04693 1.396C2.11368 0.970462 2.27986 0.522462 2.66748 0.231846C2.84949 0.0954617 3.0426 0.0446155 3.23762 0.0216924C3.42205 1.14624e-07 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 1.14624e-07 8.76238 0.0216924C8.95742 0.0446155 9.1505 0.0954617 9.3325 0.231846C9.72014 0.522462 9.88632 0.970462 9.95309 1.396C10.0046 1.72438 10.0011 2.22608 9.999 2.5C10.0011 2.77392 10.0046 3.27562 9.95309 3.604C9.88632 4.02954 9.72014 4.47754 9.3325 4.76815C9.1505 4.90454 8.95742 4.95538 8.76238 4.97831C8.57795 5 8.35324 5 8.09268 5H3.90733C3.64677 5 3.42204 5 3.23762 4.97831C3.0426 4.95538 2.84949 4.90454 2.66748 4.76815C2.27986 4.47754 2.11368 4.02954 2.04693 3.604C1.99541 3.27562 1.9989 2.77392 2.00098 2.5Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7558 2 11.4545 2H0.545454C0.2442 2 0 2.22386 0 2.5C0 2.77614 0.2442 3 0.545454 3H11.4545C11.7558 3 12 2.77614 12 2.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Center'}
                            open={activeTooltip === 'center'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action tw-builder__settings-action--end ${selectedChoose === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-end')} onMouseEnter={() => handleMouseEnter('flex-end')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00098 2C1.9989 1.78086 1.99541 1.37951 2.04693 1.1168C2.11368 0.776369 2.27986 0.417969 2.66748 0.185477C2.84949 0.0763693 3.0426 0.0356924 3.23762 0.0173539C3.42205 9.16995e-08 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 9.16995e-08 8.76238 0.0173539C8.95742 0.0356924 9.1505 0.0763693 9.3325 0.185477C9.72014 0.417969 9.88632 0.776369 9.95309 1.1168C10.0046 1.37951 10.0011 1.78086 9.999 2C10.0011 2.21914 10.0046 2.62049 9.95309 2.8832C9.88632 3.22363 9.72014 3.58203 9.3325 3.81452C9.1505 3.92363 8.95742 3.96431 8.76238 3.98265C8.57795 4 8.35324 4 8.09268 4H3.90733C3.64677 4 3.42204 4 3.23762 3.98265C3.0426 3.96431 2.84949 3.92363 2.66748 3.81452C2.27986 3.58203 2.11368 3.22363 2.04693 2.8832C1.99541 2.62049 1.9989 2.21914 2.00098 2Z" fill="currentColor"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 5.5C12 5.22386 11.7558 5 11.4545 5H0.545454C0.2442 5 0 5.22386 0 5.5C0 5.77614 0.2442 6 0.545454 6H11.4545C11.7558 6 12 5.77614 12 5.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'End'}
                            open={activeTooltip === 'flex-end'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                    </div>
                </div>
            );
        case 'super-justify':
            return(
            <div className="tw-builder__settings-setting tw-builder__settings-setting--column" key={index}>
                <span className="tw-builder__settings-subtitle">{name}</span>
                <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                    <button className={`tw-builder__settings-action ${selectedChoose === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-start')} onMouseEnter={() => handleMouseEnter('flex-start')} onMouseLeave={handleMouseLeave}>
                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Start'}
                        open={activeTooltip === 'flex-start'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedChoose === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Center'}
                        open={activeTooltip === 'center'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedChoose === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-end')} onMouseEnter={() => handleMouseEnter('flex-end')} onMouseLeave={handleMouseLeave}>
                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'End'}
                        open={activeTooltip === 'flex-end'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedChoose === 'space-between' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('space-between')} onMouseEnter={() => handleMouseEnter('space-between')} onMouseLeave={handleMouseLeave}>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.08581 10.0201C2.86671 10.0246 2.46541 10.0324 2.20217 9.98366C1.86104 9.92057 1.50087 9.75826 1.26422 9.37317C1.15316 9.19234 1.11041 8.99968 1.08998 8.80486C1.07064 8.62064 1.06822 8.39593 1.06542 8.13539L1.0204 3.95028C1.0176 3.68973 1.01518 3.46503 1.03055 3.28042C1.04679 3.0852 1.08539 2.8917 1.19253 2.70853C1.42084 2.31842 1.77743 2.14839 2.11712 2.07796C2.37926 2.02366 2.78063 2.02278 2.99978 2.02255C3.21888 2.01806 3.62018 2.01031 3.88342 2.05896C4.22455 2.12207 4.58472 2.28438 4.82137 2.6695C4.93243 2.85031 4.97518 3.04294 4.99561 3.23777C5.01495 3.422 5.01737 3.64671 5.02017 3.90725L5.06519 8.09236C5.06799 8.3529 5.07041 8.57762 5.05504 8.76221C5.0388 8.95743 5.0002 9.15096 4.89306 9.33413C4.66475 9.72423 4.30816 9.89425 3.96847 9.96466C3.70633 10.019 3.30496 10.0198 3.08581 10.0201Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.499971 0.00536387C0.223847 0.00833421 0.00262689 0.254939 0.00586725 0.556165L0.123212 11.4646C0.126453 11.7659 0.352927 12.0076 0.629051 12.0047C0.905175 12.0017 1.12639 11.7551 1.12315 11.4539L1.00581 0.545409C1.00257 0.244182 0.776095 0.00239353 0.499971 0.00536387Z" fill="currentColor"/>
                            <path d="M9.00012 2.02154C9.21922 2.01721 9.62052 2.0096 9.88374 2.05842C10.2248 2.12166 10.5849 2.28414 10.8214 2.66935C10.9324 2.85023 10.975 3.04291 10.9954 3.23774C11.0146 3.42197 11.0169 3.64668 11.0196 3.90723L11.0627 8.09236C11.0653 8.3529 11.0677 8.57761 11.0522 8.7622C11.0359 8.95742 10.9972 9.1509 10.8899 9.33402C10.6615 9.72403 10.3048 9.89389 9.96505 9.96415C9.70289 10.0183 9.30152 10.019 9.08237 10.0191C8.86327 10.0235 8.46197 10.0311 8.19875 9.98232C7.85765 9.91905 7.49756 9.75657 7.26109 9.37134C7.15012 9.19047 7.10746 8.99782 7.08711 8.80299C7.06786 8.61874 7.06555 8.39404 7.06287 8.13349L7.01983 3.94836C7.01715 3.68782 7.01484 3.4631 7.03029 3.27852C7.04662 3.08331 7.08531 2.88979 7.19254 2.70668C7.42104 2.31668 7.77771 2.14683 8.11744 2.07658C8.3796 2.02236 8.78097 2.02172 9.00012 2.02154Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.6231 12.0059C11.8992 12.003 12.1205 11.7565 12.1174 11.4553L12.0052 0.546793C12.0021 0.245554 11.7758 0.00366949 11.4997 0.00650944C11.2235 0.0093494 11.0022 0.255839 11.0053 0.557077L11.1175 11.4656C11.1206 11.7668 11.3469 12.0087 11.6231 12.0059Z" fill="currentColor"/>
                        </svg>

                        <Tooltip
                        message={'Between'}
                        open={activeTooltip === 'space-between'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedChoose === 'space-around' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('space-around')} onMouseEnter={() => handleMouseEnter('space-around')} onMouseLeave={handleMouseLeave}>
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 9.99902C3.78086 10.0011 3.37951 10.0046 3.1168 9.95307C2.77637 9.88632 2.41797 9.72014 2.18548 9.33252C2.07637 9.15051 2.03569 8.9574 2.01735 8.76238C2 8.57795 2 8.35323 2 8.09267L2 3.90732C2 3.64676 2 3.42205 2.01735 3.23762C2.03569 3.04258 2.07637 2.8495 2.18548 2.6675C2.41797 2.27986 2.77637 2.11368 3.1168 2.04691C3.37951 1.99543 3.78086 1.99887 4 2.001C4.21914 1.99887 4.62049 1.99543 4.8832 2.04691C5.22363 2.11368 5.58203 2.27986 5.81452 2.6675C5.92363 2.8495 5.96431 3.04258 5.98265 3.23762C6 3.42205 6 3.64676 6 3.90732L6 8.09267C6 8.35323 6 8.57796 5.98265 8.76238C5.96431 8.9574 5.92363 9.15051 5.81452 9.33252C5.58203 9.72014 5.22363 9.88632 4.8832 9.95307C4.62049 10.0046 4.21914 10.0011 4 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                            <path d="M10 9.99902C9.78086 10.0011 9.37951 10.0046 9.1168 9.95307C8.77637 9.88632 8.41797 9.72014 8.18548 9.33252C8.07637 9.15051 8.03569 8.9574 8.01735 8.76238C8 8.57795 8 8.35323 8 8.09267L8 3.90732C8 3.64676 8 3.42204 8.01735 3.23762C8.03569 3.04258 8.07637 2.8495 8.18548 2.6675C8.41797 2.27986 8.77637 2.11368 9.1168 2.04691C9.37951 1.99543 9.78086 1.99887 10 2.001C10.2191 1.99887 10.6205 1.99543 10.8832 2.04691C11.2236 2.11368 11.582 2.27986 11.8145 2.6675C11.9236 2.8495 11.9643 3.04258 11.9826 3.23762C12 3.42204 12 3.64676 12 3.90732V8.09267C12 8.35323 12 8.57796 11.9826 8.76238C11.9643 8.9574 11.9236 9.15051 11.8145 9.33252C11.582 9.72014 11.2236 9.88632 10.8832 9.95307C10.6205 10.0046 10.2191 10.0011 10 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.5 0.00622559C13.2239 0.00622559 13 0.250436 13 0.55168V11.4608C13 11.762 13.2239 12.0062 13.5 12.0062C13.7761 12.0062 14 11.762 14 11.4608V0.55168C14 0.250436 13.7761 0.00622559 13.5 0.00622559Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Around'}
                        open={activeTooltip === 'space-around'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                    <button className={`tw-builder__settings-action ${selectedChoose === 'space-evenly' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('space-evenly')} onMouseEnter={() => handleMouseEnter('space-evenly')} onMouseLeave={handleMouseLeave}>
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 9.99902C4.78086 10.0011 4.37951 10.0046 4.1168 9.95307C3.77637 9.88632 3.41797 9.72014 3.18548 9.33252C3.07637 9.15051 3.03569 8.9574 3.01735 8.76238C3 8.57795 3 8.35323 3 8.09267L3 3.90732C3 3.64676 3 3.42205 3.01735 3.23762C3.03569 3.04258 3.07637 2.8495 3.18548 2.6675C3.41797 2.27986 3.77637 2.11368 4.1168 2.04691C4.37951 1.99543 4.78086 1.99887 5 2.001C5.21914 1.99887 5.62049 1.99543 5.8832 2.04691C6.22363 2.11368 6.58203 2.27986 6.81452 2.6675C6.92363 2.8495 6.96431 3.04258 6.98265 3.23762C7 3.42205 7 3.64676 7 3.90732L7 8.09267C7 8.35323 7 8.57796 6.98265 8.76238C6.96431 8.9574 6.92363 9.15051 6.81452 9.33252C6.58203 9.72014 6.22363 9.88632 5.8832 9.95307C5.62049 10.0046 5.21914 10.0011 5 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.00500488C0.22386 0.00500488 0 0.249216 0 0.550459L0 11.4596C0 11.7608 0.22386 12.005 0.5 12.005C0.77614 12.005 1 11.7608 1 11.4596V0.550459C1 0.249216 0.77614 0.00500488 0.5 0.00500488Z" fill="currentColor"/>
                            <path d="M11 9.99902C10.7809 10.0011 10.3795 10.0046 10.1168 9.95307C9.77637 9.88632 9.41797 9.72014 9.18548 9.33252C9.07637 9.15051 9.03569 8.9574 9.01735 8.76238C9 8.57795 9 8.35323 9 8.09267V3.90732C9 3.64676 9 3.42204 9.01735 3.23762C9.03569 3.04258 9.07637 2.8495 9.18548 2.6675C9.41797 2.27986 9.77637 2.11368 10.1168 2.04691C10.3795 1.99543 10.7809 1.99887 11 2.001C11.2191 1.99887 11.6205 1.99543 11.8832 2.04691C12.2236 2.11368 12.582 2.27986 12.8145 2.6675C12.9236 2.8495 12.9643 3.04258 12.9826 3.23762C13 3.42204 13 3.64676 13 3.90732V8.09267C13 8.35323 13 8.57796 12.9826 8.76238C12.9643 8.9574 12.9236 9.15051 12.8145 9.33252C12.582 9.72014 12.2236 9.88632 11.8832 9.95307C11.6205 10.0046 11.2191 10.0011 11 9.99902Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.5 0.00622559C15.2239 0.00622559 15 0.250436 15 0.55168V11.4608C15 11.762 15.2239 12.0062 15.5 12.0062C15.7761 12.0062 16 11.762 16 11.4608V0.55168C16 0.250436 15.7761 0.00622559 15.5 0.00622559Z" fill="currentColor"/>
                        </svg>
                        <Tooltip
                        message={'Evenly'}
                        open={activeTooltip === 'space-evenly'}
                        responsivePosition={{ desktop: 'top', mobile: 'top' }}
                        width="auto"
                        />
                    </button>
                </div>
            </div>

            );
        case 'super-align':
            return(
                <div className="tw-builder__settings-setting tw-builder__settings-setting--column" key={index}>
                        <span className="tw-builder__settings-subtitle">{name}</span>
                        <div className="tw-builder__settings-actions tw-builder__settings-actions--column">
                            <button className={`tw-builder__settings-action tw-builder__settings-action--start ${selectedChoose === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-start')} onMouseEnter={() => handleMouseEnter('flex-start')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 4C1.9989 3.78086 1.99541 3.37951 2.04693 3.1168C2.11368 2.77637 2.27986 2.41797 2.66748 2.18548C2.84949 2.07637 3.0426 2.03569 3.23762 2.01735C3.42205 2 3.64677 2 3.90733 2H8.09268C8.35324 2 8.57795 2 8.76238 2.01735C8.95742 2.03569 9.1505 2.07637 9.3325 2.18548C9.72014 2.41797 9.88632 2.77637 9.95309 3.1168C10.0046 3.37951 10.0011 3.78086 9.999 4C10.0011 4.21914 10.0046 4.62049 9.95309 4.8832C9.88632 5.22363 9.72014 5.58203 9.3325 5.81452C9.1505 5.92363 8.95742 5.96431 8.76238 5.98265C8.57795 6 8.35324 6 8.09268 6H3.90733C3.64677 6 3.42204 6 3.23762 5.98265C3.0426 5.96431 2.84949 5.92363 2.66748 5.81452C2.27986 5.58203 2.11368 5.22363 2.04693 4.8832C1.99541 4.62049 1.9989 4.21914 2.00098 4Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.22386 11.7558 0 11.4545 0H0.545454C0.2442 0 0 0.22386 0 0.5C0 0.77614 0.2442 1 0.545454 1H11.4545C11.7558 1 12 0.77614 12 0.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Start'}
                                open={activeTooltip === 'flex-start'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action ${selectedChoose === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 2.5C1.9989 2.22608 1.99541 1.72438 2.04693 1.396C2.11368 0.970462 2.27986 0.522462 2.66748 0.231846C2.84949 0.0954617 3.0426 0.0446155 3.23762 0.0216924C3.42205 1.14624e-07 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 1.14624e-07 8.76238 0.0216924C8.95742 0.0446155 9.1505 0.0954617 9.3325 0.231846C9.72014 0.522462 9.88632 0.970462 9.95309 1.396C10.0046 1.72438 10.0011 2.22608 9.999 2.5C10.0011 2.77392 10.0046 3.27562 9.95309 3.604C9.88632 4.02954 9.72014 4.47754 9.3325 4.76815C9.1505 4.90454 8.95742 4.95538 8.76238 4.97831C8.57795 5 8.35324 5 8.09268 5H3.90733C3.64677 5 3.42204 5 3.23762 4.97831C3.0426 4.95538 2.84949 4.90454 2.66748 4.76815C2.27986 4.47754 2.11368 4.02954 2.04693 3.604C1.99541 3.27562 1.9989 2.77392 2.00098 2.5Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7558 2 11.4545 2H0.545454C0.2442 2 0 2.22386 0 2.5C0 2.77614 0.2442 3 0.545454 3H11.4545C11.7558 3 12 2.77614 12 2.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'Center'}
                                open={activeTooltip === 'center'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action tw-builder__settings-action--end ${selectedChoose === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('flex-end')} onMouseEnter={() => handleMouseEnter('flex-end')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.00098 2C1.9989 1.78086 1.99541 1.37951 2.04693 1.1168C2.11368 0.776369 2.27986 0.417969 2.66748 0.185477C2.84949 0.0763693 3.0426 0.0356924 3.23762 0.0173539C3.42205 9.16995e-08 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 9.16995e-08 8.76238 0.0173539C8.95742 0.0356924 9.1505 0.0763693 9.3325 0.185477C9.72014 0.417969 9.88632 0.776369 9.95309 1.1168C10.0046 1.37951 10.0011 1.78086 9.999 2C10.0011 2.21914 10.0046 2.62049 9.95309 2.8832C9.88632 3.22363 9.72014 3.58203 9.3325 3.81452C9.1505 3.92363 8.95742 3.96431 8.76238 3.98265C8.57795 4 8.35324 4 8.09268 4H3.90733C3.64677 4 3.42204 4 3.23762 3.98265C3.0426 3.96431 2.84949 3.92363 2.66748 3.81452C2.27986 3.58203 2.11368 3.22363 2.04693 2.8832C1.99541 2.62049 1.9989 2.21914 2.00098 2Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 5.5C12 5.22386 11.7558 5 11.4545 5H0.545454C0.2442 5 0 5.22386 0 5.5C0 5.77614 0.2442 6 0.545454 6H11.4545C11.7558 6 12 5.77614 12 5.5Z" fill="currentColor"/>
                                </svg>
                                <Tooltip
                                message={'End'}
                                open={activeTooltip === 'flex-end'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                            <button className={`tw-builder__settings-action tw-builder__settings-action--stretch ${selectedChoose === 'stretch' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('stretch')} onMouseEnter={() => handleMouseEnter('stretch')} onMouseLeave={handleMouseLeave}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 11.5C12 11.2239 11.7558 11 11.4545 11H0.545454C0.2442 11 -3.57628e-07 11.2239 -3.57628e-07 11.5C-3.57628e-07 11.7761 0.2442 12 0.545454 12H11.4545C11.7558 12 12 11.7761 12 11.5Z" fill="currentColor"/>
                                    <path d="M10.0098 5.95261C10.013 6.3857 10.0187 7.1789 9.96855 7.69823C9.90363 8.37122 9.73938 9.07999 9.35301 9.54052C9.17159 9.75665 8.9787 9.83757 8.78377 9.87434C8.59944 9.90914 8.37472 9.90975 8.11416 9.91046L3.92883 9.92183C3.66827 9.92254 3.44355 9.92315 3.25903 9.88935C3.0639 9.85364 2.8706 9.77377 2.68802 9.55863C2.29913 9.10021 2.13103 8.39234 2.06243 7.71972C2.00953 7.20066 2.01082 6.40744 2.01177 5.97435C2.00846 5.54126 2.00287 4.74806 2.05294 4.22873C2.11788 3.55574 2.28214 2.84697 2.66853 2.38644C2.84994 2.17031 3.0428 2.08939 3.23774 2.05262C3.42207 2.01782 3.64679 2.01721 3.90735 2.0165L8.09268 2.00513C8.35324 2.00442 8.57797 2.00381 8.76248 2.03761C8.9576 2.07332 9.15093 2.15319 9.33352 2.36833C9.72239 2.82675 9.89049 3.53462 9.95907 4.20724C10.012 4.7263 10.0107 5.51952 10.0098 5.95261Z" fill="currentColor"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.00157098 0.532595C0.00232137 0.808734 0.24714 1.03193 0.548382 1.03111L11.4574 1.00147C11.7587 1.00065 12.0023 0.776125 12.0015 0.499986C12.0008 0.223847 11.756 0.000651104 11.4547 0.00146974L0.545665 0.0311142C0.244422 0.0319328 0.000820595 0.256456 0.00157098 0.532595Z" fill="currentColor"/>
                                </svg>

                                <Tooltip
                                message={'Stretch'}
                                open={activeTooltip === 'stretch'}
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                width="auto"
                                />
                            </button>
                        </div>
                </div>
            )

        case 'text-align':
            return (
                <div className="tw-builder__settings-setting" key={index}>
                    <span className="tw-builder__settings-subtitle">{name}</span>
                    <div className="tw-builder__settings-actions">
                        <button className={`tw-builder__settings-action ${selectedChoose === 'left' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('left')} onMouseEnter={() => handleMouseEnter('left')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.00146369 1.5C-0.00165555 1.33565 -0.00688098 1.03463 0.070398 0.8376C0.170525 0.582277 0.419789 0.313477 1.00122 0.139108C1.27423 0.057277 1.56389 0.0267693 1.85643 0.0130155C2.13307 6.87746e-08 2.47015 0 2.86099 0L9.13902 0C9.52986 0 9.86693 6.87746e-08 10.1436 0.0130155C10.4361 0.0267693 10.7257 0.057277 10.9987 0.139108C11.5802 0.313477 11.8295 0.582277 11.9296 0.8376C12.0069 1.03463 12.0017 1.33565 11.9985 1.5C12.0017 1.66435 12.0069 1.96537 11.9296 2.1624C11.8295 2.41772 11.5802 2.68652 10.9987 2.86089C10.7257 2.94272 10.4361 2.97323 10.1436 2.98698C9.86693 3 9.52986 3 9.13902 3H2.86099C2.47015 3 2.13306 3 1.85643 2.98698C1.56389 2.97323 1.27423 2.94272 1.00122 2.86089C0.419789 2.68652 0.170525 2.41772 0.070398 2.1624C-0.00688098 1.96537 -0.00165555 1.66435 0.00146369 1.5Z" fill="currentColor"/>
                                <path d="M0.000731847 6.5C-0.000827773 6.33565 -0.00344049 6.03463 0.035199 5.8376C0.0852624 5.58228 0.209894 5.31348 0.50061 5.13911C0.637115 5.05728 0.781946 5.02677 0.928217 5.01302C1.06653 5 1.23508 5 1.4305 5H4.56951C4.76493 5 4.93347 5 5.07179 5.01302C5.21806 5.02677 5.36287 5.05728 5.49937 5.13911C5.7901 5.31348 5.91474 5.58228 5.96482 5.8376C6.00343 6.03463 6.00085 6.33565 5.99925 6.5C6.00085 6.66435 6.00343 6.96537 5.96482 7.1624C5.91474 7.41772 5.7901 7.68652 5.49937 7.86089C5.36287 7.94272 5.21806 7.97323 5.07179 7.98698C4.93347 8 4.76493 8 4.56951 8H1.4305C1.23508 8 1.06653 8 0.928217 7.98698C0.781946 7.97323 0.637115 7.94272 0.50061 7.86089C0.209894 7.68652 0.0852624 7.41772 0.035199 7.1624C-0.00344049 6.96537 -0.000827773 6.66435 0.000731847 6.5Z" fill="currentColor"/>
                                <path d="M0.00109777 11.5C-0.00124166 11.3356 -0.00516074 11.0346 0.0527985 10.8376C0.127894 10.5823 0.314842 10.3135 0.750916 10.1391C0.955672 10.0573 1.17292 10.0268 1.39233 10.013C1.5998 10 1.85261 10 2.14574 10H6.85426C7.14739 10 7.4002 10 7.60768 10.013C7.8271 10.0268 8.04431 10.0573 8.24906 10.1391C8.68515 10.3135 8.87211 10.5823 8.94722 10.8376C9.00514 11.0346 9.00128 11.3356 8.99888 11.5C9.00128 11.6644 9.00514 11.9654 8.94722 12.1624C8.87211 12.4177 8.68515 12.6865 8.24906 12.8609C8.04431 12.9427 7.8271 12.9732 7.60768 12.987C7.4002 13 7.14739 13 6.85426 13H2.14574C1.85261 13 1.5998 13 1.39233 12.987C1.17292 12.9732 0.955672 12.9427 0.750916 12.8609C0.314842 12.6865 0.127894 12.4177 0.0527985 12.1624C-0.00516074 11.9654 -0.00124166 11.6644 0.00109777 11.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Left'}
                            open={activeTooltip === 'left'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('center')} onMouseEnter={() => handleMouseEnter('center')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.00146369 1.5C-0.00165555 1.33565 -0.00688098 1.03463 0.070398 0.8376C0.170525 0.582277 0.419789 0.313477 1.00122 0.139108C1.27423 0.057277 1.56389 0.0267693 1.85643 0.0130155C2.13307 6.87746e-08 2.47015 0 2.86099 0L9.13902 0C9.52986 0 9.86693 6.87746e-08 10.1436 0.0130155C10.4361 0.0267693 10.7257 0.057277 10.9987 0.139108C11.5802 0.313477 11.8295 0.582277 11.9296 0.8376C12.0069 1.03463 12.0017 1.33565 11.9985 1.5C12.0017 1.66435 12.0069 1.96537 11.9296 2.1624C11.8295 2.41772 11.5802 2.68652 10.9987 2.86089C10.7257 2.94272 10.4361 2.97323 10.1436 2.98698C9.86693 3 9.52986 3 9.13902 3H2.86099C2.47015 3 2.13306 3 1.85643 2.98698C1.56389 2.97323 1.27423 2.94272 1.00122 2.86089C0.419789 2.68652 0.170525 2.41772 0.070398 2.1624C-0.00688098 1.96537 -0.00165555 1.66435 0.00146369 1.5Z" fill="currentColor"/>
                                <path d="M3.00073 6.5C2.99917 6.33565 2.99656 6.03463 3.0352 5.8376C3.08526 5.58228 3.20989 5.31348 3.50061 5.13911C3.63711 5.05728 3.78195 5.02677 3.92822 5.01302C4.06653 5 4.23508 5 4.4305 5H7.56951C7.76493 5 7.93347 5 8.07179 5.01302C8.21806 5.02677 8.36287 5.05728 8.49937 5.13911C8.7901 5.31348 8.91474 5.58228 8.96482 5.8376C9.00343 6.03463 9.00085 6.33565 8.99925 6.5C9.00085 6.66435 9.00343 6.96537 8.96482 7.1624C8.91474 7.41772 8.7901 7.68652 8.49937 7.86089C8.36287 7.94272 8.21806 7.97323 8.07179 7.98698C7.93347 8 7.76493 8 7.56951 8H4.4305C4.23508 8 4.06653 8 3.92822 7.98698C3.78195 7.97323 3.63711 7.94272 3.50061 7.86089C3.20989 7.68652 3.08526 7.41772 3.0352 7.1624C2.99656 6.96537 2.99917 6.66435 3.00073 6.5Z" fill="currentColor"/>
                                <path d="M1.5011 11.5C1.49876 11.3356 1.49484 11.0346 1.5528 10.8376C1.62789 10.5823 1.81484 10.3135 2.25092 10.1391C2.45567 10.0573 2.67292 10.0268 2.89233 10.013C3.0998 10 3.35261 10 3.64574 10H8.35426C8.64739 10 8.9002 10 9.10768 10.013C9.3271 10.0268 9.54431 10.0573 9.74906 10.1391C10.1852 10.3135 10.3721 10.5823 10.4472 10.8376C10.5051 11.0346 10.5013 11.3356 10.4989 11.5C10.5013 11.6644 10.5051 11.9654 10.4472 12.1624C10.3721 12.4177 10.1852 12.6865 9.74906 12.8609C9.54431 12.9427 9.3271 12.9732 9.10768 12.987C8.9002 13 8.64739 13 8.35426 13H3.64574C3.35261 13 3.0998 13 2.89233 12.987C2.67292 12.9732 2.45567 12.9427 2.25092 12.8609C1.81484 12.6865 1.62789 12.4177 1.5528 12.1624C1.49484 11.9654 1.49876 11.6644 1.5011 11.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Center'}
                            open={activeTooltip === 'center'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                        <button className={`tw-builder__settings-action ${selectedChoose === 'right' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleChooseChange('right')} onMouseEnter={() => handleMouseEnter('right')} onMouseLeave={handleMouseLeave}>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.00146369 1.5C-0.00165555 1.33565 -0.00688098 1.03463 0.070398 0.8376C0.170525 0.582277 0.419789 0.313477 1.00122 0.139108C1.27423 0.057277 1.56389 0.0267693 1.85643 0.0130155C2.13307 6.87746e-08 2.47015 0 2.86099 0L9.13902 0C9.52986 0 9.86693 6.87746e-08 10.1436 0.0130155C10.4361 0.0267693 10.7257 0.057277 10.9987 0.139108C11.5802 0.313477 11.8295 0.582277 11.9296 0.8376C12.0069 1.03463 12.0017 1.33565 11.9985 1.5C12.0017 1.66435 12.0069 1.96537 11.9296 2.1624C11.8295 2.41772 11.5802 2.68652 10.9987 2.86089C10.7257 2.94272 10.4361 2.97323 10.1436 2.98698C9.86693 3 9.52986 3 9.13902 3H2.86099C2.47015 3 2.13306 3 1.85643 2.98698C1.56389 2.97323 1.27423 2.94272 1.00122 2.86089C0.419789 2.68652 0.170525 2.41772 0.070398 2.1624C-0.00688098 1.96537 -0.00165555 1.66435 0.00146369 1.5Z" fill="currentColor"/>
                                <path d="M6.00073 6.5C5.99917 6.33565 5.99656 6.03463 6.0352 5.8376C6.08526 5.58228 6.20989 5.31348 6.50061 5.13911C6.63711 5.05728 6.78195 5.02677 6.92822 5.01302C7.06653 5 7.23508 5 7.4305 5H10.5695C10.7649 5 10.9335 5 11.0718 5.01302C11.2181 5.02677 11.3629 5.05728 11.4994 5.13911C11.7901 5.31348 11.9147 5.58228 11.9648 5.8376C12.0034 6.03463 12.0009 6.33565 11.9993 6.5C12.0009 6.66435 12.0034 6.96537 11.9648 7.1624C11.9147 7.41772 11.7901 7.68652 11.4994 7.86089C11.3629 7.94272 11.2181 7.97323 11.0718 7.98698C10.9335 8 10.7649 8 10.5695 8H7.4305C7.23508 8 7.06653 8 6.92822 7.98698C6.78195 7.97323 6.63711 7.94272 6.50061 7.86089C6.20989 7.68652 6.08526 7.41772 6.0352 7.1624C5.99656 6.96537 5.99917 6.66435 6.00073 6.5Z" fill="currentColor"/>
                                <path d="M3.0011 11.5C2.99876 11.3356 2.99484 11.0346 3.0528 10.8376C3.12789 10.5823 3.31484 10.3135 3.75092 10.1391C3.95567 10.0573 4.17292 10.0268 4.39233 10.013C4.5998 10 4.85261 10 5.14574 10H9.85426C10.1474 10 10.4002 10 10.6077 10.013C10.8271 10.0268 11.0443 10.0573 11.2491 10.1391C11.6852 10.3135 11.8721 10.5823 11.9472 10.8376C12.0051 11.0346 12.0013 11.3356 11.9989 11.5C12.0013 11.6644 12.0051 11.9654 11.9472 12.1624C11.8721 12.4177 11.6852 12.6865 11.2491 12.8609C11.0443 12.9427 10.8271 12.9732 10.6077 12.987C10.4002 13 10.1474 13 9.85426 13H5.14574C4.85261 13 4.5998 13 4.39233 12.987C4.17292 12.9732 3.95567 12.9427 3.75092 12.8609C3.31484 12.6865 3.12789 12.4177 3.0528 12.1624C2.99484 11.9654 2.99876 11.6644 3.0011 11.5Z" fill="currentColor"/>
                            </svg>
                            <Tooltip
                            message={'Right'}
                            open={activeTooltip === 'right'}
                            responsivePosition={{ desktop: 'top', mobile: 'top' }}
                            width="auto"
                            />
                        </button>
                    </div>
                </div>
            );
    }
}

function ControlComponent({control, selectedId, showNotification, selectedLabel}) {
    const {JSONtree, activeRoot, idsCSSData, classesCSSData, addCSSProperty, addJSONProperty} = useCanvas();

    //state to store the selected element properties o  acnfedata
    const [selectedElementData, setSelectedElementData] = useState(null);


    
    console.log('idsCSSData',idsCSSData);
    console.log('JSONtree idsCSSData',JSONtree.idsCSSData);
    console.log('JSONtree',JSONtree);
    console.log('selectedElementData',selectedElementData);
    


    //spreads the properties of the selected element
    useEffect(() => {
        if(!selectedId || !JSONtree || !JSONtree.roots) {
            setSelectedElementData(null);
            return;
        }

        const findElement = (node, targetId) => {
            if(!node) return null;
            if(node.id === targetId) return node;
            if(node.children) {
                for(const child of node.children) {
                    const result = findElement(child, targetId);
                    if(result) return result;
                }
            }
            return null;
        }

        const activeRootNode = JSONtree.roots.find(root => root.id === activeRoot);
        if(!activeRootNode) {
            setSelectedElementData(null);
            return;
        }

        const selectedElement = findElement(activeRootNode, selectedId);
        if(!selectedElement) {
            setSelectedElementData(null);
            return;
        }
        //find the css data for the selected element
        const elementCssData = JSONtree.idsCSSData?.find(item => item.id === selectedId);

        const elementData = {
            id: selectedElement.id,
            elementType: selectedElement.elementType,
            tagName: selectedElement.tagName,
            classList: selectedElement.classList,
            children: selectedElement.children,
            nestable: selectedElement.nestable,
            icon: selectedElement.icon,
            label: selectedElement.label,
            href: selectedElement.href,
            innerText: selectedElement.innerText,
            properties: elementCssData?.properties || {},

            hasChildren: selectedElement.children && selectedElement.children.length > 0,
            className: selectedElement.classList?.[0] || null,
        }
        setSelectedElementData(elementData);


     }, [selectedId, JSONtree, activeRoot]);

     const applyGlobalCSSChange = useCallback((cssProperty, value) => {
        if(!selectedId || !cssProperty) return;

        addCSSProperty('id', selectedId, cssProperty, value);

     }, [selectedId, addCSSProperty, JSONtree]);

     const getGlobalCSSValue = useCallback((cssProperty) => {
        if(!selectedId || !cssProperty) return null;
    
        const elementData = JSONtree.idsCSSData.find(item => item.id === selectedId);
        return elementData?.properties?.[cssProperty] || null;
     }, [JSONtree, selectedId]);

     const applyGlobalJSONChange = useCallback((JSONProperty, value)=>{

        if(!selectedId || !JSONProperty) return null;

        addJSONProperty(selectedId, JSONProperty, value);
     },[selectedId, addJSONProperty]);

     const getGlobalJSONValue = useCallback((JSONProperty)=>{
        if(!selectedId || !JSONProperty) return null;

        return selectedElementData?.[JSONProperty] || null;
    
     },[selectedElementData, selectedId]);

     const globalControlProps = {
        selectedElementData,
        applyGlobalCSSChange,
        getGlobalCSSValue,
        applyGlobalJSONChange,
        getGlobalJSONValue,
        selectedId,
     };

     
    

    const whatType = (item, index) => {

        const enhancedItem = {
            ...item,
            elementId: selectedId,
            ...globalControlProps,
        };
                
           
        switch(item.type) {
            case 'text':
                return <TextType key={index} {...enhancedItem} name={item.name} value={item.value} placeholder={item.placeholder} index={index} autoUnit={item.autoUnit} />;
            case 'select':
                return <SelectType key={index} {...enhancedItem} name={item.name} value={item.value} options={item.options} index={index} cssProperty={item.cssProperty}/>;
            case 'super-select':
                return <SuperSelectType key={index} {...enhancedItem} name={item.name} index={index} value={item.value} category={item.category} cssProperty={item.cssProperty} JSONProperty={item.JSONProperty}/>;
            case 'panel':
                return <PanelType key={`${index}-${selectedId}`} {...enhancedItem} name={item.name} index={index} cssProperty={item.cssProperty}/>;
            case 'color':
                return <ColorType key={index} {...enhancedItem} name={item.name} value={item.value} opacity={item.opacity} index={index} cssProperty={item.cssProperty} elementId={item.elementId}/>;
            case 'image':
                return <ImageType key={index} {...enhancedItem} name={item.name} index={index} />;
            case 'choose':
                return <ChooseType key={index} {...enhancedItem} name={item.name} index={index} category={item.category} cssProperty={item.cssProperty} />;
        }
    }
    return (
        <div className="tw-builder__settings">
            <span className="tw-builder__settings-label">{selectedLabel}</span>
            <div className="tw-builder__settings-header">
                <BuilderClasses selectedId={selectedId} showNotification={showNotification}/>
                {control.header && control.header.map((item, index) => whatType(item, index))}
            </div>
            <div className="tw-builder__settings-body">
                {/* Map the controls */}
                {control.body && control.body.map((section, sectionIndex) => (
                    <BuilderControl 
                    key={sectionIndex} 
                    label={section.label} 
                    controls={section.controls} 
                    whatType={whatType}
                    globalControlProps={globalControlProps}
                    />
                ))}
            </div>
        </div>
    )
}
export default ControlComponent;

