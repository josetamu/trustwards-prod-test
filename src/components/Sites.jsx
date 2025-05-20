import { Card } from './Card'
import { Modal } from './Modal'
export const Sites = ({ cards, onAddCard, isModalOpen, setIsModalOpen }) => (
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
          onSave={onAddCard}
        />
      )}
    </div>
  );