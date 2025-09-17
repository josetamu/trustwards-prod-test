'use client'

import { Sites } from '@components/sites/Sites'
import { useDashboard } from '@dashboard/layout'

function HomePage() {
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
    openChangeModalSettings,
    openChangeModal,
    showNotification,
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
      openChangeModalSettings={openChangeModalSettings}
      openChangeModal={openChangeModal}
      showNotification={showNotification}
    />
  );
}

export default HomePage