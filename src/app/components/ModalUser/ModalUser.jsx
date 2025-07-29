import './ModalUser.css';

import { ModalAccount } from '@components/ModalAccount/ModalAccount';
import { ModalAppearance } from '../ModalAppearance/ModalAppearance';
import ModalUpgradePlan from '../ModalUpgradePlan/ModalUpgradePlan';

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
            case 'Plan':
                return <ModalUpgradePlan 
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
        <div className={`modal-user ${userSettings === 'Plan' ? 'modal-user--upgrade' : ''}`}>
            <div className="modal-user__aside">
                <div className="modal-user__settings">
                    <div className={`modal-user__item ${userSettings === 'Account' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Account');}}>
                        <span className="modal-user__item__span">Account</span>
                    </div>
                    <div className={`modal-user__item ${userSettings === 'Appearance' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Appearance');}}>
                        <span className="modal-user__item__span">Appearance</span>
                    </div>
                    <div className="modal-user__divider"></div>
                    <div className={`modal-user__item modal-user__item--upgrade ${userSettings === 'Plan' ? 'modal-user__item--active' : ''}`} onClick={() => {setUserSettings('Plan');}}>
                        <span className="modal-user__item__icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_439_1015)">
                                <path className="modal-user__tick" d="M7.00002 0.728516C10.4633 0.728516 13.2709 3.53606 13.2709 6.99935C13.2709 10.4627 10.4633 13.2702 7.00002 13.2702C3.53674 13.2702 0.729187 10.4627 0.729187 6.99935C0.729187 3.53606 3.53674 0.728516 7.00002 0.728516ZM4.13349 6.70768L4.95835 7.53257L6.41669 6.07424V9.91602H7.58335V6.07424L9.04169 7.53257L9.86658 6.70768L7.00002 3.84115L4.13349 6.70768Z" fill="currentColor"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_439_1015">
                                <rect width="14" height="14" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <span className="modal-user__item__span modal-user__item__span--upgrade">Upgrade plan</span>
                    </div>
                </div>
            </div>
            <div className="modal-user__setting">
                {/* render the content of the modal based on the userSettings state */}
                {renderContent()}
            </div>
        </div>
    )
}

