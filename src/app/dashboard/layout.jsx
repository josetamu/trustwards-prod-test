'use client'

import './dashboard-root.css'
import './dashboard.css'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../../supabase/supabaseClient';
import { useRouter } from 'next/navigation';

import { Sidebar, otherpages } from '@components/sideBar/Sidebar'
import { ModalContainer } from '@components/ModalContainer/ModalContainer'
import { ModalDelete } from '@components/ModalDelete/ModalDelete'
import { ModalSupport } from '@components/ModalSupport/ModalSupport'
import { ModalChange } from '@components/ModalChange/ModalChange'
import { ModalUser } from '@components/ModalUser/ModalUser'
import Notification from '@components/Notification/Notification'


import { useTheme } from 'next-themes'
const DashboardContext = createContext(null);
export const useDashboard = () => useContext(DashboardContext);

function DashboardLayout({ children }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [modalProps, setModalProps] = useState(null);

  // Sidebar state && Site state
  const [activePage, setActivePage] = useState('Websites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteOpen, setIsSiteOpen] = useState(false);
  const [siteTab, setSiteTab] = useState('Home');

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

 




  // We set the appearance settings when they are loaded. appearanceSettings is a object with the settings of the user(database)
  // Theme is controlled with next-themes and Accent Color is an attribute of the html tag
  useEffect(() => {
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

const arrayDePrueba = {
  negro: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  blanco: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  azul: {
    backgroundColor: '#003049',
    color: '#FFFFFF',
  },
  celeste: {
    backgroundColor: '#ade8f4',
    color: '#000000',
  },
};
  

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
    console.log(userId)
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

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activePage]);

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

    const openModal = (type, props = null) => {
      setModalType(type);
      setModalProps(props);
      setIsModalOpen(true);
    };

    const closeModal = () => {

        setIsModalOpen(false);
        setModalType(null);
        setModalProps(null);
      
    };

    // ModalChange functions
    const openChangeModal = (type) => {
      setChangeType(type);
      setIsChangeModalOpen(true);
    };

    const closeChangeModal = () => {
        setIsChangeModalOpen(false);
        setChangeType('');
      };

    const showNotification = (message) => {
      setNotification({
        open: true,
        message: message,
      });
    };
    const hideNotification = () => {
      setNotification({
        open: false,
        message: '',
      });
    };

    const createNewSite = async () => {
      try {
        const colorKeys = Object.keys(arrayDePrueba);
        const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        
        // Function to generate a unique site name, mapping the existing sites names if includes the name adds a number to the end in the while loop
        const generateUniqueSiteName = (baseName) => {
          const existingNames = webs.map(site => site.Name);
          let newName = baseName;
          let counter = 1;
          
          while (existingNames.includes(newName)) {
            newName = `${baseName}(${counter})`;
            counter++;
          }
          
          return newName;
        };
        
        // When a user creates a new site, the auto generated name is "Untitled"
        const uniqueSiteName = generateUniqueSiteName('Untitled');
        
        const { data, error } = await supabase
          .from('Site')
          .insert([
            {
              Name: uniqueSiteName,
              userid: user.id,
              'Avatar Color': randomColorKey
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
        router.push(`/dashboard/${encodeURIComponent(uniqueSiteName)}`);

      } catch (error) {
        showNotification('Error creating site');
      }
    }

    const blockSidebar = () => {

      if(window.innerWidth <= 767 && isSidebarOpen){
        return true;
      }
      return false;
    }

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
            setUser={setUser}
            setIsModalOpen={setIsModalOpen}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            getAppearanceSettings={getAppearanceSettings}
            openChangeModal={openChangeModal}
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
          />)
        case 'Upgrade':
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
        createNewSite,
    };

    return (
        <DashboardContext.Provider value={contextProps}>
            <div className="app-container">
                <Sidebar  
                    otherPages={otherpages}
                    onPageChange={setActivePage} 
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
                    siteTab={siteTab}
                    setSiteTab={setSiteTab}
                    userSettings={userSettings}
                    setUserSettings={setUserSettings}
                    createNewSite={createNewSite}
                />
                <div className={`content__container ${isSidebarOpen ? 'open' : ''} ${blockSidebar() ? 'content__container--blocked' : ''}`}>
                    {children}

                    <ModalContainer 
                        isOpen={isModalOpen} 
                        onClose={closeModal} 
                        isSidebarOpen={isSidebarOpen}
                        onBackdropClick={handleBackdropClick}
                    >
                        {renderModal()}
                    </ModalContainer>
                    
                    {/* ModalChange as independent modal */}
                    <ModalContainer 
                    isOpen={isChangeModalOpen} 
                    onClose={closeChangeModal} 
                    isSidebarOpen={isSidebarOpen}
                    onBackdropClick={handleBackdropClick}
                    >
                    <ModalChange
                        changeType={changeType}
                        onClose={closeChangeModal}
                        user={user}
                        setUser={setUser}
                        setIsModalOpen={setIsModalOpen}
                        showNotification={showNotification}
                    />
                    </ModalContainer>
                    <Notification
                    open={notification.open}
                    onClose={hideNotification}
                    position="top-right"
                    autoClose={1500}
                    >
                    <span className={`notification__message`}>
                        {notification.message}
                    </span>
                    </Notification>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}

export default DashboardLayout