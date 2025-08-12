import BuilderControl from '@components/BuilderControl/BuilderControl';
import { LayoutControl, SpacingControl, SizeControl, BackgroundControl, TextControl, StylesControl } from '../ControlComponents/ControlComponents';
import { useState, useRef, useEffect } from 'react';

function ImageControls({selectedId}) {
    const [selectedTag, setSelectedTag] = useState('div');
    const tagSelectRef = useRef(null);
    const objectFitRef = useRef(null);
    const [selectedObjectFit, setSelectedObjectFit] = useState('fill');
    
    const adjustSelectWidth = () => {
        if(tagSelectRef.current){
            const select = tagSelectRef.current;
            const tagWidths = {
                'div': 25,
                'figure': 35,
                'img': 25,
            };
            const baseWidth = tagWidths[selectedTag] || 20;
            const totalWidth = baseWidth + 25;
            select.style.width = `${totalWidth}px`;
        }
        if(objectFitRef.current){
            const select = objectFitRef.current;
            const objectFitWidths = {
                'fill': 35,
                'contain': 42,
                'cover': 35,
                'scale-down': 65,
                'none': 35,
            };
            const baseWidth = objectFitWidths[selectedObjectFit] || 20;
            const totalWidth = baseWidth + 25;
            select.style.width = `${totalWidth}px`;
        }
    }

    useEffect(() => {
        if(selectedTag || selectedObjectFit){
            adjustSelectWidth();
        }
    }, [selectedTag, selectedObjectFit]);

    const handleSelectChange = (e) => {
        setSelectedTag(e.target.value);
    }
    const handleObjectFitChange = (e) => {
        setSelectedObjectFit(e.target.value);
    }
    
    const controls = [
        {
            label: 'Layout',
            control: <LayoutControl />,
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
                    <img src="/assets/builder-default-image.svg" alt="Image" className="tw-builder__settings-image" />
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
                        <option className="tw-builder__settings-option" value="div">div</option>
                        <option className="tw-builder__settings-option" value="figure">figure</option>
                        <option className="tw-builder__settings-option" value="img">img</option>
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
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Alt</span>
                    <input type="text" className="tw-builder__settings-input tw-builder__settings-input--link" placeholder="Alt..." />
                </div>
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Aspect ratio</span>
                    <input type="text" className="tw-builder__settings-input" />
                </div>
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Object fit</span>
                    <div className="tw-builder__settings-select-container">
                        <select 
                            ref={objectFitRef}
                            className="tw-builder__settings-select"
                            value={selectedObjectFit}
                            onChange={handleObjectFitChange}
                        >
                            <option className="tw-builder__settings-option" value="fill">Fill</option>
                            <option className="tw-builder__settings-option" value="contain">Contain</option>
                            <option className="tw-builder__settings-option" value="cover">Cover</option>
                            <option className="tw-builder__settings-option" value="scale-down">Scale down</option>
                            <option className="tw-builder__settings-option" value="none">None</option>
                        </select>
                        <span className="tw-builder__settings-arrow">
                            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                                <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div className="tw-builder__settings-body">
                {controls.map((control) => (
                    <BuilderControl
                        key={control.label}
                        label={control.label}
                        control={control.control}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageControls;