'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { getIconByName } from '@/lib/hugeicons';
import './Icon.css';

// Export groupControls separately for use in CanvasContext
export const iconGroupControls = {
    header: [
        { name: 'Link to', type: 'text', placeholder: 'URL...', nextLine: true},
        { 
            name: 'Icon', 
            type: 'icons', 
            dataAttribute: 'data-icon-name',
            JSONProperty: 'icon',
            default: 'AddIcon',
        },
        { name: 'Size', type: 'text', dataAttribute: 'data-icon-size', default: '24' },
        { name: 'Stroke Width', type: 'text', dataAttribute: 'data-stroke-width', default: '1.5' },
        { name: 'Color', type: 'color', default: '#000000', opacity: '100%', cssProperty: 'color', nextLine: true },
    ],
    body: [
        {
            label: 'Spacing',
            controls: [
                { name: 'Margin', type: 'panel', cssProperty: 'margin', autoUnit: 'px', nextLine: true},
                { name: 'Padding', type: 'panel', cssProperty: 'padding', autoUnit: 'px', nextLine: true},
                { name: 'Position', type: 'super-select', placeholder: 'static', cssProperty: 'position', category: 'position'},
            ]
        },
        {
            label: 'Background',
            controls: [
                { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'background-color', nextLine: true},
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

    const groupControls = iconGroupControls;

    const render = () => {
        // Get icon configuration from data attributes (with safe fallbacks)
        const iconName = (dataAttributes && dataAttributes['data-icon-name']) || 'AddIcon';
        const iconSize = parseInt((dataAttributes && dataAttributes['data-icon-size'])) || 24;
        const strokeWidth = parseFloat((dataAttributes && dataAttributes['data-stroke-width'])) || 1.5;
        
        // Get the icon object from HugeIcons
        const selectedIcon = getIconByName(iconName);
        
        return (
            <Tag key={id} {...nodeProps} {...(dataAttributes || {})}>
                <HugeiconsIcon 
                    icon={selectedIcon} 
                    size={iconSize} 
                    color="currentColor" 
                    strokeWidth={strokeWidth} 
                />
            </Tag>
        )
    }

    return {
        groupControls,
        render
    };
};