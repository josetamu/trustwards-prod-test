import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient';
import './Global.css'

import Academy from './Academy'
import Home from './home/Home'
import { LegalNews } from './legalNews/LegalNews'
import { Settings } from './settings/Settings'
import { Sidebar, homePages, docPages, otherpages } from './sideBar/Sidebar'
import { Sites } from './sites/Sites'  
import { Reports } from './reports/Reports'
import { Profile } from './profile/Profile'
import { ModalNewSite } from './ModalNewSite/ModalNewSite'
import { ModalContainer } from './ModalContainer/ModalContainer'

function App() {
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Websites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [webs, setwebs] = useState([]);
  const [modalType, setModalType] = useState(null);
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
  const fetchSites = async () => {
    const { data, error } = await supabase
      .from('Site')
      .select('*');
    
    if (error) {
      console.error('Error fetching sites:', error);
    } else {
      setwebs(data);
    }
  };

  useEffect(() => {
    // Usar el listener onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          getUser(session.user.id);
          fetchSites(); // Fetch sites when user is authenticated
        } else {
          getUser(null);
          setwebs([]); // Clear sites when user logs out
        }
      }
    );

    // Llamar a _loginDevUser solo una vez al montar el componente para forzar el inicio de sesión en desarrollo
    _loginDevUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Dependencia vacía para que se ejecute solo una vez

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
            
          />
        );
      case 'Support':
        return <Reports />;
      case 'Appearance':
        return <Academy />;
      case 'Legal news':
        return <LegalNews />;
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
    const renderModal = () => {
      if (!isModalOpen) return null;
  
      switch (modalType) {
        case 'Profile':
          return (
           
              <Profile user={user} setUser={setUser} setIsModalOpen={setIsModalOpen} />
           
          );
        case 'NewSite':
          return (
            
              <ModalNewSite
                onSave={() => {setIsModalOpen(false); fetchSites()}}
                onCancel={() => setIsModalOpen(false)}
              />
            
          );
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