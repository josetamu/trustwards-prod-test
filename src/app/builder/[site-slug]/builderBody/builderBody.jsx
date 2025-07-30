import './builderBody.css'
import { useState, useRef } from 'react';
import { supabase } from '../../../../supabase/supabaseClient';
import BuilderHeader from '../../../components/BuilderHeader/BuilderHeader';

function BuilderBody({site, setSite, setModalType, setIsModalOpen, checkSitePicture, SiteStyle, openChangeModalSettings}) {


    return (
        <div className="tw-builder__body">
            <div className="tw-builder__header">
                <BuilderHeader site={site} setSite={setSite} setModalType={setModalType} setIsModalOpen={setIsModalOpen} checkSitePicture={checkSitePicture} SiteStyle={SiteStyle} openChangeModalSettings={openChangeModalSettings}/>
            </div>
            <div className="tw-builder__canvas"></div>
            <div className="tw-builder__toolbar"></div>
        </div>
    )
}

export default BuilderBody;