'use client';

import './Image.css';

export const Image = (node, nodeProps = {}) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName;
    const src = node.src;

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
        header: [
            { name: 'Tag', type: 'select', value: 'img', options: ['img', 'figure', 'div']},
            { name: 'Image', type: 'image', JSONProperty: 'src'},

        ],
        body: [
            {
                label: 'Layout',
                controls: [
                    { name: 'Direction', type: 'choose', category: 'direction'},
                    { name: 'Justify', type: 'choose', category: 'justify'},
                    { name: 'Align', type: 'choose', category: 'align'},
                    { name: 'Wrap', type: 'select', value: 'wrap', options: ['Wrap', 'No Wrap']},
                    { name: 'Gap', type: 'text', placeholder: '0'},
                ]
            },
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
                    { name: 'Width', type: 'text'},
                    { name: 'Max. Width', type: 'text'},
                    { name: 'Height', type: 'text'},
                    { name: 'Max. Height', type: 'text'},
                ]
            },
            {
                label: 'Background',
                controls: [
                    { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
                ]
            }
        ]
    }

    const render = () => {
        return (
            <Tag key={id} {...nodeProps} {...dataAttributes} src={src}></Tag>
        )
    }

    return {
        groupControls,
        render
    };
};