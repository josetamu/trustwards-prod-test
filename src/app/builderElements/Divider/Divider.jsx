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
            { name: 'Height', type: 'text', value: '2px' },
            { name: 'Width', type: 'text', value: '100%' },
            { name: 'Style', type: 'select', value: 'solid', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'] },
            { name: 'Direction', type: 'choose', category: 'direction'},
            { name: 'Align', type: 'choose', category: 'align'},
            { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
        ],
        body: [
            {
                label: 'Style',
                controls: [
                    { name: 'Border Width', type: 'panel'},
                    { name: 'Border Style', type: 'select', value: 'None', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'] },
                    { name: 'Border Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'border-color' },
                    { name: 'Border Radius', type: 'panel'},
                    { name: 'Box Shadow X', type: 'text' },
                    { name: 'Box Shadow Y', type: 'text' },
                    { name: 'Blur', type: 'text' },
                    { name: 'Spread', type: 'text' },
                    { name: 'Box Shadow Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'box-shadow' },
                    { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'] },
                    { name: 'Z-Index', type: 'text' },
                    { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'] },
                    { name: 'Opacity', type: 'text', value: '1' },
                    { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'] },
                    { name: 'Transform', type: 'text'},
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