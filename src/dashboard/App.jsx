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


function App() {
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Websites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [user, setUser] = useState(null);
   // function to open sidebar in desktop toggleing the .open class
   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const contentContainer = document.querySelector('.content__container');
    const userSettings = document.querySelector('.profile');
    if (!isSidebarOpen) {
        contentContainer.classList.add('open');
        if(userSettings){
          userSettings.classList.add('open');
        }
    } else {
        contentContainer.classList.remove('open');
        if(userSettings){
          userSettings.classList.remove('open');
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
    .from('Users')
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

  useEffect(() => {
    // Usar el listener onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          getUser(session.user.id);
        } else {
          getUser(null); // Limpiar el usuario si no hay sesión
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
  const addSite = (text) => {
    if (text === null) {
      setIsModalOpen(false);
      return;
    }
    setSites([...sites, { id: sites.length + 1, text }]);
    setIsModalOpen(false);
  };
  

  // Render the appropriate view based on active page
  const renderActivePage = () => {
    switch (activePage) {
      case 'Home':
        return <Home />;
      case 'Websites':
        return (
          <Sites 
            sites={sites}
            onAddSite={addSite}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            user={user}
          />
        );
      case 'Analytics':
        return <Reports />;
      case 'Academy':
        return <Academy />;
      case 'Legal news':
        return <LegalNews />;
      default:
        return <Sites />
    }
    
  };

  
  const renderUserSettings = () => {
    switch (userSettings) {
      case 'Profile':
        return <Profile setUserSettings={setUserSettings} user={user} setUser={setUser}/>;
      default:
        return;
    }

   
  }

  return (
  <div className="app-container">
    <Sidebar homePages={homePages} 
      docPages={docPages} 
      otherPages={otherpages}
      onPageChange={setActivePage} 
      isSidebarOpen={isSidebarOpen} 
      setIsSidebarOpen={setIsSidebarOpen} 
      toggleSidebar={toggleSidebar}
      setUserSettings={setUserSettings}
      user={user}/>
    <div className="content__container">
      {renderActivePage()}
     {renderUserSettings()}
    </div>
  </div>
    
      
  );
}

export default App