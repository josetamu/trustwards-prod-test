import React from 'react';
import '../ProfileDropdown/profileDropdown.css';
import { siteMenuPages } from '../SideBar/Sidebar';
import { SidebarLink } from '../SidebarLink/SidebarLink';
import '../SidebarSite/SidebarSites.css';

export const SiteMenuSB = ({setIsModalOpen, setModalType, isModalOpen, setIsDropdownOpen, siteData, setSiteData}) => {
    return (
        <div className='profileDropdown__dropdown--active'>
            <div className="profileDropdown__upper">
                {siteMenuPages.map((siteMenuPage) => (
                    <SidebarLink
                        className="profileDropdown__link"
                        key={siteMenuPage.name}
                        icon={siteMenuPage.icon}
                        text={siteMenuPage.name}
                        onClick={() => {
                            if(siteMenuPage.name === 'Settings'){
                                setIsModalOpen(!isModalOpen);
                                setModalType('EditSite');
                                setIsDropdownOpen(false);
                                setSiteData(siteData);
                            }
                        }}
                    />
                ))}
            </div>
            <div className="profileDropdown__lower">
                <SidebarLink
                    className="profileDropdown__link profileDropdown__link__logout"
                    icon={<svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.625 3.20898L10.1081 11.7379C10.0708 12.3537 9.56047 12.834 8.94354 12.834H3.55644C2.93951 12.834 2.42922 12.3537 2.3919 11.7379L1.875 3.20898" stroke="#D00606" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 3.20768H3.91667M3.91667 3.20768L4.64015 1.51956C4.73207 1.30508 4.94297 1.16602 5.17632 1.16602H7.32368C7.55702 1.16602 7.76795 1.30508 7.85982 1.51956L8.58333 3.20768M3.91667 3.20768H8.58333M11.5 3.20768H8.58333" stroke="#D00606" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.79102 9.625V6.125" stroke="#D00606" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.70898 9.625V6.125" stroke="#D00606" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                    text="Delete"
                />
            </div>
        </div>
    );
}
