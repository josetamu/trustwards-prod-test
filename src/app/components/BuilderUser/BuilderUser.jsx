import './BuilderUser.css';
import { Tooltip } from '@components/tooltip/Tooltip';
import { useState } from 'react';

export default function BuilderUser({user, checkProfilePicture, profileStyle, setModalType, setIsModalOpen}) {

    const [showTooltip, setShowTooltip] = useState(false);
    // Function to show the tooltip when the user is hovered
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };
    // Function to hide the tooltip when the user is not hovered
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };
    return (

        <div 
            className="builder-user" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onClick={() => {
                // Open the account modal
                setModalType('Account');
                setIsModalOpen(true);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModalType('Account');
                    setIsModalOpen(true);
                }
            }}
            tabIndex={0}
            aria-label={`User account: ${user?.Name || 'User'}. Click to open account settings`}
        >
            {/*If the user has no profile picture, show the user color */}
        <span className={`builder-user__color ${checkProfilePicture(user) === '' ? '' : 'builder-user__color--null'}`} 
        style={profileStyle(user)}>
          {user?.Name.charAt(0)}
        </span> 
        {/*If the user has a profile picture, show it */}
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