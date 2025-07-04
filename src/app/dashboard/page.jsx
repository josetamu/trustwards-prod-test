'use client'

import './dashboard-root.css'

import { Sites } from '@components/sites/Sites'  
import './dashboard.css'
  

import { useDashboard } from './layout'

function Dashboard() {
  const {
    isModalOpen,
    setIsModalOpen,
    user,
    webs,
    isSidebarOpen,
    setModalType,
    setSiteData,
    siteData,
    setIsDropdownOpen,
    createNewSite,
    checkSitePicture,
    SiteStyle,
  } = useDashboard();

  return (
    <Sites 
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      user={user}
      webs={webs}
      isSidebarOpen={isSidebarOpen}
      setModalType={setModalType}
      setSiteData={setSiteData}
      siteData={siteData}
      setIsDropdownOpen={setIsDropdownOpen}
      createNewSite={createNewSite}
      checkSitePicture={checkSitePicture}
      SiteStyle={SiteStyle}
    />
  );
}

export default Dashboard