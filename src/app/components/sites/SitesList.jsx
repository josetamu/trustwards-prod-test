import { useDashboard } from '../../dashboard/layout';
import { Site } from '../site/Site';
import { NewSite } from '../NewSite/NewSite';
import { SitesSkeleton } from '../Skeletons/SitesSkeleton';
import { useMemo } from 'react';

export function SitesList({ openChangeModal, setIsModalOpen, setModalType, showNotification, isModalOpen, isDropdownOpen, setIsDropdownOpen, setSiteData, checkSitePicture, SiteStyle, openChangeModalSettings }) {
    const { allUserDataResource, appearanceSettings } = useDashboard();
    

    

    const sortedSites = useMemo(() => {
      if(!allUserDataResource) return [];

      const { webs, appearance } = allUserDataResource.read();
      const sortMode = appearance['Sort Sites'];

      
      
      const sorted = [...webs];
      
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
  }, [allUserDataResource, appearanceSettings]);

  if(!allUserDataResource) return <SitesSkeleton/>;

  const { webs, user, appearance} = allUserDataResource.read();
  const view = appearance['View Sites'];


    return (
        <>
        <div className={`sites__grid ${view ? 'sites__grid--grid' : 'sites__grid--list'}`}> 
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
              view={view}
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