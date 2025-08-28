'use client';

import './Modal.css';

export const Modal = (node, nodeProps = {}, children) => {
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
                    { name: 'Font Size', type: 'text' },
                    { name: 'Text Transform', type: 'select', value: 'none', options: ['None', 'Capitalize', 'Uppercase', 'Lowercase'] },
                    { name: 'Font Family', type: 'text' },
                    { name: 'Font Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                    { name: 'Font Style', type: 'select', value: 'normal', options: ['Normal', 'Italic', 'Oblique'] },
                    { name: 'Line Height', type: 'text' },
                    { name: 'Letter Spacing', type: 'text' },
                    { name: 'Text Decoration', type: 'choose', category: 'decoration'},
                    { name: 'Text Align', type: 'choose', category: 'text-align'},
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'color' },
                ]
            }
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