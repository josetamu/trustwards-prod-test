import { useState, useRef, useEffect } from 'react';
import { SpacingControl, SizeControl, BackgroundControl, TextControl, StylesControl } from '../ControlComponents/ControlComponents';
import BuilderControl from '@components/BuilderControl/BuilderControl';

function BlockControls({selectedId}) {
    const [selectedTag, setSelectedTag] = useState('div');
    const tagSelectRef = useRef(null);
    const displaySelectRef = useRef(null);
    const [selectedDisplay, setSelectedDisplay] = useState('flex');

    const adjustSelectWidth = () => {
        if(tagSelectRef.current){
            const select = tagSelectRef.current;
            const tagWidths = {
                'div': 25,
                'section': 40,
                'a': 25,
                'article': 35,
                'aside': 30,
                'nav': 25,
            };
            const baseWidth = tagWidths[selectedTag] || 20;
            const totalWidth = baseWidth + 25;
            select.style.width = `${totalWidth}px`;
        }
        if(displaySelectRef.current){
            const select = displaySelectRef.current;
            const displayWidths = {
                'flex': 25,
                'grid': 25,
                'block': 30,
                'inline-block': 65,
                'inline': 30,
                'none': 30,
            };
            const baseWidth = displayWidths[selectedDisplay] || 20;
            const totalWidth = baseWidth + 25;
            select.style.width = `${totalWidth}px`;
        }
    };

    useEffect(() => {
        if(selectedTag || selectedDisplay){
            adjustSelectWidth();
        }
    }, [selectedTag, selectedDisplay]);

    const handleSelectChange = (e) => {
        setSelectedTag(e.target.value);
    };
    const handleDisplaySelectChange = (e) => {
        setSelectedDisplay(e.target.value);
    };
    const controls = [
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
                        <option className="tw-builder__settings-option" value="div">div</option>
                        <option className="tw-builder__settings-option" value="a">a</option>
                        <option className="tw-builder__settings-option" value="section">section</option>
                        <option className="tw-builder__settings-option" value="article">article</option>
                        <option className="tw-builder__settings-option" value="aside">aside</option>
                        <option className="tw-builder__settings-option" value="nav">nav</option>
                    </select>
                    <span className="tw-builder__settings-arrow">
                            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="2.64645" y1="3.64645" x2="5.64645" y2="0.646446" stroke="#999999"/>
                                <line y1="-0.5" x2="4.24264" y2="-0.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 3 4)" stroke="#999999"/>
                            </svg>
                    </span>
                    </div>
                </div>
                {selectedTag === 'a' && (
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Link to</span>
                    <input type="text" className="tw-builder__settings-input tw-builder__settings-input--link" placeholder="URL..." />
                </div>
                )}
                <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Display</span>
                    <div className="tw-builder__settings-select-container">
                        <select 
                            ref={displaySelectRef}
                            className="tw-builder__settings-select"
                            value={selectedDisplay}
                            onChange={handleDisplaySelectChange}
                        >
                            <option className="tw-builder__settings-option" value="flex">Flex</option>
                            <option className="tw-builder__settings-option" value="grid">Grid</option>
                            <option className="tw-builder__settings-option" value="block">Block</option>
                            <option className="tw-builder__settings-option" value="inline-block">Inline Block</option>
                            <option className="tw-builder__settings-option" value="inline">Inline</option>
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
                {selectedDisplay === 'flex' && (
                    <h1>Flex</h1>
                )}
                {selectedDisplay === 'grid' && (
                    <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Display</span>
                    </div>
                )}
                {(selectedDisplay === 'block' || selectedDisplay === 'inline-block' || selectedDisplay === 'inline') && (
                    <h1>Block</h1>
                )}
            </div>
            <div className="tw-builder__settings-body">
                {/* Map the controls */}
                {controls.map((control, index) => (
                    <BuilderControl key={index} label={control.label} control={control.control} />
                ))}
            </div>
        </div>
    )
}
export default BlockControls;