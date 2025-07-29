import "./User.css";

import { useEffect, useState, Suspense } from 'react';

import { SidebarLink } from '../sidebarLink/SidebarLink';
import { profilePages } from '../sideBar/Sidebar';
import { Dropdown } from '../dropdown/Dropdown';
import { UserName } from './User__Name';
import { UserNameSkeleton } from '../Skeletons/UserNameSkeleton';


export const User = ({  setIsSidebarOpen,user,isDropdownOpen,setIsDropdownOpen,isSidebarOpen,toggleSidebar,setModalType,setIsModalOpen,isModalOpen, modalType, setUserSettings, checkProfilePicture, profileStyle, windowWidth, isSidebarMenu }) => {
//Here the dropdown's menu is defined by mapping the profilePages array
    const UserMenu = () => {
        return(
            <>
                            {profilePages.map((profilePage) => (
                                <SidebarLink
                                    className="dropdown__item"
                                    key={profilePage.name}
                                    icon={profilePage.icon}
                                    text={profilePage.name}
                                    onClick={() => {
                                        if(modalType === profilePage.name && isModalOpen){
                                            setIsModalOpen(false);
                                        } else {
                                            setIsModalOpen(true);
                                            setModalType(profilePage.name);
                                            setIsDropdownOpen(false);
                                            setUserSettings(profilePage.name);
                                        }
                                        
                                    }}
                                />
                            ))}
                            <div className="dropdown__divider"></div>
                            <button
                                className="dropdown__item dropdown__item--delete"
                                >
                                    <span className="dropdown__icon dropdown__icon--delete">
                                        <svg  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_64_417)">
                                            <path d="M12.541 7.00067C12.541 4.38829 12.541 3.0821 11.7295 2.27054C10.9179 1.45898 9.61171 1.45898 6.99935 1.45898C4.38701 1.45898 3.08081 1.45898 2.26921 2.27054C1.45768 3.0821 1.45768 4.38829 1.45768 7.00067C1.45768 9.61301 1.45768 10.9192 2.26921 11.7307C3.08081 12.5423 4.38701 12.5423 6.99935 12.5423C9.61171 12.5423 10.9179 12.5423 11.7295 11.7307C12.541 10.9192 12.541 9.61301 12.541 7.00067Z" stroke="currentColor" strokeWidth="1.3"/>
                                            <path opacity="0.4" d="M9.91602 7.01821H5.84692M5.84692 7.01821C5.84692 7.351 7.10412 8.46919 7.10412 8.46919M5.84692 7.01821C5.84692 6.67678 7.10412 5.58067 7.10412 5.58067M4.08268 4.66602V9.3327" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_64_417">
                                            <rect width="14" height="14" fill="white" transform="matrix(-1 0 0 1 14 0)"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    Log out</button>
            </>
            
        )

    }


    return (
        <div className="user" 
          onMouseEnter={() => (isSidebarOpen || isSidebarMenu) && setIsDropdownOpen(true)} 
          onMouseLeave={() => (isSidebarOpen || isSidebarMenu) && setIsDropdownOpen(false)}>
             <Dropdown
                className="user-dropdown"
                open={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                animationType="SCALE_BOTTOM"
                menu={<UserMenu setIsModalOpen={setIsModalOpen} setModalType={setModalType} isModalOpen={isModalOpen} setIsDropdownOpen={setIsDropdownOpen} toggleSidebar={toggleSidebar} setIsSidebarOpen={setIsSidebarOpen} />}
            >
                <div className="user__profile">
                <div className="user__header">
                    <span className={`user__color ${checkProfilePicture(user) === '' ? '' : 'user__color--null'}`} 
                        style={profileStyle(user)}>
                          {user?.Name.charAt(0)}
                    </span> 
                        <img className={`user__avatar ${checkProfilePicture(user) === '' ? 'user__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="avatar" />
                    <Suspense fallback={<UserNameSkeleton />}>
                        <UserName user={user} />
                    </Suspense>
                </div>
                <div className="user__icons">
                    <span className="user__icons--down">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.00002 4.5C3.00002 4.5 5.20948 7.49999 6.00003 7.5C6.79058 7.5 9 4.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="user__icons--up">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.00002 7.5C3.00002 7.5 5.20948 4.50001 6.00003 4.5C6.79058 4.5 9 7.5 9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                    </span>
                </div>                   
                </div>
            </Dropdown>
        </div>
    )
}

