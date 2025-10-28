'use client';

// Export groupControls separately for use in CanvasContext
export const buttonGroupControls = {
    header: [
        { name: 'Link to', type: 'text', placeholder: 'URL...', JSONProperty: 'href', nextLine: true},
    ],
    body: [
        {
            label: 'Spacing',
            controls: [
                { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true, default: { 'padding-top': '6px', 'padding-bottom': '6px', 'padding-left': '12px', 'padding-right': '12px' } },
                { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
            ]
        },
        {
            label: 'Size',
            controls: [
                { name: 'Min. Width', type: 'text', cssProperty: 'min-width', autoUnit: 'px'},
                { name: 'Width', type: 'text', cssProperty: 'width', autoUnit: 'px'},
                { name: 'Max. Width', type: 'text', cssProperty: 'max-width', autoUnit: 'px'},
                { name: 'Min. Height', type: 'text', cssProperty: 'min-height', autoUnit: 'px'},
                { name: 'Height', type: 'text', cssProperty: 'height', autoUnit: 'px'},
                { name: 'Max. Height', type: 'text', cssProperty: 'max-height', autoUnit: 'px'},
            ]
        },
        {
            label: 'Background',
            controls: [
                { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'background-color', nextLine: true },
            ]
        },
        {
            label: 'Text',
            controls: [
                { name: 'Color', type: 'color', cssProperty: 'color', nextLine: true, default: '#ffffff'},
                { name: 'Font', type: 'select', cssProperty: 'font-family', placeholder: 'Inter'},
                { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px', default: '14px'},
                { name: 'Weight', type: 'select', placeholder: 'Medium', default: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight' },
                { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                
            ]
        },
        {
            label: 'Styles',
            controls: [
                { name: 'Opacity', type: 'text', cssProperty: 'opacity', placeholder: '1'},
                { name: 'Overflow', type: 'select', placeholder: 'Visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                { name: 'Cursor', type: 'select', placeholder: 'Default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                {
                    name: 'Mix blend mode',
                    type: 'select',
                    placeholder: 'normal',
                    options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
                    cssProperty: 'mix-blend-mode'
                },
                {name: 'Border', type: 'border', default: { 'border-radius': '8px' } },
                {name: 'Shadow', type: 'box-shadow'},
                {name: 'Transition', type: 'text', cssProperty: 'transition', placeholder: 'all 0.2s ease', nextLine: true},
            ]
        },
    ]
};

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

    const groupControls = buttonGroupControls;

    const render = () => {
        return (
            <Tag key={id} {...nodeProps} {...dataAttributes} {...(node.href ? { href: node.href } : {})}>
                {text}
            </Tag>
        )
    }

    return {
        groupControls,
        render
    };
};