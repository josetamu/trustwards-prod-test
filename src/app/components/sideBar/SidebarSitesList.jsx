import { useDashboard } from '@dashboard/layout';
import { NewSite } from '@components/NewSite/NewSite';
import { SidebarSites } from '@components/sidebarSite/SidebarSites';
import { SidebarSiteSkeleton } from '@components/Skeletons/SidebarSiteSkeleton';
import { useMemo } from 'react';

export function SidebarSitesList({ openChangeModal, setIsModalOpen, setModalType, showNotification, isSidebarOpen, isModalOpen, isDropdownOpen, setIsDropdownOpen, siteData, setSiteData, toggleSidebar, setIsSidebarOpen, modalType, globalSiteData, setSelectedSite, setIsSiteOpen, checkSitePicture, SiteStyle, openChangeModalSettings, isSidebarMenu, setIsSidebarMenu, filteredWebs }) {
    const { allUserDataResource } = useDashboard();

    // Mover useMemo antes del return condicional
    const sortedFilteredWebs = useMemo(() => {
        if (!allUserDataResource || !filteredWebs || filteredWebs.length === 0) return [];
        
        const { appearance } = allUserDataResource.read();
        const sortMode = appearance['Sort Sites'] || 'newest';
        
        const sorted = [...filteredWebs];
        
        switch (sortMode) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.Date) - new Date(b.Date));
            case 'a-z':
                return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
            case 'z-a':
                return sorted.sort((a, b) => b.Name.localeCompare(a.Name));
            default:
                return sorted;
        }
    }, [allUserDataResource, filteredWebs]);

    // Ahora el return condicional
    if(!allUserDataResource) {
        return (
                <SidebarSiteSkeleton isSidebarOpen={isSidebarOpen}/>
            
        );
    }
    
    const { webs, user } = allUserDataResource.read();
    if(filteredWebs.length === 0) {
        return (
            <>
                <div className="sidebar__sites-display--none">
                    <div className="sidebar__sites-display-container">
                        <div className="sidebar__sites-display-text">
                            There aren't sites here yet.
                            <br />
                            Start by creating a <span className="sidebar__sites-display-span">new site.</span>
                        </div>
                        <NewSite openChangeModal={openChangeModal} user={user} webs={webs} showNotification={showNotification} setIsModalOpen={setIsModalOpen} setModalType={setModalType}/>
                    </div>
                </div>

                <div className='sidebar__sites-add' onClick={() => {
                    openChangeModal('newsite');
                }} 
                >
                    <div className='sidebar__sites-add-icon'>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 4.57143H4.57143V8H3.42857V4.57143H0V3.42857H3.42857V0H4.57143V3.42857H8V4.57143Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
            </>
    );
    }

    return (
        <>
            {(isSidebarOpen ? sortedFilteredWebs : sortedFilteredWebs.slice(0, 6)).map((web) => (
                web.userid === user.id && (
                        <div key={web.id} className="sidebar__sites-tooltip-wrapper">
                            <SidebarSites
                                key={web.id}
                                avatar={web["Avatar URL"]}
                                name={web.Name}
                                isSidebarOpen={isSidebarOpen}
                                setIsModalOpen={setIsModalOpen}
                                setModalType={setModalType}
                                isModalOpen={isModalOpen}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                                siteData={web}
                                setSiteData={setSiteData}
                                toggleSidebar={toggleSidebar}
                                setIsSidebarOpen={setIsSidebarOpen}
                                modalType={modalType}
                                globalSiteData={siteData}
                                setSelectedSite={setSelectedSite}
                                setIsSiteOpen={setIsSiteOpen}
                                checkSitePicture={checkSitePicture}
                                SiteStyle={SiteStyle}
                                openChangeModal={openChangeModal}
                                openChangeModalSettings={openChangeModalSettings}
                                isSidebarMenu={isSidebarMenu}
                                setIsSidebarMenu={setIsSidebarMenu}
                            />
                        </div>

                )
            ))}
            <div className='sidebar__sites-add' onClick={() => {
                openChangeModal('newsite');
            }} 
            >
                <div className='sidebar__sites-add-icon'>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4.57143H4.57143V8H3.42857V4.57143H0V3.42857H3.42857V0H4.57143V3.42857H8V4.57143Z" fill="currentColor"/>
                    </svg>
                </div>
                <span className='sidebar__sites-add-text'>New Site...</span>
            </div>
        </>
    );
}