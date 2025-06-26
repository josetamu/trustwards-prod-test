import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase/supabaseClient';
import './Global.css'

import Academy from './Academy'
import Home from './Home/Home'
import { LegalNews } from './LegalNews/LegalNews'
import { Settings } from './Settings/Settings'
import { Sidebar, homePages, siteMenuPages, otherpages } from './sideBar/Sidebar'
import { Sites } from './sites/Sites'  
import { Reports } from './reports/Reports'
import { ModalAccount } from './ModalAccount/ModalAccount'
import { ModalNewSite } from './ModalNewSite/ModalNewSite'
import { ModalContainer } from './ModalContainer/ModalContainer'
import './App.css'
import { ModalEditSite } from './ModalEditSite/ModalEditSite'
import { ModalDelete } from './ModalDelete/ModalDelete'
import { ModalSupport } from './ModalSupport/ModalSupport'
import { ModalAppearance } from './ModalAppearance/ModalAppearance'
import SiteView from './SiteView/SiteView'
import { ModalChange } from './ModalChange/ModalChange'
import { ModalUser } from './ModalUser/ModalUser'
import Notification from './Notification/Notification'
function App() {
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Websites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [webs, setwebs] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [modalProps, setModalProps] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteOpen, setIsSiteOpen] = useState(false);
  const [siteTab, setSiteTab] = useState('Overview');
  const [appearanceSettings, setAppearanceSettings] = useState(null);
  // ModalChange state
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });
  

   // function to open sidebar in desktop toggleing the .open class
   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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


  

  //Force login (only dev mode)
  const _loginDevUser = async () => {
    await supabase.auth.signInWithPassword({
      /* emails: 'darezo.2809@gmail.com', 'oscar.abad.brickscore@gmail.com', 'jose11tamu@gmail.com'*/
      email: 'oscar.abad.brickscore@gmail.com',  
      password: 'TW.141109'
    });
  };

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



  const getAppearanceSettings = async (userId) => {
    const { data, error } = await supabase
      .from('Appearance')
      .select('*')
      .eq('userid', userId)
      .single();
    setAppearanceSettings(data);
  };




  // Function to fetch sites from Supabase
  const fetchSites = async (userId) => {
    if (!userId) {
      setwebs([]);
      return;
    }
    const { data, error } = await supabase
      .from('Site')
      .select('*')
      .eq('userid', userId);

    if (error) {
      console.error('Error fetching sites:', error);
    } else {
      setwebs(data);
    }
  };

  // Remove a site from the webs state
  const handleDeleteSite = (id) => {
    setwebs(prev => prev.filter(site => site.id !== id));
  };

  // Expose the function globally for Sites.jsx
  window.onDeleteSite = handleDeleteSite;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          getUser(session.user.id);
          fetchSites(session.user.id); // Fetch sites when user is authenticated
          getAppearanceSettings(session.user.id); // Fetch appearance settings when user is authenticated
        } else {
          getUser(null);
          setwebs([]); // Clear sites when user logs out
          setAppearanceSettings(null); // Clear appearance settings when user logs out
        }
      }
    );

    // Call _loginDevUser only once on mount to force login in development
    _loginDevUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activePage]);

  // Creates a custom new site
/*   const addSite = (text) => {
    if (text === null) {
      setIsModalOpen(false);
      return;
    }
    setSites([...sites, { id: sites.length + 1, text }]);
    setIsModalOpen(false);
  }; */
  

  // Render the appropriate view based on active page
  const renderActivePage = () => {
    switch (activePage) {
      case 'Websites':
        if(isSiteOpen){
          return <SiteView selectedSite={selectedSite} siteTab={siteTab} setSiteTab={setSiteTab} />
        }
        return (
          <Sites 
            sites={sites}
            /* onAddSite={addSite} */
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            user={user}
            webs={webs}
            isSidebarOpen={isSidebarOpen}
            setModalType={setModalType}
            setSiteData={setSiteData}
            siteData={siteData}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        );
      default:
        return <Sites />
    }
    
  };

  
 /*  const renderUserSettings = () => {
    switch (userSettings) {
      case 'Profile':
        return <Profile setUserSettings={setUserSettings} user={user} setUser={setUser}/>;
      default:
        return;
    }
  } */

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
        case 'NewSite':
          return (
            <ModalNewSite
              onSave={() => {setIsModalOpen(false); fetchSites(user?.id)}}
              onCancel={() => setIsModalOpen(false)}
              userSites={webs?.length || 0}
              setIsModalOpen={setIsModalOpen}
              userPlan={user?.Plan || 'free'}
              openModal={openModal}
              webs={webs}
            />
          );
        case 'EditSite':
          return (
            <ModalEditSite
              onSave={() => {setIsModalOpen(false); fetchSites(user?.id)}}
              onCancel={() => setIsModalOpen(false)}
              setIsModalOpen={setIsModalOpen}
              webs={webs}
              siteData={siteData}
              setSiteData={setSiteData}
              openModal={openModal}
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

/*   // Add a new site
  const handleAddSite = (newText, newDomain) => {
    const newSite = {
      id: crypto.randomUUID(),
      text: newText,
      domain: newDomain,
      createdAt: new Date().toISOString(),
    };    
    setwebs(prev => [...prev, newSite]);
    setIsModalOpen(false);
  }; */

  return (
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
      />
    <div className="content__container">
      {renderActivePage()}

      {isModalOpen && (
      <ModalContainer isOpen={isModalOpen} onClose={closeModal} isSidebarOpen={isSidebarOpen}>
       {renderModal()}
      </ModalContainer>
    )}
     
    {/* ModalChange as independent modal */}
    {isChangeModalOpen && (
      <ModalContainer isOpen={isChangeModalOpen} onClose={closeChangeModal} isSidebarOpen={isSidebarOpen}>
        <ModalChange
          changeType={changeType}
          onClose={closeChangeModal}
          user={user}
          setUser={setUser}
          setIsModalOpen={setIsModalOpen}
          showNotification={showNotification}
        />
      </ModalContainer>
    )}
    <Notification
      open={notification.open}
      onClose={hideNotification}
      position="top-right"
      autoClose={1000}
    >
      <span className={`notification__message`}>
        {notification.message}
      </span>
    </Notification>
     
    </div>
    
   
  </div>
    
      
  );
}

export default App