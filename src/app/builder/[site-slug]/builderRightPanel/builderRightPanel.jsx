import './builderRightPanel.css'
import BuilderUser from '../../../components/BuilderUser/BuilderUser';
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderSave from '@components/BuilderSave/BuilderSave';
import TextControls from '@components/TextControls/TextControls';
import DividerControls from '@components/DividerControls/DividerControls';
import BlockControls from '@components/BlockControls/BlockControls';
import ImageControls from '@components/ImageControls/ImageControls';
import ControlComponent from '@components/ControlComponents/ControlComponents';

function BuilderRightPanel({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen, showNotification, siteSlug, isPanelOpen}) {
    const { activeRoot, selectedId, JSONtree } = useCanvas();

    // Function to find the element in the JSON tree
    const findElement = (node, targetId) => {
        if(!node) return null;
        if (node.id === targetId) {
            return node;
        }
        if (node.children) {
            return node.children.find(child => findElement(child, targetId));
        }
        return null;
    };

    // Function to get the selected element
    const selectedElement = findElement(JSONtree, selectedId);
    // Get the class name to know the type of the selected element
    const selectedClassName = selectedElement?.classList[0];

    const pruebaControls = {
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
        ],

/*         body: {
            label: 'Prueba',
            controls: [
                { name: 'Texto', type: 'text', value: 'Title' },
                { name: 'Texto2', type: 'text', placeholder: 'Title2' },
                { name: 'Texto3', type: 'text', value: 'Title3', placeholder: 'Title3' },
                { name: 'Select', type: 'select', value: 'opcion 1', placeholder: 'opcion 1', options: ['opcion 1', 'opcion 2', 'opcion 3'] },
                { name: 'Panel', type: 'panel'},
                { name: 'Color', type: 'color'},
                { name: 'Image', type: 'image'},
                { name: 'Choose', type: 'choose'},
            ]
        } */
    }
    
    

    return (
        <div className={`tw-builder__right-panel ${!isPanelOpen ? 'tw-builder__right-panel--closed' : ''}`}>
            <div className="tw-builder__right-header">
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification} siteSlug={siteSlug}/>
            </div>
            <div className="tw-builder__right-body">
                {/* If no element is selected(root), show the no selected item */}
                {selectedId === activeRoot && <NoSelectedItem/>}
                {/* Check the type element and show the correct controls */}
                {selectedClassName === 'tw-builder__text' && <TextControls selectedId={selectedId}/>}
                {selectedClassName === 'tw-builder__divider' && <DividerControls selectedId={selectedId}/>}
{/*                 {selectedClassName === 'tw-builder__image' && <ImageControls selectedId={selectedId}/>} */}
                {selectedClassName === 'tw-builder__block' && <BlockControls selectedId={selectedId}/>}
                {selectedClassName === 'tw-builder__image' && <ControlComponent control={pruebaControls} selectedId={selectedId}/>}
            </div>
        </div>
    )
}

export default BuilderRightPanel;