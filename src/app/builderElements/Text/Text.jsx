'use client';

import './Text.css';

export const Text = (node, nodeProps = {}, anchorAncestor = false) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName;
    const text = node.text;


    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
            header: [
                {name: 'Tag', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p', 'span'], value: 'h3', JSONProperty: 'tagName'},
               /*  { name: 'Tag', type: 'select', value: 'h3', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p', 'span'], JSONProperty: 'tagName'}, */
                { name: 'Link to', type: 'text', placeholder: 'URL...', JSONProperty: 'href'},
                { name: 'Text', type: 'textarea', placeholder: 'Text goes here...', JSONProperty: 'text'},
                
            ],
            body: [
                {
                    label: 'Layout',
                    controls: [
                        { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction'},
                        { name: 'Justify', type: 'choose', category: 'justify', cssProperty: 'justify-content'},
                        { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items'},
                        { name: 'Wrap', type: 'select', value: 'wrap', options: ['Wrap', 'No Wrap'], cssProperty: 'flex-wrap'},
                        { name: 'Gap', type: 'text', placeholder: '0', cssProperty: 'gap', autoUnit: 'px'},
                    ]
                },
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
                        { name: 'Font', type: 'text', cssProperty: 'font-family' },
                        { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                        { name: 'Weight', type: 'select', value: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight' },
                        { name: 'Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                        { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                        { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align'},
                        
                    ]
                },
                {
                    label: 'Styles',
                    controls: [
                        { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                        { name: 'Opacity', type: 'text', value: '1', cssProperty: 'opacity' },
                        { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                        { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                        {name: 'Border', type: 'border'},
                        {name: 'Shadow', type: 'box-shadow'},
                    ]
                }
            ]
    }

    const render = () => {
        return (
            <Tag
              key={id}
              {...nodeProps}
              {...dataAttributes}
              {...(Tag === 'a' && node.href ? { href: node.href } : {})}
            >
              {node.href && Tag !== 'a' && !anchorAncestor
                ? (
                    <a
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      target="_blank"
                      href={node.href}
                      tabIndex={-1}
                      onClick={e => e.preventDefault()}
                      aria-disabled="true"
                    >
                      {text}
                    </a>
                  )
                : text}
            </Tag>
          )
    }

    return {
        groupControls,
        render
    };
};