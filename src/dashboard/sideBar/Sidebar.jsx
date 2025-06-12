import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { SidebarLink } from '../sitebarLink/SitebarLink';
import { Profile } from '../profile/Profile';
import { Settings } from '../settings/Settings';
import { PlanCard } from '../PlanCard/PlanCard';
import { ProfileDropdown } from '../profileDropdown/ProfileDropdown';
import { SidebarSites } from '../sidebarSite/SidebarSites';
import "./Sidebar.css";
import { Tooltip } from '../tooltip/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../dashboard_animations';

// names and icons used in the sidebar
export const homePages = [

    {
      name: 'Websites',
      icon: <svg className="sidebar__link__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                <path d="M18 20.5001C18.8888 20.3004 19.5638 19.9723 20.1088 19.4328C21.5 18.0554 21.5 15.8386 21.5 11.4051C21.5 6.97151 21.5 4.75472 20.1088 3.37739C18.7175 2.00006 16.4783 2.00006 12 2.00006C7.52166 2.00006 5.28249 2.00006 3.89124 3.37739C2.5 4.75472 2.5 6.97151 2.5 11.4051C2.5 15.8386 2.5 18.0554 3.89124 19.4328C4.43619 19.9723 5.11124 20.3004 6 20.5001" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M2.5 8.50006H21.5" stroke="#686B74" strokeWidth="1.5" strokeLinejoin="round"></path>
                <path d="M6.99981 5.50006H7.00879" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10.9998 5.50006H11.0088" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M15.5 17.5001V15.0001C13.5 15.0001 12 14.0001 12 14.0001C12 14.0001 10.5 15.0001 8.5 15.0001V17.5001C8.5 21.0001 12 22.0001 12 22.0001C12 22.0001 15.5 21.0001 15.5 17.5001Z" stroke="#686B74" fill='#686B74' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
    },
    {
        name: 'Analytics',
        icon: <svg className="sidebar__link__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6667 3C10.6667 2.73478 10.772 2.48043 10.9596 2.29289C11.1471 2.10536 11.4015 2 11.6667 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H11.6667C11.4015 14 11.1471 13.8946 10.9596 13.7071C10.772 13.5196 10.6667 13.2652 10.6667 13V3ZM6.33333 7C6.33333 6.73478 6.43869 6.48043 6.62623 6.29289C6.81376 6.10536 7.06812 6 7.33333 6H8.66667C8.93188 6 9.18624 6.10536 9.37377 6.29289C9.56131 6.48043 9.66667 6.73478 9.66667 7V13C9.66667 13.2652 9.56131 13.5196 9.37377 13.7071C9.18624 13.8946 8.93188 14 8.66667 14H7.33333C7.06812 14 6.81376 13.8946 6.62623 13.7071C6.43869 13.5196 6.33333 13.2652 6.33333 13V7ZM3 10C2.73478 10 2.48043 10.1054 2.29289 10.2929C2.10536 10.4804 2 10.7348 2 11V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H4.33333C4.59855 14 4.8529 13.8946 5.04044 13.7071C5.22798 13.5196 5.33333 13.2652 5.33333 13V11C5.33333 10.7348 5.22798 10.4804 5.04044 10.2929C4.8529 10.1054 4.59855 10 4.33333 10H3Z" fill="#686B74"/>
        </svg>
        
    },
  ];
export const siteMenuPages = [

        {
            name: 'Builder',
            icon:   <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H14V2.72727H0V0Z" fill="#686B74"/>
                        <path d="M3.73333 10V4.54545H9.33333L3.73333 10Z" fill="#686B74"/>
                        <path d="M7.46667 10V4.54545H12.1333L7.46667 10Z" fill="#686B74"/>
                    </svg>
            
            
        },
        {
            name: 'Copy Script',
            icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.08398 8.58398C5.08398 6.93408 5.08398 6.10913 5.59655 5.59655C6.10913 5.08398 6.93408 5.08398 8.58398 5.08398H9.16732C10.8172 5.08398 11.6422 5.08398 12.1547 5.59655C12.6673 6.10913 12.6673 6.93408 12.6673 8.58398V9.16732C12.6673 10.8172 12.6673 11.6422 12.1547 12.1547C11.6422 12.6673 10.8172 12.6673 9.16732 12.6673H8.58398C6.93408 12.6673 6.10913 12.6673 5.59655 12.1547C5.08398 11.6422 5.08398 10.8172 5.08398 9.16732V8.58398Z" stroke="#686B74" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.74994 5.08333C9.74854 3.35836 9.72247 2.46487 9.22033 1.85308C9.12338 1.73494 9.01506 1.6266 8.89693 1.52964C8.25153 1 7.29271 1 5.375 1C3.4573 1 2.49845 1 1.85308 1.52964C1.73494 1.6266 1.6266 1.73494 1.52964 1.85308C1 2.49845 1 3.4573 1 5.375C1 7.29271 1 8.25153 1.52964 8.89693C1.6266 9.01506 1.73494 9.12338 1.85308 9.22033C2.46487 9.72247 3.35836 9.74854 5.08333 9.74994" stroke="#686B74" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            
        },
        {
            name: 'Settings',
            icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.29734 9.11365L1.75 12.25L4.88653 11.7025C5.12307 11.6613 5.34111 11.548 5.5109 11.3782L11.9937 4.89533C12.3354 4.55362 12.3354 3.99959 11.9936 3.65789L10.342 2.00627C10.0003 1.66457 9.44628 1.66458 9.10456 2.00628L2.62168 8.48931C2.45189 8.65906 2.33862 8.87711 2.29734 9.11365Z" stroke="#686B74" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.16602 3.5L10.4993 5.83333" stroke="#686B74" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
            
        },

    
  ];
export const profilePages = [
    {
        name: 'Profile',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="profileDropdown__link__fill profileDropdown__link__path" fillRule="evenodd" clipRule="evenodd" d="M5.07556 1.17164C4.90966 1.14943 4.7698 1.19742 4.67459 1.23897C4.58706 1.27716 4.48831 1.33292 4.39251 1.38701L3.0805 2.13864C2.99544 2.19881 2.88051 2.2946 2.81454 2.4496C2.74252 2.61882 2.76576 2.78937 2.78287 2.88803C2.80138 2.99477 2.83979 3.14174 2.87654 3.28239C3.10768 4.16719 2.54306 5.11903 1.62906 5.36399L1.61296 5.3683C1.47467 5.40534 1.3451 5.44006 1.24376 5.47659C1.14895 5.51077 0.990505 5.57494 0.878855 5.7198C0.776246 5.8529 0.749045 5.99885 0.738341 6.1021C0.728471 6.19736 0.728495 6.31128 0.728518 6.42212V7.57665C0.728495 7.68748 0.728471 7.80141 0.738341 7.89667C0.749045 7.99992 0.77624 8.14581 0.878843 8.27892C0.990487 8.42377 1.14893 8.48793 1.24373 8.52212C1.34507 8.55869 1.62903 8.63476 1.62903 8.63476C2.5427 8.8797 3.10695 9.83135 2.87566 10.7163C2.87566 10.7163 2.80047 11.0038 2.78195 11.1106C2.76483 11.2092 2.74158 11.3798 2.81359 11.549C2.87955 11.7041 2.99449 11.7999 3.07956 11.8601L4.39157 12.6117C4.48734 12.6658 4.58617 12.7215 4.67369 12.7597C4.76891 12.8013 4.90879 12.8493 5.0747 12.8271C5.25505 12.8029 5.38873 12.7 5.4656 12.6357C5.54723 12.5674 5.75247 12.3638 5.75247 12.3638C6.09279 12.0263 6.54604 11.8574 6.99935 11.8573C7.45266 11.8574 7.90591 12.0263 8.24623 12.3638C8.24623 12.3638 8.4515 12.5674 8.53311 12.6357C8.60999 12.7 8.74363 12.8029 8.924 12.8271C9.0899 12.8493 9.22978 12.8013 9.32504 12.7597C9.41254 12.7215 9.5113 12.6658 9.60708 12.6117L10.9191 11.8601C11.0042 11.7999 11.1191 11.7041 11.1851 11.549C11.2571 11.3798 11.2339 11.2092 11.2167 11.1106C11.1982 11.0038 11.1231 10.7163 11.1231 10.7163C10.8918 9.83135 11.456 8.8797 12.3697 8.63476C12.3697 8.63476 12.6537 8.55869 12.755 8.52212C12.8498 8.48793 13.0082 8.42377 13.1199 8.27892C13.2225 8.14581 13.2497 7.99992 13.2604 7.89667C13.2702 7.80141 13.2702 7.68748 13.2702 7.57665V6.42212C13.2702 6.31128 13.2702 6.19736 13.2604 6.1021C13.2497 5.99885 13.2225 5.8529 13.1199 5.7198C13.0082 5.57494 12.8498 5.51077 12.7549 5.47659C12.6536 5.44006 12.524 5.40534 12.3857 5.3683L12.3696 5.36399C11.4556 5.11903 10.891 4.16719 11.1222 3.28239C11.1589 3.14174 11.1973 2.99477 11.2159 2.88803C11.233 2.78937 11.2562 2.61882 11.1842 2.4496C11.1182 2.2946 11.0032 2.19881 10.9182 2.13864L9.60621 1.38701C9.51037 1.33292 9.41167 1.27716 9.32411 1.23897C9.22891 1.19742 9.08903 1.14943 8.92313 1.17164C8.74282 1.19579 8.60912 1.29872 8.53223 1.36298C8.45063 1.43122 8.24535 1.63481 8.24535 1.63481C7.90521 1.97206 7.45231 2.14076 6.99935 2.14088C6.54639 2.14076 6.09349 1.97206 5.75338 1.63481C5.75338 1.63481 5.54809 1.43122 5.46647 1.36298C5.3896 1.29872 5.25591 1.19579 5.07556 1.17164ZM6.99935 9.04099C8.12693 9.04099 9.04102 8.12691 9.04102 6.99932C9.04102 5.87174 8.12693 4.95768 6.99935 4.95768C5.87177 4.95768 4.95768 5.87174 4.95768 6.99932C4.95768 8.12691 5.87177 9.04099 6.99935 9.04099Z" fill="#686B74"/>
              </svg>
        
    },

    {
        name: 'Billing',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M6.70898 6.41602H4.95898" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="profileDropdown__link__path" d="M8.45898 4.08398H4.95898" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="profileDropdown__link__path" d="M11.6673 12.541V2.33268C11.6673 1.68835 11.145 1.16602 10.5007 1.16602H3.50065C2.85632 1.16602 2.33398 1.68835 2.33398 2.33268V12.541L4.66732 11.3743L7.00065 12.8327L9.33398 11.3743L11.6673 12.541Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
        
    },

    {
        name: 'Affiliate',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M7.58268 4.08333C7.58268 5.372 6.53799 6.41667 5.24935 6.41667C3.96068 6.41667 2.91602 5.372 2.91602 4.08333C2.91602 2.79467 3.96068 1.75 5.24935 1.75C6.53799 1.75 7.58268 2.79467 7.58268 4.08333Z" stroke="#686B74" strokeWidth="1.3"/>
        <path className="profileDropdown__link__path" d="M8.75 6.41667C10.0386 6.41667 11.0833 5.372 11.0833 4.08333C11.0833 2.79467 10.0386 1.75 8.75 1.75" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="profileDropdown__link__path" d="M6.41602 8.16602H4.08268C2.47185 8.16602 1.16602 9.47187 1.16602 11.0827C1.16602 11.727 1.68835 12.2493 2.33268 12.2493H8.16602C8.81037 12.2493 9.33268 11.727 9.33268 11.0827C9.33268 9.47187 8.02683 8.16602 6.41602 8.16602Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
        <path className="profileDropdown__link__path" d="M9.91602 8.16602C11.5268 8.16602 12.8327 9.47187 12.8327 11.0827C12.8327 11.727 12.3104 12.2493 11.666 12.2493H10.791" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
    }

];

export const otherpages = [
    {
        name: 'Support',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M8.26553 11.8938C10.7056 11.7316 12.6493 9.76038 12.8092 7.28571C12.8405 6.80142 12.8405 6.29987 12.8092 5.81559C12.6493 3.3409 10.7056 1.36967 8.26553 1.20747C7.43306 1.15214 6.56395 1.15225 5.73316 1.20747C3.29308 1.36967 1.34942 3.3409 1.18949 5.81559C1.15819 6.29987 1.15819 6.80142 1.18949 7.28571C1.24774 8.18702 1.64635 9.02153 2.11563 9.7262C2.3881 10.2195 2.20828 10.8352 1.92447 11.3731C1.71984 11.7609 1.61752 11.9548 1.69967 12.0948C1.78183 12.2349 1.96533 12.2394 2.33235 12.2483C3.05816 12.266 3.54758 12.0602 3.93608 11.7737C4.15641 11.6112 4.26659 11.53 4.34252 11.5206C4.41845 11.5113 4.56788 11.5729 4.86669 11.6959C5.13525 11.8065 5.44707 11.8748 5.73316 11.8938C6.56395 11.949 7.43306 11.9492 8.26553 11.8938Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
        <path className="profileDropdown__link__path" d="M7.00065 9.04232V9.33398M7.00065 7.58398V7.29232L7.97931 5.82432C8.10193 5.64044 8.16732 5.42438 8.16732 5.20339C8.16732 4.55634 7.6275 4.08398 7.00065 4.08398C6.3563 4.08398 5.83398 4.60632 5.83398 5.25065" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
    }, 
    {
        name: 'Appearance',
        icon: <svg className="profileDropdown__link__svg" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_64_433)">
        <path className="profileDropdown__link__path" d="M11.3327 7.99935C11.3327 9.84028 9.84028 11.3327 7.99935 11.3327C6.1584 11.3327 4.66602 9.84028 4.66602 7.99935C4.66602 6.1584 6.1584 4.66602 7.99935 4.66602C9.84028 4.66602 11.3327 6.1584 11.3327 7.99935Z" stroke="#686B74" strokeWidth="1.5"/>
        <path className="profileDropdown__link__path" opacity="0.4" d="M8.00065 1.33398V2.33398M8.00065 13.6673V14.6673M12.7145 12.7149L12.0074 12.0077M3.99349 3.99349L3.28638 3.28638M14.6673 8.00065H13.6673M2.33398 8.00065H1.33398M12.7149 3.28646L12.0077 3.99356M3.99382 12.0078L3.28671 12.7149" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_64_433">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        
    }

    
]



// Sidebar component
export function Sidebar({ 
    onPageChange, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    toggleSidebar, 
    setUserSettings,
    user,
    webs,
    setIsModalOpen,
    setModalType,
    isModalOpen,
    
    }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWebs = webs.filter(web => 
        web.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDropdownClick = () => {
        if(window.innerWidth < 767){
            setIsDropdownOpen(false);
        }
    };

    const handleToggleSidebar = () => {
        toggleSidebar();
        handleDropdownClick();
        setIsSearchOpen(false);
    };

    return (
        <div className={`${isSidebarOpen ? 'sidebar--open' : 'sidebar'}`}>
            <div className={`${isSidebarOpen ? 'sidebar__logos--open' : 'sidebar__logos'}`}>
                <div className={`${isSidebarOpen ? 'sidebar__logo--open' : 'sidebar__logo'}`}>
                
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        
                        <path d="M0 0H21V4.09091H0V0Z" fill="url(#paint0_linear_64_364)"/>
                        <path d="M5.6 15V6.81818H14L5.6 15Z" fill="url(#paint1_linear_64_364)"/>
                        <path d="M11.2 15V6.81818H18.2L11.2 15Z" fill="url(#paint2_linear_64_364)"/>
                        <defs>
                        <linearGradient id="paint0_linear_64_364" x1="10.5" y1="0" x2="10.5" y2="15" gradientUnits="userSpaceOnUse">
                        <stop/>
                        <stop offset="1"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_64_364" x1="10.5" y1="0" x2="10.5" y2="15" gradientUnits="userSpaceOnUse">
                        <stop/>
                        <stop offset="1"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_64_364" x1="10.5" y1="0" x2="10.5" y2="15" gradientUnits="userSpaceOnUse">
                        <stop/>
                        <stop offset="1"/>
                        </linearGradient>
                        </defs>
                    </svg>
                    
                </div>
                <a className="sidebar__action" onClick={handleToggleSidebar}>
                    <svg className="sidebar__action__desk" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 9C1.5 6.1877 1.5 4.78155 2.21618 3.7958C2.44748 3.47745 2.72745 3.19748 3.0458 2.96618C4.03155 2.25 5.4377 2.25 8.25 2.25H9.75C12.5623 2.25 13.9685 2.25 14.9542 2.96618C15.2725 3.19748 15.5525 3.47745 15.7838 3.7958C16.5 4.78155 16.5 6.1877 16.5 9C16.5 11.8123 16.5 13.2185 15.7838 14.2042C15.5525 14.5225 15.2725 14.8025 14.9542 15.0338C13.9685 15.75 12.5623 15.75 9.75 15.75H8.25C5.4377 15.75 4.03155 15.75 3.0458 15.0338C2.72745 14.8025 2.44748 14.5225 2.21618 14.2042C1.5 13.2185 1.5 11.8123 1.5 9Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                        <path d="M7.125 2.625V15.375" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                        <path d="M3.75 5.25C3.75 5.25 4.43566 5.25 4.875 5.25" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.75 8.25H4.875" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.75 7.5L11.8301 8.2929C11.4434 8.6262 11.25 8.79292 11.25 9C11.25 9.20708 11.4434 9.3738 11.8301 9.7071L12.75 10.5" stroke="#686B74" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <svg className="sidebar__action__mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 4.44772 3.44772 4 4 4L20 4C20.5523 4 21 4.44772 21 5C21 5.55229 20.5523 6 20 6L4 6C3.44772 6 3 5.55228 3 5Z" fill="#000000"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M3 12C3 11.4477 3.44772 11 4 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L4 13C3.44772 13 3 12.5523 3 12Z" fill="#000000"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M3 19C3 18.4477 3.44772 18 4 18L20 18C20.5523 18 21 18.4477 21 19C21 19.5523 20.5523 20 20 20L4 20C3.44772 20 3 19.5523 3 19Z" fill="#000000"></path>
                    </svg>

                </a>
            </div>
            
            <div className={`${isSidebarOpen ? 'sidebar__container--open' : 'sidebar__container'}`}>
                
                <div className="sidebar__upper">
                    <div className="sidebar__home">
                        <a className="sidebar__header">
                        <span className="sidebar__header__icon">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_209_250)">
                            <path d="M10.5 3.375C10.5 2.33947 9.66055 1.5 8.625 1.5C7.58945 1.5 6.75 2.33947 6.75 3.375C6.75 4.41053 7.58945 5.25 8.625 5.25C9.66055 5.25 10.5 4.41053 10.5 3.375Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                            <path d="M5.25 3.375C5.25 2.33947 4.41053 1.5 3.375 1.5C2.33947 1.5 1.5 2.33947 1.5 3.375C1.5 4.41053 2.33947 5.25 3.375 5.25C4.41053 5.25 5.25 4.41053 5.25 3.375Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                            <path d="M10.5 8.625C10.5 7.58945 9.66055 6.75 8.625 6.75C7.58945 6.75 6.75 7.58945 6.75 8.625C6.75 9.66055 7.58945 10.5 8.625 10.5C9.66055 10.5 10.5 9.66055 10.5 8.625Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                            <path d="M5.25 8.625C5.25 7.58945 4.41053 6.75 3.375 6.75C2.33947 6.75 1.5 7.58945 1.5 8.625C1.5 9.66055 2.33947 10.5 3.375 10.5C4.41053 10.5 5.25 9.66055 5.25 8.625Z" stroke="#686B74" strokeWidth="1.3" strokeLinejoin="round"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_209_250">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>


                            </span>
                            <span className="sidebar__header__text">Dashboard</span>
                        </a>
                    </div>
                    <div className={`${isSidebarOpen ? 'sidebar__sites--open' : 'sidebar__sites'}`}>
                        <div className={`${isSidebarOpen ? 'sidebar__sites-header--open' : 'sidebar__sites-header'}`}>
                            <span className='sidebar__sites-title'>SITES</span>
                            <div className={`${isSearchOpen ? 'sidebar__sites-searcher--open' : 'sidebar__sites-searcher'}`}>
                                <span className='sidebar__sites-search' onClick={() => setIsSearchOpen(!isSearchOpen)}>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.99912 8.99912L7.07031 7.07031" stroke="#191919" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
                                        <path d="M4.55541 8.11083C6.51902 8.11083 8.11083 6.51902 8.11083 4.55541C8.11083 2.59181 6.51902 1 4.55541 1C2.59181 1 1 2.59181 1 4.55541C1 6.51902 2.59181 8.11083 4.55541 8.11083Z" stroke="#191919" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}/>
                                    </svg>
                                </span>
                                <input 
                                    className={`${isSearchOpen ? 'sidebar__sites-input--open' : 'sidebar__sites-input'}`} 
                                    type="text" 
                                    placeholder='Search sites...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <span className='sidebar__sites-add' onClick={() => {setIsModalOpen(!isModalOpen);
                                setModalType("NewSite");
                                                                                     if(window.innerWidth < 767) {
                                                                                        setIsSidebarOpen(false);
                                                                                        toggleSidebar();
                                                                                        toggleDropdown();
                                                                                    }
                                                                                    }} >
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 4.57143H4.57143V8H3.42857V4.57143H0V3.42857H3.42857V0H4.57143V3.42857H8V4.57143Z" fill="black"/>
                                    </svg>

                                </span>
                            
                        </div>
                        <div className="sidebar__sites-container">
                            <div className={`${isSidebarOpen ? 'sitesDisplay--open' : 'sitesDisplay'}`}>
                                {filteredWebs.length === 0 ? (
                                    <span className={`${isSidebarOpen ? 'sitesDisplay__nosites--open' : 'sitesDisplay__nosites'}`}>
                                        {searchQuery ? 'No sites found' : 'You don\'t have any sites yet'}
                                    </span>
                                ) : (
                                    (isSidebarOpen ? filteredWebs : filteredWebs.slice(0, 6)).map((web) => (
                                        <div key={web.id} className="sidebar__sites-tooltip-wrapper">
                                            <SidebarSites
                                                key={web.id}
                                                avatar={web["Avatar URL"]}
                                                name={web.Name}
                                                isSidebarOpen={isSidebarOpen}
                                                setIsModalOpen={setIsModalOpen}
                                                setModalType={setModalType}
                                                isModalOpen={isModalOpen}
                                            />
                                            <AnimatePresence>
                                            </AnimatePresence>
                                            {!isSidebarOpen && window.innerWidth > 767 && (
                                                <Tooltip 
                                                    message={web.Name} 
                                                    id={web.id}
                                                    position="sidebar"
                                                    type='default'
                                                />
                                            )} 
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sidebar__lower">
                   <div className="sidebar__others">
                        {otherpages.map((otherPage) => (
                            <SidebarLink
                                key={otherPage.name}
                                icon={otherPage.icon}
                                text={otherPage.name}
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    if(isSidebarOpen){
                                        toggleSidebar();
                                    }
                                    onPageChange(otherPage.name);
                                    setUserSettings(null);
                                    handleDropdownClick();
                                }}
                            />
                        ))}
                    </div>
                    <ProfileDropdown 
                    avatar="avatar" 
                    user={user}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    setUserSettings={setUserSettings}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    setModalType={setModalType}
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    /> 

                </div>
            </div>
        </div>
    );
}

