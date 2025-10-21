'use client';

import './Divider.css';

export const Divider = (node, nodeProps = {}) => {
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
            { name: 'Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'background-color' },
        ],
        body: [
            {
                label: 'Spacing',
                controls: [
                    { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px'},
                    { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px'},
                    { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
                ]
            },
            {
                label: 'Size',
                controls: [
                    { name: 'Min. Width', type: 'text', cssProperty: 'min-width', autoUnit: 'px'},
                    { name: 'Width', type: 'text', cssProperty: 'width', autoUnit: 'px'},
                    { name: 'Max. Width', type: 'text', cssProperty: 'max-width', autoUnit: 'px'},
                    { name: 'Min. Height', type: 'text', cssProperty: 'min-height', autoUnit: 'px'},
                    { name: 'Height', type: 'text', cssProperty: 'height', autoUnit: 'px'},
                    { name: 'Max. Height', type: 'text', cssProperty: 'max-height', autoUnit: 'px'},
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
                        defaultValue: 'normal',
                        options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
                        cssProperty: 'mix-blend-mode'
                    },
                    {name: 'Border', type: 'border'},
                    {name: 'Shadow', type: 'box-shadow'},
                    {name: 'Transition', type: 'text', cssProperty: 'transition', placeholder: 'all 0.2s ease'},
                ]
            },
        ]
    }

    const render = () => {
        return (
            <Tag key={id} {...nodeProps} {...dataAttributes}></Tag>
        )
    }

    return {
        groupControls,
        render
    };
};