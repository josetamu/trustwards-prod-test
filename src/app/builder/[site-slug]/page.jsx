'use client'

import './builder-root.css'
import './builder.css'

import BuilderLeftPanel from './builderLeftPanel/builderLeftPanel'
import BuilderBody from './builderBody/builderBody'
import BuilderRightPanel from './builderRightPanel/builderRightPanel'
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import { useParams, notFound } from 'next/navigation';
import { ModalContainer } from '../../components/ModalContainer/ModalContainer';
import { ModalUser } from '../../components/ModalUser/ModalUser';
import { ModalDelete } from '../../components/ModalDelete/ModalDelete';
import { ModalSupport } from '../../components/ModalSupport/ModalSupport';
import { ModalChange } from '../../components/ModalChange/ModalChange';
import  Notification  from '../../components/Notification/Notification';
import { CanvasProvider } from '@contexts/CanvasContext';

function Builder() {
  const params = useParams();
  const siteSlug = params['site-slug'];

  //BD states
  const [user, setUser] = useState(null);
  const [site, setSite] = useState(null);
  const [appearanceSettings, setAppearanceSettings] = useState(null);

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState(null);

  //Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    position: 'top',
    contentCenter: false
  });
  // Set userSettings based on modalType
  useEffect(() => {
    if (modalType === 'Account' || modalType === 'Appearance' || modalType === 'Plan') {
      setUserSettings(modalType);
    }
  }, [modalType]);
  


  //Fetch all data user from the database
  const allUserData = async (userId) => {
    if(!userId) {
      setUser(null);
      setSite(null);
      setAppearanceSettings(null);
      return;
    }

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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to fetch all data user from the database
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          allUserData(session.user.id);
        } else {
          setUser(null);
          setSite(null);
          setAppearanceSettings(null);
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
/*         //update site data when the selected site changes
        useEffect(() => {
          if(!site || site.userid !== user.id) return notFound();
    
  }, [site, user]);
   */

  // Set the accent color of the builder
  useEffect(() => {
  if (appearanceSettings?.['Accent Color']) {
    document.documentElement.setAttribute('data-color', appearanceSettings?.['Accent Color']);
  } else {
    document.documentElement.removeAttribute('data-color');
  }
}, [appearanceSettings]);

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
  };
    // Function to check if the site picture is null, undefined or empty, to know if we should show the avatar color or the avatar image
    const checkSitePicture = (site) => {
        const sitePicture = site?.["Avatar URL"];
        if(sitePicture === null || sitePicture === undefined || sitePicture === ''){
        return '';
        } else {
        return sitePicture;
        }
  }
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
    if (isModalOpen) {
      closeModal();
    }
     if (isChangeModalOpen) {
      closeChangeModal();
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
          siteData={siteData}
          setIsModalOpen={setIsModalOpen}
          setSiteData={setSiteData}
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

  return (
    <CanvasProvider>
    <div className="tw-builder">
      <BuilderLeftPanel 
        isPanelOpen={isLeftPanelOpen} 
        onPanelToggle={handleLeftPanelToggle}
        setModalType={setModalType}
        setIsModalOpen={setIsModalOpen}
        openChangeModal={openChangeModal}
        isRightPanelOpen={isRightPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
      />
      <BuilderBody site={site} setSite={setSite} setModalType={setModalType} setIsModalOpen={setIsModalOpen} checkSitePicture={checkSitePicture} SiteStyle={SiteStyle} openChangeModalSettings={openChangeModalSettings}/>
      
      <BuilderRightPanel user={user} checkProfilePicture={checkProfilePicture} profileStyle={ProfileStyle} setModalType={setModalType} setIsModalOpen={setIsModalOpen} showNotification={showNotification} siteSlug={siteSlug} isPanelOpen={isRightPanelOpen}/>
      
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
    </div>
    </CanvasProvider>
  );
}


export default Builder;