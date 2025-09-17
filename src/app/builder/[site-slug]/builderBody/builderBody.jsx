import './builderBody.css'
import BuilderHeader from '../../../components/BuilderHeader/BuilderHeader';

import { Toolbar } from './Toolbar/Toolbar';
import { Canvas } from './Canvas/Canvas';

function BuilderBody({site, setSite, setModalType, setIsModalOpen, checkSitePicture, SiteStyle, openChangeModalSettings}) {
    return (
        <div className="tw-builder__body">
                <BuilderHeader site={site} setSite={setSite} setModalType={setModalType} setIsModalOpen={setIsModalOpen} checkSitePicture={checkSitePicture} SiteStyle={SiteStyle} openChangeModalSettings={openChangeModalSettings}/>
                <Canvas site={site}/>
                <Toolbar/>
        </div>
    )
}

export default BuilderBody;