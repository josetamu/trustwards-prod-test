'use client';

import './Checkbox.css';

export const Checkbox = (node, nodeProps = {}) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName;

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
        header: [
            { name: 'Type', type: 'select', options: ['switch', 'checkbox'], dataAttribute: 'data-type', notDelete: true},
            { name: 'Disabled Color', type: 'color', cssProperty: '--disabled-color', nextLine: true },
            { name: 'Enabled Color', type: 'color', cssProperty: '--enabled-color', nextLine: true },
            { name: 'Duration', type: 'text', cssProperty: '--transition-duration', placeholder: '0.2s' },
            { name: 'CSS Easing', type: 'text', cssProperty: '--transition-easing', placeholder: 'ease' },
        ],
        body: [
            {
                label: 'Switch Styles',
                controls: [
                    {name: 'Switch Border', type: 'border'},
                    {name: 'Ball Border', type: 'border', selector: '.tw-categories__expander-switch', defaultCSS: { 'border-top-radius': '100px' }},
                ],
                required: { control: 'Type', value: 'switch' }
            },
            {
                label: 'Spacing',
                controls: [
                    { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true},
                    { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
                    { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
                ]
            },
            {
                label: 'Background',
                controls: [
                    { name: 'Background Color', type: 'color', cssProperty: 'background-color', nextLine: true },
                ]
            },
            {
                label: 'Styles',
                controls: [
                    { name: 'Opacity', type: 'text', cssProperty: 'opacity', placeholder: '1'},
                    { name: 'Overflow', type: 'select', placeholder: 'Visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Cursor', type: 'select', placeholder: 'Default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
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
    }

    const render = () => {
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
    }

    return {
        groupControls,
        render
    };
};