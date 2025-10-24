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
            { name: 'Image', type: 'image', nextLine2: true},
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
                    { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'color' },
                    { name: 'Font', type: 'select', cssProperty: 'font-family' },
                    { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                    
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
            },
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