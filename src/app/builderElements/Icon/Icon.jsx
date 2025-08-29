'use client';

import './Icon.css';

export const Icon = (node, nodeProps = {}) => {
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="currentColor" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C12.6904 2.75 13.25 3.30964 13.25 4V10.75H20C20.6904 10.75 21.25 11.3096 21.25 12C21.25 12.6904 20.6904 13.25 20 13.25H13.25V20C13.25 20.6904 12.6904 21.25 12 21.25C11.3096 21.25 10.75 20.6904 10.75 20V13.25H4C3.30964 13.25 2.75 12.6904 2.75 12C2.75 11.3096 3.30964 10.75 4 10.75H10.75V4C10.75 3.30964 11.3096 2.75 12 2.75Z" fill="currentColor" />
                </svg>
            </Tag>
        )
    }

    return {
        groupControls,
        render
    };
};