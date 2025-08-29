'use client';

import './Checkbox.css';

export const Checkbox = (node, nodeProps = {}) => {
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
            { name: 'Image', type: 'image'},
            { name: 'Tag', type: 'select', value: 'div', options: ['div', 'figure', 'img']},
            { name: 'Link to', type: 'text', placeholder: 'URL...'},
            { name: 'Alt', type: 'text', placeholder: 'Alt...'},
            { name: 'Height', type: 'text'},
            { name: 'Width', type: 'text'},
            { name: 'Object Fit', type: 'select', value: 'fill', options: ['Fill', 'Contain', 'Cover', 'Scale-down', 'None']},

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
            },
            {
                label: 'Styles',
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
            <Tag key={id} {...nodeProps} {...dataAttributes}>
                <input 
                    type="checkbox" 
                    name="category"
                    className="tw-categories__expander-input tw-categories__expander-input--category"
                />
                <span 
                    className="tw-categories__expander-switch"
                />
            </Tag>
        )
    }

    return {
        groupControls,
        render
    };
};