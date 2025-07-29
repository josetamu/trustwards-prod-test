import { useDashboard } from '../../dashboard/layout';
import { NewSite } from '../NewSite/NewSite';
import { SidebarSites } from '../sidebarSite/SidebarSites';
import { SidebarSiteSkeleton } from '../Skeletons/SidebarSiteSkeleton';




export function SidebarSitesList({ searchQuery, openChangeModal, setIsModalOpen, setModalType, showNotification, isSidebarOpen, isModalOpen, isDropdownOpen, setIsDropdownOpen, siteData, setSiteData, toggleSidebar, setIsSidebarOpen, modalType, setSelectedSite, setIsSiteOpen, checkSitePicture, SiteStyle, openChangeModalSettings, isSidebarMobile, windowWidth, setIsSidebarMobile, filteredWebs }) {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) {
        return (
                <SidebarSiteSkeleton isSidebarOpen={isSidebarOpen}/>
            
        );
    }
    const { webs, user } = allUserDataResource.read();


    if(filteredWebs.length === 0) {
        return (
        <div className="sitesDisplay__nosites">
            {searchQuery ? 'No sites found' : (
                <div className="nosites__container">
                    <div className="nosites__text">
                        There aren't sites here yet.
                        <br />
                        Start by creating a <span className="nosites__text__span">new site.</span>
                    </div>
                    <NewSite openChangeModal={openChangeModal} user={user} webs={webs} showNotification={showNotification} setIsModalOpen={setIsModalOpen} setModalType={setModalType}/>
                </div>
            )}
            </div>
    );
    }

    return (
        (isSidebarOpen ? filteredWebs : filteredWebs.slice(0, 6)).map((web) => (
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
                            isSidebarMobile={isSidebarMobile}
                            windowWidth={windowWidth}
                            setIsSidebarMobile={setIsSidebarMobile}
                        />
                    
                </div>
            )
        ))
    );
}