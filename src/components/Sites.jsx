import { useState } from 'react';
import { Card } from './Card';
import { Modal } from './Modal';

export const Sites = ({ cards, onAddCard, isModalOpen, setIsModalOpen }) => {
  const [cardList, setCardList] = useState(cards);
  const [editingCard, setEditingCard] = useState(null);

   // Handles both adding a new card and editing an existing one
  const handleAddOrEditCard = (newText, newDomain) => {
    if (editingCard) {
      // Edit an existing card
      setCardList(prev =>
        prev.map(card =>
          card.id === editingCard.id ? { ...card, text: newText, domain: newDomain } : card
        )
      );
      setEditingCard(null);
    } else {
      // Add a new card
      const newCard = {
        id: crypto.randomUUID(),
        text: newText,
        domain: newDomain,
      };
      setCardList(prev => [...prev, newCard]);
    }

    setIsModalOpen(false);
  };

  // Delete the card
  const handleDeleteCard = (id) => {
    setCardList(prev => prev.filter(card => card.id !== id));
  };

  // Open the modal to edit the card
  const handleEditCard = (id) => {
    const cardToEdit = cardList.find(c => c.id === id);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="card-table">
      <button onClick={() => {
        setEditingCard(null);
        setIsModalOpen(true);
      }} className="md-card-button">
        Add Site
      </button>

      <div className="cards-list">
        {cardList.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal
          onSave={(text, domain) => handleAddOrEditCard(text, domain)}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCard(null);
          }}
          initialData={editingCard}
        />
      )}
    </div>
  );
};
