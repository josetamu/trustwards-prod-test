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
            { name: 'Height', type: 'text', placeholder: '2px', cssProperty: 'height', autoUnit: 'px' },
            { name: 'Width', type: 'text', placeholder: '100%', cssProperty: 'width', autoUnit: 'px' },
            { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction'},
            { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items'},
            { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
        ],
        body: [
            {
                label: 'Style',
                controls: [
                    {name: 'Border', type: 'border'},
                    {name: 'Shadow', type: 'box-shadow'},
                    { name: 'Position', type: 'select', placeholder: 'Static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                    { name: 'Z-Index', type: 'text', cssProperty: 'z-index' },
                    { name: 'Overflow', type: 'select', placeholder: 'Visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Opacity', type: 'text', cssProperty: 'opacity', placeholder: '1' },
                    { name: 'Cursor', type: 'select', placeholder: 'Default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
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