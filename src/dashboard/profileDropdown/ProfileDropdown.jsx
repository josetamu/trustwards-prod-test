import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { SidebarLink } from '../sitebarLink/SitebarLink';
import { profilePages } from '../sideBar/Sidebar';
import "./ProfileDropdown.css";





export const ProfileDropdown = ({ setUserSettings,setIsSidebarOpen,user,isDropdownOpen,setIsDropdownOpen,isSidebarOpen,toggleSidebar }) => {

    

    const toggleDropdown = () => {
        if(window.innerWidth < 767){
            setIsDropdownOpen(!isDropdownOpen);
            
        }
    };

    const isMobile = window.innerWidth < 767;

   /*  const handleOutsideClick = (event) => {
        if(window.innerWidth < 767){
            if(!event.target.closest(".profileDropdown__dropdown")){
                setIsDropdownOpen(false);
            }
        }
    }; */

   
    
    
    return (
        <div className={`${isSidebarOpen ? 'profileDropdown--open' : 'profileDropdown'}`}>
            <div className=
                    {isMobile 
                        ? `${isDropdownOpen ? "profileDropdown__dropdown--active" : "profileDropdown__dropdown--inactive"}`
                        : `profileDropdown__dropdown`}
            >
                        <div className="profileDropdown__upper">
                            {profilePages.map((profilePage) => (
                                <SidebarLink
                                    className="profileDropdown__link"
                                    key={profilePage.name}
                                    icon={profilePage.icon}
                                    text={profilePage.name}
                                    onClick={() => {
                                        setUserSettings(profilePage.name);
                                        if(window.innerWidth < 767) {
                                            setIsSidebarOpen(false);
                                            toggleSidebar();
                                            toggleDropdown();
                                        }
                                        
                                    }}
                                />
                            ))}
                        </div>
                        <div className="profileDropdown__lower">
                            <SidebarLink
                                className="profileDropdown__link profileDropdown__link__logout"
                                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_64_417)">
                                    <path className="profileDropdown__link__path" d="M12.541 7.00067C12.541 4.38829 12.541 3.0821 11.7295 2.27054C10.9179 1.45898 9.61171 1.45898 6.99935 1.45898C4.38701 1.45898 3.08081 1.45898 2.26921 2.27054C1.45768 3.0821 1.45768 4.38829 1.45768 7.00067C1.45768 9.61301 1.45768 10.9192 2.26921 11.7307C3.08081 12.5423 4.38701 12.5423 6.99935 12.5423C9.61171 12.5423 10.9179 12.5423 11.7295 11.7307C12.541 10.9192 12.541 9.61301 12.541 7.00067Z" stroke="#686B74" stroke-width="1.3"/>
                                    <path className="profileDropdown__link__path" opacity="0.4" d="M9.91602 7.01821H5.84692M5.84692 7.01821C5.84692 7.351 7.10412 8.46919 7.10412 8.46919M5.84692 7.01821C5.84692 6.67678 7.10412 5.58067 7.10412 5.58067M4.08268 4.66602V9.3327" stroke="#686B74" stroke-width="1.3" stroke-linecap="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_64_417">
                                    <rect width="14" height="14" fill="white" transform="matrix(-1 0 0 1 14 0)"/>
                                    </clipPath>
                                    </defs>
                                    </svg>
                                    }
                                text="Logout"
                            />
                        </div>
            </div>
           <div className={`${isSidebarOpen ? 'profileDropdown__profile--open' : 'profileDropdown__profile'}`} onClick={() => {
              toggleDropdown();
            }}>
            <div className="profileDropdown__header">
                <img className="profileDropdown__header__avatar" src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="avatar" />
                <span className={`${isSidebarOpen ? 'profileDropdown__header__name--open' : 'profileDropdown__header__name'}`}>{user?.["First Name"]} {user?.["Second Name"] || "User"}</span>
            </div>
            <div className={`${isSidebarOpen ? 'profileDropdown__icons--open' : 'profileDropdown__icons'}`}>
                <span className="profileDropdown__icons--down">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00002 4.5C3.00002 4.5 5.20948 7.49999 6.00003 7.5C6.79058 7.5 9 4.5 9 4.5" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span className="profileDropdown__icons--up">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00002 7.5C3.00002 7.5 5.20948 4.50001 6.00003 4.5C6.79058 4.5 9 7.5 9 7.5" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                </span>
            </div>                  
            </div> 
            
        </div>
    )
}

