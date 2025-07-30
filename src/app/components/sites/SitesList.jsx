import { useDashboard } from '../../dashboard/layout';
import { Site } from '../site/Site';
import { NewSite } from '../NewSite/NewSite';
import { SitesSkeleton } from '../Skeletons/SitesSkeleton';


export function SitesList({ searchQuery, openChangeModal, setIsModalOpen, setModalType, showNotification, isSidebarOpen, isModalOpen, isDropdownOpen, setIsDropdownOpen, siteData, setSiteData, toggleSidebar, setIsSidebarOpen, modalType, globalSiteData, setSelectedSite, setIsSiteOpen, checkSitePicture, SiteStyle, openChangeModalSettings, isSidebarMenu, setIsSidebarMenu, sortedSites, isGridView }) {
    const { allUserDataResource } = useDashboard();
    if(!allUserDataResource) return <SitesSkeleton/>;
    const { webs, user } = allUserDataResource.read();




    return (
        <>
        <div className={`sites__grid ${isGridView ? 'sites__grid--grid' : 'sites__grid--list'}`}> 
        {sortedSites.map(site => (
          user && site.userid === user.id && (
            <Site
              key={site.id}
              id={site.id}
              text={site.Name}
              domain={site.Domain}
              onRemove={() => {}}
              setIsModalOpen={setIsModalOpen}
              setModalType={setModalType}
              isModalOpen={isModalOpen}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setSiteData={setSiteData}
              siteData={site}
              isGridView={isGridView}
              checkSitePicture={checkSitePicture}
              SiteStyle={SiteStyle}
              openChangeModalSettings={openChangeModalSettings}
            />
          )
        ))}
        <div className="sites__add-site--small">
          <div className="sites__add-site-text">
            Add a new website
          </div>
          <NewSite openChangeModal={openChangeModal} user={user} webs={webs} showNotification={showNotification} setIsModalOpen={setIsModalOpen} setModalType={setModalType}/>
        </div>
      </div>
      <div className="sites__add-site--big">
        <div className="sites__add-site-container">
          <span className="sites__add-site-heading">No Sites</span>
          <div className="sites__add-site-text">
            There aren't sites here yet.
            <br />
            Start by creating a <span className="sites__add-site-span">new site.</span>
          </div>
        </div>
        <NewSite openChangeModal={openChangeModal} user={user} webs={webs} showNotification={showNotification} setIsModalOpen={setIsModalOpen} setModalType={setModalType}/>
      </div>
      </>
    );
}