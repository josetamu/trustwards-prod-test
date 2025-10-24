'use client';

import './Checkbox.css';

// Export groupControls separately for use in CanvasContext
export const checkboxGroupControls = {
    header: [
        { 
            name: 'Type', 
            type: 'select', 
            options: ['switch', 'checkbox'], 
            dataAttribute: 'data-type', 
            default: 'switch', 
            notDelete: true
        },
        { 
            name: 'Disabled Color', 
            type: 'color', 
            cssProperty: '--disabled-color', 
            default: '#555555', 
            nextLine: true,
        },
        { 
            name: 'Enabled Color', 
            type: 'color', 
            cssProperty: '--enabled-color', 
            default: '#0099FE', 
            nextLine: true, 
        },
        { 
            name: 'Duration', 
            type: 'text', 
            cssProperty: '--transition-duration', 
            default: '0.2s', 
        },
        { 
            name: 'CSS Easing', 
            type: 'text', 
            cssProperty: '--transition-easing', 
            default: 'ease', 
        },
    ],
    body: [
        {
            label: 'Switch Styles',
            controls: [
                {
                    name: 'Width',
                    type: 'text',
                    cssProperty: 'width',
                    autoUnit: 'px',
                    default: '26px',
                    selector: '&[data-type="switch"]'
                },
                {
                    name: 'Height',
                    type: 'text',
                    cssProperty: '--height',
                    autoUnit: 'px',
                    default: '16px',
                    selector: '&[data-type="switch"]'
                },
                {
                    name: 'Border', 
                    type: 'border',
                    selector: '&[data-type="switch"]',
                    default: {
                        'border-radius': '100px',
                    },
                },
                {
                    name: 'Shadow',
                    type: 'box-shadow',
                    selector: '&[data-type="switch"]',
                },
            ],
            required: { control: 'Type', value: 'switch' }
        },
        {
            label: 'Circle Styles',
            controls: [
                {
                    name: 'Spacing', 
                    type: 'text', 
                    cssProperty: '--switch-spacing',
                    default: '2px',
                    autoUnit: 'px'
                },
                {
                    name: 'Border', 
                    type: 'border',
                    selector: '.tw-categories__expander-switch',
                    default: {
                        'border-radius': '100px',
                    }
                },
                {
                    name: 'Shadow',
                    type: 'box-shadow',
                    selector: '.tw-categories__expander-switch',
                    default: {
                        'box-shadow': '0px 0px 4px 4px #00000020',
                    }
                },
                {
                    name: 'Background',
                    type: 'color',
                    cssProperty: 'background-color',
                    selector: '.tw-categories__expander-switch',
                    default: '#FFFFFF',
                    nextLine: true
                },
            ],
            required: { control: 'Type', value: 'switch' }
        },
        {
            label: 'Box Styles',
            controls: [
                {
                    name: 'Size',
                    type: 'text',
                    cssProperty: '--size',
                    autoUnit: 'px',
                    default: '25px',
                    selector: '&[data-type="checkbox"]'
                },
                {
                    name: 'Border', 
                    type: 'border',
                    selector: '.tw-categories__expander-checkbox',
                    default: {
                        'border-radius': '8px',
                    },
                },
                {
                    name: 'Shadow',
                    type: 'box-shadow',
                    selector: '.tw-categories__expander-checkbox',
                },
            ],
            required: { control: 'Type', value: 'checkbox' }
        },
        {
            label: 'Check Styles',
            controls: [
                {
                    name: 'Size',
                    type: 'text',
                    cssProperty: '--check-size',
                    autoUnit: 'px',
                    default: '20px',
                    selector: '&[data-type="checkbox"]'
                },
                {
                    name: 'Stroke Width',
                    type: 'text',
                    cssProperty: '--check-stroke-width',
                    autoUnit: 'px',
                    default: '3px',
                    selector: '&[data-type="checkbox"]',
                },
                {
                    name: 'Color',
                    type: 'color',
                    cssProperty: '--check-color',
                    default: '#FFFFFF',
                    selector: '.tw-categories__expander-checkbox svg',
                    nextLine: true,
                },
            ],
            required: { control: 'Type', value: 'checkbox' }
        },
        {
            label: 'Spacing',
            controls: [
                { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
                { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
            ]
        },
        {
            label: 'Styles',
            controls: [
                { name: 'Opacity', type: 'text', cssProperty: 'opacity', placeholder: '1'},
                { name: 'Overflow', type: 'select', placeholder: 'Visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                { name: 'Cursor', type: 'select', placeholder: 'Default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor', default: 'pointer' },
                {
                    name: 'Mix blend mode',
                    type: 'select',
                    placeholder: 'normal',
                    options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
                    cssProperty: 'mix-blend-mode'
                },
                {name: 'Shadow', type: 'box-shadow'},
                {name: 'Transition', type: 'text', cssProperty: 'transition', placeholder: 'all 0.2s ease', nextLine: true},
            ]
        },
    ]
};

export const Checkbox = (node, nodeProps = {}) => {
    // nodeProps adds HTML id and classList
    const id = node.id;
    const Tag = node.tagName;
    const dataAttributes = node.attributes;
    const groupControls = checkboxGroupControls;

    const render = () => {
        // Crate a switch or a checkbox depending on the data-type attribute
        const type = (dataAttributes && dataAttributes['data-type']) ;

        if(type === 'switch') {
            return (
                <Tag key={id} {...nodeProps} {...dataAttributes}>
                    <input 
                        type="checkbox" 
                        name="category"
                        className="tw-categories__expander-input tw-categories__expander-input--category"
                    />
                    <span 
                        className="tw-categories__expander-switch"
                    />
                </Tag>
            )
        }else{
            return (
                <Tag key={id} {...nodeProps} {...dataAttributes}>
                    <input className="tw-categories__expander-input" type="checkbox" id={id + '-checkbox-input'}/>
                    <label className="tw-categories__expander-checkbox" htmlFor={id + '-checkbox-input'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                            <path d="M4.25 13.5L8.75 18L19.75 6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </label>
                </Tag>
            )
        }
    }

    return {
        groupControls,
        render
    };
};