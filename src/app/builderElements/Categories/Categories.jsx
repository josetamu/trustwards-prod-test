'use client';

import './Categories.css';

export const Categories = (node, nodeProps = {}, children) => {
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
            { name: 'Tag', type: 'super-select', value: 'div', category: 'text'},
            { name: 'Display', type: 'super-select', value: 'flex', category: 'display'},
        ],
        body: [
            {
                label: 'Spacing',
                controls: [
                    { name: 'Padding', type: 'panel'},
                    { name: 'Margin', type: 'panel'},
                ]
            },
            {
                label: 'Size',
                controls: [
                    { name: 'Width', type: 'text' },
                    { name: 'Max. Width', type: 'text' },
                    { name: 'Height', type: 'text' },
                    { name: 'Max. Height', type: 'text' },
                ]
            },
            {
                label: 'Background',
                controls: [
                    { name: '', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'color' },
                    { name: 'Font', type: 'select', cssProperty: 'font-family' },
                    { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                    
                ]
            },
        ]
    }

    const render = () => {
        return (
            <Tag key={id} {...nodeProps} {...dataAttributes}>{children}</Tag>
        )
    }

    return {
        groupControls,
        render
    };
};