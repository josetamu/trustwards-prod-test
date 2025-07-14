'use client'

import './dashboard-root.css'
import './dashboard.css'
import './[site-slug]/home.css'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../../supabase/supabaseClient';
import { useRouter, useParams, usePathname } from 'next/navigation';

import { Sidebar} from '@components/sideBar/Sidebar'
import { ModalContainer } from '@components/ModalContainer/ModalContainer'
import { ModalDelete } from '@components/ModalDelete/ModalDelete'
import { ModalSupport } from '@components/ModalSupport/ModalSupport'
import { ModalChange } from '@components/ModalChange/ModalChange'
import { ModalUser } from '@components/ModalUser/ModalUser'
import Notification from '@components/Notification/Notification'
import DashboardHeader from '@components/DashboardHeader/DashboardHeader'

import { useTheme } from 'next-themes'
const DashboardContext = createContext(null);
export const useDashboard = () => useContext(DashboardContext);

function DashboardLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Sidebar state && Site state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteOpen, setIsSiteOpen] = useState(false);

  // DB state
  const [userSettings, setUserSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [webs, setWebs] = useState([]);
  const [siteData, setSiteData] = useState(null);
  const [appearanceSettings, setAppearanceSettings] = useState(null);

  // ModalChange state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState('');

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Browser state to handle SSR
  const [isBrowser, setIsBrowser] = useState(false);

  // We set the appearance settings when they are loaded. appearanceSettings is a object with the settings of the user(database)
  // Theme is controlled with next-themes and Accent Color is an attribute of the html tag
  useEffect(() => {
    setIsBrowser(true);
    if (appearanceSettings) {
      setTheme(appearanceSettings['Theme']);
      
      if (appearanceSettings['Accent Color']) {
        document.documentElement.setAttribute('data-color', appearanceSettings['Accent Color']);
      } else {
        document.documentElement.removeAttribute('data-color');
      }
    }
  }, [appearanceSettings]);


   // function to open sidebar in desktop toggleing the .open class. Also we save the state in the database only on desktop
   const toggleSidebar = async () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    
    //save in the database only on desktop
    if (window.innerWidth > 767) {
      await updateAppearanceSettings({ Sidebar: newSidebarState });
    }

    // we add the .open class to the content container and the user settings and the modal
    const contentContainer = document.querySelector('.content__container');
    const userSettings = document.querySelector('.profile');
    const modal = document.querySelector('.modal__backdrop'); 
    
    if (!isSidebarOpen) {
        contentContainer.classList.add('open');
        if(userSettings){
          userSettings.classList.add('open');
        }
        if(modal){
          modal.classList.add('open');
        }
    } else {
        contentContainer.classList.remove('open');
        if(userSettings){
          userSettings.classList.remove('open');
        }
        if(modal){
          modal.classList.remove('open');
        }

    }
};

  // Apply sidebar state saved in the database when appearance settings are loaded. if the user is in mobile, this is not applied
  useEffect(() => {
    if (appearanceSettings && appearanceSettings.Sidebar !== undefined) {
      // In mobile (≤767px), always start with the sidebar closed
      // In desktop (>767px), use the saved state in the database
      if (window.innerWidth <= 767) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(appearanceSettings.Sidebar);
      }
    }
  }, [appearanceSettings]);

  // Avatar's colors pool
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
  
  //Force login (only dev mode)
  const _loginDevUser = async () => {
    await supabase.auth.signInWithPassword({
      /* emails: 'darezo.2809@gmail.com', 'oscar.abad.brickscore@gmail.com', 'jose11tamu@gmail.com'*/
      email: 'oscar.abad.brickscore@gmail.com',  
      password: 'TW.141109'
    });
  };


  // We get the user data from the database
  const getUser = async (userId) => {
    if (!userId) {
      setUser(null);
      return;
    }
    const {data: userData, error: dbError} = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();
    if(dbError) {
      console.log(dbError);
      setUser(null);
    } else {
      setUser(userData);
    }
  };


  // We get the appearance settings from the database
  const getAppearanceSettings = async (userId) => {
    const { data, error } = await supabase
      .from('Appearance')
      .select('*')
      .eq('userid', userId)
      .single();
    setAppearanceSettings(data);
  };

  // Function to update the appearance settings in the database
  const updateAppearanceSettings = async (settings) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('Appearance')
      .update(settings)
      .eq('userid', user.id);
    
    if (error) {
      console.error('Error updating appearance settings:', error);
    }
  };

    // Function to fetch sites from Supabase. Also used to realtime update the sites when a new site is created
    const fetchSites = async (userId) => {
      if (!userId) {
        setWebs([]);
        return;
      }
      const { data, error } = await supabase
        .from('Site')
        .select('*')
        .eq('userid', userId);
  
      if (error) {
        console.error('Error fetching sites:', error);
      } else {
        setWebs(data);
      }
    };


  // Remove a site from the webs state. 
  const handleDeleteSite = (id) => {
    setWebs(prev => prev.filter(site => site.id !== id));
  };

  // Expose the function globally for Sites.jsx using useEffect, and real time removed
  useEffect(() => {
    window.onDeleteSite = handleDeleteSite;
    
    return () => {
      delete window.onDeleteSite;
    };
  }, []);


  //We get the user data from the database when the user is authenticated
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          getUser(session.user.id);
          fetchSites(session.user.id); // Fetch sites when user is authenticated
          getAppearanceSettings(session.user.id); // Fetch appearance settings when user is authenticated
        } else {
          getUser(null);
          setWebs([]); // Clear sites when user logs out
          setAppearanceSettings(null); // Clear appearance settings when user logs out
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Force login (only dev mode)
  useEffect(() => {
    _loginDevUser();
  }, []);

  // Update global siteData when navigating to a specific site
  useEffect(() => {
    const siteSlug = params['site-slug'];
    if (siteSlug) {
      if (webs.length > 0) {
        const selectedSite = webs.find(site => site.id === siteSlug);
        if (selectedSite) {
          setSiteData(selectedSite);
          setIsSiteOpen(true);
        }
      }
      // Don't set siteData to null when webs is empty, wait for webs to load
    } else {
      setSiteData(null);
      setIsSiteOpen(false);
    }
  }, [params, webs, setSiteData, setIsSiteOpen]);

  // Set userSettings based on modalType
  useEffect(() => {
    if (modalType === 'Account' || modalType === 'Appearance' || modalType === 'Plan') {
      setUserSettings(modalType);
    }
  }, [modalType]);


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

//Global function to close modals by clicking outside the modal
const handleBackdropClick = useCallback((e) => {
  if (e.target.className.includes('modal__backdrop')) {
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


//Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        
      
    };

    // Function to open the ModalChange modal
    const openChangeModal = (type) => {
      setChangeType(type);
      setIsChangeModalOpen(true);
    };

    // Function to open the ModalChange modal with the site data
    const openChangeModalSettings = (siteData) => {
      setChangeType('settings');
      setIsChangeModalOpen(true);
      setSiteData(siteData);
    };

    //Function to close the ModalChange modal
    const closeChangeModal = () => {
        setIsChangeModalOpen(false);
        setChangeType('');
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

    //Function to copy script to clipboard
    const handleCopy = async (siteSlug, position = 'top', contentCenter = false) => {
        const script = `<script>https://trustwards.io/cdn/${siteSlug}.js</script>`;
        try {
            await navigator.clipboard.writeText(script);
            showNotification("Copied script to clipboard", position, contentCenter);
        } catch (error) {
            console.error('Failed to copy text: ', error);
            showNotification("Failed to copy script", position, contentCenter);
        }
    };

    //Function to create a new site
    const createNewSite = async (createSiteName, createSiteDomain) => {
    
      try {
        const colorKeys = Object.keys(avatarColors);
        const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        
        // Function to generate a unique site name, mapping the existing sites names if includes the name adds a number to the end in the while loop
        const generateUniqueSiteName = (baseName) => {
          const existingNames = webs.map(site => site.Name);
          let newName = baseName;
          let counter = 1;
          
          while (existingNames.includes(newName)) {
            newName = `${baseName} (${counter})`;
            counter++;
          }
          
          return newName;
        };
        
        // When a user creates a new site, the auto generated name is "Untitled"
        const uniqueSiteName = generateUniqueSiteName(createSiteName || 'Untitled');
        
        const { data, error } = await supabase
          .from('Site')
          .insert([
            {
              Name: uniqueSiteName,
              userid: user.id,
              'Avatar Color': randomColorKey,
              Plan: 'Free',
              Domain: createSiteDomain
            }
          ])
          .select();

        if (error) {
          showNotification('Error creating site');
          return;
        }

        // Update the webs state immediately with the new site
        setWebs(prevWebs => [...prevWebs, data[0]]);
        setSelectedSite(data[0]);
        setIsSiteOpen(true);
        
        // Navigate to the new site page
        router.push(`/dashboard/${data[0].id}`);

      } catch (error) {
        showNotification('Error creating site');
      }
    }

    //Function to check if the sidebar is open and the window is in mobile. Then in the return() we add the class to the content container
    const blockSidebar = () => {
      if (!isBrowser) return false;
      return window.innerWidth <= 767 && isSidebarOpen;
    };


//This function is the master of the modals. It is the function that renders the modal depending on the modalType. Each modal is a component that is rendered in the ModalContainer as a child.
//Also ModalUser is ModalContainer child, but it is father of account, appearance and upgrade. That's why we have to check the modalType and render ModalUser in those cases.
    const renderModal = () => {
      if (!isModalOpen) return null;
  
      switch (modalType) {
        case 'Account':
          return (
            <ModalUser
              onClose={() => setIsModalOpen(false)}
              onSave={() => {
                // Refresh user data after saving appearance settings
                  getAppearanceSettings(user.id); // Refresh appearance settings after saving
                  setIsModalOpen(false);
              
            }}
            user={user}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            getAppearanceSettings={getAppearanceSettings}
            openChangeModal={openChangeModal}
            checkProfilePicture={checkProfilePicture}
            profileStyle={ProfileStyle}
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
              // Refresh user data after saving appearance settings
                getAppearanceSettings(user.id); // Refresh appearance settings after saving
                setIsModalOpen(false);
              
            }}
            user={user}
            setUser={setUser}
            setIsModalOpen={setIsModalOpen}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            getAppearanceSettings={getAppearanceSettings}
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
              getAppearanceSettings={getAppearanceSettings}
              openChangeModal={openChangeModal}
              checkProfilePicture={checkProfilePicture}
              profileStyle={ProfileStyle}
            />
          )
        
        default:
          return null;
      }
    }

    const contextProps = {
        isModalOpen,
        setIsModalOpen,
        user,
        webs,
        isSidebarOpen,
        setModalType,
        setSiteData,
        siteData,
        setIsDropdownOpen,
        fetchSites,
        checkSitePicture,
        SiteStyle,
        showNotification,
        supabase,
        isDropdownOpen,
        handleCopy,
        setSelectedSite,
        openChangeModalSettings,
        openChangeModal,
        showNotification,
    };

    return (
        <DashboardContext.Provider value={contextProps}>
            <div className="app-container">
                <Sidebar  
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    toggleSidebar={toggleSidebar}
                    user={user}
                    webs={webs}
                    setIsModalOpen={setIsModalOpen}
                    setModalType={setModalType}
                    isModalOpen={isModalOpen}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    setSiteData={setSiteData}
                    siteData={siteData}
                    modalType={modalType}
                    selectedSite={selectedSite}
                    setSelectedSite={setSelectedSite}
                    isSiteOpen={isSiteOpen}
                    setIsSiteOpen={setIsSiteOpen}
                    userSettings={userSettings}
                    setUserSettings={setUserSettings}
                    checkProfilePicture={checkProfilePicture}
                    profileStyle={ProfileStyle}
                    checkSitePicture={checkSitePicture}
                    SiteStyle={SiteStyle}
                    openChangeModal={openChangeModal}
                    openChangeModalSettings={openChangeModalSettings}
                    showNotification={showNotification}
                />
                <div className={`content__container ${isSidebarOpen ? 'open' : ''} ${blockSidebar() ? 'content__container--blocked' : ''}`}>
                    {isSiteOpen && !pathname.startsWith('/builder') && <DashboardHeader />}
                    {children}


                </div>
                <ModalContainer 
                        isOpen={isModalOpen} 
                        onClose={closeModal} 
                        onBackdropClick={handleBackdropClick}
                        isSidebarOpen={isSidebarOpen}
                    >
                        {renderModal()}
                    </ModalContainer>
                    {/* ModalChange as independent modal */}
                    <ModalContainer 
                    isOpen={isChangeModalOpen} 
                    isSidebarOpen={isSidebarOpen}
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
                        siteData={siteData}
                        setSiteData={setSiteData}
                        fetchSites={fetchSites}
                        createNewSite={createNewSite}
                    />
                    </ModalContainer>
                    <Notification
                    open={notification.open}
                    onClose={hideNotification}
                    autoClose={2000} //duration of the notification in ms
                    notificationMessage={notification.message}
                    position={notification.position || 'top'}
                    isSidebarOpen={isSidebarOpen}
                    contentCenter={notification.contentCenter || false}
                    >
                    </Notification>
            </div>
        </DashboardContext.Provider>
    );
}

export default DashboardLayout