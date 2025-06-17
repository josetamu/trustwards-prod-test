import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient';
import './Global.css'

import Academy from './Academy'
import Home from './home/Home'
import { LegalNews } from './legalNews/LegalNews'
import { Settings } from './settings/Settings'
import { Sidebar, homePages, siteMenuPages, otherpages } from './sideBar/Sidebar'
import { Sites } from './sites/Sites'  
import { Reports } from './reports/Reports'
import { Profile } from './Profile/Profile'
import { ModalNewSite } from './ModalNewSite/ModalNewSite'
import { ModalContainer } from './ModalContainer/ModalContainer'
import './App.css'
import { ModalEditSite } from './ModalEditSite/ModalEditSite'
import { ModalAvatar } from './ModalAvatar/ModalAvatar'
import { ModalDelete } from './ModalDelete/ModalDelete'
import { ModalSupport } from './ModalSupport/ModalSupport'
import { ModalAppearance } from './ModalAppearance/ModalAppearance'

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
      //email: 'darezo.2809@gmail.com',
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
        } else {
          getUser(null);
          setwebs([]); // Clear sites when user logs out
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
      case 'Home':
        return <Home />;
      case 'Websites':
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

    const renderModal = () => {
      if (!isModalOpen) return null;
  
      switch (modalType) {
        case 'Profile':
          return (
            <Profile 
              user={user} 
              setUser={setUser} 
              setIsModalOpen={setIsModalOpen}
              openModal={openModal}
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
        case 'EditAvatar':
          return (
            <ModalAvatar
              onClose={closeModal}
              onSave={(data) => {
                if (modalProps?.onSave) {
                  modalProps.onSave(data);
                }
                closeModal();
              }}
              initialState={modalProps?.initialState}
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
        return ( <ModalAppearance
            onClose={() => setIsModalOpen(false)}
            onSave={() => setIsModalOpen(false)}
          />)

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
      />
    <div className="content__container">
      {renderActivePage()}

      {isModalOpen && (
      <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSidebarOpen={isSidebarOpen}>
       {renderModal()}
      </ModalContainer>
    )}
     
    </div>
    
   
  </div>
    
      
  );
}

export default App