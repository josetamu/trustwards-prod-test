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
        //If the node is not found, return null
        if(!node) return null;
        //If find the element, return it
        if (node.id === targetId) {
            return node;
        }
        //If the element has children, search through them
        if (node.children) {
            for (const child of node.children) {
                const found = findElement(child, targetId);
                if (found) return found;
            }
        }
        //If nothing is found, return null
        return null;
    };

    //Find the selected element and store it selectedElement, if not set it to null
    let selectedElement = null;
    if(JSONtree && JSONtree.roots) {
        const activeRootNode = JSONtree.roots.find(root => root.id === activeRoot);
        if(activeRootNode) {
            selectedElement = findElement(activeRootNode, selectedId);
        }
    }

    //get the label and type of the selected element
    const selectedLabel = selectedElement?.label;
    const selectedType = selectedElement?.elementType;

    const getControls = (selectedType) => {
//Create a temporary node to get the controls
        const tempNode = {
            id: selectedId,
            tagName: 'div', 
            attributes: {},
            classList: [],
            text: '',
            src: ''
        }

        //Switch the type of the selected element and return the correct controls
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

    //Store the controls for the selected element to use in ControlComponent react element
    const currentControls = getControls(selectedType);



    return (
        <div className={`tw-builder__right-panel ${!isPanelOpen ? 'tw-builder__right-panel--closed' : ''}`}>
            <div className="tw-builder__right-header">
                {/* React element for right panel header: Avatar and save builder button */}
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification} siteSlug={siteSlug}/>
            </div>
            <div className="tw-builder__right-body">
                <div className="tw-builder__right-body-content">
                {/* If no element is selected, show the NoSelectedItem react element */}
                {(!selectedId || selectedId === 'tw-root--banner' || selectedId === 'tw-root--model') && <NoSelectedItem/>}
                    {/* Check the type element and show the correct controls */}
                    {currentControls && <ControlComponent control={currentControls} selectedId={selectedId} showNotification={showNotification} selectedLabel={selectedLabel}/>}               
                </div>
            </div>
        </div>
    )
}

export default BuilderRightPanel;