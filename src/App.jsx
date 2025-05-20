import { useState } from 'react'
import { Card } from './components/Card'
import { Modal } from './components/Modal'
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // creates a custom new card
  const addCard = (text) => {
    setCards([...cards, { id: cards.length + 1, text }]);
    setIsModalOpen(false);
  };

  return (
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
  );
}

export default App
