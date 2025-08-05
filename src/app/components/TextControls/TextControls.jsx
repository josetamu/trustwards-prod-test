import './TextControls.css';
import BuilderControl from '../BuilderControl/BuilderControl';
import { useState, useRef, useEffect } from 'react';
import { DisplayControl, SpacingControl, SizeControl, BackgroundControl, TextControl, StylesControl, CodeControl } from '../ControlComponents/ControlComponents';

function TextControls({selectedId}) {
    const [selectedTag, setSelectedTag] = useState('h1');
    const tagSelectRef = useRef(null);

    // Function to adjust the width of the select
    const adjustSelectWidth = () => {
        if (tagSelectRef.current) {
            const select = tagSelectRef.current;
            // Map of tags to widths
            const tagWidths = {
                'h1': 20, 'h2': 20, 'h3': 20, 'h4': 20, 'h5': 20, 'h6': 20,
                'p': 5,
                'span': 30,
            };
            
            const baseWidth = tagWidths[selectedTag] || 30;
            const totalWidth = baseWidth + 25; // +25 for arrow
            
            select.style.width = `${totalWidth}px`;
        }
    };

    // Adjust the width of the select when the tag is changed
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
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Tag</span>
                    <div className="tw-builder__settings-select-container">
                    <select 
                        ref={tagSelectRef}
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
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Link to</span>
                    <input type="text" className="tw-builder__settings-input tw-builder__settings-input--link" placeholder="URL..." />
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