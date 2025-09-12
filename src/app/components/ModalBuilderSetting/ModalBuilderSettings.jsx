import './ModalBuilderSettings.css';



export const ModalBuilderSettings = () => {
    return (
        <div className='modal-builder-settings'>
            <div className='modal-builder-settings__header'>
                <span className='modal-builder-settings__header-title'>Builder Settings</span>
                <span className='modal-builder-settings__header-close'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.55806 2.55806C2.80213 2.31398 3.19787 2.31398 3.44194 2.55806L6 5.1161L8.55805 2.55806C8.80215 2.31398 9.19785 2.31398 9.44195 2.55806C9.686 2.80213 9.686 3.19787 9.44195 3.44194L6.8839 6L9.44195 8.55805C9.686 8.80215 9.686 9.19785 9.44195 9.44195C9.19785 9.686 8.80215 9.686 8.55805 9.44195L6 6.8839L3.44194 9.44195C3.19787 9.686 2.80213 9.686 2.55806 9.44195C2.31398 9.19785 2.31398 8.80215 2.55806 8.55805L5.1161 6L2.55806 3.44194C2.31398 3.19787 2.31398 2.80213 2.55806 2.55806Z" fill="#999999"/>
                    </svg>
                </span>
            </div>
            <div className='modal-builder-settings__divider'></div>
            <div className='modal-builder-settings__content'>
                <div className='modal-builder-settings__content-tabs'>
                    <span className='modal-builder-settings__content-tab'></span>
                    <span className='modal-builder-settings__content-tab'></span>
                    <span className='modal-builder-settings__content-tab'></span>
                </div>
                <div className='modal-builder-settings__content-divider modal-builder-settings__content-divider--vertical'></div>
                <div className='modal-builder-settings__content-body'>
                </div>
            </div>
        </div>
    )
}
