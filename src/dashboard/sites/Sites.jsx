import { useState, useMemo } from 'react';
import { Site } from '../site/Site';
import { Sort } from '../sort/Sort';
import { View } from '../view/View';
import './Sites.css'

export const Sites = ({ sites, isModalOpen, setIsModalOpen, user, webs, isSidebarOpen, setModalType, isDropdownOpen, setIsDropdownOpen, setSiteData}) => {
  const [siteList, setSiteList] = useState(sites);
  const [sortMode, setSortMode] = useState('alphabetical'); // 'alphabetical' or 'date'
  const [isAscending, setIsAscending] = useState(true);
  const [isGridView, setIsGridView] = useState(() => {
    const saved = localStorage.getItem('viewMode');
    return saved === null ? true : JSON.parse(saved);
  });
  
  // Handle sort change
  const handleSortChange = (mode, ascending) => {
    setSortMode(mode);
    setIsAscending(ascending);
  };

  // Sort the sites
  const sortedSites = useMemo(() => {
    const sorted = [...siteList];
    if (sortMode === 'alphabetical') {
      sorted.sort((a, b) => a.text.localeCompare(b.text)); // uses the first letter
    } else {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return isAscending ? sorted : sorted.reverse();
  }, [siteList, sortMode, isAscending]);
  

  return (
    <div className="sites__wrapper">
      <div className="sites__header">
        <h2 className="sites__title">Sites</h2>
        <div className="sites__header-actions">
        <View onViewChange={(newView) => {
          localStorage.setItem('viewMode', JSON.stringify(newView));
          setIsGridView(newView);
        }} />
          <Sort onSortChange={handleSortChange} />
          <button 
            className="sites__new-button"
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setModalType("NewSite");
              /* if(window.innerWidth < 767) {
                setIsSidebarOpen(false);
                toggleSidebar();
                toggleDropdown();
              } */
            }} 
          >
            New
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
              <path d="M12 7V17M17 12L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
              <path d="M2.5 8.5C2.86239 7.67056 3.3189 6.89166 3.85601 6.17677M6.17681 3.85598C6.89168 3.31888 7.67058 2.86239 8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`sites__grid ${isGridView ? 'grid' : 'list'}`}>
      {/*   {sortedSites.map((site) => (
          <Site
            key={site.id}
            id={site.id}
            text={site.text}
            domain={site.domain}
            onUpdate={(updatedText, updatedDomain) => {
              setSiteList(prev => prev.map(s => s.id === site.id ? { ...s, text: updatedText, domain: updatedDomain } : s));
            }}
            onRemove={() => {
              setSiteList(prev => prev.filter(s => s.id !== site.id));
            }}
          />
        ))} */}
        {webs.map(site => (
          user && site.userid === user.id && (
            <Site
              key={site.id}
              id={site.id}
              text={site.Name}
              domain={site.Domain}
              onRemove={() => {
                setSiteList(prev => prev.filter(s => s.id !== site.id));
                if (typeof window.onDeleteSite === 'function') window.onDeleteSite(site.id);
              }}
              setIsModalOpen={setIsModalOpen}
              setModalType={setModalType}
              isModalOpen={isModalOpen}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setSiteData={setSiteData}
              siteData={site}

            />
          )
        ))}
      </div>
    </div>
  );
};
