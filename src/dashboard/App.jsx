import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient';
import './Global.css'
import './modal/Modal.css'
import './sites/Sites.css'

import Academy from './Academy'
import Home from './Home'
import { LegalNews } from './LegalNews'
import { Settings } from './settings'
import { Sidebar } from './Sidebar'
import { homePages } from './Sidebar'
import { docPages } from './Sidebar'
import { Sites } from './sites/Sites'  
import { Reports } from './Reports'


function App() {
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Websites');

  //Force login (only dev mode)
  const _loginDevUser = async () => {
    await supabase.auth.signInWithPassword({
      email: 'oscar.abad.brickscore@gmail.com',
      password: 'TW.141109'
    });
  };

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if(error) {
      console.log(error);
    }else{
      const user = data.user;
    }
  };

  useEffect(() => {
    _loginDevUser();
    getUser();
  }, []);

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

  return (
  <div className="app-container">
    <Sidebar homePages={homePages} docPages={docPages} onPageChange={setActivePage} />
      {renderActivePage()}
  </div>
    
      
  );
}

export default App