'use client';

import './Banner.css';

// Export groupControls separately for use in CanvasContext
export const bannerGroupControls = {
    header: [
        { name: 'Tag', type: 'super-select', category: 'block', JSONProperty: 'tagName', placeholder: 'div'},
        { name: 'Type', type: 'select', default: 'Pop Up', options: ['Pop Up'], dataAttribute: 'data-type', notDelete: true },
        {
            name: 'Backdrop',
            type: 'switch',
            dataAttribute: 'data-backdrop',
            default: false,
        },
    ],
    body: [
        {
            label: 'Pop Up',
            controls: [
                {
                    name: 'Scale', type: 'text', cssProperty: '--popup-scale', default: '0.9',
                },
                {
                    name: 'Scale From', type: 'select', default: 'bottom', options: ['top', 'bottom', 'left', 'right'], cssProperty: '--popup-scale-from',
                },
                {
                    name: 'Scale Duration', type: 'text', cssProperty: '--popup-scale-duration', default: '0.3s',
                },
                {
                    name: 'Scale Easing', type: 'text', cssProperty: '--popup-scale-easing', default: 'cubic-bezier(0.34, 1.56, 0.64, 1)', nextLine: true,
                },
                {
                    name: 'Fade Duration', type: 'text', cssProperty: '--popup-fade-duration', default: '0.2s',
                },
                {
                    name: 'Fade Easing', type: 'text', cssProperty: '--popup-fade-easing', default: 'ease', nextLine: true,
                },
            ],
            required: { control: 'Type', value: 'Pop Up' }
        },
        {
            label: 'Pop Up Size',
            controls: [
                { name: 'Min. Width', type: 'text', cssProperty: 'min-width', autoUnit: 'px', selector: '&[data-type="Pop Up"]'},
                { name: 'Width', type: 'text', cssProperty: 'width', autoUnit: 'px', default: '100%', selector: '&[data-type="Pop Up"]'},
                { name: 'Max. Width', type: 'text', cssProperty: 'max-width', autoUnit: 'px', default: '300px', selector: '&[data-type="Pop Up"]'},
                { name: 'Min. Height', type: 'text', cssProperty: 'min-height', autoUnit: 'px', selector: '&[data-type="Pop Up"]'},
                { name: 'Height', type: 'text', cssProperty: 'height', autoUnit: 'px', default: '100%', selector: '&[data-type="Pop Up"]'},
                { name: 'Max. Height', type: 'text', cssProperty: 'max-height', autoUnit: 'px', default: '150px', selector: '&[data-type="Pop Up"]'},
            ],
            required: { control: 'Type', value: 'Pop Up' }
        },
        {
            label: 'Backdrop',
            controls: [
                {
                    name: 'Color',
                    type: 'color',
                    JSONProperty: 'backdropColor',
                    default: 'rgba(0, 0, 0, 0.75)',
                    nextLine: true,
                },
                { name: 'Blur', type: 'text', default: '10px', JSONProperty: 'backdropBlur' },
                {
                    name: 'Fade Duration', type: 'text', JSONProperty: 'backdropFadeDuration', default: '0.2s',
                },
                {
                    name: 'Fade Easing', type: 'text', JSONProperty: 'backdropFadeEasing', default: 'ease', nextLine: true,
                },
            ],
            required: { control: 'Backdrop', value: true }
        },
        {
            label: 'Layout',
            controls: [
                { name: 'Display', type: 'super-select', category: 'display', cssProperty: 'display', placeholder: 'flex', default: {
                    'display': 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'justify-content': 'center',
                }},
            ]
        },
        {
            label: 'Spacing',
            controls: [
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true},
                { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
                { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position', default: {
                    'position': 'absolute',
                    'bottom': '20px',
                    'left': '20px',
                }},
            ]
        },
        {
            label: 'Background',
            controls: [
                { name: 'Background Color', type: 'color', default: '#CCCCCC', opacity: '100%', cssProperty: 'background-color', nextLine: true },
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
                {name: 'Border', type: 'border'},
                {name: 'Shadow', type: 'box-shadow'},
                {name: 'Transition', type: 'text', cssProperty: 'transition', placeholder: 'all 0.2s ease', nextLine: true},
            ]
        },
    ]
};

export const Banner = (node, nodeProps = {}, children) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName || 'div';

    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls = bannerGroupControls;
;
    const backdropColor = node.backdropColor;
    const backdropBlur = node.backdropBlur;
    const backdropFadeDuration = node.backdropFadeDuration;
    const backdropFadeEasing = node.backdropFadeEasing;

    const render = () => {
        return (
            <div key={`${id}-overlay`} className="tw-banner-overlay" style={
                {
                    '--filter-blur': backdropBlur,
                    '--backdrop-color': backdropColor,
                    '--backdrop-fade-duration': backdropFadeDuration,
                    '--backdrop-fade-easing': backdropFadeEasing
                }
            }>
                <Tag key={id} {...nodeProps} {...dataAttributes}>
                    {children}
                </Tag>
            </div>
        )
    }

    return {
        groupControls,
        render
    };
};