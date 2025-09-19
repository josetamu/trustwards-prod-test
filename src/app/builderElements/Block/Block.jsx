'use client';

import './Block.css';

export const Block = (node, nodeProps = {}, children, anchorAncestor = false) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName || 'div';
    const RealTag = (anchorAncestor && Tag === 'a') ? 'div' : Tag;

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
        header: [
            { name: 'Tag', type: 'super-select', category: 'block', JSONProperty: 'tagName', placeholder: 'div'},
            { name: 'Display', type: 'super-select', category: 'display', cssProperty: 'display', placeholder: 'flex'},
        ],
        body: [
            {
                label: 'Spacing',
                controls: [
                    { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px'},
                    { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px'},
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
                    { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
                ]
            },
            {
                
                    label: 'Text',
                    controls: [
                        { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'color' },
                        { name: 'Font', type: 'select', cssProperty: 'font-family' },
                        { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                        { name: 'Weight', type: 'select', placeholder: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight' },
                        { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                        { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                        { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                        
                    ]
                },
        ]
    }

    const render = () => {
        return (
            <RealTag key={id} {...nodeProps} {...dataAttributes} {...(node.href ? { href: node.href } : {})}>
              {children}
            </RealTag>
          )
    }

    return {
        groupControls,
        render
    };
};