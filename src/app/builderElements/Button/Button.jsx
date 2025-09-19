'use client';

export const Button = (node, nodeProps = {}) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName;
    const text = node.text;

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-button': 'New Button 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
        header: [
            { name: 'Tag', type: 'select', value: 'h3', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p', 'span']},
            { name: 'Link to', type: 'text', placeholder: 'URL...'},
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
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: id, cssProperty: 'color' },
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
            <Tag key={id} {...nodeProps} {...dataAttributes}>{text}</Tag>
        )
    }

    return {
        groupControls,
        render
    };
};