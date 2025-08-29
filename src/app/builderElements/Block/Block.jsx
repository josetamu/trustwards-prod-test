'use client';

import './Block.css';

export const Block = (node, nodeProps = {}, children, anchorAncestor = false) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName;
    const RealTag = (anchorAncestor && Tag === 'a') ? 'div' : Tag;

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
        header: [
            { name: 'Tag', type: 'super-select', value: 'div', category: 'block', JSONProperty: 'tagName'},
            { name: 'Display', type: 'super-select', value: 'flex', category: 'display', cssProperty: 'display'},
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
                    { name: '', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Font Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Text Transform', type: 'select', value: 'none', options: ['None', 'Capitalize', 'Uppercase', 'Lowercase'], cssProperty: 'text-transform' },
                    { name: 'Font Family', type: 'text', cssProperty: 'font-family' },
                    { name: 'Font Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Font Style', type: 'select', value: 'normal', options: ['Normal', 'Italic', 'Oblique'], cssProperty: 'font-style' },
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Letter Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Text Decoration', type: 'choose', category: 'decoration', cssProperty: 'text-decoration'},
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'color' },
                ]
            }
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