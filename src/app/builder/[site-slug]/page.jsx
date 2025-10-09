'use client'

import '@app/root.css'
import './builder.css'

import BuilderLeftPanel from './builderLeftPanel/builderLeftPanel'
import BuilderBody from './builderBody/builderBody'
import BuilderRightPanel from './builderRightPanel/builderRightPanel'
import { ContextMenu } from '@components/contextMenu/ContextMenu'
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@supabase/supabaseClient';
import { useParams, notFound } from 'next/navigation';
import { ModalContainer } from '@components/ModalContainer/ModalContainer';
import { ModalUser } from '@components/ModalUser/ModalUser';
import { ModalDelete } from '@components/ModalDelete/ModalDelete';
import { ModalSupport } from '@components/ModalSupport/ModalSupport';
import { ModalChange } from '@components/ModalChange/ModalChange';
import  Notification  from '@components/Notification/Notification';
import { CanvasProvider } from '@contexts/CanvasContext';
import Loader from '@components/Loader/Loader';
import MobileWarning from '@components/MobileWarning/MobileWarning';
import BuilderThemes from '@components/BuilderThemes/BuilderThemes';
import { ModalBuilderSettings } from '@components/ModalBuilderSetting/ModalBuilderSettings';
import BuilderSave from '@components/BuilderSave/BuilderSave';

function Builder() {
  const params = useParams();
  const siteSlug = params['site-slug'];

  // Custom hook for media queries
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addListener(listener);
      return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
  };

  //BD states
  const [user, setUser] = useState(null);
  const [site, setSite] = useState(null);
  const [appearanceSettings, setAppearanceSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track if we've already loaded data for the current user to prevent unnecessary refetching
  const loadedUserIdRef = useRef(null);

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState(null);

  //Themes states
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isManualThemesOpen, setIsManualThemesOpen] = useState(false)

  //Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    position: 'top',
    contentCenter: false
  });

  //Loader state
  const [loaderCompleted, setLoaderCompleted] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState(false);

  //Context menu state
  const [clipboard, setClipboard] = useState(null);


  // Set userSettings based on modalType
  useEffect(() => {
    if (modalType === 'Account' || modalType === 'Appearance' || modalType === 'Plan') {
      setUserSettings(modalType);
    }
  }, [modalType]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    open: false,
    position: { x: 0, y: 0 },
    targetItem: null,
    previousSelectedItem: null,
    key: Date.now() // Unique key for each context menu instance
  });

  // Context menu handlers
  const handleContextMenu = (e, item, currentSelectedItem) => {
    e.preventDefault();
    e.stopPropagation();

    // Determine position: if event is keyboard (clientX/Y == 0),
    // position the menu next to the triggering element; otherwise use mouse coords
    let x = e.clientX;
    let y = e.clientY;

    if ((!x && !y)) {
      // Try to position near the currentTarget (tree item header or canvas node)
      const targetEl = e.currentTarget || document.activeElement;
      if (targetEl && targetEl.getBoundingClientRect) {
        const rect = targetEl.getBoundingClientRect();
        // Place menu to the right of the element with small offset
        x = Math.round(rect.right + 8);
        y = Math.round(rect.top);
      } else {
        // Fallback to center of viewport
        x = Math.round(window.innerWidth / 2);
        y = Math.round(window.innerHeight / 2);
      }
    }

    // Clamp within viewport to avoid overflow
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - 8));
    const clampedY = Math.max(8, Math.min(y, window.innerHeight - 8));

    // Create a completely new context menu instance with unique key
    setContextMenu({
      open: true,
      position: { x: clampedX, y: clampedY },
      targetItem: item,
      previousSelectedItem: currentSelectedItem, // Keep the original selection
      key: Date.now() + Math.random() // Ensure unique key for each instance
    });
  };

  const closeContextMenu = (restoreSelection = false) => {
    setContextMenu(prev => ({
      open: false,
      position: { x: 0, y: 0 },
      targetItem: null,
      previousSelectedItem: restoreSelection ? prev.previousSelectedItem : null,
      key: prev.key // Keep the same key when just closing
    }));
  };


  //Fetch all data user from the database
  const allUserData = async (userId) => {
    if(!userId) {
      setUser(null);
      setSite(null);
      setAppearanceSettings(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [userResult, siteResult, appearanceResult] = await Promise.allSettled([
        supabase.from('User').select('*').eq('id', userId).single(),
        supabase.from('Site').select('*').eq('id', siteSlug).single(),
        supabase.from('Appearance').select('*').eq('userid', userId).single()
      ]);

      const userData = userResult.status === 'fulfilled' && !userResult.value.error ? userResult.value.data : null;
      const siteData = siteResult.status === 'fulfilled' && !siteResult.value.error ? siteResult.value.data : [];
      const appearanceData = appearanceResult.status === 'fulfilled' && !appearanceResult.value.error ? appearanceResult.value.data : null;


      setUser(userData);
      setSite(siteData);
      setAppearanceSettings(appearanceData);

    // Handle loading if liveWebsite is enabled
    if(siteData?.JSON?.liveWebsite === true){
      setIsScreenshotLoading(true);
      const url = `/api/screenshot?domain=${encodeURIComponent(siteData.Domain)}`;
      
      // Preload the image to detect when it's ready
      const img = new Image();
      img.onload = () => {
          setScreenshotUrl(url);
          setIsScreenshotLoading(false);
        
      };
      img.onerror = () => {
          setScreenshotUrl(null);
          setIsScreenshotLoading(false);
     
      };
      img.src = url;
    } else {
      setScreenshotUrl(null);
      setIsScreenshotLoading(false);
    }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to fetch all data user from the database when the user is logged ins
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Only fetch data if this is a different user or we haven't loaded data yet
          if (loadedUserIdRef.current !== session.user.id) {
            loadedUserIdRef.current = session.user.id;
            allUserData(session.user.id);
          }
        } else {
          // User logged out - clear everything
          loadedUserIdRef.current = null;
          setUser(null);
          setSite(null);
          setAppearanceSettings(null);
          setIsLoading(false);
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Set the accent color of the builder
  useEffect(() => {
  if (appearanceSettings?.['Accent Color']) {
    document.documentElement.setAttribute('data-color', appearanceSettings?.['Accent Color']);
  } else {
    document.documentElement.removeAttribute('data-color');
  }
}, [appearanceSettings]);

// Avatar colors when there is no avatar image
  const avatarColors = {
    green: {
      backgroundColor: '#2FB11F',
      color: '#FFFFFF',
    },
    pink: {
      backgroundColor: '#FF3DDB',
      color: '#000000',
    },
    yellow: {
      backgroundColor: '#FEBA00',
      color: '#000000',
    },
    blue: {
      backgroundColor: '#0099FE',
      color: '#FFFFFF',
    },
    purple: {
      backgroundColor: '#9D4EDD',
      color: '#FFFFFF',
    },
    orange: {
      backgroundColor: '#FF6B35',
      color: '#000000',
    },
  };


  // Function to set the style of the site picture
  const SiteStyle = (site) => {
    const color = avatarColors[site?.["Avatar Color"]]?.color || '#FFFFFF';
    const backgroundColor = avatarColors[site?.["Avatar Color"]]?.backgroundColor || '#000000';
    return {
      color,
      backgroundColor
    }
  } 

  // Function to check if the profile picture is null, undefined or empty, to know if we should show the avatar color or the avatar image
const checkProfilePicture = (user) => {
  const profilePicture = user?.["Avatar URL"];
  if(profilePicture === null || profilePicture === undefined || profilePicture === ''){
    return '';
  } else {
    return profilePicture;
  }
}

// Function to set the style of the profile picture
const ProfileStyle = (user) => {
  const color = avatarColors[user?.["Avatar Color"]]?.color || '#FFFFFF';
  const backgroundColor = avatarColors[user?.["Avatar Color"]]?.backgroundColor || '#000000';
  return {
    color,
    backgroundColor
  }
}

//Global function to close modals with escape key
const handleKeyDown = useCallback((e) => {
  if (e.key === 'Escape') {
    // Only close the topmost modal (change modal takes priority)
    if (isChangeModalOpen) {
      closeChangeModal();
    } else if (isModalOpen) {
      closeModal();
    }
  }
}, [isModalOpen, isChangeModalOpen]);
    // Add event listener for keyboard events
    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      
      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleKeyDown]);

//Global function to close modals by clicking outside the modal
const handleBackdropClick = useCallback((e) => {
  if (e.target.className.includes('modal__backdrop')) {
     if (isChangeModalOpen) {
      closeChangeModal();
    } else if (isModalOpen) {
      closeModal();
    } 
   if(isModalOpen){
    closeModal();
   }
  }
}, [isModalOpen, isChangeModalOpen]);

//Function to close the modal
const closeModal = () => {
  setIsModalOpen(false);
  setModalType(null);
};

    //Function to close the ModalChange modal
    const closeChangeModal = () => {
      setIsChangeModalOpen(false);
      setChangeType('');
    };
        // Function to open the ModalChange modal with the site data
        const openChangeModalSettings = (siteData) => {
          setChangeType('settings');
          setIsChangeModalOpen(true);
          setSite(siteData);
        };

    // Function to open the ModalChange modal
    const openChangeModal = (type) => {
      setChangeType(type);
      setIsChangeModalOpen(true);
    };

    //Function to show the notification
    const showNotification = (message, position = 'top', contentCenter = false) => {
      setNotification({
        open: true,
        message: message,
        position: position,
        contentCenter: contentCenter,
      });
    };

    //Function to hide the notification
    const hideNotification = () => {
      setNotification({
        open: false,
        message: '',
        position: '',
        contentCenter: false,
      });
    };

const renderModal = () => {
  if (!isModalOpen) return null;

  switch (modalType) {
    case 'Account':
      return (
        <ModalUser
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
              setIsModalOpen(false);

          
        }}
        user={user}
        appearanceSettings={appearanceSettings}
        setAppearanceSettings={setAppearanceSettings}
        userSettings={userSettings}
        setUserSettings={setUserSettings}

        openChangeModal={openChangeModal}
        checkProfilePicture={checkProfilePicture}
        profileStyle={ProfileStyle}
        setUser={setUser}
        />
      );
    case 'DeleteSite':
      return (
        <ModalDelete
          onClose={() => setIsModalOpen(false)}
          siteData={site}
          setIsModalOpen={setIsModalOpen}
          setSiteData={setSite}
        />
      );
    case 'Support':
      return ( <ModalSupport
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)}
        user={user}
        setUser={setUser}
        setIsModalOpen={setIsModalOpen}
        showNotification={showNotification}
      />) 
  case 'Appearance':
    return ( 
      <ModalUser
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
            setIsModalOpen(false);
          
        }}
        user={user}
        setUser={setUser}
        setIsModalOpen={setIsModalOpen}
        appearanceSettings={appearanceSettings}
        setAppearanceSettings={setAppearanceSettings}
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        openChangeModal={openChangeModal}
        checkProfilePicture={checkProfilePicture}
        profileStyle={ProfileStyle}
        
      />) 
    case 'Plan':
      return (
        <ModalUser
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
          }}
          user={user}
          setUser={setUser}
          setIsModalOpen={setIsModalOpen}
          appearanceSettings={appearanceSettings}
          setAppearanceSettings={setAppearanceSettings}
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          openChangeModal={openChangeModal}
          checkProfilePicture={checkProfilePicture}
          profileStyle={ProfileStyle}
        />
      )
    case 'Builder':
      return (
        <ModalBuilderSettings
          onClose={() => setIsModalOpen(false)}
          showNotification={showNotification}
         
        />
      )
    
    default:
      return null;
  }
}


  
  //Remove padding from html from the dashboard
  useEffect(() => {
    document.documentElement.classList.add('trustwards-builder')

    return () => {
      document.documentElement.classList.remove('trustwards-builder')
    }
  }, [])

  // State to control both panels (left and right)
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

  // Function to handle left panel toggle
  const handleLeftPanelToggle = () => {
    if (!isLeftPanelOpen && !isRightPanelOpen) {
      // If both are closed, open both
      setIsLeftPanelOpen(true)
      setIsRightPanelOpen(true)
    } else if (isLeftPanelOpen && isRightPanelOpen) {
      // If both are open, close both
      setIsLeftPanelOpen(false)
      setIsRightPanelOpen(false)
    } else if (!isLeftPanelOpen && isRightPanelOpen) {
      // If left is closed but right is open, open left
      setIsLeftPanelOpen(true)
    } else if (isLeftPanelOpen && !isRightPanelOpen) {
      // If left is open but right is closed, close left
      setIsLeftPanelOpen(false)
    }
  }

  //Mobile state warning
  const isMobile = useMediaQuery('(max-width: 820px)');

  return (
  <CanvasProvider siteData={site} CallContextMenu={handleContextMenu} setIsFirstTime={setIsFirstTime}>
 <Loader isVisible={isLoading || isScreenshotLoading} loaderCompleted={loaderCompleted} setLoaderCompleted={setLoaderCompleted} isLiveWebsiteLoading={isScreenshotLoading}/>
    {isMobile && <MobileWarning/>}
    {!isMobile && !isLoading && ( 
    <div className="tw-builder">
      <BuilderThemes isFirstTime={isFirstTime} setIsFirstTime={setIsFirstTime} isManualThemesOpen={isManualThemesOpen} setIsManualThemesOpen={setIsManualThemesOpen} showNotification={showNotification} siteSlug={siteSlug}/>

      <BuilderLeftPanel 
        isPanelOpen={isLeftPanelOpen} 
        onPanelToggle={handleLeftPanelToggle}
        setModalType={setModalType}
        setIsModalOpen={setIsModalOpen}
        openChangeModal={openChangeModal}
        isRightPanelOpen={isRightPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        showNotification={showNotification}
        CallContextMenu={handleContextMenu}
        setIsManualThemesOpen={setIsManualThemesOpen}
        clipboard={clipboard}
        setClipboard={setClipboard}
      />
      <BuilderBody site={site} setSite={setSite} setModalType={setModalType} setIsModalOpen={setIsModalOpen} /* checkSitePicture={checkSitePicture} */ SiteStyle={SiteStyle} openChangeModalSettings={openChangeModalSettings} screenshotUrl={screenshotUrl} setScreenshotUrl={setScreenshotUrl}/>
      
      <BuilderRightPanel user={user} site={site} checkProfilePicture={checkProfilePicture} profileStyle={ProfileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen} showNotification={showNotification} siteSlug={siteSlug} isPanelOpen={isRightPanelOpen}/>
   
      
      
      <ModalContainer 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onBackdropClick={handleBackdropClick}
      >
        {renderModal()}
      </ModalContainer>
                    {/* ModalChange as independent modal */}
                    <ModalContainer 
                    isOpen={isChangeModalOpen} 
                    onClose={closeChangeModal} 
                    onBackdropClick={handleBackdropClick}
                    >
                    <ModalChange
                        changeType={changeType}
                        onClose={closeChangeModal}
                        user={user}
                        setUser={setUser}
                        setIsModalOpen={setIsModalOpen}
                        showNotification={showNotification}
                        siteData={site}
                        setSiteData={setSite}
                    />
                    </ModalContainer>
                    <Notification
                    open={notification.open}
                    onClose={hideNotification}
                    autoClose={2000} //duration of the notification in ms
                    notificationMessage={notification.message}
                    position={notification.position || 'top'}
                    contentCenter={notification.contentCenter || false}
                    >
                    </Notification>

                    {/* Context menu - key forces new instance for each menu */}
                    <ContextMenu
                      key={contextMenu.key}
                      open={contextMenu.open}
                      position={contextMenu.position}
                      onClose={closeContextMenu}
                      targetItem={contextMenu.targetItem}
                      showNotification={showNotification}
                      className="tree-context-menu"
                      previousSelectedItem={contextMenu.previousSelectedItem}
                      clipboard={clipboard}
                      setClipboard={setClipboard}
                    />
                 
      </div>
    )}
    </CanvasProvider>

  );
}


export default Builder;