import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { SidebarLink } from './SitebarLink';
import { UserConfig } from './UserConfig';
import { Settings } from './settings';
import logo from '../assets/pepsi-logo.png';
import { PlanCard } from './PlanCard';

// names and icons used in the sidebar
export const homePages = [

    {
      name: 'Websites',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                <path d="M18 20.5001C18.8888 20.3004 19.5638 19.9723 20.1088 19.4328C21.5 18.0554 21.5 15.8386 21.5 11.4051C21.5 6.97151 21.5 4.75472 20.1088 3.37739C18.7175 2.00006 16.4783 2.00006 12 2.00006C7.52166 2.00006 5.28249 2.00006 3.89124 3.37739C2.5 4.75472 2.5 6.97151 2.5 11.4051C2.5 15.8386 2.5 18.0554 3.89124 19.4328C4.43619 19.9723 5.11124 20.3004 6 20.5001" stroke="#686B74" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M2.5 8.50006H21.5" stroke="#686B74" stroke-width="1.5" stroke-linejoin="round"></path>
                <path d="M6.99981 5.50006H7.00879" stroke="#686B74" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M10.9998 5.50006H11.0088" stroke="#686B74" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M15.5 17.5001V15.0001C13.5 15.0001 12 14.0001 12 14.0001C12 14.0001 10.5 15.0001 8.5 15.0001V17.5001C8.5 21.0001 12 22.0001 12 22.0001C12 22.0001 15.5 21.0001 15.5 17.5001Z" stroke="#686B74" fill='#686B74' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
    },
    {
        name: 'Analytics',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6667 3C10.6667 2.73478 10.772 2.48043 10.9596 2.29289C11.1471 2.10536 11.4015 2 11.6667 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H11.6667C11.4015 14 11.1471 13.8946 10.9596 13.7071C10.772 13.5196 10.6667 13.2652 10.6667 13V3ZM6.33333 7C6.33333 6.73478 6.43869 6.48043 6.62623 6.29289C6.81376 6.10536 7.06812 6 7.33333 6H8.66667C8.93188 6 9.18624 6.10536 9.37377 6.29289C9.56131 6.48043 9.66667 6.73478 9.66667 7V13C9.66667 13.2652 9.56131 13.5196 9.37377 13.7071C9.18624 13.8946 8.93188 14 8.66667 14H7.33333C7.06812 14 6.81376 13.8946 6.62623 13.7071C6.43869 13.5196 6.33333 13.2652 6.33333 13V7ZM3 10C2.73478 10 2.48043 10.1054 2.29289 10.2929C2.10536 10.4804 2 10.7348 2 11V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H4.33333C4.59855 14 4.8529 13.8946 5.04044 13.7071C5.22798 13.5196 5.33333 13.2652 5.33333 13V11C5.33333 10.7348 5.22798 10.4804 5.04044 10.2929C4.8529 10.1054 4.59855 10 4.33333 10H3Z" fill="#686B74"/>
        </svg>
        
    },
  ];
  export const docPages = [

        {
            name: 'Academy',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.25 12.8557V14C16.25 14.4142 16.5858 14.75 17 14.75C17.4142 14.75 17.75 14.4142 17.75 14V11C17.75 10.3211 17.3305 9.87047 16.8902 9.54806C16.4735 9.24285 15.8766 8.93597 15.1871 8.58142L15.1315 8.55281L13.9184 7.92895L13.9184 7.92895C13.5463 7.73756 13.2246 7.5721 12.9438 7.45781C12.6434 7.33554 12.3401 7.25 12 7.25C11.6599 7.25 11.3566 7.33554 11.0562 7.45781C10.7754 7.5721 10.4537 7.73756 10.0816 7.92895L10.0816 7.92895L10.0816 7.92895L10.0544 7.94292L8.86853 8.55281L8.8129 8.58142C8.12337 8.93597 7.52655 9.24285 7.10977 9.54806C6.66949 9.87047 6.25 10.3211 6.25 11C6.25 11.6789 6.66949 12.1295 7.10977 12.4519C7.40822 12.6705 7.79898 12.8899 8.25 13.1271V15.4954C8.25 16.2175 8.79925 16.7924 9.39865 17.1403C10.0424 17.5139 10.9279 17.7505 12 17.7505C13.0721 17.7505 13.9576 17.5139 14.6014 17.1403C15.2008 16.7924 15.75 16.2175 15.75 15.4954V13.1271C15.9265 13.0342 16.0939 12.9441 16.25 12.8557ZM13.9184 14.0711L14.25 13.9005V15.4807C14.2499 15.4797 14.2498 15.4792 14.2496 15.4791C14.249 15.479 14.2478 15.4813 14.2455 15.4859C14.2296 15.5184 14.1587 15.6629 13.8484 15.843C13.4754 16.0594 12.8609 16.2505 12 16.2505C11.1391 16.2505 10.5246 16.0594 10.1516 15.843C9.84131 15.6629 9.77042 15.5184 9.75447 15.4859C9.75219 15.4813 9.75104 15.479 9.75046 15.4791C9.75022 15.4792 9.75008 15.4797 9.75 15.4807V13.9005L10.0816 14.0711C10.4537 14.2624 10.7754 14.4279 11.0562 14.5422C11.3566 14.6645 11.6599 14.75 12 14.75C12.3401 14.75 12.6434 14.6645 12.9438 14.5422C13.2246 14.4279 13.5463 14.2624 13.9184 14.0711L13.9184 14.0711Z" fill="currentColor" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0251 3C7.98399 3 4.56274 5.64901 3.41309 9.30032C3.24722 9.82711 2.68572 10.1197 2.15893 9.95384C1.63214 9.78797 1.33955 9.22647 1.50542 8.69968C2.9106 4.23678 7.08869 1 12.0251 1C17.7403 1 22.4418 5.33935 22.9954 10.901C23.0269 11.217 22.9063 11.5292 22.6706 11.7421C22.4349 11.955 22.1121 12.0433 21.8009 11.9799L19.8008 11.5728C19.2596 11.4627 18.9102 10.9347 19.0204 10.3935C19.1305 9.85231 19.6585 9.50288 20.1997 9.61303L20.7597 9.727C19.7504 5.85862 16.2233 3 12.0251 3Z" fill="currentColor" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9749 21C16.016 21 19.4373 18.351 20.5869 14.6997C20.7528 14.1729 21.3143 13.8803 21.8411 14.0462C22.3679 14.212 22.6605 14.7735 22.4946 15.3003C21.0894 19.7632 16.9113 23 11.9749 23C6.2597 23 1.55816 18.6606 1.0046 13.099C0.973144 12.783 1.09369 12.4708 1.32939 12.2579C1.56508 12.045 1.88789 11.9567 2.19912 12.0201L4.19917 12.4271C4.74036 12.5373 5.08979 13.0653 4.97964 13.6065C4.8695 14.1477 4.34149 14.4971 3.8003 14.387L3.2403 14.273C4.2496 18.1414 7.77667 21 11.9749 21Z" fill="currentColor" />
                </svg>
        },
        {
            name: 'Legal news',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#686B74" fill="none">
                    <path opacity="0.4" d="M10.5 8H18.5M10.5 12H13M18.5 12H16M10.5 16H13M18.5 16H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path opacity="0.4" d="M7 7.5H6C4.11438 7.5 3.17157 7.5 2.58579 8.08579C2 8.67157 2 9.61438 2 11.5V18C2 19.3807 3.11929 20.5 4.5 20.5C5.88071 20.5 7 19.3807 7 18V7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 3.5H11C10.07 3.5 9.60504 3.5 9.22354 3.60222C8.18827 3.87962 7.37962 4.68827 7.10222 5.72354C7 6.10504 7 6.57003 7 7.5V18C7 19.3807 5.88071 20.5 4.5 20.5H16C18.8284 20.5 20.2426 20.5 21.1213 19.6213C22 18.7426 22 17.3284 22 14.5V9.5C22 6.67157 22 5.25736 21.1213 4.37868C20.2426 3.5 18.8284 3.5 16 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
        },
    
  ]
// Sidebar component
export function Sidebar({ homePages, docPages, onPageChange }) {
    const [user, setUser] = useState(null);
    const [isUserConfigOpen, setIsUserConfigOpen] = useState(false);
    // funtion to open and close the sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//supa base with dev user
    const _loginDevUser = async () => {
        await supabase.auth.signInWithPassword({
          email: 'oscar.abad.brickscore@gmail.com', 
          password: 'TW.141109'
        });
    };
    
    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error);
        } else {
            setUser(data.user);
        }
    };

    useEffect(() => {
        _loginDevUser();
        getUser(); 
    }, []); 

    return (
        <div className={`${isSidebarOpen ? 'sidebar-container-open' : 'sidebar-container'}`}>
            <a className="sidebar-action" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                <path d="M2 12C2 8.25027 2 6.3754 2.95491 5.06107C3.26331 4.6366 3.6366 4.26331 4.06107 3.95491C5.3754 3 7.25027 3 11 3H13C16.7497 3 18.6246 3 19.9389 3.95491C20.3634 4.26331 20.7367 4.6366 21.0451 5.06107C22 6.3754 22 8.25027 22 12C22 15.7497 22 17.6246 21.0451 18.9389C20.7367 19.3634 20.3634 19.7367 19.9389 20.0451C18.6246 21 16.7497 21 13 21H11C7.25027 21 5.3754 21 4.06107 20.0451C3.6366 19.7367 3.26331 19.3634 2.95491 18.9389C2 17.6246 2 15.7497 2 12Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"></path>
                <path d="M9.5 3.5L9.5 20.5" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"></path>
                <path d="M5 7C5 7 5.91421 7 6.5 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 11H6.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M17 10L15.7735 11.0572C15.2578 11.5016 15 11.7239 15 12C15 12.2761 15.2578 12.4984 15.7735 12.9428L17 14" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            </a>
            <div className={`${isSidebarOpen ? 'sidebar-open' : 'sidebar'}`}>
                <div className="logo-container">
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
                <div className="sidebar__upper">
                <div className="sidebar__home">
                    <span className="sidebar__home-text">
                       <span className="sidebar__home-text-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M21 6.75C21 4.67893 19.3211 3 17.25 3C15.1789 3 13.5 4.67893 13.5 6.75C13.5 8.82107 15.1789 10.5 17.25 10.5C19.3211 10.5 21 8.82107 21 6.75Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"></path>
                                <path d="M10.5 6.75C10.5 4.67893 8.82107 3 6.75 3C4.67893 3 3 4.67893 3 6.75C3 8.82107 4.67893 10.5 6.75 10.5C8.82107 10.5 10.5 8.82107 10.5 6.75Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"></path>
                                <path d="M21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.1789 13.5 13.5 15.1789 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"></path>
                                <path d="M10.5 17.25C10.5 15.1789 8.82107 13.5 6.75 13.5C4.67893 13.5 3 15.1789 3 17.25C3 19.3211 4.67893 21 6.75 21C8.82107 21 10.5 19.3211 10.5 17.25Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"></path>
                            </svg>
                        </span>
                        <span className="sidebar__home-text-text">Home</span>
                    </span>
                    {homePages.map((homePage) => (
                        <SidebarLink
                            key={homePage.name}
                            icon={homePage.icon}
                            text={homePage.name}
                            onClick={() => onPageChange(homePage.name)}
                        />
                    ))}
                </div>
                <div className="sidebar__docs">
                    <span className="sidebar__home-text">
                        <span className="sidebar__docs-text-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4253 3.28231C19.6271 2.95101 18.5745 2.67059 17.2694 2.32287L16.2094 2.04043C14.9041 1.69265 13.8516 1.4122 12.9939 1.30229C12.1033 1.18818 11.3124 1.241 10.5821 1.66025C9.85117 2.07986 9.40864 2.73583 9.06207 3.5614C8.72864 4.35566 8.44647 5.40287 8.09691 6.70016L7.04517 10.6032L7.04517 10.6032C6.69559 11.9004 6.41338 12.9476 6.30275 13.8013C6.18777 14.6885 6.24094 15.4779 6.66391 16.2064C7.08651 16.9342 7.74618 17.3737 8.57474 17.7176C9.3729 18.0489 10.4255 18.3293 11.7306 18.677L12.7907 18.9595C14.0959 19.3073 15.1484 19.5877 16.0061 19.6976C16.8967 19.8117 17.6877 19.7589 18.4179 19.3396C19.1488 18.92 19.5914 18.2641 19.9379 17.4385C20.2714 16.6442 20.5535 15.597 20.9031 14.2997L21.9548 10.3967C22.3044 9.09953 22.5866 8.05231 22.6973 7.19861C22.8122 6.31139 22.7591 5.52199 22.3361 4.79352C21.9135 4.06567 21.2538 3.62623 20.4253 3.28231ZM15.5 8.5C16.3284 8.5 17 7.82843 17 7C17 6.17157 16.3284 5.5 15.5 5.5C14.6716 5.5 14 6.17157 14 7C14 7.82843 14.6716 8.5 15.5 8.5Z" fill="#ffffff"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.42476 5.96656C6.58145 6.49615 6.27914 7.05249 5.74955 7.20917C4.16184 7.67891 3.67122 7.99964 3.43 8.4151C3.27585 8.68059 3.19912 9.0304 3.28691 9.72268C3.37843 10.4444 3.62427 11.3754 3.9895 12.7462L5.00185 16.5459C5.36709 17.9168 5.61705 18.8466 5.89654 19.5175C6.16472 20.1613 6.40448 20.424 6.66771 20.5751C6.93178 20.7267 7.28263 20.8022 7.97972 20.7109C8.70497 20.616 9.64091 20.366 11.0171 19.9951L11.4898 19.8678C12.0231 19.7241 12.5719 20.0399 12.7155 20.5731C12.8592 21.1064 12.5434 21.6552 12.0102 21.7989L11.4697 21.9445C10.1785 22.2925 9.11292 22.5796 8.23931 22.694C7.32231 22.814 6.46842 22.7668 5.67196 22.3096C4.87467 21.8519 4.40521 21.1385 4.05034 20.2866C3.71275 19.4763 3.42985 18.4143 3.08748 17.1292L2.03873 13.1929C1.69626 11.9076 1.41331 10.8457 1.3028 9.97429C1.18661 9.05805 1.23879 8.20589 1.7004 7.41087C2.38641 6.22933 3.65434 5.74336 5.18215 5.29135C5.71174 5.13467 6.26808 5.43697 6.42476 5.96656Z" fill="#ffffff"></path>
                        </svg>
                        </span>
                        <span className="sidebar__home-text-text">Docs</span>
                    </span>
                    {docPages.map((docPage) => (
                        <SidebarLink
                            key={docPage.name}
                            icon={docPage.icon}
                            text={docPage.name}
                            onClick={() => onPageChange(docPage.name)}
                        />
                    ))}
                </div>

                </div>
                <div className="sidebar__lower">
                    <PlanCard currentPlan={"Free plan"} monthlyVisitors={20} totalVisitors={100} />
                </div>
            </div>
        </div>
    );
}

