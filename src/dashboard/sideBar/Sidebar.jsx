import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { SidebarLink } from '../sitebarLink/SitebarLink';
import { Profile } from '../profile/Profile';
import { Settings } from '../settings/Settings';
import { PlanCard } from '../planCard/PlanCard';
import { ProfileDropdown } from '../profileDropdown/ProfileDropdown';
import "./Sidebar.css";


// names and icons used in the sidebar
export const homePages = [

    {
      name: 'Websites',
      icon: <svg class="sidebar__link__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                <path d="M18 20.5001C18.8888 20.3004 19.5638 19.9723 20.1088 19.4328C21.5 18.0554 21.5 15.8386 21.5 11.4051C21.5 6.97151 21.5 4.75472 20.1088 3.37739C18.7175 2.00006 16.4783 2.00006 12 2.00006C7.52166 2.00006 5.28249 2.00006 3.89124 3.37739C2.5 4.75472 2.5 6.97151 2.5 11.4051C2.5 15.8386 2.5 18.0554 3.89124 19.4328C4.43619 19.9723 5.11124 20.3004 6 20.5001" stroke="#686B74" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M2.5 8.50006H21.5" stroke="#686B74" stroke-width="1.5" stroke-linejoin="round"></path>
                <path d="M6.99981 5.50006H7.00879" stroke="#686B74" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M10.9998 5.50006H11.0088" stroke="#686B74" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M15.5 17.5001V15.0001C13.5 15.0001 12 14.0001 12 14.0001C12 14.0001 10.5 15.0001 8.5 15.0001V17.5001C8.5 21.0001 12 22.0001 12 22.0001C12 22.0001 15.5 21.0001 15.5 17.5001Z" stroke="#686B74" fill='#686B74' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
    },
    {
        name: 'Analytics',
        icon: <svg class="sidebar__link__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6667 3C10.6667 2.73478 10.772 2.48043 10.9596 2.29289C11.1471 2.10536 11.4015 2 11.6667 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H11.6667C11.4015 14 11.1471 13.8946 10.9596 13.7071C10.772 13.5196 10.6667 13.2652 10.6667 13V3ZM6.33333 7C6.33333 6.73478 6.43869 6.48043 6.62623 6.29289C6.81376 6.10536 7.06812 6 7.33333 6H8.66667C8.93188 6 9.18624 6.10536 9.37377 6.29289C9.56131 6.48043 9.66667 6.73478 9.66667 7V13C9.66667 13.2652 9.56131 13.5196 9.37377 13.7071C9.18624 13.8946 8.93188 14 8.66667 14H7.33333C7.06812 14 6.81376 13.8946 6.62623 13.7071C6.43869 13.5196 6.33333 13.2652 6.33333 13V7ZM3 10C2.73478 10 2.48043 10.1054 2.29289 10.2929C2.10536 10.4804 2 10.7348 2 11V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H4.33333C4.59855 14 4.8529 13.8946 5.04044 13.7071C5.22798 13.5196 5.33333 13.2652 5.33333 13V11C5.33333 10.7348 5.22798 10.4804 5.04044 10.2929C4.8529 10.1054 4.59855 10 4.33333 10H3Z" fill="#686B74"/>
        </svg>
        
    },
  ];
export const docPages = [

        {
            name: 'Academy',
            icon:   <svg class="sidebar__link__svg" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1963 4.85336C12.3109 2.71612 10.1004 1.00945 6.57165 1.30645C6.19661 1.33802 5.86513 1.07984 5.83131 0.729813C5.79748 0.379782 6.07411 0.0704336 6.44919 0.0388636C10.6101 -0.311337 13.373 1.75056 14.4683 4.39443C15.4305 6.71719 15.1106 9.52329 13.3134 11.4545H13.637C14.0136 11.4545 14.3189 11.7394 14.3189 12.0909C14.3189 12.4423 14.0136 12.7272 13.637 12.7272H11.5913C11.2148 12.7272 10.9094 12.4423 10.9094 12.0909V10.5C10.9094 10.1485 11.2148 9.86362 11.5913 9.86362C11.9679 9.86362 12.2732 10.1485 12.2732 10.5V10.63C13.7011 9.09985 14.0077 6.81232 13.1963 4.85336ZM0.681099 1.90911C0.681099 1.55766 0.986389 1.27274 1.36299 1.27274H3.40866C3.58951 1.27274 3.76295 1.33979 3.89083 1.45913C4.01871 1.57847 4.09055 1.74034 4.09055 1.90911V3.50001C4.09055 3.85147 3.78526 4.13637 3.40866 4.13637C3.03206 4.13637 2.72677 3.85147 2.72677 3.50001V3.36867C1.29388 4.89522 0.992335 7.17002 1.80854 9.12302C2.69858 11.2527 4.91275 12.9617 8.42722 12.7009C8.8026 12.673 9.13113 12.9344 9.161 13.2848C9.1908 13.6351 8.91068 13.9417 8.5353 13.9696C4.39702 14.2767 1.63779 12.2171 0.537977 9.58546C-0.430575 7.26796 -0.116546 4.47382 1.6854 2.54547H1.36299C0.986389 2.54547 0.681099 2.26056 0.681099 1.90911Z" fill="#686B74"/>
                        <path d="M4 5H11V6.63636H4V5Z" fill="url(#paint0_linear_79_111)"/>
                        <path d="M5.86667 11V7.72727H8.66667L5.86667 11Z" fill="url(#paint1_linear_79_111)"/>
                        <path d="M7.73333 11V7.72727H10.0667L7.73333 11Z" fill="url(#paint2_linear_79_111)"/>
                        <defs>
                        <linearGradient id="paint0_linear_79_111" x1="7.5" y1="5" x2="7.5" y2="11" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#686B74"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_79_111" x1="7.5" y1="5" x2="7.5" y2="11" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#686B74"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_79_111" x1="7.5" y1="5" x2="7.5" y2="11" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#686B74"/>
                        </linearGradient>
                        </defs>
                   </svg>
            
        },
        {
            name: 'Legal news',
            icon: <svg class="sidebar__link__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                    <path opacity="0.4" d="M10.5 8H18.5M10.5 12H13M18.5 12H16M10.5 16H13M18.5 16H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path opacity="0.4" d="M7 7.5H6C4.11438 7.5 3.17157 7.5 2.58579 8.08579C2 8.67157 2 9.61438 2 11.5V18C2 19.3807 3.11929 20.5 4.5 20.5C5.88071 20.5 7 19.3807 7 18V7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 3.5H11C10.07 3.5 9.60504 3.5 9.22354 3.60222C8.18827 3.87962 7.37962 4.68827 7.10222 5.72354C7 6.10504 7 6.57003 7 7.5V18C7 19.3807 5.88071 20.5 4.5 20.5H16C18.8284 20.5 20.2426 20.5 21.1213 19.6213C22 18.7426 22 17.3284 22 14.5V9.5C22 6.67157 22 5.25736 21.1213 4.37868C20.2426 3.5 18.8284 3.5 16 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
        },
    
  ];
export const profilePages = [
    {
        name: 'Profile',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="profileDropdown__link__fill profileDropdown__link__path" fill-rule="evenodd" clip-rule="evenodd" d="M5.07556 1.17164C4.90966 1.14943 4.7698 1.19742 4.67459 1.23897C4.58706 1.27716 4.48831 1.33292 4.39251 1.38701L3.0805 2.13864C2.99544 2.19881 2.88051 2.2946 2.81454 2.4496C2.74252 2.61882 2.76576 2.78937 2.78287 2.88803C2.80138 2.99477 2.83979 3.14174 2.87654 3.28239C3.10768 4.16719 2.54306 5.11903 1.62906 5.36399L1.61296 5.3683C1.47467 5.40534 1.3451 5.44006 1.24376 5.47659C1.14895 5.51077 0.990505 5.57494 0.878855 5.7198C0.776246 5.8529 0.749045 5.99885 0.738341 6.1021C0.728471 6.19736 0.728495 6.31128 0.728518 6.42212V7.57665C0.728495 7.68748 0.728471 7.80141 0.738341 7.89667C0.749045 7.99992 0.77624 8.14581 0.878843 8.27892C0.990487 8.42377 1.14893 8.48793 1.24373 8.52212C1.34507 8.55869 1.62903 8.63476 1.62903 8.63476C2.5427 8.8797 3.10695 9.83135 2.87566 10.7163C2.87566 10.7163 2.80047 11.0038 2.78195 11.1106C2.76483 11.2092 2.74158 11.3798 2.81359 11.549C2.87955 11.7041 2.99449 11.7999 3.07956 11.8601L4.39157 12.6117C4.48734 12.6658 4.58617 12.7215 4.67369 12.7597C4.76891 12.8013 4.90879 12.8493 5.0747 12.8271C5.25505 12.8029 5.38873 12.7 5.4656 12.6357C5.54723 12.5674 5.75247 12.3638 5.75247 12.3638C6.09279 12.0263 6.54604 11.8574 6.99935 11.8573C7.45266 11.8574 7.90591 12.0263 8.24623 12.3638C8.24623 12.3638 8.4515 12.5674 8.53311 12.6357C8.60999 12.7 8.74363 12.8029 8.924 12.8271C9.0899 12.8493 9.22978 12.8013 9.32504 12.7597C9.41254 12.7215 9.5113 12.6658 9.60708 12.6117L10.9191 11.8601C11.0042 11.7999 11.1191 11.7041 11.1851 11.549C11.2571 11.3798 11.2339 11.2092 11.2167 11.1106C11.1982 11.0038 11.1231 10.7163 11.1231 10.7163C10.8918 9.83135 11.456 8.8797 12.3697 8.63476C12.3697 8.63476 12.6537 8.55869 12.755 8.52212C12.8498 8.48793 13.0082 8.42377 13.1199 8.27892C13.2225 8.14581 13.2497 7.99992 13.2604 7.89667C13.2702 7.80141 13.2702 7.68748 13.2702 7.57665V6.42212C13.2702 6.31128 13.2702 6.19736 13.2604 6.1021C13.2497 5.99885 13.2225 5.8529 13.1199 5.7198C13.0082 5.57494 12.8498 5.51077 12.7549 5.47659C12.6536 5.44006 12.524 5.40534 12.3857 5.3683L12.3696 5.36399C11.4556 5.11903 10.891 4.16719 11.1222 3.28239C11.1589 3.14174 11.1973 2.99477 11.2159 2.88803C11.233 2.78937 11.2562 2.61882 11.1842 2.4496C11.1182 2.2946 11.0032 2.19881 10.9182 2.13864L9.60621 1.38701C9.51037 1.33292 9.41167 1.27716 9.32411 1.23897C9.22891 1.19742 9.08903 1.14943 8.92313 1.17164C8.74282 1.19579 8.60912 1.29872 8.53223 1.36298C8.45063 1.43122 8.24535 1.63481 8.24535 1.63481C7.90521 1.97206 7.45231 2.14076 6.99935 2.14088C6.54639 2.14076 6.09349 1.97206 5.75338 1.63481C5.75338 1.63481 5.54809 1.43122 5.46647 1.36298C5.3896 1.29872 5.25591 1.19579 5.07556 1.17164ZM6.99935 9.04099C8.12693 9.04099 9.04102 8.12691 9.04102 6.99932C9.04102 5.87174 8.12693 4.95768 6.99935 4.95768C5.87177 4.95768 4.95768 5.87174 4.95768 6.99932C4.95768 8.12691 5.87177 9.04099 6.99935 9.04099Z" fill="#686B74"/>
              </svg>
        
    },
    {
        name: 'Appearance',
        icon: <svg className="profileDropdown__link__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_64_433)">
        <path className="profileDropdown__link__path" d="M11.3327 7.99935C11.3327 9.84028 9.84028 11.3327 7.99935 11.3327C6.1584 11.3327 4.66602 9.84028 4.66602 7.99935C4.66602 6.1584 6.1584 4.66602 7.99935 4.66602C9.84028 4.66602 11.3327 6.1584 11.3327 7.99935Z" stroke="#686B74" stroke-width="1.5"/>
        <path className="profileDropdown__link__path" opacity="0.4" d="M8.00065 1.33398V2.33398M8.00065 13.6673V14.6673M12.7145 12.7149L12.0074 12.0077M3.99349 3.99349L3.28638 3.28638M14.6673 8.00065H13.6673M2.33398 8.00065H1.33398M12.7149 3.28646L12.0077 3.99356M3.99382 12.0078L3.28671 12.7149" stroke="#686B74" stroke-width="1.5" stroke-linecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_64_433">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        
    },
    {
        name: 'Billing',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M6.70898 6.41602H4.95898" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path className="profileDropdown__link__path" d="M8.45898 4.08398H4.95898" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path className="profileDropdown__link__path" d="M11.6673 12.541V2.33268C11.6673 1.68835 11.145 1.16602 10.5007 1.16602H3.50065C2.85632 1.16602 2.33398 1.68835 2.33398 2.33268V12.541L4.66732 11.3743L7.00065 12.8327L9.33398 11.3743L11.6673 12.541Z" stroke="#686B74" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
        
    },
    {
        name: 'Support',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M8.26553 11.8938C10.7056 11.7316 12.6493 9.76038 12.8092 7.28571C12.8405 6.80142 12.8405 6.29987 12.8092 5.81559C12.6493 3.3409 10.7056 1.36967 8.26553 1.20747C7.43306 1.15214 6.56395 1.15225 5.73316 1.20747C3.29308 1.36967 1.34942 3.3409 1.18949 5.81559C1.15819 6.29987 1.15819 6.80142 1.18949 7.28571C1.24774 8.18702 1.64635 9.02153 2.11563 9.7262C2.3881 10.2195 2.20828 10.8352 1.92447 11.3731C1.71984 11.7609 1.61752 11.9548 1.69967 12.0948C1.78183 12.2349 1.96533 12.2394 2.33235 12.2483C3.05816 12.266 3.54758 12.0602 3.93608 11.7737C4.15641 11.6112 4.26659 11.53 4.34252 11.5206C4.41845 11.5113 4.56788 11.5729 4.86669 11.6959C5.13525 11.8065 5.44707 11.8748 5.73316 11.8938C6.56395 11.949 7.43306 11.9492 8.26553 11.8938Z" stroke="#686B74" stroke-width="1.3" stroke-linejoin="round"/>
        <path className="profileDropdown__link__path" d="M7.00065 9.04232V9.33398M7.00065 7.58398V7.29232L7.97931 5.82432C8.10193 5.64044 8.16732 5.42438 8.16732 5.20339C8.16732 4.55634 7.6275 4.08398 7.00065 4.08398C6.3563 4.08398 5.83398 4.60632 5.83398 5.25065" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    },
    {
        name: 'Affiliate',
        icon: <svg className="profileDropdown__link__svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="profileDropdown__link__path" d="M7.58268 4.08333C7.58268 5.372 6.53799 6.41667 5.24935 6.41667C3.96068 6.41667 2.91602 5.372 2.91602 4.08333C2.91602 2.79467 3.96068 1.75 5.24935 1.75C6.53799 1.75 7.58268 2.79467 7.58268 4.08333Z" stroke="#686B74" stroke-width="1.3"/>
        <path className="profileDropdown__link__path" d="M8.75 6.41667C10.0386 6.41667 11.0833 5.372 11.0833 4.08333C11.0833 2.79467 10.0386 1.75 8.75 1.75" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path className="profileDropdown__link__path" d="M6.41602 8.16602H4.08268C2.47185 8.16602 1.16602 9.47187 1.16602 11.0827C1.16602 11.727 1.68835 12.2493 2.33268 12.2493H8.16602C8.81037 12.2493 9.33268 11.727 9.33268 11.0827C9.33268 9.47187 8.02683 8.16602 6.41602 8.16602Z" stroke="#686B74" stroke-width="1.3" stroke-linejoin="round"/>
        <path className="profileDropdown__link__path" d="M9.91602 8.16602C11.5268 8.16602 12.8327 9.47187 12.8327 11.0827C12.8327 11.727 12.3104 12.2493 11.666 12.2493H10.791" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    }

];

// Sidebar component
export function Sidebar({ homePages, 
    docPages, 
    onPageChange, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    toggleSidebar, 
    setUserSettings,
    user
    }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleDropdownClick = () => {
        if(window.innerWidth < 767){
            setIsDropdownOpen(false);
        }
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
                <a className="sidebar__action" onClick={() => {
                    toggleSidebar();
                    handleDropdownClick();
                }}>
                    <svg className="sidebar__action__desk" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 9C1.5 6.1877 1.5 4.78155 2.21618 3.7958C2.44748 3.47745 2.72745 3.19748 3.0458 2.96618C4.03155 2.25 5.4377 2.25 8.25 2.25H9.75C12.5623 2.25 13.9685 2.25 14.9542 2.96618C15.2725 3.19748 15.5525 3.47745 15.7838 3.7958C16.5 4.78155 16.5 6.1877 16.5 9C16.5 11.8123 16.5 13.2185 15.7838 14.2042C15.5525 14.5225 15.2725 14.8025 14.9542 15.0338C13.9685 15.75 12.5623 15.75 9.75 15.75H8.25C5.4377 15.75 4.03155 15.75 3.0458 15.0338C2.72745 14.8025 2.44748 14.5225 2.21618 14.2042C1.5 13.2185 1.5 11.8123 1.5 9Z" stroke="#686B74" stroke-width="1.3" stroke-linejoin="round"/>
                        <path d="M7.125 2.625V15.375" stroke="#686B74" stroke-width="1.3" stroke-linejoin="round"/>
                        <path d="M3.75 5.25C3.75 5.25 4.43566 5.25 4.875 5.25" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.75 8.25H4.875" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.75 7.5L11.8301 8.2929C11.4434 8.6262 11.25 8.79292 11.25 9C11.25 9.20708 11.4434 9.3738 11.8301 9.7071L12.75 10.5" stroke="#686B74" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <svg className="sidebar__action__mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C3 4.44772 3.44772 4 4 4L20 4C20.5523 4 21 4.44772 21 5C21 5.55229 20.5523 6 20 6L4 6C3.44772 6 3 5.55228 3 5Z" fill="#000000"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 11.4477 3.44772 11 4 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L4 13C3.44772 13 3 12.5523 3 12Z" fill="#000000"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 19C3 18.4477 3.44772 18 4 18L20 18C20.5523 18 21 18.4477 21 19C21 19.5523 20.5523 20 20 20L4 20C3.44772 20 3 19.5523 3 19Z" fill="#000000"></path>
                    </svg>

                </a>
            </div>
            
            <div className={`${isSidebarOpen ? 'sidebar__container--open' : 'sidebar__container'}`}>
                
                <div className="sidebar__upper">
                    <div className="sidebar__home">
                        <span className="sidebar__header">
                        <span className="sidebar__header__icon">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_79_131)">
                                <path d="M10.5 3.375C10.5 2.33947 9.66055 1.5 8.625 1.5C7.58945 1.5 6.75 2.33947 6.75 3.375C6.75 4.41053 7.58945 5.25 8.625 5.25C9.66055 5.25 10.5 4.41053 10.5 3.375Z" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
                                <path d="M5.25 3.375C5.25 2.33947 4.41053 1.5 3.375 1.5C2.33947 1.5 1.5 2.33947 1.5 3.375C1.5 4.41053 2.33947 5.25 3.375 5.25C4.41053 5.25 5.25 4.41053 5.25 3.375Z" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
                                <path d="M10.5 8.625C10.5 7.58945 9.66055 6.75 8.625 6.75C7.58945 6.75 6.75 7.58945 6.75 8.625C6.75 9.66055 7.58945 10.5 8.625 10.5C9.66055 10.5 10.5 9.66055 10.5 8.625Z" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
                                <path d="M5.25 8.625C5.25 7.58945 4.41053 6.75 3.375 6.75C2.33947 6.75 1.5 7.58945 1.5 8.625C1.5 9.66055 2.33947 10.5 3.375 10.5C4.41053 10.5 5.25 9.66055 5.25 8.625Z" stroke="white" stroke-width="1.3" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_79_131">
                                <rect width="12" height="12" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>

                            </span>
                            <span className="sidebar__header__text">Home</span>
                        </span>
                        {homePages.map((homePage) => (
                            <SidebarLink
                                key={homePage.name}
                                icon={homePage.icon}
                                text={homePage.name}
                                onClick={() => {
                                    
                                    setIsSidebarOpen(false);
                                    if(isSidebarOpen){
                                        toggleSidebar();
                                        onPageChange(homePage.name);
                                    }
                                   
                                    setUserSettings(null);
                                    handleDropdownClick();
                                }}
                            />
                        ))}
                    </div>
                    <div className="sidebar__docs">
                        <span className="sidebar__header">
                            <span className="sidebar__docs__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4253 3.28231C19.6271 2.95101 18.5745 2.67059 17.2694 2.32287L16.2094 2.04043C14.9041 1.69265 13.8516 1.4122 12.9939 1.30229C12.1033 1.18818 11.3124 1.241 10.5821 1.66025C9.85117 2.07986 9.40864 2.73583 9.06207 3.5614C8.72864 4.35566 8.44647 5.40287 8.09691 6.70016L7.04517 10.6032L7.04517 10.6032C6.69559 11.9004 6.41338 12.9476 6.30275 13.8013C6.18777 14.6885 6.24094 15.4779 6.66391 16.2064C7.08651 16.9342 7.74618 17.3737 8.57474 17.7176C9.3729 18.0489 10.4255 18.3293 11.7306 18.677L12.7907 18.9595C14.0959 19.3073 15.1484 19.5877 16.0061 19.6976C16.8967 19.8117 17.6877 19.7589 18.4179 19.3396C19.1488 18.92 19.5914 18.2641 19.9379 17.4385C20.2714 16.6442 20.5535 15.597 20.9031 14.2997L21.9548 10.3967C22.3044 9.09953 22.5866 8.05231 22.6973 7.19861C22.8122 6.31139 22.7591 5.52199 22.3361 4.79352C21.9135 4.06567 21.2538 3.62623 20.4253 3.28231ZM15.5 8.5C16.3284 8.5 17 7.82843 17 7C17 6.17157 16.3284 5.5 15.5 5.5C14.6716 5.5 14 6.17157 14 7C14 7.82843 14.6716 8.5 15.5 8.5Z" fill="#ffffff"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.42476 5.96656C6.58145 6.49615 6.27914 7.05249 5.74955 7.20917C4.16184 7.67891 3.67122 7.99964 3.43 8.4151C3.27585 8.68059 3.19912 9.0304 3.28691 9.72268C3.37843 10.4444 3.62427 11.3754 3.9895 12.7462L5.00185 16.5459C5.36709 17.9168 5.61705 18.8466 5.89654 19.5175C6.16472 20.1613 6.40448 20.424 6.66771 20.5751C6.93178 20.7267 7.28263 20.8022 7.97972 20.7109C8.70497 20.616 9.64091 20.366 11.0171 19.9951L11.4898 19.8678C12.0231 19.7241 12.5719 20.0399 12.7155 20.5731C12.8592 21.1064 12.5434 21.6552 12.0102 21.7989L11.4697 21.9445C10.1785 22.2925 9.11292 22.5796 8.23931 22.694C7.32231 22.814 6.46842 22.7668 5.67196 22.3096C4.87467 21.8519 4.40521 21.1385 4.05034 20.2866C3.71275 19.4763 3.42985 18.4143 3.08748 17.1292L2.03873 13.1929C1.69626 11.9076 1.41331 10.8457 1.3028 9.97429C1.18661 9.05805 1.23879 8.20589 1.7004 7.41087C2.38641 6.22933 3.65434 5.74336 5.18215 5.29135C5.71174 5.13467 6.26808 5.43697 6.42476 5.96656Z" fill="#ffffff"></path>
                            </svg>
                            </span>
                            <span className="sidebar__header__text">Docs</span>
                        </span>
                        {docPages.map((docPage) => (
                            <SidebarLink
                                key={docPage.name}
                                icon={docPage.icon}
                                text={docPage.name}
                                onClick={() => {
                                    
                                    setIsSidebarOpen(false);
                                    if(isSidebarOpen){
                                        toggleSidebar();
                                        onPageChange(docPage.name);
                                    }
                                    setUserSettings(null);
                                    handleDropdownClick();
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="sidebar__lower">
                    <PlanCard currentPlan={"Free plan"} monthlyVisitors={20} totalVisitors={100} isSidebarOpen={isSidebarOpen} />
                    <ProfileDropdown 
                    avatar="avatar" 
                    user={user}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    setUserSettings={setUserSettings}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                   
                    /> 

                </div>
            </div>
        </div>
    );
}

