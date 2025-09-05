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
            { name: 'Height', type: 'text', value: '2px', cssProperty: 'height', autoUnit: 'px' },
            { name: 'Width', type: 'text', value: '100%', cssProperty: 'width', autoUnit: 'px' },
            { name: 'Style', type: 'select', value: 'solid', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
            { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction'},
            { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items'},
            { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
        ],
        body: [
            {
                label: 'Style',
                controls: [
                    { name: 'Border Width', type: 'panel', cssProperty: 'border-width', autoUnit: 'px'},
                    { name: 'Border Style', type: 'select', value: 'None', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
                    { name: 'Border Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'border-color' },
                    { name: 'Border Radius', type: 'panel', cssProperty: 'border-radius', autoUnit: 'px'},
                    { name: 'Box Shadow X', type: 'text', cssProperty: 'box-shadow-x', autoUnit: 'px'},
                    { name: 'Box Shadow Y', type: 'text', cssProperty: 'box-shadow-y', autoUnit: 'px'},
                    { name: 'Blur', type: 'text', cssProperty: 'box-shadow-blur', autoUnit: 'px'},
                    { name: 'Spread', type: 'text', cssProperty: 'box-shadow-spread', autoUnit: 'px'},
                    { name: 'Box Shadow Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'box-shadow' },
                    { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                    { name: 'Z-Index', type: 'text', cssProperty: 'z-index' },
                    { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Opacity', type: 'text', value: '1', cssProperty: 'opacity' },
                    { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                    { name: 'Transform', type: 'text', cssProperty: 'transform'},
                ]
            }
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