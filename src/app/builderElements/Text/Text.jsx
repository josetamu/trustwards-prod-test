'use client';

import './Text.css';

export const Text = (node, nodeProps = {}, anchorAncestor = false) => {
    // nodeProps adds HTML id and classList

    const id = node.id;
    const Tag = node.tagName || 'h3';
    const text = node.text;


    const dataAttributes = node.attributes;
    /*
    dataAttributes format: { 'data-text': 'New Text 2' }
    we can now check for a especific attribute to do conditional HTML rendering
    any html attribute (tag, text, data-attribute) is changed on the JSONtree by right panel controls
    */

    const groupControls =  {
            header: [
                {name: 'Tag', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p', 'span'], placeholder: 'h3', JSONProperty: 'tagName'},
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
                        { name: 'Wrap', type: 'select', placeholder: 'Wrap',options: ['Wrap', 'No Wrap'], cssProperty: 'flex-wrap'},
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
                        { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'background-color' },
                    ]
                },
                {
                    label: 'Text',
                    controls: [
                        { name: 'Color', type: 'color', value: '000000', opacity: '100%', cssProperty: 'color' },
                        { name: 'Font', type: 'select', cssProperty: 'font-family', placeholder: 'Inter'},
                        { name: 'Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                        { name: 'Weight', type: 'select', placeholder: 'Medium', options: ['Thin', 'Extra Light', 'Light', 'Normal', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'], options2: ['Thin Italic', 'Extra Light Italic', 'Light Italic', 'Normal Italic', 'Medium Italic', 'Semi Bold Italic', 'Bold Italic', 'Extra Bold Italic', 'Black Italic'], cssProperty: 'font-weight' },
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
                        {name: 'Prueba', type: 'select', placeholder: 'Prueba', options: ['Prueba'], options2: ['Prueba 2'], cssProperty: 'postion'},
                    ]
                }
            ]
    }

    // Function to sanitize HTML manually without libraries
    const sanitizeHTML = (html) => {
        if (typeof window === 'undefined') return html; // SSR safety
        
        // Allowed tags (whitelist)
        const allowedTags = ['span', 'strong', 'em', 'u', 'b', 'i', 'br', 'small', 'mark', 'del', 's', 'ins', 'sub', 'sup'];
        
        // Allowed attributes
        const allowedAttributes = {
            'span': ['style', 'class'],
            'strong': ['style', 'class'],
            'em': ['style', 'class'],
            'u': ['style', 'class'],
            'b': ['style', 'class'],
            'i': ['style', 'class'],
            'small': ['style', 'class'],
            'mark': ['style', 'class'],
            'del': ['style', 'class'],
            's': ['style', 'class'],
            'ins': ['style', 'class'],
            'sub': ['style', 'class'],
            'sup': ['style', 'class'],
            'br': []
        };

        // Allowed CSS properties in inline styles
        const allowedCSSProperties = [
            'color', 'background-color', 'font-size', 'font-weight', 
            'text-decoration', 'font-style', 'font-family', 'text-align',
            'letter-spacing', 'line-height', 'text-transform', 'opacity',
            'padding', 'margin', 'display'
        ];

        // Create a temporary element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Recursive function to clean nodes
        const cleanNode = (node) => {
            // If it is a text node, return it as is
            if (node.nodeType === Node.TEXT_NODE) {
                return node.cloneNode(true);
            }

            // If it is an element node
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();

                // If the tag is not allowed, return only its text content
                if (!allowedTags.includes(tagName)) {
                    return document.createTextNode(node.textContent);
                }

                // Create a new clean element
                const cleanElement = document.createElement(tagName);

                // Copy only allowed attributes
                const allowedAttrs = allowedAttributes[tagName] || [];
                for (let attr of node.attributes) {
                    if (allowedAttrs.includes(attr.name)) {
                        // Sanitize style attribute especially
                        if (attr.name === 'style') {
                            const sanitizedStyle = sanitizeStyle(attr.value);
                            if (sanitizedStyle) {
                                cleanElement.setAttribute('style', sanitizedStyle);
                            }
                        } else if (attr.name === 'class') {
                            cleanElement.setAttribute('class', attr.value);
                        }
                    }
                }

                // Clean recursively the children
                for (let child of node.childNodes) {
                    const cleanChild = cleanNode(child);
                    if (cleanChild) {
                        cleanElement.appendChild(cleanChild);
                    }
                }

                return cleanElement;
            }

            return null;
        };

        // Function to sanitize inline styles
        const sanitizeStyle = (styleString) => {
            const styles = styleString.split(';').filter(s => s.trim());
            const cleanStyles = [];

            for (let style of styles) {
                const [property, value] = style.split(':').map(s => s.trim());
                
                if (property && value && allowedCSSProperties.includes(property.toLowerCase())) {
                    // Verify that the value does not contain javascript: or dangerous expressions
                    if (!value.toLowerCase().includes('javascript:') && 
                        !value.toLowerCase().includes('expression') &&
                        !value.toLowerCase().includes('import') &&
                        !value.toLowerCase().includes('url(javascript:')) {
                        cleanStyles.push(`${property}: ${value}`);
                    }
                }
            }

            return cleanStyles.join('; ');
        };

        // Clean all nodes
        const fragment = document.createDocumentFragment();
        for (let child of tempDiv.childNodes) {
            const cleanChild = cleanNode(child);
            if (cleanChild) {
                fragment.appendChild(cleanChild);
            }
        }

        // Create a temporary div to get the resulting HTML
        const resultDiv = document.createElement('div');
        resultDiv.appendChild(fragment);
        
        return resultDiv.innerHTML;
    };

    const render = () => {
        // Detect if the text contains HTML
        const containsHTML = /<[^>]*>/g.test(text);
        
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
                      {containsHTML 
                        ? <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />
                        : text
                      }
                    </a>
                  )
                : containsHTML 
                    ? <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />
                    : text
              }
            </Tag>
          )
    }

    return {
        groupControls,
        render
    };
};