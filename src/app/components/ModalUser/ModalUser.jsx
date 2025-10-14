import './ModalUser.css';

import { ModalAccount } from '@components/ModalAccount/ModalAccount';
import { ModalAppearance } from '@components/ModalAppearance/ModalAppearance';
import ModalBilling from '@components/ModalBilling/ModalBilling';

export function ModalUser({onSave, user, setUser, setIsModalOpen, appearanceSettings, setAppearanceSettings, userSettings, setUserSettings, openChangeModal, avatarColors, checkProfilePicture, profileStyle, allUserDataResource }) {
//Modal User is a modal that allows the user to change their account settings, appearance settings, and upgrade plan.
//In this function we render the content of the modal based on the userSettings state.

    const renderContent = () => {
        switch (userSettings) {
            case 'Account':
                return <ModalAccount 
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSave}
                    setUser={setUser}
                    userSettings={userSettings}
                    openChangeModal={openChangeModal}
                    avatarColors={avatarColors}                    
                    checkProfilePicture={checkProfilePicture}
                    profileStyle={profileStyle}
                    allUserDataResource={allUserDataResource}
                />
            case 'Appearance':
                return <ModalAppearance 
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    appearanceSettings={appearanceSettings}
                    setAppearanceSettings={setAppearanceSettings}
                    userSettings={userSettings}
                />
            case 'Billing':
                return <ModalBilling 
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSave}
                    user={user}
                    setUser={setUser}
                    userSettings={userSettings}
                    userPlan={user?.Plan}
                />
        }
    }
    
    return (
        <div className={`modal-user ${userSettings === 'Billing' ? 'modal-user--upgrade' : ''}`}>
            <div className="modal-user__header">
                <span className="modal-user__header-title">User Settings</span>
                <span className="modal-user__header-close" onClick={() => {setIsModalOpen(false);}}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.55806 2.55806C2.80213 2.31398 3.19787 2.31398 3.44194 2.55806L6 5.1161L8.55805 2.55806C8.80215 2.31398 9.19785 2.31398 9.44195 2.55806C9.686 2.80213 9.686 3.19787 9.44195 3.44194L6.8839 6L9.44195 8.55805C9.686 8.80215 9.686 9.19785 9.44195 9.44195C9.19785 9.686 8.80215 9.686 8.55805 9.44195L6 6.8839L3.44194 9.44195C3.19787 9.686 2.80213 9.686 2.55806 9.44195C2.31398 9.19785 2.31398 8.80215 2.55806 8.55805L5.1161 6L2.55806 3.44194C2.31398 3.19787 2.31398 2.80213 2.55806 2.55806Z" fill="currentColor"/>
                    </svg>
                </span>
            </div>
            <div className="modal-user__body">
                <div className="modal-user__aside">
                    <div className="modal-user__settings">
                        <div className={`modal-user__item ${userSettings === 'Account' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Account');}} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setUserSettings('Account'); } }} tabIndex={0} role="button" aria-pressed={userSettings === 'Account'}>
                            <span className="modal-user__item-span">Account</span>
                        </div>
                        <div className={`modal-user__item ${userSettings === 'Appearance' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Appearance');}} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setUserSettings('Appearance'); } }} tabIndex={0} role="button" aria-pressed={userSettings === 'Appearance'}>
                            <span className="modal-user__item-span">Appearance</span>
                        </div>
                        <div className={`modal-user__item ${userSettings === 'Billing' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Billing');}} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setUserSettings('Billing'); } }} tabIndex={0} role="button" aria-pressed={userSettings === 'Billing'}>
                            <span className="modal-user__item-span">Billing</span>
                        </div>
                    </div>
                </div>
                <div className="modal-user__divider"></div>
                <div className="modal-user__setting">
                    {/* render the content of the modal based on the userSettings state */}
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

