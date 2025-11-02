'use client';

import './Categories.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { getIconByName } from '@/lib/hugeicons';

// Helper function to generate categoriesGroupControls with opacity logic
const getCategoriesGroupControls = (categoriesScanned = []) => ({
    header: [
        { name: 'Tag', type: 'super-select', category: 'block', JSONProperty: 'tagName', placeholder: 'div'},
        { name: 'Display', type: 'super-select', category: 'display', cssProperty: 'display', placeholder: 'block', default: 'block'},
    ],
    body: [
        {
            label: 'Spacing',
            controls: [
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true},
                { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
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

        /*Category Items*/
        { type: 'separator' },
        { type: 'label', text: 'Category Items' },

        { type: 'repeater', controls: [
            {
                label: 'Functional',
                itemStyle: categoriesScanned.includes('Functional') ? undefined : { opacity: 0.5 },
                controls: [
                    { name: 'Title', type: 'text', JSONProperty: 'functionalTitle', nextLine: true, default: 'Functional'},
                    { name: 'Description', type: 'textarea', JSONProperty: 'functionalDescription', nextLine: true,
                        default: 'These cookies are essential in order to use the website and its features.'
                    },
                ]
            },
            {
                label: 'Analytics',
                itemStyle: categoriesScanned.includes('Analytics') ? undefined : { opacity: 0.5 },
                controls: [
                    { name: 'Title', type: 'text', JSONProperty: 'analyticsTitle', nextLine: true, default: 'Analytics'},
                    { name: 'Description', type: 'textarea', JSONProperty: 'analyticsDescription', nextLine: true,
                        default: 'Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data is used to improve the user experience and optimize our services.'
                    },
                ]
            },
            {
                label: 'Marketing',
                itemStyle: categoriesScanned.includes('Marketing') ? undefined : { opacity: 0.5 },
                controls: [
                    { name: 'Title', type: 'text', JSONProperty: 'marketingTitle', nextLine: true, default: 'Marketing'},
                    { name: 'Description', type: 'textarea', JSONProperty: 'marketingDescription', nextLine: true,
                        default: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.'
                    },
                ]
            },
            {
                label: 'Other',
                itemStyle: categoriesScanned.includes('Other') ? undefined : { opacity: 0.5 },
                controls: [
                    { name: 'Title', type: 'text', JSONProperty: 'otherTitle', nextLine: true, default: 'Other'},
                    { name: 'Description', type: 'textarea', JSONProperty: 'otherDescription', nextLine: true,
                        default: 'Other cookies are used to collect information about how you use our site, while you are on it. This includes information about the pages you view, the links you click and other actions you take on our site.'
                    },
                ]
            },
        ]},

        {
            label: 'Header',
            controls: [
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true, selector: '.tw-categories__expander-header'},
                { name: 'Justify', type: 'choose', category: 'super-justify', cssProperty: 'justify-content', nextLine: true, selector: '.tw-categories__expander-header', default: 'space-between' },
                { name: 'Align', type: 'choose', category: 'super-align', cssProperty: 'align-items', nextLine: true, selector: '.tw-categories__expander-header', default: 'center' },
                { name: 'Direction', type: 'choose', category: 'flex-direction', cssProperty: 'flex-direction', selector: '.tw-categories__expander-header' },
                { name: 'Wrap', type: 'select', placeholder: 'nowrap', options: ['nowrap', 'wrap', 'wrap-reverse'], cssProperty: 'flex-wrap', selector: '.tw-categories__expander-header' },
                { name: 'Column Gap', type: 'text', cssProperty: 'column-gap', autoUnit: 'px', selector: '.tw-categories__expander-header' },
                { name: 'Row Gap', type: 'text', cssProperty: 'row-gap', autoUnit: 'px', selector: '.tw-categories__expander-header' },
            ],
        },
        {
            label: 'Icon + Title',
            controls: [
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true, selector: '.tw-categories__expander-header-title'},
                { name: 'Justify', type: 'choose', category: 'super-justify', cssProperty: 'justify-content', nextLine: true, selector: '.tw-categories__expander-header-title' },
                { name: 'Align', type: 'choose', category: 'super-align', cssProperty: 'align-items', nextLine: true, selector: '.tw-categories__expander-header-title', default: 'center' },
                { name: 'Direction', type: 'choose', category: 'flex-direction', cssProperty: 'flex-direction', selector: '.tw-categories__expander-header-title' },
                { name: 'Wrap', type: 'select', placeholder: 'nowrap', options: ['nowrap', 'wrap', 'wrap-reverse'], cssProperty: 'flex-wrap', selector: '.tw-categories__expander-header-title' },
                { name: 'Column Gap', type: 'text', cssProperty: 'column-gap', autoUnit: 'px', selector: '.tw-categories__expander-header-title', default: '10px' },
                { name: 'Row Gap', type: 'text', cssProperty: 'row-gap', autoUnit: 'px', selector: '.tw-categories__expander-header-title' },
            ],
        },
        {
            label: 'Icon',
            controls: [
                { 
                    name: 'Icon', 
                    type: 'icons', 
                    dataAttribute: 'data-icon-name',
                    JSONProperty: 'icon',
                    default: 'AddIcon',
                },
                { name: 'Size', type: 'text', dataAttribute: 'data-icon-size', default: '24' },
                { name: 'Stroke Width', type: 'text', dataAttribute: 'data-stroke-width', default: '1.5' },
                { name: 'Color', type: 'color', default: '#000000', opacity: '100%', cssProperty: 'color', nextLine: true, selector: '.tw-categories__expander-icon' },
            ],
        },
        {
            label: 'Title',
            controls: [
                { name: 'Color', type: 'color', cssProperty: 'color', nextLine: true, default: '#000000', opacity: '100%', selector: '.tw-categories__expander-title'},
                { name: 'Font', type: 'select', cssProperty: 'font-family', placeholder: 'Inter', selector: '.tw-categories__expander-title'},
                { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px', selector: '.tw-categories__expander-title'},
                { name: 'Weight', type: 'select', placeholder: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight', selector: '.tw-categories__expander-title' },
                { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px', selector: '.tw-categories__expander-title'},
                { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px', selector: '.tw-categories__expander-title'},
                { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align', selector: '.tw-categories__expander-title'},
                
            ]
        },
        {
            label: 'Checkbox',
            controls: [
                { 
                    name: 'Type', 
                    type: 'select', 
                    options: ['switch', 'checkbox'], 
                    dataAttribute: 'data-type', 
                    default: 'switch', 
                    notDelete: true
                },
                { name: 'Functional Opacity', type: 'text', cssProperty: 'opacity', default: '0.5', selector: '.tw-checkbox[data-functional-opacity]'},
                { 
                    name: 'Disabled Color', 
                    type: 'color', 
                    cssProperty: '--disabled-color', 
                    default: '#555555', 
                    nextLine: true,
                    selector: '.tw-categories__expander-checkbox'
                },
                { 
                    name: 'Enabled Color', 
                    type: 'color', 
                    cssProperty: '--enabled-color', 
                    default: '#0099FE', 
                    nextLine: true, 
                    selector: '.tw-categories__expander-checkbox'
                },

                /*Switch*/
                {
                    name: 'Circle Color',
                    type: 'color',
                    cssProperty: 'background-color',
                    selector: '.tw-categories__expander-switch',
                    default: '#FFFFFF',
                    nextLine: true,
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Width',
                    type: 'text',
                    cssProperty: 'width',
                    autoUnit: 'px',
                    default: '26px',
                    selector: '.tw-categories__expander-checkbox[data-type="switch"]',
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Height',
                    type: 'text',
                    cssProperty: '--height',
                    autoUnit: 'px',
                    default: '16px',
                    selector: '.tw-categories__expander-checkbox[data-type="switch"]',
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Switch Spacing', 
                    type: 'text', 
                    cssProperty: '--switch-spacing',
                    default: '2px',
                    autoUnit: 'px',
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Switch Border', 
                    type: 'border',
                    selector: '.tw-categories__expander-checkbox[data-type="switch"]',
                    default: {
                        'border-radius': '100px',
                    },
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Circle Border', 
                    type: 'border',
                    selector: '.tw-categories__expander-switch',
                    default: {
                        'border-radius': '100px',
                    },
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Switch Shadow',
                    type: 'box-shadow',
                    selector: '.tw-categories__expander-checkbox[data-type="switch"]',
                    required: { control: 'Type', value: 'switch' }
                },
                {
                    name: 'Circle Shadow',
                    type: 'box-shadow',
                    selector: '.tw-categories__expander-switch',
                    default: {
                        'box-shadow': '0px 0px 4px 4px #00000020',
                    },
                    required: { control: 'Type', value: 'switch' }
                },

                /*Checkbox*/
                {
                    name: 'Box Size',
                    type: 'text',
                    cssProperty: '--size',
                    autoUnit: 'px',
                    default: '25px',
                    selector: '.tw-categories__expander-checkbox[data-type="checkbox"]',
                    required: { control: 'Type', value: 'checkbox' }
                },
                {
                    name: 'Check Size',
                    type: 'text',
                    cssProperty: '--check-size',
                    autoUnit: 'px',
                    default: '20px',
                    selector: '.tw-categories__expander-checkbox[data-type="checkbox"]',
                    required: { control: 'Type', value: 'checkbox' }
                },
                {
                    name: 'Box Border', 
                    type: 'border',
                    selector: '.tw-categories__expander-checkbox',
                    default: {
                        'border-radius': '8px',
                    },
                    required: { control: 'Type', value: 'checkbox' }
                },
                {
                    name: 'Box Shadow',
                    type: 'box-shadow',
                    selector: '.tw-categories__expander-checkbox',
                    required: { control: 'Type', value: 'checkbox' }
                },
                {
                    name: 'Check Stroke',
                    type: 'text',
                    cssProperty: '--check-stroke-width',
                    autoUnit: 'px',
                    default: '3px',
                    selector: '.tw-categories__expander-checkbox[data-type="checkbox"]',
                    required: { control: 'Type', value: 'checkbox' }
                },
                {
                    name: 'Check Color',
                    type: 'color',
                    cssProperty: '--check-color',
                    default: '#FFFFFF',
                    selector: '.tw-categories__expander-checkbox svg',
                    nextLine: true,
                    required: { control: 'Type', value: 'checkbox' }
                },

                { 
                    name: 'Enable Duration', 
                    type: 'text', 
                    cssProperty: '--transition-duration', 
                    default: '0.2s', 
                },
                { 
                    name: 'Enable Easing', 
                    type: 'text', 
                    cssProperty: '--transition-easing', 
                    default: 'ease', 
                    nextLine: true,
                },
            ],
        },
        {
            label: 'Content',
            controls: [
                { name: 'Color', type: 'color', cssProperty: 'color', nextLine: true, default: '#000000', opacity: '100%', selector: '.tw-categories__expander-paragraph'},
                { name: 'Font', type: 'select', cssProperty: 'font-family', placeholder: 'Inter', selector: '.tw-categories__expander-paragraph'},
                { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px', selector: '.tw-categories__expander-paragraph'},
                { name: 'Weight', type: 'select', placeholder: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight', selector: '.tw-categories__expander-paragraph' },
                { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px', selector: '.tw-categories__expander-paragraph'},
                { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px', selector: '.tw-categories__expander-paragraph'},
                { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align', selector: '.tw-categories__expander-paragraph'},
                
            ]
        },
        {
            label: 'Collapse Animation',
            controls: [
                {
                    name: 'Icon Rotation',
                    type: 'text',
                    cssProperty: '--expanded-icon-rotate',
                    default: '45deg',
                    autoUnit: 'deg',
                },
                {
                    name: 'Icon Duration',
                    type: 'text',
                    cssProperty: '--expanded-icon-duration',
                    default: '0.2s',
                    autoUnit: 's',
                },
                {
                    name: 'Icon Easing',
                    type: 'text',
                    cssProperty: '--expanded-icon-easing',
                    default: 'ease',
                    nextLine: true,
                },
                {
                    name: 'Expand Duration',
                    type: 'text',
                    cssProperty: '--expand-duration',
                    default: '0.2s',
                    autoUnit: 's',
                },
                {
                    name: 'Expand Easing',
                    type: 'text',
                    cssProperty: '--expand-easing',
                    default: 'ease',
                    nextLine: true,
                },
            ],
        },
    ]
});

// Export groupControls as a function instead to add opacity 0.5 to repeater items if not found
export const categoriesGroupControls = (node = null) => {
    const categoriesScanned = node?.categoriesScanned || [];
    return getCategoriesGroupControls(categoriesScanned);
};

export const Categories = (node, nodeProps = {}) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName || 'div';
    const dataAttributes = node.attributes;
    const groupControls = categoriesGroupControls(node);

    const render = () => {
        // Get icon configuration from data attributes (with safe fallbacks)
        const iconName = (dataAttributes && dataAttributes['data-icon-name']) || 'AddIcon';
        const iconSize = parseInt((dataAttributes && dataAttributes['data-icon-size'])) || 24;
        const strokeWidth = parseFloat((dataAttributes && dataAttributes['data-stroke-width'])) || 1.5;
        
        // Get the icon object from HugeIcons
        const selectedIcon = getIconByName(iconName);

        //Get checkbox type
        const checkboxType = (dataAttributes && dataAttributes['data-type']);

        // Get categories from node.categoriesScanned
        const categories = (Array.isArray(node.categoriesScanned) && node.categoriesScanned.length > 0) 
            ? node.categoriesScanned 
            : ['Functional'];

        // Map categories to their JSON properties
        const categoryDataMap = {
            'Functional': {
                title: node.functionalTitle || 'Functional',
                description: node.functionalDescription || 'These cookies are essential in order to use the website and its features.'
            },
            'Analytics': {
                title: node.analyticsTitle || 'Analytics',
                description: node.analyticsDescription || 'Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data is used to improve the user experience and optimize our services.'
            },
            'Marketing': {
                title: node.marketingTitle || 'Marketing',
                description: node.marketingDescription || 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.'
            },
            'Other': {
                title: node.otherTitle || 'Other',
                description: node.otherDescription || 'Other cookies are used to collect information about how you use our site, while you are on it. This includes information about the pages you view, the links you click and other actions you take on our site.'
            }
        };

        return (
            <Tag key={id} {...nodeProps} {...dataAttributes}>
                {categories.map((category, index) => {
                    const categoryData = categoryDataMap[category];
                    
                    return (
                        <div key={`${id}-${category}-${index}`} className="tw-categories__expander">
                            <div className="tw-categories__expander-header">

                                <div className="tw-categories__expander-header-title">

                                    <HugeiconsIcon
                                        className="tw-categories__expander-icon"
                                        icon={selectedIcon} 
                                        size={iconSize} 
                                        color="currentColor" 
                                        strokeWidth={strokeWidth} 
                                    />
                                    <span className="tw-categories__expander-title">{categoryData.title}</span>

                                </div>
                                <div {...(category === 'Functional' ? { 'data-functional-opacity': '' } : {})} className="tw-checkbox tw-categories__expander-checkbox tw-categories__expander-checkbox--category" data-type={checkboxType}>
                                    {checkboxType === 'switch' ? (
                                        <>
                                            <input 
                                                type="checkbox" 
                                                name={categoryData.title.toLowerCase()}
                                                className="tw-categories__expander-input tw-categories__expander-input--category"
                                                {...(category === 'Functional' ? { disabled: true, checked: true } : {})}
                                            />
                                            <span 
                                                className="tw-categories__expander-switch"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="checkbox"
                                                name={categoryData.title.toLowerCase()}
                                                className="tw-categories__expander-input"
                                                id={`${id}-${category}-checkbox-input`}
                                                {...(category === 'Functional' ? { disabled: true, checked: true } : {})}
                                            />
                                            <label className="tw-categories__expander-checkbox" htmlFor={`${id}-${category}-checkbox-input`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                                    <path d="M4.25 13.5L8.75 18L19.75 6" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </label>
                                        </>
                                    )}
                                </div>

                            </div>
                            <div className="tw-categories__expander-content">
                                <div className="tw-categories__expander-paragraph">{categoryData.description}</div>
                            </div>
                        </div>
                    );
                })}
            </Tag>
        )
    }

    return {
        groupControls,
        render
    };
};