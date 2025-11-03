'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';     
import { Suspense } from 'react';
import { SidebarSiteSkeleton } from '@components/Skeletons/SidebarSiteSkeleton';
import { useDashboard } from '@dashboard/DashboardContext';

import "./sideBar.css";

import { SidebarLink } from '@components/sidebarLink/SidebarLink';
import { User } from '@components/User/User';
import { SidebarSites } from '@components/sidebarSite/SidebarSites';
import { NewSite } from '@components/NewSite/NewSite';
import Link from 'next/link';
import { Tooltip } from '@components/tooltip/Tooltip';
import { SidebarSitesList } from './SidebarSitesList';
import { SiteName } from './siteName';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';

                                              

// names and icons maped in the sidebar. By changing here icons and names you change sidebar items
export const homePages = [

    {
      name: 'Websites',
      icon: <svg className="sidebar__link-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M18 20.5001C18.8888 20.3004 19.5638 19.9723 20.1088 19.4328C21.5 18.0554 21.5 15.8386 21.5 11.4051C21.5 6.97151 21.5 4.75472 20.1088 3.37739C18.7175 2.00006 16.4783 2.00006 12 2.00006C7.52166 2.00006 5.28249 2.00006 3.89124 3.37739C2.5 4.75472 2.5 6.97151 2.5 11.4051C2.5 15.8386 2.5 18.0554 3.89124 19.4328C4.43619 19.9723 5.11124 20.3004 6 20.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M2.5 8.50006H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                <path d="M6.99981 5.50006H7.00879" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10.9998 5.50006H11.0088" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M15.5 17.5001V15.0001C13.5 15.0001 12 14.0001 12 14.0001C12 14.0001 10.5 15.0001 8.5 15.0001V17.5001C8.5 21.0001 12 22.0001 12 22.0001C12 22.0001 15.5 21.0001 15.5 17.5001Z" stroke="currentColor" fill='currentColor' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
    },
    {
        name: 'Analytics',
        icon: <svg className="sidebar__link-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6667 3C10.6667 2.73478 10.772 2.48043 10.9596 2.29289C11.1471 2.10536 11.4015 2 11.6667 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H11.6667C11.4015 14 11.1471 13.8946 10.9596 13.7071C10.772 13.5196 10.6667 13.2652 10.6667 13V3ZM6.33333 7C6.33333 6.73478 6.43869 6.48043 6.62623 6.29289C6.81376 6.10536 7.06812 6 7.33333 6H8.66667C8.93188 6 9.18624 6.10536 9.37377 6.29289C9.56131 6.48043 9.66667 6.73478 9.66667 7V13C9.66667 13.2652 9.56131 13.5196 9.37377 13.7071C9.18624 13.8946 8.93188 14 8.66667 14H7.33333C7.06812 14 6.81376 13.8946 6.62623 13.7071C6.43869 13.5196 6.33333 13.2652 6.33333 13V7ZM3 10C2.73478 10 2.48043 10.1054 2.29289 10.2929C2.10536 10.4804 2 10.7348 2 11V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H4.33333C4.59855 14 4.8529 13.8946 5.04044 13.7071C5.22798 13.5196 5.33333 13.2652 5.33333 13V11C5.33333 10.7348 5.22798 10.4804 5.04044 10.2929C4.8529 10.1054 4.59855 10 4.33333 10H3Z" fill="currentColor"/>
        </svg>
        
    },
  ];
export const siteMenuPages = [

        {
            name: 'Builder',
            icon:   <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H14V2.72727H0V0Z" fill="currentColor"/>
                        <path d="M3.73333 10V4.54545H9.33333L3.73333 10Z" fill="currentColor"/>
                        <path d="M7.46667 10V4.54545H12.1333L7.46667 10Z" fill="currentColor"/>
                    </svg>
            
            
        },
        {
            name: 'Copy Script',
            icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.08398 8.58398C5.08398 6.93408 5.08398 6.10913 5.59655 5.59655C6.10913 5.08398 6.93408 5.08398 8.58398 5.08398H9.16732C10.8172 5.08398 11.6422 5.08398 12.1547 5.59655C12.6673 6.10913 12.6673 6.93408 12.6673 8.58398V9.16732C12.6673 10.8172 12.6673 11.6422 12.1547 12.1547C11.6422 12.6673 10.8172 12.6673 9.16732 12.6673H8.58398C6.93408 12.6673 6.10913 12.6673 5.59655 12.1547C5.08398 11.6422 5.08398 10.8172 5.08398 9.16732V8.58398Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.74994 5.08333C9.74854 3.35836 9.72247 2.46487 9.22033 1.85308C9.12338 1.73494 9.01506 1.6266 8.89693 1.52964C8.25153 1 7.29271 1 5.375 1C3.4573 1 2.49845 1 1.85308 1.52964C1.73494 1.6266 1.6266 1.73494 1.52964 1.85308C1 2.49845 1 3.4573 1 5.375C1 7.29271 1 8.25153 1.52964 8.89693C1.6266 9.01506 1.73494 9.12338 1.85308 9.22033C2.46487 9.72247 3.35836 9.74854 5.08333 9.74994" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            
        },
        {
            name: 'Settings',
            icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.29734 9.11365L1.75 12.25L4.88653 11.7025C5.12307 11.6613 5.34111 11.548 5.5109 11.3782L11.9937 4.89533C12.3354 4.55362 12.3354 3.99959 11.9936 3.65789L10.342 2.00627C10.0003 1.66457 9.44628 1.66458 9.10456 2.00628L2.62168 8.48931C2.45189 8.65906 2.33862 8.87711 2.29734 9.11365Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.16602 3.5L10.4993 5.83333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
            
        },

    
  ];
export const profilePages = [
    {
        name: 'Account',
        icon: <svg className="dropdown__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.07556 1.17164C4.90966 1.14943 4.7698 1.19742 4.67459 1.23897C4.58706 1.27716 4.48831 1.33292 4.39251 1.38701L3.0805 2.13864C2.99544 2.19881 2.88051 2.2946 2.81454 2.4496C2.74252 2.61882 2.76576 2.78937 2.78287 2.88803C2.80138 2.99477 2.83979 3.14174 2.87654 3.28239C3.10768 4.16719 2.54306 5.11903 1.62906 5.36399L1.61296 5.3683C1.47467 5.40534 1.3451 5.44006 1.24376 5.47659C1.14895 5.51077 0.990505 5.57494 0.878855 5.7198C0.776246 5.8529 0.749045 5.99885 0.738341 6.1021C0.728471 6.19736 0.728495 6.31128 0.728518 6.42212V7.57665C0.728495 7.68748 0.728471 7.80141 0.738341 7.89667C0.749045 7.99992 0.77624 8.14581 0.878843 8.27892C0.990487 8.42377 1.14893 8.48793 1.24373 8.52212C1.34507 8.55869 1.62903 8.63476 1.62903 8.63476C2.5427 8.8797 3.10695 9.83135 2.87566 10.7163C2.87566 10.7163 2.80047 11.0038 2.78195 11.1106C2.76483 11.2092 2.74158 11.3798 2.81359 11.549C2.87955 11.7041 2.99449 11.7999 3.07956 11.8601L4.39157 12.6117C4.48734 12.6658 4.58617 12.7215 4.67369 12.7597C4.76891 12.8013 4.90879 12.8493 5.0747 12.8271C5.25505 12.8029 5.38873 12.7 5.4656 12.6357C5.54723 12.5674 5.75247 12.3638 5.75247 12.3638C6.09279 12.0263 6.54604 11.8574 6.99935 11.8573C7.45266 11.8574 7.90591 12.0263 8.24623 12.3638C8.24623 12.3638 8.4515 12.5674 8.53311 12.6357C8.60999 12.7 8.74363 12.8029 8.924 12.8271C9.0899 12.8493 9.22978 12.8013 9.32504 12.7597C9.41254 12.7215 9.5113 12.6658 9.60708 12.6117L10.9191 11.8601C11.0042 11.7999 11.1191 11.7041 11.1851 11.549C11.2571 11.3798 11.2339 11.2092 11.2167 11.1106C11.1982 11.0038 11.1231 10.7163 11.1231 10.7163C10.8918 9.83135 11.456 8.8797 12.3697 8.63476C12.3697 8.63476 12.6537 8.55869 12.755 8.52212C12.8498 8.48793 13.0082 8.42377 13.1199 8.27892C13.2225 8.14581 13.2497 7.99992 13.2604 7.89667C13.2702 7.80141 13.2702 7.68748 13.2702 7.57665V6.42212C13.2702 6.31128 13.2702 6.19736 13.2604 6.1021C13.2497 5.99885 13.2225 5.8529 13.1199 5.7198C13.0082 5.57494 12.8498 5.51077 12.7549 5.47659C12.6536 5.44006 12.524 5.40534 12.3857 5.3683L12.3696 5.36399C11.4556 5.11903 10.891 4.16719 11.1222 3.28239C11.1589 3.14174 11.1973 2.99477 11.2159 2.88803C11.233 2.78937 11.2562 2.61882 11.1842 2.4496C11.1182 2.2946 11.0032 2.19881 10.9182 2.13864L9.60621 1.38701C9.51037 1.33292 9.41167 1.27716 9.32411 1.23897C9.22891 1.19742 9.08903 1.14943 8.92313 1.17164C8.74282 1.19579 8.60912 1.29872 8.53223 1.36298C8.45063 1.43122 8.24535 1.63481 8.24535 1.63481C7.90521 1.97206 7.45231 2.14076 6.99935 2.14088C6.54639 2.14076 6.09349 1.97206 5.75338 1.63481C5.75338 1.63481 5.54809 1.43122 5.46647 1.36298C5.3896 1.29872 5.25591 1.19579 5.07556 1.17164ZM6.99935 9.04099C8.12693 9.04099 9.04102 8.12691 9.04102 6.99932C9.04102 5.87174 8.12693 4.95768 6.99935 4.95768C5.87177 4.95768 4.95768 5.87174 4.95768 6.99932C4.95768 8.12691 5.87177 9.04099 6.99935 9.04099Z" fill="currentColor"/>
              </svg>
        
    },

    {
        name: 'Billing',
        icon: <svg className='dropdown__icon' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.90212 1.89648C8.97487 1.89648 9.81732 1.89647 10.4815 1.9715C11.1594 2.04808 11.7092 2.20776 12.1662 2.56865C12.303 2.67669 12.4298 2.79601 12.5451 2.92537C12.9337 3.36124 13.1073 3.88955 13.1899 4.53773C13.1994 4.61231 13.2041 4.6496 13.1956 4.68236C13.1819 4.73471 13.1418 4.78034 13.0916 4.80052C13.0602 4.81315 13.0209 4.81315 12.9422 4.81315H1.05649C0.977873 4.81315 0.938557 4.81315 0.907144 4.80052C0.856937 4.78034 0.816762 4.73471 0.803089 4.68236C0.794537 4.6496 0.799292 4.61231 0.808806 4.53773C0.891458 3.88955 1.06499 3.36124 1.45359 2.92537C1.56892 2.79601 1.69575 2.67669 1.83256 2.56865C2.28953 2.20776 2.83927 2.04808 3.51719 1.9715C4.18137 1.89647 5.02387 1.89648 6.09664 1.89648H7.90212ZM13.2702 7.03139C13.2702 8.03712 13.2702 8.83389 13.1899 9.4636C13.1073 10.1117 12.9337 10.6401 12.5451 11.0759C12.4298 11.2053 12.303 11.3246 12.1662 11.4326C11.7092 11.7936 11.1594 11.9532 10.4815 12.0298C9.81732 12.1048 8.97487 12.1048 7.90206 12.1048H6.09664C5.02386 12.1048 4.18137 12.1048 3.51719 12.0298C2.83926 11.9532 2.28952 11.7936 1.83255 11.4326C1.69575 11.3246 1.56891 11.2053 1.45359 11.0759C1.06499 10.6401 0.891452 10.1117 0.8088 9.4636C0.728504 8.83389 0.72851 8.03706 0.728516 7.03139V6.96991C0.728516 6.63403 0.72851 6.32148 0.731502 6.03063C0.733153 5.8698 0.733982 5.78939 0.785122 5.73877C0.836269 5.68815 0.917288 5.68815 1.07933 5.68815H12.9194C13.0814 5.68815 13.1624 5.68815 13.2136 5.73877C13.2647 5.78939 13.2656 5.8698 13.2672 6.03063C13.2702 6.32136 13.2702 6.63385 13.2702 6.96956V7.03139ZM5.97852 9.33398C5.97852 9.09237 6.1744 8.89648 6.41602 8.89648H7.29102C7.53263 8.89648 7.72852 9.09237 7.72852 9.33398C7.72852 9.5756 7.53263 9.77148 7.29102 9.77148H6.41602C6.1744 9.77148 5.97852 9.5756 5.97852 9.33398ZM9.04102 8.89648C8.7994 8.89648 8.60352 9.09237 8.60352 9.33398C8.60352 9.5756 8.7994 9.77148 9.04102 9.77148H11.0827C11.3243 9.77148 11.5202 9.5756 11.5202 9.33398C11.5202 9.09237 11.3243 8.89648 11.0827 8.89648H9.04102Z" fill="currentColor"/>
        </svg>
        
        
    },

    {
        name: 'Affiliate',
        icon: <svg className="dropdown__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.58268 4.08333C7.58268 5.372 6.53799 6.41667 5.24935 6.41667C3.96068 6.41667 2.91602 5.372 2.91602 4.08333C2.91602 2.79467 3.96068 1.75 5.24935 1.75C6.53799 1.75 7.58268 2.79467 7.58268 4.08333Z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8.75 6.41667C10.0386 6.41667 11.0833 5.372 11.0833 4.08333C11.0833 2.79467 10.0386 1.75 8.75 1.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.41602 8.16602H4.08268C2.47185 8.16602 1.16602 9.47187 1.16602 11.0827C1.16602 11.727 1.68835 12.2493 2.33268 12.2493H8.16602C8.81037 12.2493 9.33268 11.727 9.33268 11.0827C9.33268 9.47187 8.02683 8.16602 6.41602 8.16602Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M9.91602 8.16602C11.5268 8.16602 12.8327 9.47187 12.8327 11.0827C12.8327 11.727 12.3104 12.2493 11.666 12.2493H10.791" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
    }

];

export const otherpages = [
    {
        name: 'Support',
        icon: <svg className="sidebar__link-svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.26553 11.8938C10.7056 11.7316 12.6493 9.76038 12.8092 7.28571C12.8405 6.80142 12.8405 6.29987 12.8092 5.81559C12.6493 3.3409 10.7056 1.36967 8.26553 1.20747C7.43306 1.15214 6.56395 1.15225 5.73316 1.20747C3.29308 1.36967 1.34942 3.3409 1.18949 5.81559C1.15819 6.29987 1.15819 6.80142 1.18949 7.28571C1.24774 8.18702 1.64635 9.02153 2.11563 9.7262C2.3881 10.2195 2.20828 10.8352 1.92447 11.3731C1.71984 11.7609 1.61752 11.9548 1.69967 12.0948C1.78183 12.2349 1.96533 12.2394 2.33235 12.2483C3.05816 12.266 3.54758 12.0602 3.93608 11.7737C4.15641 11.6112 4.26659 11.53 4.34252 11.5206C4.41845 11.5113 4.56788 11.5729 4.86669 11.6959C5.13525 11.8065 5.44707 11.8748 5.73316 11.8938C6.56395 11.949 7.43306 11.9492 8.26553 11.8938Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M7.00065 9.04232V9.33398M7.00065 7.58398V7.29232L7.97931 5.82432C8.10193 5.64044 8.16732 5.42438 8.16732 5.20339C8.16732 4.55634 7.6275 4.08398 7.00065 4.08398C6.3563 4.08398 5.83398 4.60632 5.83398 5.25065" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
    }, 
    {
        name: 'Appearance',
        icon: <svg className="sidebar__link-svg" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_64_433)">
        <path d="M11.3327 7.99935C11.3327 9.84028 9.84028 11.3327 7.99935 11.3327C6.1584 11.3327 4.66602 9.84028 4.66602 7.99935C4.66602 6.1584 6.1584 4.66602 7.99935 4.66602C9.84028 4.66602 11.3327 6.1584 11.3327 7.99935Z" stroke="currentColor" strokeWidth="1.5"/>
        <path opacity="0.4" d="M8.00065 1.33398V2.33398M8.00065 13.6673V14.6673M12.7145 12.7149L12.0074 12.0077M3.99349 3.99349L3.28638 3.28638M14.6673 8.00065H13.6673M2.33398 8.00065H1.33398M12.7149 3.28646L12.0077 3.99356M3.99382 12.0078L3.28671 12.7149" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
    isSidebarOpen, 
    setIsSidebarOpen, 
    toggleSidebar, 
    setUserSettings,
    user,
    webs,
    setIsModalOpen,
    setModalType,
    isModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    setSiteData,
    siteData,
    modalType,
    setSelectedSite,
    setIsSiteOpen,
    isSiteOpen,
    checkProfilePicture,
    profileStyle,
    checkSitePicture,
    SiteStyle,
    openChangeModal,
    showNotification,
    isChangeModalOpen,
    isSidebarMenu,
    setIsSidebarMenu,
    isContentBlocked,
    setBlockContent,
    openChangeModalSettings,
    }) {
    const router = useRouter();
    const { 'site-slug': siteSlug } = useParams();
    const pathname = usePathname();
    const [isActive, setIsActive] = useState('');
    const [hasSitesOverflow, setHasSitesOverflow] = useState(false);
    const [windowResizedWidth, setWindowResizedWidth] = useState(0);

    //const to check if you are clicking outside the sidebar and the action button
    const sidebarContainerRef = useRef(null);
    const sidebarActionRef = useRef(null);
    const sitesDisplayRef = useRef(null);
    // if siteSlug the sidebar content change to the site menu

    useEffect(() => {
        if(siteSlug) {
            setIsSiteOpen(true);
        } else {
            setIsSiteOpen(false);
        }
    }, [siteSlug, setIsSiteOpen]);

    // Prefetch all routes on sidebar mount (page load)
    useEffect(() => {
        // Global routes
        router.prefetch('/');
        // If there is a site, prefetch the site's views
        if (siteSlug) {
        const routes = [
            `/${siteSlug}`,
            `/${siteSlug}/analytics`,
            `/${siteSlug}/scanner`,
            `/${siteSlug}/proof-of-consent`,
            `/${siteSlug}/integrations`,
        ];
        routes.forEach((r) => router.prefetch(r));
        }
    }, [router, siteSlug]);

    // Update isActive based on current pathname
    useEffect(() => {
        const routeMap = {
          [`/${siteSlug}`]: 'Home',
          [`/${siteSlug}/scanner`]: 'Scanner',
          [`/${siteSlug}/integrations`]: 'Integrations',
          [`/${siteSlug}/analytics`]: 'Analytics',
          [`/${siteSlug}/proof-of-consent`]: 'Proof of Consent',
        };
      
        setIsActive(routeMap[pathname] || '');
      }, [pathname, siteSlug]);

    // function to close the sidebar when clicking outside in mobile 
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only handle clicks outside on mobile devices
            if (window.innerWidth < 767 && isSidebarMenu) {
                // Don't close sidebar if a modal is open
                if (isModalOpen || isChangeModalOpen) {
                    return;
                }
                
                // Check if click is outside both the container and the action button
                const isOutsideContainer = sidebarContainerRef.current && !sidebarContainerRef.current.contains(event.target);
                const isOutsideAction = sidebarActionRef.current && !sidebarActionRef.current.contains(event.target);
                
                if (isOutsideContainer && isOutsideAction) {
                    setIsSidebarMenu(false);
                    setBlockContent(!isContentBlocked);
                }
            }
        };
        const handleEscape = (event) => {
            // Only handle clicks outside on mobile devices
            if (event.key === 'Escape' && window.innerWidth < 767 && isSidebarMenu) {
                // Don't close sidebar if a modal is open
                if (isModalOpen || isChangeModalOpen) {
                    return;
                }
                
                setIsSidebarMenu(false);
                setBlockContent(!isContentBlocked);
            }
        };

        // When clicking outside
        document.addEventListener('mousedown', handleClickOutside);
        // When pressing ESC
        document.addEventListener('keydown', handleEscape);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isSidebarOpen, setIsSidebarOpen, toggleSidebar, isModalOpen, isSidebarMenu]);

    // Define overviewPages inside the component to access siteData
    const overviewPages = [
        {
            href: `/${siteSlug}`,
            name:'Home',
            icon: <svg width="12" height="12" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10.285V4.07039C0 3.88736 0.0409523 3.71409 0.122857 3.5506C0.204762 3.38711 0.317619 3.25245 0.461429 3.14664L4.30786 0.23094C4.50929 0.0769801 4.73929 0 4.99786 0C5.25643 0 5.48786 0.0769801 5.69214 0.23094L9.53857 3.14592C9.68286 3.25174 9.79571 3.38663 9.87714 3.5506C9.95905 3.71409 10 3.88736 10 4.07039V10.285C10 10.4766 9.92881 10.6437 9.78643 10.7862C9.64405 10.9287 9.47714 11 9.28571 11H6.86857C6.70476 11 6.56762 10.9447 6.45714 10.8341C6.34667 10.7231 6.29143 10.5858 6.29143 10.4223V7.01254C6.29143 6.84905 6.23619 6.71201 6.12571 6.60143C6.01476 6.49037 5.87762 6.43484 5.71429 6.43484H4.28571C4.12238 6.43484 3.98548 6.49037 3.875 6.60143C3.76405 6.71201 3.70857 6.84905 3.70857 7.01254V10.423C3.70857 10.5865 3.65333 10.7235 3.54286 10.8341C3.43238 10.9447 3.29548 11 3.13214 11H0.714286C0.522857 11 0.355952 10.9287 0.213571 10.7862C0.0711903 10.6437 0 10.4766 0 10.285Z" fill="currentColor"/>
            </svg> 
        },
        {
            href: `/${siteSlug}/analytics`,
            name:'Analytics',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path opacity="0.3" d="M7.03809 0.166992C8.49856 0.166986 9.64569 0.166979 10.5413 0.287386C11.459 0.410779 12.1872 0.668799 12.7594 1.24093C13.3315 1.81307 13.5895 2.54124 13.7129 3.45901C13.8333 4.35462 13.8333 5.50173 13.8333 6.96219V7.03846C13.8333 8.49893 13.8333 9.64606 13.7129 10.5417C13.5895 11.4594 13.3315 12.1876 12.7594 12.7597C12.1872 13.3319 11.459 13.5899 10.5413 13.7133C9.64569 13.8337 8.49856 13.8337 7.03809 13.8337H6.96183C5.50136 13.8337 4.35425 13.8337 3.45864 13.7133C2.54087 13.5899 1.8127 13.3319 1.24057 12.7597C0.668433 12.1876 0.410413 11.4594 0.287019 10.5417C0.166613 9.64606 0.166619 8.49893 0.166626 7.03846V6.96219C0.166619 5.50174 0.166613 4.35462 0.287019 3.45901C0.410413 2.54124 0.668433 1.81307 1.24057 1.24093C1.8127 0.668799 2.54087 0.410779 3.45864 0.287386C4.35425 0.166979 5.50137 0.166986 6.96183 0.166992H7.03809Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.66663 7.16699C3.94277 7.16699 4.16663 7.39086 4.16663 7.66699V10.3337C4.16663 10.6098 3.94277 10.8337 3.66663 10.8337C3.39049 10.8337 3.16663 10.6098 3.16663 10.3337V7.66699C3.16663 7.39086 3.39049 7.16699 3.66663 7.16699Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M7 3.16699C7.27613 3.16699 7.5 3.39085 7.5 3.66699V10.3337C7.5 10.6098 7.27613 10.8337 7 10.8337C6.72387 10.8337 6.5 10.6098 6.5 10.3337V3.66699C6.5 3.39085 6.72387 3.16699 7 3.16699Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.3334 5.83301C10.6095 5.83301 10.8334 6.05687 10.8334 6.33301V10.333C10.8334 10.6091 10.6095 10.833 10.3334 10.833C10.0572 10.833 9.83337 10.6091 9.83337 10.333V6.33301C9.83337 6.05687 10.0572 5.83301 10.3334 5.83301Z" fill="currentColor"/>
            </svg>
            
        },
        {
            href: `/${siteSlug}/scanner`,
            name:'Scanner',
            icon: <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.728516 6.99624C0.728516 3.23765 4.15007 0.381093 7.73715 0.762745C8.06726 0.797874 8.46993 0.886272 8.63653 1.27772C8.70607 1.44123 8.70951 1.60997 8.70321 1.73974C8.69755 1.85688 8.67392 2.03939 8.65701 2.1702C8.59722 2.63583 8.76171 3.06457 9.02252 3.26742C9.07963 3.31189 9.14817 3.36616 9.2047 3.42516C9.26519 3.48824 9.3412 3.58596 9.37299 3.72509C9.40455 3.86302 9.37917 3.98304 9.35409 4.06366C9.33041 4.13973 9.29453 4.21803 9.26455 4.28237C9.17886 4.46656 9.20715 4.70298 9.37048 4.92683C9.53422 5.15122 9.79725 5.30569 10.0714 5.31709C10.1691 5.32115 10.2739 5.32588 10.3665 5.34027C10.4637 5.35536 10.585 5.38599 10.7005 5.46627C10.819 5.54861 10.8911 5.65484 10.9396 5.75107C10.9849 5.84078 11.0202 5.94362 11.0517 6.04104C11.1795 6.43607 11.5274 6.69974 11.9224 6.76892C12.0268 6.78572 12.3359 6.83624 12.4174 6.85234C12.5616 6.88086 12.7413 6.9249 12.8969 7.02524C13.0779 7.1419 13.1986 7.31527 13.2463 7.53641C13.2884 7.73154 13.2699 7.94615 13.2285 8.1649C12.6777 11.073 10.1125 13.2701 7.03312 13.2701C3.55336 13.2701 0.728516 10.4634 0.728516 6.99624ZM7.0039 6.99928C7.0039 7.32145 6.74274 7.58261 6.42057 7.58261H6.41532C6.09314 7.58261 5.832 7.32145 5.832 6.99928C5.832 6.6771 6.09314 6.41595 6.41532 6.41595H6.42057C6.74274 6.41595 7.0039 6.6771 7.0039 6.99928ZM3.5039 6.41595C3.82607 6.41595 4.08724 6.15479 4.08724 5.83261C4.08724 5.51044 3.82607 5.24928 3.5039 5.24928H3.49867C3.1765 5.24928 2.91533 5.51044 2.91533 5.83261C2.91533 6.15479 3.1765 6.41595 3.49867 6.41595H3.5039ZM7.58723 10.4993C7.58723 10.8215 7.32607 11.0826 7.0039 11.0826H6.99865C6.67647 11.0826 6.41532 10.8215 6.41532 10.4993C6.41532 10.1771 6.67647 9.91595 6.99865 9.91595H7.0039C7.32607 9.91595 7.58723 10.1771 7.58723 10.4993ZM6.14202 3.80864C6.31288 3.63779 6.31288 3.36077 6.14202 3.18992C5.97117 3.01907 5.69418 3.01907 5.52332 3.18992L4.93999 3.77325C4.76914 3.94411 4.76914 4.22112 4.93999 4.39197C5.11084 4.56282 5.38786 4.56282 5.55871 4.39197L6.14202 3.80864ZM10.2254 7.8566C10.3962 8.02746 10.3962 8.30443 10.2254 8.47529L9.64202 9.05862C9.47117 9.22948 9.1942 9.22948 9.02334 9.05862C8.85248 8.88776 8.85248 8.6108 9.02334 8.43994L9.60667 7.8566C9.77753 7.68575 10.0545 7.68575 10.2254 7.8566ZM3.77332 9.05862C3.60247 8.88776 3.60247 8.6108 3.77332 8.43994C3.94418 8.26908 4.22119 8.26908 4.39204 8.43994L4.97537 9.02327C5.14623 9.19413 5.14623 9.4711 4.97537 9.64195C4.80452 9.81281 4.52751 9.81281 4.35666 9.64195L3.77332 9.05862Z" fill="currentColor"/>
            </svg>
            
        },
        {
            href: `/${siteSlug}/proof-of-consent`,
            name:'Proof of Consent',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
            <path opacity="0.4" d="M6.75831 15.0548C6.44138 15.1672 6.10504 15.1668 5.72504 15.1663C4.70791 15.1663 3.76948 15.1662 3.11698 15.0896C2.44185 15.0104 1.86338 14.8418 1.37337 14.4446C1.19349 14.2988 1.02965 14.1341 0.884622 13.9533C0.489535 13.4608 0.321735 12.8793 0.242915 12.2006C0.166728 11.5448 0.166735 10.7204 0.166748 9.69797V6.64892C0.166735 5.46094 0.166722 4.50336 0.267448 3.75025C0.372028 2.96834 0.595762 2.31 1.11593 1.78712C1.6361 1.26425 2.29104 1.03936 3.0689 0.934228C3.81811 0.832975 4.86551 0.832988 6.04738 0.833008C7.22924 0.832988 8.18184 0.832975 8.93111 0.934228C9.70898 1.03936 10.3639 1.26425 10.884 1.78712C11.4042 2.31 11.628 2.96834 11.7325 3.75025C11.8332 4.50337 11.8332 5.46094 11.8332 6.64894L11.8333 8.9651C11.834 9.40737 11.8346 9.79984 11.6852 10.1624C11.5358 10.5249 11.2593 10.802 10.9478 11.1142L7.75918 14.3193C7.49091 14.5898 7.25338 14.8291 6.95018 14.9749C6.88764 15.005 6.82364 15.0316 6.75831 15.0548Z" fill="currentColor"/>
            <path d="M6.75831 15.0551C6.82357 15.0319 6.88764 15.0053 6.95011 14.9753C7.25337 14.8295 7.49084 14.5901 7.75917 14.3197L10.9477 11.1145C11.2593 10.8023 11.5358 10.5252 11.6852 10.1627C11.751 10.0029 11.7878 9.83726 11.8082 9.66406H10.4876C9.57591 9.66406 9.14351 9.6646 8.56557 9.74226C7.96551 9.823 7.46024 9.9956 7.05897 10.3969C6.65771 10.7981 6.48511 11.3034 6.40437 11.9035C6.32684 12.4803 6.32684 12.9176 6.32691 13.8255V15.1475C6.47577 15.1322 6.61891 15.1046 6.75831 15.0551Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9.16673 4.66699C9.16673 4.94313 8.94287 5.16699 8.66673 5.16699H3.33337C3.05723 5.16699 2.83337 4.94314 2.83337 4.66699C2.83337 4.39085 3.05723 4.16699 3.33337 4.16699H8.66673C8.94287 4.16699 9.16673 4.39085 9.16673 4.66699Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.50007 7.33301C6.50007 7.60914 6.2762 7.83301 6.00007 7.83301H3.33337C3.05723 7.83301 2.83337 7.60914 2.83337 7.33301C2.83337 7.05681 3.05723 6.83301 3.33337 6.83301H6.00007C6.2762 6.83301 6.50007 7.05681 6.50007 7.33301Z" fill="currentColor"/>
            </svg> 
        },
        {
            href: `/${siteSlug}/integrations`,
            name:'Integrations',
            icon: <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.25 3.79102C12.25 4.75751 11.4665 5.54102 10.5 5.54102C9.53347 5.54102 8.75 4.75751 8.75 3.79102C8.75 2.82452 9.53347 2.04102 10.5 2.04102C11.4665 2.04102 12.25 2.82452 12.25 3.79102Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M5.25 7C5.25 7.96652 4.4665 8.75 3.5 8.75C2.5335 8.75 1.75 7.96652 1.75 7C1.75 6.03347 2.5335 5.25 3.5 5.25C4.4665 5.25 5.25 6.03347 5.25 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M12.25 10.209C12.25 11.1755 11.4665 11.959 10.5 11.959C9.53347 11.959 8.75 11.1755 8.75 10.209C8.75 9.24246 9.53347 8.45898 10.5 8.45898C11.4665 8.45898 12.25 9.24246 12.25 10.209Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M4.95898 6.12471L8.75065 4.375M4.95898 7.58333L8.75065 9.33304" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
        },

    ];

    //const to know if there are no web
    const filteredWebs = webs.filter(web => {
        return web.userid === user?.id;
    }).sort((a, b) => new Date(a.Date) - new Date(b.Date)); 
    

    //function to open the sidebar
    const handleToggleSidebar = () => {
      
        if(window.innerWidth === 0) return;
        
        if(window.innerWidth <= 767){
            setIsSidebarMenu(!isSidebarMenu);
            setBlockContent(!isContentBlocked);
        }else{
            toggleSidebar();
        }
    };

    // State to know if the dashboard is hovered
    const [isDashboardHovered, setIsDashboardHovered] = useState(false);
    // State to know if the overview link is hovered
    const [hoveredOverviewLink, setHoveredOverviewLink] = useState(null);

    useEffect(() => {
        const checkOverflowAndWindowResize = () => {
            if (sitesDisplayRef.current) {
                const el = sitesDisplayRef.current;
                setHasSitesOverflow(el.scrollHeight > el.clientHeight);
            }

            setWindowResizedWidth(window.innerWidth);

            if(window.innerWidth >= 767){
                setBlockContent(false);
            }
        };

        checkOverflowAndWindowResize();
        window.addEventListener('resize', checkOverflowAndWindowResize);

        return () => window.removeEventListener('resize', checkOverflowAndWindowResize);
    }, [filteredWebs, isSiteOpen]);

    return (
        <div className={`${isSidebarMenu ? 'sidebar__backdrop' : ''}`}>
            <div className={`sidebar ${(isSidebarOpen ? 'sidebar--open' : 'sidebar--closed')} ${isSidebarMenu ? 'sidebar--menu' : ''}`}>
                {/* Logo and action button */}
                <div className="sidebar__logos">
                    <div className="sidebar__logo">
                        <div className="sidebar__logo-img"></div>
                    </div>
                    <a 
                        ref={sidebarActionRef}
                        className="sidebar__action" 
                        onClick={handleToggleSidebar}
                        tabIndex={0}
                        aria-label="Toggle sidebar"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleToggleSidebar();
                            }
                        }}
                    >
                        <div className='sidebar__desk'></div>

                        <svg className={`sidebar__burger ${isSidebarMenu ? 'sidebar__burger--closed' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 4.44772 3.44772 4 4 4L20 4C20.5523 4 21 4.44772 21 5C21 5.55229 20.5523 6 20 6L4 6C3.44772 6 3 5.55228 3 5Z" fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M3 12C3 11.4477 3.44772 11 4 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L4 13C3.44772 13 3 12.5523 3 12Z" fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M3 19C3 18.4477 3.44772 18 4 18L20 18C20.5523 18 21 18.4477 21 19C21 19.5523 20.5523 20 20 20L4 20C3.44772 20 3 19.5523 3 19Z" fill="currentColor"></path>
                        </svg>
                        <svg className={`sidebar__cross ${isSidebarMenu ? 'sidebar__cross--active' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289Z" fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289Z" fill="currentColor"></path>
                        </svg>

                    </a>
                    
                </div>
                {/* Sidebar container divided in two parts: upper and lower */}
                
                <div 
                    ref={sidebarContainerRef}
                    className="sidebar__container" 
                >
                    {/* Upper part of the sidebar */}
                    <div className="sidebar__upper">
                        <div className="sidebar__home">
                                <Link
                                href={`/`}
                                className={`sidebar-header ${pathname === '/' ? 'sidebar-header--active' : ''} ${isSidebarMenu ? 'sidebar-header--mobile' : ''}`}
                                onMouseEnter={() => setIsDashboardHovered(true)}
                                onMouseLeave={() => setIsDashboardHovered(false)}
                                onClick={() => setIsSidebarMenu(false)}
                            >
                                <span className="sidebar-header__icon">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_209_250)">
                                        <path d="M10.5 3.375C10.5 2.33947 9.66055 1.5 8.625 1.5C7.58945 1.5 6.75 2.33947 6.75 3.375C6.75 4.41053 7.58945 5.25 8.625 5.25C9.66055 5.25 10.5 4.41053 10.5 3.375Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                        <path d="M5.25 3.375C5.25 2.33947 4.41053 1.5 3.375 1.5C2.33947 1.5 1.5 2.33947 1.5 3.375C1.5 4.41053 2.33947 5.25 3.375 5.25C4.41053 5.25 5.25 4.41053 5.25 3.375Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                        <path d="M10.5 8.625C10.5 7.58945 9.66055 6.75 8.625 6.75C7.58945 6.75 6.75 7.58945 6.75 8.625C6.75 9.66055 7.58945 10.5 8.625 10.5C9.66055 10.5 10.5 9.66055 10.5 8.625Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                        <path d="M5.25 8.625C5.25 7.58945 4.41053 6.75 3.375 6.75C2.33947 6.75 1.5 7.58945 1.5 8.625C1.5 9.66055 2.33947 10.5 3.375 10.5C4.41053 10.5 5.25 9.66055 5.25 8.625Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_209_250">
                                        <rect width="12" height="12" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                    {!isSidebarOpen && !isSidebarMenu &&(
                                        <Tooltip
                                            message="Dashboard"
                                            responsivePosition={{ desktop: 'dashboard', mobile: 'top' }}
                                            open={isDashboardHovered}
                                            animationType="SCALE_LEFT"
                                        />
                                    )}
                                </span>
                                <span className="sidebar-header__text">Dashboard</span>
                            </Link>
                        </div>

                        <div className="sidebar__divider"></div>
                        
                        <div className="sidebar__sites">
                            <div className="sidebar__sites-header">
                                {/* render different headers depending you are inside site or not */}
                                
                                <Suspense fallback={<UserNameSkeleton />}>
                                    {siteSlug ? (
                                        <SiteName siteSlug={siteSlug}/>
                                    ) : (
                                        <span className='sidebar__sites-title'>Sites</span>
                                    )}
                                </Suspense>
                              
                            </div>
                            <div className="sidebar__sites-container">
                                {!!siteSlug ? (
                                    // if we are inside a site, show the overviewPages
                                    <div className={`sidebar__sites-display ${hasSitesOverflow ? 'sidebar__sites-display--overflow' : ''}`} ref={sitesDisplayRef}>
                                        <div className="sidebar__sites-display-links">
                                        {overviewPages.map((page) => (
                                            <div
                                                key={page.name}
                                                className="sidebar__sites-tooltip-wrapper"
                                                onMouseEnter={() => setHoveredOverviewLink(page.name)}
                                                onMouseLeave={() => setHoveredOverviewLink(null)}
                                            >
                                                <Link
                                                    href={page.href}
                                                    className={`sidebar__site-link ${isActive === page.name ? 'sidebar__site-link--active' : ''}`}
                                                    onClick={() => {
                                                        if(typeof window !== 'undefined' && window.innerWidth < 767) {
                                                            setIsSidebarMenu(false);
                                                            toggleSidebar();
                                                        }
                                                    }}
                                                >
                                                    <span className='sidebar__site-link-icon'>{page.icon}</span>
                                                    <span className='sidebar__site-link-text'>{page.name}</span>
                                                </Link>
                                                {!isSidebarOpen && !isSidebarMenu && (
                                                    <Tooltip 
                                                        message={page.name} 
                                                        responsivePosition={{ desktop: 'sidebar', mobile: 'top' }}
                                                        open={hoveredOverviewLink === page.name}
                                                        animationType="SCALE_LEFT"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                ) : (
                                    
                                    // if we are not inside a site, show the list of sites
                                    // Also if there are no sites, show the add a new site button
                                    <div className={`sidebar__sites-display ${hasSitesOverflow ? 'sidebar__sites-display--overflow' : ''}`} ref={sitesDisplayRef}>
                                        <div className="sidebar__sites-overflow-padding">
                                            <Suspense fallback={<SidebarSiteSkeleton isSidebarOpen={isSidebarOpen}/>}>
                                                <SidebarSitesList
                                                    setIsModalOpen={setIsModalOpen}
                                                    setModalType={setModalType}
                                                    showNotification={showNotification}
                                                    isSidebarOpen={isSidebarOpen}
                                                    isModalOpen={isModalOpen}
                                                    isDropdownOpen={isDropdownOpen}
                                                    setIsDropdownOpen={setIsDropdownOpen}
                                                    siteData={siteData}
                                                    setSiteData={setSiteData}
                                                    toggleSidebar={toggleSidebar}
                                                    setIsSidebarOpen={setIsSidebarOpen}
                                                    modalType={modalType}
                                                    setSelectedSite={setSelectedSite}
                                                    setIsSiteOpen={setIsSiteOpen}
                                                    checkSitePicture={checkSitePicture}
                                                    SiteStyle={SiteStyle}
                                                    isSidebarMenu={isSidebarMenu}
                                                    setIsSidebarMenu={setIsSidebarMenu}
                                                    filteredWebs={filteredWebs}
                                                    openChangeModal={openChangeModal}
                                                    openChangeModalSettings={openChangeModalSettings}
                                                />
                                            </Suspense>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Lower part of the sidebar */}
                    <div className="sidebar__lower">
                    <div className="sidebar__others">
                            {/* render the other pages (support and appearance)*/}
                            {otherpages.map((otherPage) => (
                                <SidebarLink
                                    key={otherPage.name}
                                    icon={otherPage.icon}
                                    text={otherPage.name}
                                    modalType={modalType}
                                    onClick={() => {
                                        if (modalType === otherPage.name && isModalOpen) {
                                            setIsModalOpen(false);
                                        } else {
                                            setModalType(otherPage.name);
                                            setIsModalOpen(true);
                                            setUserSettings(otherPage.name);

                                        }

                                        
                                    }}
                                />
                            ))}
                        </div>
                        <div className="sidebar__divider"></div>
                        {/* render the profile dropdown */}
                        <User 
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
                        modalType={modalType}
                        checkProfilePicture={checkProfilePicture}
                        profileStyle={profileStyle}
                        isSidebarMenu={isSidebarMenu}
                        /> 

                    </div>
                </div>
            </div>
        </div>

    );
}