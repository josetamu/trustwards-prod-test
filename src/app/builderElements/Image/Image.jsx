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
            { name: 'Tag', type: 'select', placeholder: 'img', options: ['img', 'figure', 'div'], JSONProperty: 'tagName'},
            { name: 'Image', type: 'image', JSONProperty: 'src', inline: false, inline2: true},

        ],
        body: [
            {
                label: 'Layout',
                controls: [
                    { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction'},
                    { name: 'Justify', type: 'choose', category: 'justify', cssProperty: 'justify-content'},
                    { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items'},
                    { name: 'Wrap', type: 'select', placeholder: 'Wrap', options: ['Wrap', 'No Wrap'], cssProperty: 'flex-wrap'},
                    { name: 'Gap', type: 'text', placeholder: '0', cssProperty: 'gap', autoUnit: 'px'},
                ]
            },
            {
                label: 'Spacing',
                controls: [
                    { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', inline: true},
                    { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', inline: true},
                ]
            },
            {
                label: 'Size',
                controls: [
                    { name: 'Width', type: 'text', cssProperty: 'width', autoUnit: 'px'},
                    { name: 'Max. Width', type: 'text', cssProperty: 'max-width', autoUnit: 'px'},
                    { name: 'Height', type: 'text', cssProperty: 'height', autoUnit: 'px'},
                    { name: 'Max. Height', type: 'text', cssProperty: 'max-height', autoUnit: 'px'},
                ]
            },
            {
                label: 'Background',
                controls: [
                    { name: 'Background Color', type: 'color', cssProperty: 'background-color', inline: true},
                ]
            },
            {
                label: 'Styles',
                controls: [
                    { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
                    { name: 'Opacity', type: 'text', cssProperty: 'opacity', placeholder: '1'},
                    { name: 'Overflow', type: 'select', placeholder: 'Visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Cursor', type: 'select', placeholder: 'Default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                    {name: 'Border', type: 'border'},
                    {name: 'Shadow', type: 'box-shadow'},
                    {name: 'Transition', type: 'text', cssProperty: 'transition', placeholder: 'all 0.2s ease'},
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