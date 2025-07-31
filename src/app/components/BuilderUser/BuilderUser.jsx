import './BuilderUser.css';
import { Tooltip } from '@components/Tooltip/Tooltip';
import { useState } from 'react';

export default function BuilderUser({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen}) {

    const [showTooltip, setShowTooltip] = useState(false);
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };
    return (
        <div className="builder-user" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => {
            setModalType('Account');
            setIsModalOpen(true);
        }}>
        <span className={`builder-user__color ${checkProfilePicture(user) === '' ? '' : 'builder-user__color--null'}`} 
        style={profileStyle(user)}>
          {user?.Name.charAt(0)}
        </span> 
        <img className={`builder-user__avatar ${checkProfilePicture(user) === '' ? 'builder-user__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="avatar"/>
        <Tooltip
                message={user?.Name || 'User'}
                open={showTooltip}
                responsivePosition={{ desktop: 'bottom', mobile: 'bottom' }}
                width="auto"
        />
        </div>
    )
}