import { useState, useEffect } from 'react'
import { Card } from './components/Card'
import { Modal } from './components/Modal'
import { Sidebar } from './components/Sidebar'
import { supabase } from './supabase/supabaseClient';
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pages = [
    {
      name: 'Domains',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#ffffff" stroke-width="1.5"></path>
      <path d="M2.5 9H21.5" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
      <path d="M7 6H7.00898" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M11 6H11.009" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M9.11805 13.5C8.84339 13.1931 8.44425 13 8 13C7.17157 13 6.5 13.6716 6.5 14.5V15.5C6.5 16.3284 7.17157 17 8 17C8.44425 17 8.84339 16.8069 9.11805 16.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M15.5 13L17.5 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M12.4922 13.5H12.5012M12.4922 16.5H12.5012" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
    },
    {
      name: 'Settings',
      icon: settingsIcon
    }
  ];

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

  // creates a custom new card
  const addCard = (text) => {
    setCards([...cards, { id: cards.length + 1, text }]);
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar pages={pages} />
    
    <div className="card-table">
      <button onClick={() => setIsModalOpen(true)} className="md-card-button">
        Add Domain
      </button>

      <div className="cards-list">
        {cards.map((card) => (
          <Card key={card.id} text={card.text}/>
        ))}
      </div> 

      {isModalOpen && (
        <Modal
          onSave={addCard}
        />
      )}
    </div>
    </div>
  );
}

export default App