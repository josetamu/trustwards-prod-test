import './builderRightPanel.css'
import NoSelectedItem from '../../../components/NoSelectedItem/NoSelectedItem';

function BuilderRightPanel() {
    return (
        <div className="tw-builder__right-panel">
            <div className="tw-builder__right-header">
{/*             <HeaderProfile></HeaderProfile>
                <SaveBuilder></SaveBuilder> */}
                <div className="prueba"></div>
                <div className="prueba"></div>
            </div>
            <div className="tw-builder__right-body">
                <NoSelectedItem/>
            </div>
        </div>
    )
}

export default BuilderRightPanel;