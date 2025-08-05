import { useState, useRef, useEffect } from 'react';
import { Tooltip } from '@components/Tooltip/Tooltip';

export const DisplayControl = ({}) => {
    const [selectedWrap, setSelectedWrap] = useState('wrap');
    const [selectedDirection, setSelectedDirection] = useState('row');
    const [selectedAlign, setSelectedAlign] = useState('flex-start');
    const [selectedJustify, setSelectedJustify] = useState('flex-start');
    const wrapSelectRef = useRef(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const adjustWrapSelectWidth = () => {
        if (wrapSelectRef.current) {
            const select = wrapSelectRef.current;
            const wrapWidths = {
                'wrap': 35,
                'nowrap': 50,
            };
            
            const baseWidth = wrapWidths[selectedWrap] || 35;
            const totalWidth = baseWidth + 25; // +25 for arrow
            
            select.style.width = `${totalWidth}px`;
        }
    };

    useEffect(() => {
        adjustWrapSelectWidth();
    }, [selectedWrap]);

    const handleWrapSelectChange = (e) => {
        setSelectedWrap(e.target.value);
    };
    const handleDirectionChange = (direction) => {
        setSelectedDirection(direction);
    };
    const handleAlignChange = (align) => {
        setSelectedAlign(align);
    };
    const handleJustifyChange = (justify) => {
        setSelectedJustify(justify);
    };
    return (
    <>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Direction</span>
        <div className="tw-builder__settings-actions">
            <button className={`tw-builder__settings-action ${selectedDirection === 'row' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleDirectionChange('row')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.00134172 2C-0.00151758 1.78086 -0.00630757 1.37951 0.0645315 1.1168C0.156314 0.776369 0.384806 0.417969 0.917786 0.185477C1.16804 0.0763693 1.43357 0.0356924 1.70173 0.0173539C1.95531 9.16995e-08 2.26431 0 2.62258 0H8.37743C8.7357 0 9.04469 9.16995e-08 9.29828 0.0173539C9.56645 0.0356924 9.83193 0.0763693 10.0822 0.185477C10.6152 0.417969 10.8437 0.776369 10.9355 1.1168C11.0063 1.37951 11.0016 1.78086 10.9986 2C11.0016 2.21914 11.0063 2.62049 10.9355 2.8832C10.8437 3.22363 10.6152 3.58203 10.0822 3.81452C9.83193 3.92363 9.56645 3.96431 9.29828 3.98265C9.04469 4 8.7357 4 8.37743 4H2.62258C2.26431 4 1.95531 4 1.70173 3.98265C1.43357 3.96431 1.16804 3.92363 0.917786 3.81452C0.384806 3.58203 0.156314 3.22363 0.0645315 2.8832C-0.00630757 2.62049 -0.00151758 2.21914 0.00134172 2Z" fill="currentColor"/>
                    <path d="M0.00134172 7C-0.00151758 6.78086 -0.00630757 6.37951 0.0645315 6.1168C0.156314 5.77637 0.384806 5.41797 0.917786 5.18548C1.16804 5.07637 1.43357 5.03569 1.70173 5.01735C1.95531 5 2.26431 5 2.62258 5H8.37743C8.7357 5 9.04469 5 9.29828 5.01735C9.56645 5.03569 9.83193 5.07637 10.0822 5.18548C10.6152 5.41797 10.8437 5.77637 10.9355 6.1168C11.0063 6.37951 11.0016 6.78086 10.9986 7C11.0016 7.21914 11.0063 7.62049 10.9355 7.8832C10.8437 8.22363 10.6152 8.58203 10.0822 8.81452C9.83193 8.92363 9.56645 8.96431 9.29828 8.98265C9.04469 9 8.7357 9 8.37743 9H2.62258C2.26431 9 1.95531 9 1.70173 8.98265C1.43357 8.96431 1.16804 8.92363 0.917786 8.81452C0.384806 8.58203 0.156314 8.22363 0.0645315 7.8832C-0.00630757 7.62049 -0.00151758 7.21914 0.00134172 7Z" fill="currentColor"/>
                </svg>
                <Tooltip
                message={'Row'}
                open={showTooltip}
                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                width="auto"
                />
            </button>
            <button className={`tw-builder__settings-action ${selectedDirection === 'column' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleDirectionChange('column')}>
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0.000975796C7.21914 -0.0011037 7.62049 -0.00458732 7.8832 0.046932C8.22363 0.113683 8.58203 0.279859 8.81452 0.66748C8.92363 0.849487 8.96431 1.0426 8.98265 1.23762C9 1.42205 9 1.64677 9 1.90733V6.09268C9 6.35324 9 6.57795 8.98265 6.76238C8.96431 6.95742 8.92363 7.1505 8.81452 7.3325C8.58203 7.72014 8.22363 7.88632 7.8832 7.95309C7.62049 8.00457 7.21914 8.00113 7 7.999C6.78086 8.00113 6.37951 8.00457 6.1168 7.95309C5.77637 7.88632 5.41797 7.72014 5.18548 7.3325C5.07637 7.1505 5.03569 6.95742 5.01735 6.76238C5 6.57795 5 6.35324 5 6.09268V1.90733C5 1.64677 5 1.42204 5.01735 1.23762C5.03569 1.0426 5.07637 0.849487 5.18548 0.66748C5.41797 0.279859 5.77637 0.113683 6.1168 0.046932C6.37951 -0.00458732 6.78086 -0.0011037 7 0.000975796Z" fill="currentColor"/>
                    <path d="M2 0.000975796C2.21914 -0.0011037 2.62049 -0.00458732 2.8832 0.046932C3.22363 0.113683 3.58203 0.279859 3.81452 0.66748C3.92363 0.849487 3.96431 1.0426 3.98265 1.23762C4 1.42205 4 1.64677 4 1.90733V6.09268C4 6.35324 4 6.57795 3.98265 6.76238C3.96431 6.95742 3.92363 7.1505 3.81452 7.3325C3.58203 7.72014 3.22363 7.88632 2.8832 7.95309C2.62049 8.00457 2.21914 8.00113 2 7.999C1.78086 8.00113 1.37951 8.00457 1.1168 7.95309C0.776369 7.88632 0.417969 7.72014 0.185476 7.3325C0.0763686 7.1505 0.0356922 6.95742 0.0173538 6.76238C0 6.57795 0 6.35324 0 6.09268V1.90733C0 1.64677 0 1.42204 0.0173538 1.23762C0.0356922 1.0426 0.0763686 0.849487 0.185476 0.66748C0.417969 0.279859 0.776369 0.113683 1.1168 0.046932C1.37951 -0.00458732 1.78086 -0.0011037 2 0.000975796Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Align</span>
        <div className="tw-builder__settings-actions">
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')}>
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')}>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')}>
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Justify</span>
        <div className="tw-builder__settings-actions">
            <button className={`tw-builder__settings-action tw-builder__settings-action--start ${selectedJustify === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-start')}>
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00098 4C1.9989 3.78086 1.99541 3.37951 2.04693 3.1168C2.11368 2.77637 2.27986 2.41797 2.66748 2.18548C2.84949 2.07637 3.0426 2.03569 3.23762 2.01735C3.42205 2 3.64677 2 3.90733 2H8.09268C8.35324 2 8.57795 2 8.76238 2.01735C8.95742 2.03569 9.1505 2.07637 9.3325 2.18548C9.72014 2.41797 9.88632 2.77637 9.95309 3.1168C10.0046 3.37951 10.0011 3.78086 9.999 4C10.0011 4.21914 10.0046 4.62049 9.95309 4.8832C9.88632 5.22363 9.72014 5.58203 9.3325 5.81452C9.1505 5.92363 8.95742 5.96431 8.76238 5.98265C8.57795 6 8.35324 6 8.09268 6H3.90733C3.64677 6 3.42204 6 3.23762 5.98265C3.0426 5.96431 2.84949 5.92363 2.66748 5.81452C2.27986 5.58203 2.11368 5.22363 2.04693 4.8832C1.99541 4.62049 1.9989 4.21914 2.00098 4Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.22386 11.7558 0 11.4545 0H0.545454C0.2442 0 0 0.22386 0 0.5C0 0.77614 0.2442 1 0.545454 1H11.4545C11.7558 1 12 0.77614 12 0.5Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedJustify === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('center')}>
                <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00098 2.5C1.9989 2.22608 1.99541 1.72438 2.04693 1.396C2.11368 0.970462 2.27986 0.522462 2.66748 0.231846C2.84949 0.0954617 3.0426 0.0446155 3.23762 0.0216924C3.42205 1.14624e-07 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 1.14624e-07 8.76238 0.0216924C8.95742 0.0446155 9.1505 0.0954617 9.3325 0.231846C9.72014 0.522462 9.88632 0.970462 9.95309 1.396C10.0046 1.72438 10.0011 2.22608 9.999 2.5C10.0011 2.77392 10.0046 3.27562 9.95309 3.604C9.88632 4.02954 9.72014 4.47754 9.3325 4.76815C9.1505 4.90454 8.95742 4.95538 8.76238 4.97831C8.57795 5 8.35324 5 8.09268 5H3.90733C3.64677 5 3.42204 5 3.23762 4.97831C3.0426 4.95538 2.84949 4.90454 2.66748 4.76815C2.27986 4.47754 2.11368 4.02954 2.04693 3.604C1.99541 3.27562 1.9989 2.77392 2.00098 2.5Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C12 2.22386 11.7558 2 11.4545 2H0.545454C0.2442 2 0 2.22386 0 2.5C0 2.77614 0.2442 3 0.545454 3H11.4545C11.7558 3 12 2.77614 12 2.5Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action tw-builder__settings-action--end ${selectedJustify === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleJustifyChange('flex-end')}>
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00098 2C1.9989 1.78086 1.99541 1.37951 2.04693 1.1168C2.11368 0.776369 2.27986 0.417969 2.66748 0.185477C2.84949 0.0763693 3.0426 0.0356924 3.23762 0.0173539C3.42205 9.16995e-08 3.64677 0 3.90733 0H8.09268C8.35324 0 8.57795 9.16995e-08 8.76238 0.0173539C8.95742 0.0356924 9.1505 0.0763693 9.3325 0.185477C9.72014 0.417969 9.88632 0.776369 9.95309 1.1168C10.0046 1.37951 10.0011 1.78086 9.999 2C10.0011 2.21914 10.0046 2.62049 9.95309 2.8832C9.88632 3.22363 9.72014 3.58203 9.3325 3.81452C9.1505 3.92363 8.95742 3.96431 8.76238 3.98265C8.57795 4 8.35324 4 8.09268 4H3.90733C3.64677 4 3.42204 4 3.23762 3.98265C3.0426 3.96431 2.84949 3.92363 2.66748 3.81452C2.27986 3.58203 2.11368 3.22363 2.04693 2.8832C1.99541 2.62049 1.9989 2.21914 2.00098 2Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 5.5C12 5.22386 11.7558 5 11.4545 5H0.545454C0.2442 5 0 5.22386 0 5.5C0 5.77614 0.2442 6 0.545454 6H11.4545C11.7558 6 12 5.77614 12 5.5Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    </div>
    <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Wrap</span>
                    <div className="tw-builder__settings-select-container">
                    <select 
                        ref={wrapSelectRef}
                        className="tw-builder__settings-select"
                        value={selectedWrap}
                        onChange={handleWrapSelectChange}
                    >
                        <option className="tw-builder__settings-option" value="wrap">Wrap</option>
                        <option className="tw-builder__settings-option" value="nowrap">No Wrap</option>
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
        <span className="tw-builder__settings-subtitle">Gap</span>
        <input type="text" className="tw-builder__settings-input" placeholder="0" />
    </div>
    </>
)};

export const SpacingControl = () => (
    <>
    <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
        <span className="tw-builder__settings-subtitle">Margin</span>
        <div className="tw-builder__settings-spacing">
            <input type="text" className="tw-builder__spacing-input"/>
            <div className="tw-builder__settings-spacing-mid">
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
            </div>
            <input type="text" className="tw-builder__spacing-input"/>
        </div>
    </div>
    <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
        <span className="tw-builder__settings-subtitle">Padding</span>
        <div className="tw-builder__settings-spacing">
            <input type="text" className="tw-builder__spacing-input"/>
            <div className="tw-builder__settings-spacing-mid">
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
            </div>
            <input type="text" className="tw-builder__spacing-input"/>
        </div>
    </div>
    </>
);

export const SizeControl = () => (
    <>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Width</span>
        <input type="text" className="tw-builder__settings-input" placeholder="100%" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Max. width</span>
        <input type="text" className="tw-builder__settings-input" placeholder="100%" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Height</span>
        <input type="text" className="tw-builder__settings-input" placeholder="100%" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Max. height</span>
        <input type="text" className="tw-builder__settings-input" placeholder="100%" />
    </div>
    </>
);

export const BackgroundControl = () => {
    const [color, setColor] = useState('#FFFFFF');
    const [hex, setHex] = useState('FFFFFF');
    const [percentage, setPercentage] = useState('100%');
    const colorInputRef = useRef(null);

    // Convertir hex a rgba con opacidad
    const hexToRgba = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };



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

    return(
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
    )
};

export const TextControl = () => {
    const [color, setColor] = useState('#FFFFFF');
    const [hex, setHex] = useState('FFFFFF');
    const [percentage, setPercentage] = useState('100%');
    const colorInputRef = useRef(null);
    const [selectedAlign, setSelectedAlign] = useState('flex-start');
    const [selectedWeight, setSelectedWeight] = useState('500');
    const weightSelectRef = useRef(null);
    const [selectedTransform, setSelectedTransform] = useState('none');
    const transformSelectRef = useRef(null);
    const [selectedStyle, setSelectedStyle] = useState('normal');
    const styleSelectRef = useRef(null);

    const handleWeightChange = (e) => {
        setSelectedWeight(e.target.value);
    };
    const handleTransformChange = (e) => {
        setSelectedTransform(e.target.value);
    };
    const handleStyleChange = (e) => {
        setSelectedStyle(e.target.value);
    };
        // Convertir hex a rgba con opacidad
        const hexToRgba = (hex, opacity) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
        };
    
    
    
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

    return(
<> 
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
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Size</span>
        <input type="text" className="tw-builder__settings-input" placeholder="16px" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Align</span>
        <div className="tw-builder__settings-actions">
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')}>
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00085 6C1.99903 5.78086 1.99599 5.37951 2.04107 5.1168C2.09947 4.77637 2.24488 4.41797 2.58405 4.18548C2.7433 4.07637 2.91227 4.03569 3.08292 4.01735C3.24429 4 3.44092 4 3.66891 4H7.33109C7.55908 4 7.75571 4 7.91709 4.01735C8.08774 4.03569 8.25668 4.07637 8.41593 4.18548C8.75512 4.41797 8.90053 4.77637 8.95895 5.1168C9.004 5.37951 9.00099 5.78086 8.99913 6C9.00099 6.21914 9.004 6.62049 8.95895 6.8832C8.90053 7.22363 8.75512 7.58203 8.41593 7.81452C8.25668 7.92363 8.08774 7.96431 7.91709 7.98265C7.75571 8 7.55908 8 7.33109 8H3.66891C3.44092 8 3.24429 8 3.08292 7.98265C2.91227 7.96431 2.7433 7.92363 2.58405 7.81452C2.24488 7.58203 2.09947 7.22363 2.04107 6.8832C1.99599 6.62049 1.99903 6.21914 2.00085 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0C0.22386 0 0 0.244211 0 0.545455V11.4545C0 11.7558 0.22386 12 0.5 12C0.77614 12 1 11.7558 1 11.4545V0.545455C1 0.244211 0.77614 0 0.5 0Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')}>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0C3.22386 0 3 0.244211 3 0.545455V11.4545C3 11.7558 3.22386 12 3.5 12C3.77614 12 4 11.7558 4 11.4545V0.545455C4 0.244211 3.77614 0 3.5 0Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')}>
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.000853822 6C-0.000965736 5.78086 -0.00401391 5.37951 0.0410655 5.1168C0.0994728 4.77637 0.244877 4.41797 0.584045 4.18548C0.743301 4.07637 0.912271 4.03569 1.08292 4.01735C1.24429 4 1.44092 4 1.66891 4H5.33109C5.55908 4 5.75571 4 5.91709 4.01735C6.08774 4.03569 6.25668 4.07637 6.41593 4.18548C6.75512 4.41797 6.90053 4.77637 6.95895 5.1168C7.004 5.37951 7.00099 5.78086 6.99913 6C7.00099 6.21914 7.004 6.62049 6.95895 6.8832C6.90053 7.22363 6.75512 7.58203 6.41593 7.81452C6.25668 7.92363 6.08774 7.96431 5.91709 7.98265C5.75571 8 5.55908 8 5.33109 8H1.66891C1.44092 8 1.24429 8 1.08292 7.98265C0.912271 7.96431 0.743301 7.92363 0.584045 7.81452C0.244877 7.58203 0.0994728 7.22363 0.0410655 6.8832C-0.00401391 6.62049 -0.000965736 6.21914 0.000853822 6Z" fill="currentColor"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C8.22386 0 8 0.244211 8 0.545455V11.4545C8 11.7558 8.22386 12 8.5 12C8.77614 12 9 11.7558 9 11.4545V0.545455C9 0.244211 8.77614 0 8.5 0Z" fill="currentColor"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'justify' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('justify')}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.00134172 1C-0.00151758 0.890431 -0.00630757 0.689754 0.0645315 0.5584C0.156314 0.388185 0.384806 0.208985 0.917786 0.0927385C1.16804 0.0381847 1.43357 0.0178462 1.70173 0.00867697C1.95531 4.58497e-08 2.26431 0 2.62258 0H8.37743C8.7357 0 9.04469 4.58497e-08 9.29828 0.00867697C9.56645 0.0178462 9.83193 0.0381847 10.0822 0.0927385C10.6152 0.208985 10.8437 0.388185 10.9355 0.5584C11.0063 0.689754 11.0016 0.890431 10.9986 1C11.0016 1.10957 11.0063 1.31025 10.9355 1.4416C10.8437 1.61182 10.6152 1.79102 10.0822 1.90726C9.83193 1.96182 9.56645 1.98215 9.29828 1.99132C9.04469 2 8.7357 2 8.37743 2H2.62258C2.26431 2 1.95531 2 1.70173 1.99132C1.43357 1.98215 1.16804 1.96182 0.917786 1.90726C0.384806 1.79102 0.156314 1.61182 0.0645315 1.4416C-0.00630757 1.31025 -0.00151758 1.10957 0.00134172 1Z" fill="#222222"/>
            <path d="M0.00134172 4C-0.00151758 3.89043 -0.00630757 3.68975 0.0645315 3.5584C0.156314 3.38818 0.384806 3.20898 0.917786 3.09274C1.16804 3.03818 1.43357 3.01785 1.70173 3.00868C1.95531 3 2.26431 3 2.62258 3H8.37743C8.7357 3 9.04469 3 9.29828 3.00868C9.56645 3.01785 9.83193 3.03818 10.0822 3.09274C10.6152 3.20898 10.8437 3.38818 10.9355 3.5584C11.0063 3.68975 11.0016 3.89043 10.9986 4C11.0016 4.10957 11.0063 4.31025 10.9355 4.4416C10.8437 4.61182 10.6152 4.79102 10.0822 4.90726C9.83193 4.96182 9.56645 4.98215 9.29828 4.99132C9.04469 5 8.7357 5 8.37743 5H2.62258C2.26431 5 1.95531 5 1.70173 4.99132C1.43357 4.98215 1.16804 4.96182 0.917786 4.90726C0.384806 4.79102 0.156314 4.61182 0.0645315 4.4416C-0.00630757 4.31025 -0.00151758 4.10957 0.00134172 4Z" fill="#222222"/>
            <path d="M0.00134172 7C-0.00151758 6.89043 -0.00630757 6.68975 0.0645315 6.5584C0.156314 6.38818 0.384806 6.20898 0.917786 6.09274C1.16804 6.03818 1.43357 6.01785 1.70173 6.00868C1.95531 6 2.26431 6 2.62258 6H8.37743C8.7357 6 9.04469 6 9.29828 6.00868C9.56645 6.01785 9.83193 6.03818 10.0822 6.09274C10.6152 6.20898 10.8437 6.38818 10.9355 6.5584C11.0063 6.68975 11.0016 6.89043 10.9986 7C11.0016 7.10957 11.0063 7.31025 10.9355 7.4416C10.8437 7.61182 10.6152 7.79102 10.0822 7.90726C9.83193 7.96182 9.56645 7.98215 9.29828 7.99132C9.04469 8 8.7357 8 8.37743 8H2.62258C2.26431 8 1.95531 8 1.70173 7.99132C1.43357 7.98215 1.16804 7.96182 0.917786 7.90726C0.384806 7.79102 0.156314 7.61182 0.0645315 7.4416C-0.00630757 7.31025 -0.00151758 7.10957 0.00134172 7Z" fill="#222222"/>
            <path d="M0.00134172 10C-0.00151758 9.89043 -0.00630757 9.68975 0.0645315 9.5584C0.156314 9.38818 0.384806 9.20898 0.917786 9.09274C1.16804 9.03818 1.43357 9.01785 1.70173 9.00868C1.95531 9 2.26431 9 2.62258 9H8.37743C8.7357 9 9.04469 9 9.29828 9.00868C9.56645 9.01785 9.83193 9.03818 10.0822 9.09274C10.6152 9.20898 10.8437 9.38818 10.9355 9.5584C11.0063 9.68975 11.0016 9.89043 10.9986 10C11.0016 10.1096 11.0063 10.3102 10.9355 10.4416C10.8437 10.6118 10.6152 10.791 10.0822 10.9073C9.83193 10.9618 9.56645 10.9822 9.29828 10.9913C9.04469 11 8.7357 11 8.37743 11H2.62258C2.26431 11 1.95531 11 1.70173 10.9913C1.43357 10.9822 1.16804 10.9618 0.917786 10.9073C0.384806 10.791 0.156314 10.6118 0.0645315 10.4416C-0.00630757 10.3102 -0.00151758 10.1096 0.00134172 10Z" fill="#222222"/>
            </svg>
            </button>
            
        </div>
    </div>
    <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Transform</span>
                    <div className="tw-builder__settings-select-container">
                    <select 
                        ref={transformSelectRef}
                        className="tw-builder__settings-select"
                        value={selectedTransform}
                        onChange={handleTransformChange}
                    >
                        <option className="tw-builder__settings-option" value="none">none</option>
                        <option className="tw-builder__settings-option" value="capitalize">capitalize</option>
                        <option className="tw-builder__settings-option" value="uppercase">uppercase</option>
                        <option className="tw-builder__settings-option" value="lowercase">lowercase</option>
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
        <span className="tw-builder__settings-subtitle">Font-Family</span>
        <input type="text" className="tw-builder__settings-input" placeholder="Arial" />
    </div>
    <div className="tw-builder__settings-setting">
                    <span className="tw-builder__settings-subtitle">Font-Weight</span>
                    <div className="tw-builder__settings-select-container">
                    <select 
                        ref={weightSelectRef}
                        className="tw-builder__settings-select"
                        value={selectedWeight}
                        onChange={handleWeightChange}
                    >
                        <option className="tw-builder__settings-option" value="100">100</option>
                        <option className="tw-builder__settings-option" value="200">200</option>
                        <option className="tw-builder__settings-option" value="300">300</option>
                        <option className="tw-builder__settings-option" value="400">400</option>
                        <option className="tw-builder__settings-option" value="500">500</option>
                        <option className="tw-builder__settings-option" value="600">600</option>
                        <option className="tw-builder__settings-option" value="700">700</option>
                        <option className="tw-builder__settings-option" value="800">800</option>
                        <option className="tw-builder__settings-option" value="900">900</option>
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
        <span className="tw-builder__settings-subtitle">Font-Style</span>
        <div className="tw-builder__settings-select-container">
            <select ref={styleSelectRef} className="tw-builder__settings-select" value={selectedStyle} onChange={handleStyleChange}>
                <option className="tw-builder__settings-option" value="normal">normal</option>
                <option className="tw-builder__settings-option" value="italic">italic</option>
                <option className="tw-builder__settings-option" value="oblique">oblique</option>
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
        <span className="tw-builder__settings-subtitle">Line Height</span>
        <input type="text" className="tw-builder__settings-input" placeholder="0" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Letter Spacing</span>
        <input type="text" className="tw-builder__settings-input" placeholder="0" />
    </div>
    <div className="tw-builder__settings-setting">
        <span className="tw-builder__settings-subtitle">Decoration</span>
        <div className="tw-builder__settings-actions">
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-start' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-start')}>
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.56818 0.272727L3.81818 3.90341H3.88636L6.13636 0.272727H7.38068L4.63636 4.63636L7.38068 9H6.13636L3.88636 5.4375H3.81818L1.56818 9H0.323864L3.13636 4.63636L0.323864 0.272727H1.56818Z" fill="black"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'center' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('center')}>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.57955 1.21023V0.272727H9.125V1.21023H6.38068V9H5.32386V1.21023H2.57955Z" fill="black"/>
                    <line y1="4.65" x2="12" y2="4.65" stroke="black" strokeWidth="0.7"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'flex-end' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('flex-end')}>
                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.57955 1.21023V0.272727H9.125V1.21023H6.38068V9H5.32386V1.21023H2.57955Z" fill="black"/>
                    <line y1="10.65" x2="12" y2="10.65" stroke="black" strokeWidth="0.7"/>
                </svg>
            </button>
            <button className={`tw-builder__settings-action ${selectedAlign === 'justify' ? 'tw-builder__settings-action--active' : ''}`} onClick={() => handleAlignChange('justify')}>
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.57955 3.21023V2.27273H9.125V3.21023H6.38068V11H5.32386V3.21023H2.57955Z" fill="black"/>
            <line y1="0.65" x2="12" y2="0.65" stroke="black" strokeWidth="0.7"/>
            </svg>

            </button>
            
        </div>
    </div>
</>
);
};

export const StylesControl = () => {
    const [borderStyle, setBorderStyle] = useState('none');
    const [selectedPosition, setSelectedPosition] = useState('static');
    const [selectedOverflow, setSelectedOverflow] = useState('visible');
    const [selectedCursor, setSelectedCursor] = useState('default');
    const [color, setColor] = useState('#000000');
    const [hex, setHex] = useState('000000');
    const [percentage, setPercentage] = useState('100%');
    const colorInputRef = useRef(null);

        // Convertir hex a rgba con opacidad
        const hexToRgba = (hex, opacity) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
        };
    
    
    
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
    return (
    <>
   {/* Border Controls */}
   <div className="tw-builder__settings-setting tw-builder__settings-setting--column">
        <span className="tw-builder__settings-subtitle">Border Width</span>
        <div className="tw-builder__settings-spacing">
            <input type="text" className="tw-builder__spacing-input"/>
            <div className="tw-builder__settings-spacing-mid">
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
            </div>
            <input type="text" className="tw-builder__spacing-input"/>
        </div>
    </div>

<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Border Style</span>
   <select className="tw-builder__settings-select" value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)}>
       <option value="none">none</option>
       <option value="solid">solid</option>
       <option value="dashed">dashed</option>
       <option value="dotted">dotted</option>
   </select>
</div>

<div className="tw-builder__settings-setting tw-builder__settings-setting--column">
   <span className="tw-builder__settings-subtitle">Border Color</span>
   <div className="tw-builder__settings-background">
            <div className="tw-builder__settings-colors">
                <input  ref={colorInputRef} type="color" className="tw-builder__settings-color-input" value={color} onChange={handleColorChange} />
                <div className="tw-builder__settings-color" onClick={handleColorClick} style={{
                        backgroundColor: finalColor, 
                    }}>
                </div>
                <input type="text" className="tw-builder__settings-hex" value={hex} onChange={handleHexChange} onBlur={handleHexBlur} onInput={handleHexChange} placeholder="000000"/>
            </div>
            <div className="tw-builder__settings-percentages">
                <input type="text" value={percentage} min={0} max={100} className="tw-builder__settings-percentage" onBlur={handlePercentageChange} onChange={handlePercentageChange} />
            </div>
        </div>
</div>

<div className="tw-builder__settings-setting tw-builder__settings-setting--column">
        <span className="tw-builder__settings-subtitle">Border Radius</span>
        <div className="tw-builder__settings-spacing">
            <input type="text" className="tw-builder__spacing-input"/>
            <div className="tw-builder__settings-spacing-mid">
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
                <input type="text" className="tw-builder__spacing-input tw-builder__spacing-input--mid"/>
            </div>
            <input type="text" className="tw-builder__spacing-input"/>
        </div>
    </div>

{/* Box Shadow */}
{/* <div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Box Shadow</span>
   <input type="text" className="tw-builder__settings-input" placeholder="0 2px 4px rgba(0,0,0,0.1)" />
</div> */}

{/* Position Controls */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Position</span>
   <select className="tw-builder__settings-select" /* value={selectedPosition} *//*  onChange={(e) => setSelectedPosition(e.target.value)} */>
       <option value="static">Static</option>
       <option value="relative">Relative</option>
       <option value="absolute">Absolute</option>
       <option value="fixed">Fixed</option>
       <option value="sticky">Sticky</option>
   </select>
</div>

{/* Z-Index */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Z-Index</span>
   <input type="text" className="tw-builder__settings-input" placeholder="auto" />
</div>

{/* Overflow */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Overflow</span>
   <select className="tw-builder__settings-select" /* value={selectedOverflow} */ /* onChange={(e) => setSelectedOverflow(e.target.value)} */>
       <option value="visible">Visible</option>
       <option value="hidden">Hidden</option>
       <option value="scroll">Scroll</option>
       <option value="auto">Auto</option>
   </select>
</div>

{/* Opacity */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Opacity</span>
   <input type="text" className="tw-builder__settings-input" placeholder="1" />
</div>

{/* Cursor */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Cursor</span>
   <select className="tw-builder__settings-select" /* value={selectedCursor} onChange={(e) => setSelectedCursor(e.target.value)} */>
       <option value="default">Default</option>
       <option value="pointer">Pointer</option>
       <option value="text">Text</option>
       <option value="not-allowed">Not Allowed</option>
       <option value="grab">Grab</option>
   </select>
</div>

{/* Transform */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Transform</span>
   <input type="text" className="tw-builder__settings-input" placeholder="rotate(0deg) scale(1)" />
</div>

{/* Transition */}
<div className="tw-builder__settings-setting">
   <span className="tw-builder__settings-subtitle">Transition</span>
   <input type="text" className="tw-builder__settings-input" placeholder="all 0.3s ease" />
</div>
</>
);
};





