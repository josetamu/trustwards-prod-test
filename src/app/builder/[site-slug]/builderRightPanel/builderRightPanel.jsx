import './builderRightPanel.css'
import BuilderUser from '../../../components/BuilderUser/BuilderUser';
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderSave from '@components/BuilderSave/BuilderSave';
import ControlComponent from '@components/ControlComponents/ControlComponents';

//Import builderElements
import { Block } from '@builderElements/Block/Block';
import { Image } from '@builderElements/Image/Image';
import { Text } from '@builderElements/Text/Text';
import { Divider } from '@builderElements/Divider/Divider';
import { Button } from '@builderElements/Button/Button';
import { Categories } from '@builderElements/Categories/Categories';
import { Checkbox } from '@builderElements/Checkbox/Checkbox';
import { Icon } from '@builderElements/Icon/Icon';



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
    const selectedLabel = selectedElement?.label;
    const selectedType = selectedElement?.elementType;

    const getControls = (selectedType) => {

        const tempNode = {
            id: selectedId,
            tagName: 'div', 
            attributes: {},
            classList: [],
            text: '',
            src: ''
        }

        switch(selectedType) {
            case 'block':
                return Block(tempNode, {}, []).groupControls;
            case 'image':
                return Image(tempNode, {}, []).groupControls;
            case 'text':
                return Text(tempNode, {}, []).groupControls;
            case 'divider':
                return Divider(tempNode, {}, []).groupControls;
            case 'button':
                return Button(tempNode, {}, []).groupControls;
            case 'categories':
                return Categories(tempNode, {}, []).groupControls;
            case 'checkbox':
                return Checkbox(tempNode, {}, []).groupControls;
            case 'icon':
                return Icon(tempNode, {}, []).groupControls;

            default:
                return null;
        }
    };

    const currentControls = getControls(selectedType);



    return (
        <div className={`tw-builder__right-panel ${!isPanelOpen ? 'tw-builder__right-panel--closed' : ''}`}>
            <div className="tw-builder__right-header">
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification} siteSlug={siteSlug}/>
            </div>
            <div className="tw-builder__right-body">
                {/* If no element is selected, show the no selected item */}
                {(!selectedId || selectedId === 'tw-root--banner' || selectedId === 'tw-root--model') && <NoSelectedItem/>}
                {/* Check the type element and show the correct controls */}
                {currentControls && <ControlComponent control={currentControls} selectedId={selectedId} showNotification={showNotification} selectedLabel={selectedLabel}/>}               
            </div>
        </div>
    )
}

export default BuilderRightPanel;