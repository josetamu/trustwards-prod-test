import './builderRightPanel.css'
import BuilderUser from '../../../components/BuilderUser/BuilderUser';
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderSave from '@components/BuilderSave/BuilderSave';
import ControlComponent from '@components/ControlComponents/ControlComponents';

function BuilderRightPanel({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen, showNotification, siteSlug, isPanelOpen}) {
    const { selectedId, JSONtree, activeRoot } = useCanvas();

    // Function to find the element in the JSON tree
    const findElement = (node, targetId) => {
        if(!node) return null;
        if (node.id === targetId) {
            return node;
        }
        if (node.children) {
            for (const child of node.children) {
                const found = findElement(child, targetId);
                if (found) return found;
            }
        }
        return null;
    };
    let selectedElement = null;
    if(JSONtree && JSONtree.roots) {
        const activeRootNode = JSONtree.roots.find(root => root.id === activeRoot);
        if(activeRootNode) {
            selectedElement = findElement(activeRootNode, selectedId);
        }
    }

    // Function to get the selected element
    //const selectedElement = findElement(JSONtree, selectedId);
    // Get the class name to know the type of the selected element
    const selectedClassName = selectedElement?.classList[0];

    


    /* const pruebaControls = {
        header: [
            { name: 'Texto', type: 'text', value: 'Title' },
            { name: 'Texto2', type: 'text', placeholder: 'Title2' },
            { name: 'Texto3', type: 'text', value: 'Title3', placeholder: 'Title3' },
            { name: 'Select', type: 'select', value: 'opcion 3', options: ['opcion 1', 'opcion 2222', 'opcion 3333333'] },
            { name: 'Fruta', type: 'select', value: 'Manzana', options: ['Manzana', 'Pera', 'Naranja', 'Mandarina'] },
            { name: 'Panel', type: 'panel'},
            { name: 'Color', type: 'color', value: '000000', opacity: '100%'},
            { name: 'Image', type: 'image'},
            { name: 'Choose', type: 'choose', category: 'direction'},
            { name: 'Choose', type: 'choose', category: 'flex-direction'},
            { name: 'Choose', type: 'choose', category: 'align'},
            { name: 'Choose', type: 'choose', category: 'justify'},
            { name: 'Choose', type: 'choose', category: 'super-justify'},
            { name: 'Choose', type: 'choose', category: 'super-align'},
            { name: 'Choose', type: 'choose', category: 'text-align'},
            { name: 'Super Select', type: 'super-select', value: 'div', category: 'text'},
            { name: 'Super Select', type: 'super-select', value: 'flex', category: 'display'},
        ],

         body: [
        {
            label: 'Prueba',
            controls: [
                { name: 'Texto', type: 'text', value: 'Title' },
                { name: 'Texto2', type: 'text', placeholder: 'Title2' },
                { name: 'Texto3', type: 'text', value: 'Title3', placeholder: 'Title3' },
                { name: 'Select', type: 'select', value: 'opcion 3', options: ['opcion 1', 'opcion 2222', 'opcion 3333333'] },
                { name: 'Fruta', type: 'select', value: 'Manzana', options: ['Manzana', 'Pera', 'Naranja', 'Mandarina'] },
                { name: 'Panel', type: 'panel'},
                { name: 'Color', type: 'color', value: '000000', opacity: '100%'},
                { name: 'Image', type: 'image'},
                { name: 'Choose', type: 'choose', category: 'direction'},
                { name: 'Choose', type: 'choose', category: 'flex-direction'},
                { name: 'Choose', type: 'choose', category: 'align'},
                { name: 'Choose', type: 'choose', category: 'justify'},
                { name: 'Choose', type: 'choose', category: 'super-justify'},
                { name: 'Choose', type: 'choose', category: 'super-align'},
                { name: 'Choose', type: 'choose', category: 'text-align'},
                { name: 'Super Select', type: 'super-select', value: 'div', category: 'text'},
                { name: 'Super Select', type: 'super-select', value: 'flex', category: 'display'},
            ]
        } 
    ]
    } */

    const blockControls = {

        header: [
            { name: 'Tag', type: 'super-select', value: 'div', category: 'text', JSONProperty: 'tagName'},
            { name: 'Display', type: 'super-select', value: 'flex', category: 'display', cssProperty: 'display' },
        ],
        body: [
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
                    { name: '', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Font Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Text Transform', type: 'select', value: 'none', options: ['None', 'Capitalize', 'Uppercase', 'Lowercase'], cssProperty: 'text-transform' },
                    { name: 'Font Family', type: 'text', cssProperty: 'font-family' },
                    { name: 'Font Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Font Style', type: 'select', value: 'normal', options: ['Normal', 'Italic', 'Oblique'], cssProperty: 'font-style' },
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Letter Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Text Decoration', type: 'choose', category: 'decoration', cssProperty: 'text-decoration' },
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align' },
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'color' },
                ]
            }
        ]
    }

    const imageControls = {

        header: [
            { name: 'Image', type: 'image'},
            { name: 'Tag', type: 'select', value: 'div', options: ['div', 'figure', 'img'], JSONProperty: 'tagName'},
            { name: 'Link to', type: 'text', placeholder: 'URL...'},
            { name: 'Alt', type: 'text', placeholder: 'Alt...'},
            { name: 'Height', type: 'text', cssProperty: 'height', autoUnit: 'px'},
            { name: 'Width', type: 'text', cssProperty: 'width', autoUnit: 'px'},
            { name: 'Object Fit', type: 'select', value: 'fill', options: ['Fill', 'Contain', 'Cover', 'Scale-down', 'None'], cssProperty: 'object-fit' },

        ],
        body: [
            {
                label: 'Layout',
                controls: [
                    { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction' },
                    { name: 'Justify', type: 'choose', category: 'justify', cssProperty: 'justify-content' },
                    { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items' },
                    { name: 'Wrap', type: 'select', value: 'wrap', options: ['Wrap', 'No Wrap'], cssProperty: 'flex-wrap' },
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
                    { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Font Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Text Transform', type: 'select', value: 'none', options: ['None', 'Capitalize', 'Uppercase', 'Lowercase'], cssProperty: 'text-transform' },
                    { name: 'Font Family', type: 'text', cssProperty: 'font-family' },
                    { name: 'Font Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Font Style', type: 'select', value: 'normal', options: ['Normal', 'Italic', 'Oblique'], cssProperty: 'font-style' },
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Letter Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Text Decoration', type: 'choose', category: 'decoration', cssProperty: 'text-decoration' },
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align' },
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'color' },
                ]
            },
            {
                label: 'Styles',
                controls: [
                    { name: 'Border Width', type: 'panel', cssProperty: 'border-width', autoUnit: 'px'},
                    { name: 'Border Style', type: 'select', value: 'None', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
                    { name: 'Border Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'border-color' },
                    { name: 'Border Radius', type: 'panel', cssProperty: 'border-radius' },
                    { name: 'Box Shadow X', type: 'text', cssProperty: 'box-shadow-x', autoUnit: 'px'},
                    { name: 'Box Shadow Y', type: 'text', cssProperty: 'box-shadow-y', autoUnit: 'px'},
                    { name: 'Blur', type: 'text', cssProperty: 'box-shadow-blur', autoUnit: 'px'},
                    { name: 'Spread', type: 'text', cssProperty: 'box-shadow-spread', autoUnit: 'px'},
                    { name: 'Box Shadow Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'box-shadow' },
                    { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                    { name: 'Z-Index', type: 'text', cssProperty: 'z-index'},
                    { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Opacity', type: 'text', value: '1', cssProperty: 'opacity' },
                    { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                    { name: 'Transform', type: 'text', cssProperty: 'transform' },
                ]
            }
        ]
    }

    const dividerControls = {
        header: [
            { name: 'Height', type: 'text', value: '2px', cssProperty: 'height', autoUnit: 'px'},
            { name: 'Width', type: 'text', value: '100%', cssProperty: 'width', autoUnit: 'px'},
            { name: 'Style', type: 'select', value: 'solid', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
            { name: 'Align', type: 'choose', category: 'justify', cssProperty: 'align-self' },
            { name: 'Color', type: 'color', value: '#000000', opacity: '100%', elementId: selectedId, cssProperty: 'background-color' },
        ],
        body: [
            {
                label: 'Style',
                controls: [
                    { name: 'Border Width', type: 'panel', cssProperty: 'border-width', autoUnit: 'px'},
                    { name: 'Border Style', type: 'select', value: 'None', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
                    { name: 'Border Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'border-color' },
                    { name: 'Border Radius', type: 'panel', cssProperty: 'border-radius' },
                    { name: 'Box Shadow X', type: 'text', cssProperty: 'box-shadow-x', autoUnit: 'px'},
                    { name: 'Box Shadow Y', type: 'text', cssProperty: 'box-shadow-y', autoUnit: 'px'},
                    { name: 'Blur', type: 'text', cssProperty: 'box-shadow-blur', autoUnit: 'px'},
                    { name: 'Spread', type: 'text', cssProperty: 'box-shadow-spread', autoUnit: 'px'},
                    { name: 'Box Shadow Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'box-shadow' },
                    { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                    { name: 'Z-Index', type: 'text', cssProperty: 'z-index' },
                    { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Opacity', type: 'text', value: '1', cssProperty: 'opacity' },
                    { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                    { name: 'Transform', type: 'text', cssProperty: 'transform' },
                ]
            }
        ]
    }
    const textControls = {
        header: [
            { name: 'Tag', type: 'select', value: 'h3', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p', 'span'], JSONProperty: 'tagName'},
            { name: 'Link to', type: 'text', placeholder: 'URL...', JSONProperty: 'href'},
        ],
        body: [
            {
                label: 'Layout',
                controls: [
                    { name: 'Direction', type: 'choose', category: 'direction', cssProperty: 'flex-direction' },
                    { name: 'Justify', type: 'choose', category: 'justify', cssProperty: 'justify-content' },
                    { name: 'Align', type: 'choose', category: 'align', cssProperty: 'align-items' },
                    { name: 'Wrap', type: 'select', value: 'wrap', options: ['Wrap', 'No Wrap'], cssProperty: 'flex-wrap' },
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
                    { name: 'Background Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'background-color' },
                ]
            },
            {
                label: 'Text',
                controls: [
                    { name: 'Font Size', type: 'text', cssProperty: 'font-size', autoUnit: 'px'},
                    { name: 'Text Transform', type: 'select', value: 'none', options: ['None', 'Capitalize', 'Uppercase', 'Lowercase'], cssProperty: 'text-transform' },
                    { name: 'Font Family', type: 'text', cssProperty: 'font-family' },
                    { name: 'Font Weight', type: 'select', value: '500', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], cssProperty: 'font-weight' },
                    { name: 'Font Style', type: 'select', value: 'normal', options: ['Normal', 'Italic', 'Oblique'], cssProperty: 'font-style' },
                    { name: 'Line Height', type: 'text', cssProperty: 'line-height', autoUnit: 'px'},
                    { name: 'Letter Spacing', type: 'text', cssProperty: 'letter-spacing', autoUnit: 'px'},
                    { name: 'Text Decoration', type: 'choose', category: 'decoration', cssProperty: 'text-decoration' },
                    { name: 'Text Align', type: 'choose', category: 'text-align', cssProperty: 'text-align' },
                    { name: 'Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'color' },
                ]
            },
            {
                label: 'Styles',
                controls: [
                    { name: 'Border Width', type: 'panel', cssProperty: 'border-width', autoUnit: 'px'},
                    { name: 'Border Style', type: 'select', value: 'None', options: ['None', 'Hidden', 'Solid',  'Dotted', 'Dashed', 'Double', 'Groove', 'Ridge', 'Inset', 'Outset'], cssProperty: 'border-style' },
                    { name: 'Border Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'border-color' },
                    { name: 'Border Radius', type: 'panel', cssProperty: 'border-radius' },
                    { name: 'Box Shadow X', type: 'text', cssProperty: 'box-shadow-x', autoUnit: 'px'},
                    { name: 'Box Shadow Y', type: 'text', cssProperty: 'box-shadow-y', autoUnit: 'px'},
                    { name: 'Blur', type: 'text', cssProperty: 'box-shadow-blur', autoUnit: 'px'},
                    { name: 'Spread', type: 'text', cssProperty: 'box-shadow-spread', autoUnit: 'px'},
                    { name: 'Box Shadow Color', type: 'color', value: '000000', opacity: '100%', elementId: selectedId, cssProperty: 'box-shadow' },
                    { name: 'Position', type: 'select', value: 'static', options: ['Static', 'Relative', 'Absolute', 'Fixed', 'Sticky'], cssProperty: 'position' },
                    { name: 'Z-Index', type: 'text', cssProperty: 'z-index' },
                    { name: 'Overflow', type: 'select', value: 'visible', options: ['Visible', 'Hidden', 'Scroll', 'Auto'], cssProperty: 'overflow' },
                    { name: 'Opacity', type: 'text', value: '1', cssProperty: 'opacity' },
                    { name: 'Cursor', type: 'select', value: 'default', options: ['Default', 'Pointer', 'Text', 'Not Allowed', 'Grab'], cssProperty: 'cursor' },
                    { name: 'Transform', type: 'text', cssProperty: 'transform' },
                ]
            }
        ]
    }
1
    return (
        <div className={`tw-builder__right-panel ${!isPanelOpen ? 'tw-builder__right-panel--closed' : ''}`}>
            <div className="tw-builder__right-header">
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification} siteSlug={siteSlug}/>
            </div>
            <div className="tw-builder__right-body">
                {/* If no element is selected, show the no selected item */}
                {(!selectedId || selectedId === activeRoot) && <NoSelectedItem/>}
                {/* Check the type element and show the correct controls */}
                {selectedClassName === 'tw-text' && <ControlComponent control={textControls} selectedId={selectedId}/>}
                {selectedClassName === 'tw-divider' && <ControlComponent control={dividerControls} selectedId={selectedId}/>}
{/*                 {selectedClassName === 'tw-builder__image' && <ImageControls selectedId={selectedId}/>} */}
                {selectedClassName === 'tw-block' && <ControlComponent control={blockControls} selectedId={selectedId}/>}
                {selectedClassName === 'tw-image' && <ControlComponent control={imageControls} selectedId={selectedId}/>}
            </div>
        </div>
    )
}

export default BuilderRightPanel;