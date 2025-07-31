import './builderRightPanel.css'
import BuilderUser from '../../../components/BuilderUser/BuilderUser';
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';
import { useCanvas } from '@contexts/CanvasContext';
import BuilderSave from '@components/BuilderSave/BuilderSave';
import TextControls from '@components/TextControls/TextControls';

function BuilderRightPanel({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen, showNotification}) {
    const { selectedId, JSONtree } = useCanvas();

    const findElement = (node, targetId) => {
        if (node.id === targetId) {
            return node;
        }
        if (node.children) {
            return node.children.find(child => findElement(child, targetId));
        }
        return null;
    };

    const selectedElement = findElement(JSONtree, selectedId);
    const selectedTagName = selectedElement?.tagName;
    
    

    return (
        <div className="tw-builder__right-panel">
            <div className="tw-builder__right-header">
                <BuilderUser user={user} checkProfilePicture={checkProfilePicture} profileStyle={profileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen}></BuilderUser>
                <BuilderSave showNotification={showNotification}/>
            </div>
            <div className="tw-builder__right-body">
                {selectedId === 'tw-root' && <NoSelectedItem/>}
                {selectedId !== 'tw-root' && selectedTagName === 'div' && <div className="tw-builder__settings">
                    <h1>Div</h1>
                </div>}
                {selectedTagName === 'h1' && <TextControls selectedId={selectedId}/>}

            </div>
        </div>
    )
}

export default BuilderRightPanel;