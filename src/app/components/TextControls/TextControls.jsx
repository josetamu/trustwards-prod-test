import './TextControls.css';
import BuilderControl from '../BuilderControl/BuilderControl';
import { useState, useRef, useEffect } from 'react';
import { DisplayControl, SpacingControl, SizeControl, BackgroundControl, TextControl, StylesControl } from '../ControlComponents/ControlComponents';

function TextControls({selectedId}) {
    const [selectedTag, setSelectedTag] = useState('h1');
    const selectRef = useRef(null);

    // Función para ajustar el ancho del select
    const adjustSelectWidth = () => {
        if (selectRef.current) {
            const select = selectRef.current;
            // Mapeo de tags a anchos
            const tagWidths = {
                'h1': 25, 'h2': 25, 'h3': 25, 'h4': 25, 'h5': 25, 'h6': 25,
                'p': 15,
                'span': 35
            };
            
            const baseWidth = tagWidths[selectedTag] || 30;
            const totalWidth = baseWidth + 25; // +25 para la flecha
            
            select.style.width = `${totalWidth}px`;
        }
    };

    useEffect(() => {
        adjustSelectWidth();
    }, [selectedTag]);

    const handleSelectChange = (e) => {
        setSelectedTag(e.target.value);
    };
    const controls = [
        {
            label: 'Display',
            control: <DisplayControl />,
    
        },
        {
            label: 'Spacing',
            control: <SpacingControl />,
    
        },
        {
            label: 'Size',
            control: <SizeControl />,
    
        },
        {
            label: 'Background',
            control: <BackgroundControl />,
    
        },
        {
            label: 'Text',
            control: <TextControl />,
    
        },
        {
            label: 'Styles',    
            control: <StylesControl />,
    
        },
    ]
    return (
        <div className="tw-builder__settings">
            <div className="tw-builder__settings-header">
                <div className="tw-builder__settings-classes">
                    <span className="tw-builder__settings-id">#{selectedId}</span>
                </div>
                <div className="tw-builder__settings-tag">
                    <span className="tw-builder__settings-subtitle">Tag</span>
                    <div className="tw-builder__settings-select-container">
                    <select 
                        ref={selectRef}
                        className="tw-builder__settings-select"
                        value={selectedTag}
                        onChange={handleSelectChange}
                    >
                        <option className="tw-builder__settings-option" value="h1">h1</option>
                        <option className="tw-builder__settings-option" value="h2">h2</option>
                        <option className="tw-builder__settings-option" value="h3">h3</option>
                        <option className="tw-builder__settings-option" value="h4">h4</option>
                        <option className="tw-builder__settings-option" value="h5">h5</option>
                        <option className="tw-builder__settings-option" value="h6">h6</option>
                        <option className="tw-builder__settings-option" value="p">p</option>
                        <option className="tw-builder__settings-option" value="span">span</option>
                    </select>
                    <span className="tw-builder__settings-arrow">
                            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                                <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                            </svg>
                    </span>
                    </div>
                </div>
                <div className="tw-builder__settings-tag">
                    <span className="tw-builder__settings-subtitle">Link to</span>
                    <input type="text" className="tw-builder__settings-input" placeholder="URL..." />
                </div>
            </div>
            <div className="tw-builder__settings-body">
                {controls.map((control, index) => (
                    <BuilderControl key={index} label={control.label} control={control.control} />
                ))}
            </div>
        </div>
    )
}

export default TextControls;    