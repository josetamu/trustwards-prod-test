import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { supabase } from './supabase/supabaseClient';
import { pages } from './components/Sidebar'
import './App.css'
import { Sites } from './components/Sites'  
import { Settings } from './components/settings'
import { Reports } from './components/Reports'
import Home from './components/Home'
import Academy from './components/Academy'
import { LegalNews } from './components/LegalNews'
import './components/Components.css'



function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('Domains');

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

      console.log('Name:', user.user_metadata.display_name);
      console.log('Email:', user.email);
    }
  };

  useEffect(() => {
    _loginDevUser();
    getUser();
  }, []);

  // Creates a custom new card
  const addCard = (text) => {
    if (text === null) {
      setIsModalOpen(false);
      return;
    }
    setCards([...cards, { id: cards.length + 1, text }]);
    setIsModalOpen(false);
  };
  

  // Render the appropriate view based on active page
  const renderActivePage = () => {
    switch (activePage) {
      case 'Home':
        return <Home />;
      case 'Sites':
        return (
          <Sites 
            cards={cards}
            onAddCard={addCard}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case 'Reports':
        return <Reports />;
      case 'Academy':
        return <Academy />;
      case 'Legal news':
        return <LegalNews />;
      default:
        return <Home />
    }
  };

  return (
    <div className="app-container">
      <Sidebar pages={pages} onPageChange={setActivePage} />
      {renderActivePage()}
    </div>
  );
}

export default App