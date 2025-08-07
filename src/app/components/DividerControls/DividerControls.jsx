import './DividerControls.css';
import { DividerMainControl, StylesControl } from '@components/ControlComponents/ControlComponents';
import BuilderControl from '@components/BuilderControl/BuilderControl';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from '@components/tooltip/Tooltip';




function DividerControls({selectedId}) {
    
const [activeTooltip, setActiveTooltip] = useState(null);
const [color, setColor] = useState('000000');
const [hex, setHex] = useState('000000');
const [percentage, setPercentage] = useState('100%');
const colorInputRef = useRef(null);
const [selectedStyle, setSelectedStyle] = useState('solid');
const styleSelectRef = useRef(null);
const directionSelectRef = useRef(null);
const [selectedDirection, setSelectedDirection] = useState('horizontal');
const [selectedAlign, setSelectedAlign] = useState('none');


     //Function to convert hex to rgba with opacity
     const hexToRgba = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };

    //Function to change the color
    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        setHex(newColor.replace('#', '').toUpperCase());
    };
    const handleHexChange = (e) => {
        const hexValue = e.target.value.toUpperCase().replace('#', '');

        if(hexValue.length > 8){
            hexValue = hexValue.slice(0, 8);
        }
        setHex(hexValue);

        const hexPattern = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        if(hexPattern.test(hexValue)) {
            const formattedHex = `#${hexValue}`;
            setColor(formattedHex);

            if (hexValue.length === 3) {
                const expandedHex = hexValue.split('').map(char => char + char).join('');
                const formattedHex = `#${expandedHex}`;
                setColor(formattedHex);
            } else {
                const formattedHex = `#${hexValue}`;
                setColor(formattedHex);
            }
        }
    };
    const handleHexBlur = (e) => {
        const hexValue = e.target.value.trim();
        if(hexValue === ''){
            setHex('FFFFFF');
            setColor('#FFFFFF');
        } 
    };
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
        }
    };
    const handleColorClick = () => {
        if(colorInputRef.current){
            colorInputRef.current.click();
        }
    };
    const finalColor = hexToRgba(color, parseInt(percentage.replace('%', '')));

const handleAlignChange = (align) => {
    setSelectedAlign(align);
};
const handleMouseEnter = (tooltipId) => {
    setActiveTooltip(tooltipId);
};
const handleMouseLeave = () => {
    setActiveTooltip(null);
};



const handleDirectionSelectChange = (e) => {
    setSelectedDirection(e.target.value);
};

const handleStyleSelectChange = (e) => {
    setSelectedStyle(e.target.value);
};

//Determine the controls used for the divider. controls are got from the ControlComponents component
const controls = [

    {
        label: 'Style',
        control: <StylesControl />,
    },

];

    return (
    <div className="tw-builder__settings">
        <div className="tw-builder__settings-header">
            <div className="tw-builder__settings-classes">
                <span className="tw-builder__settings-id">#{selectedId}</span>
            </div>
            <div className="tw-builder__settings-setting">
                <span className="tw-builder__settings-subtitle">Height</span>
                <input type="text" className="tw-builder__settings-input" placeholder="2px" />
            </div>
            <div className="tw-builder__settings-setting">
                <span className="tw-builder__settings-subtitle">Width</span>
                <input type="text" className="tw-builder__settings-input" placeholder="100%" />
            </div>
        <div className="tw-builder__settings-setting">
            <span className="tw-builder__settings-subtitle">Style</span>
            <div className="tw-builder__settings-select-container">
                <select 
                    ref={styleSelectRef}
                    className="tw-builder__settings-select"
                    value={selectedStyle}
                    onChange={handleStyleSelectChange}
                >
                    <option className="tw-builder__settings-option" value="none">None</option>
                    <option className="tw-builder__settings-option" value="hidden">Hidden</option>
                    <option className="tw-builder__settings-option" value="solid">Solid</option>
                    <option className="tw-builder__settings-option" value="dotted">Dotted</option>
                    <option className="tw-builder__settings-option" value="dashed">Dashed</option>
                    <option className="tw-builder__settings-option" value="double">Double</option>
                    <option className="tw-builder__settings-option" value="groove">Groove</option>
                    <option className="tw-builder__settings-option" value="ridge">Ridge</option>
                    <option className="tw-builder__settings-option" value="inset">Inset</option>
                    <option className="tw-builder__settings-option" value="outset">Outset</option>
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
            <div className="tw-builder__settings-select-container">
                <select 
                    ref={directionSelectRef}
                    className="tw-builder__settings-select"
                    value={selectedDirection}
                    onChange={handleDirectionSelectChange}
                >
                    <option className="tw-builder__settings-option" value="horizontal">Horizontal</option>
                    <option className="tw-builder__settings-option" value="vertical">Vertical</option>
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
            <span className="tw-builder__settings-subtitle">Align</span>
            <div className="tw-builder__settings-actions">
                <button className={`tw-builder__settings-action ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')} onMouseEnter={() => handleMouseEnter('astart')} onMouseLeave={handleMouseLeave}>
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                    </svg>
                    <Tooltip
                    message={'Start'}
                    open={activeTooltip === 'astart'}
                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                    width="auto"
                    />
                </button>
                <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')} onMouseEnter={() => handleMouseEnter('acenter')} onMouseLeave={handleMouseLeave}>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                    </svg>
                    <Tooltip
                    message={'Center'}
                    open={activeTooltip === 'acenter'}
                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                    width="auto"
                    />
                </button>
                <button className={`tw-builder__settings-action ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')} onMouseEnter={() => handleMouseEnter('aend')} onMouseLeave={handleMouseLeave}>
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                    </svg>
                    <Tooltip
                    message={'End'}
                    open={activeTooltip === 'aend'}
                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                    width="auto"
                    />
                </button>
            </div>
        </div>
        <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
            <div className="tw-builder__settings-background">
                <div className="tw-builder__settings-colors">
                    <input  ref={colorInputRef} type="color" className="tw-builder__settings-color-input" value={color} onChange={handleColorChange} />
                    <div className="tw-builder__settings-color" onClick={handleColorClick} style={{
                            backgroundColor: finalColor, 
                        }}>
                    </div>
                    <input type="text" className="tw-builder__settings-hex" value={hex} onChange={handleHexChange} onBlur={handleHexBlur} onInput={handleHexChange} placeholder="FFFFFF"/>
                </div>
                <div className="tw-builder__settings-percentages">
                    <input type="text" value={percentage} min={0} max={100} className="tw-builder__settings-percentage" onBlur={handlePercentageChange} onChange={handlePercentageChange} />
                </div>
            </div>
        </div>
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

export default DividerControls;