import './builderRightPanel.css'
import BuilderUser from '../../../components/BuilderUser/BuilderUser';
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderSave from '@components/BuilderSave/BuilderSave';
import TextControls from '@components/TextControls/TextControls';
import DividerControls from '@components/DividerControls/DividerControls';

function BuilderRightPanel({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen, showNotification, siteSlug, isPanelOpen}) {
    const { selectedId, JSONtree } = useCanvas();


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

    const selectedElement = findElement(JSONtree, selectedId);
    const selectedClassName = selectedElement?.className;
    const selectedTagName = selectedElement?.tagName;
    
    

    return (
        <div className={`tw-builder__right-panel ${!isPanelOpen ? 'tw-builder__right-panel--closed' : ''}`}>
            <div className="tw-builder__right-header">
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification} siteSlug={siteSlug}/>
            </div>
            <div className="tw-builder__right-body">
                {selectedId === 'tw-root' && <NoSelectedItem/>}
                {selectedId !== 'tw-root' && selectedTagName === 'div' && <div className="tw-builder__settings">
                    <h1>Div</h1>
                </div>}
                {selectedClassName === 'tw-builder__text' && <TextControls selectedId={selectedId}/>}
                {selectedTagName === 'h1' && <DividerControls selectedId={selectedId}/>}

            </div>
        </div>
    )
}

export default BuilderRightPanel;