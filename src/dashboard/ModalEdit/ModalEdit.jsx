import React, { useState } from 'react';
import './ModalEdit.css';

export function ModalEdit({ onClose, onSave }) {
  const [selectedGradient, setSelectedGradient] = useState(null);
  const [selectedAurora, setSelectedAurora] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const gradients = [
    { id: 1, colors: ['#FF6B00', '#1E40AF'] },
    { id: 2, colors: ['#7E22CE', '#3730A3'] },
    { id: 3, colors: ['#DC2626', '#7F1D1D'] },
    { id: 4, colors: ['#2563EB', '#7C3AED'] },
    { id: 5, colors: ['#4338CA', '#3730A3'] },
    { id: 6, colors: ['#EA580C', '#9A3412'] },
    { id: 7, colors: ['#DB2777', '#4338CA'] },
    { id: 8, colors: ['#0D9488', '#0369A1'] },
    { id: 9, colors: ['#4B5563', '#1F2937'] },
    { id: 10, colors: ['#0EA5E9', '#F97316'] },
    { id: 11, colors: ['#DC2626', '#1D4ED8'] }
  ];

  const auroras = [
    { id: 1, color: '#7E22CE' },
    { id: 2, color: '#1F2937' },
    { id: 3, color: '#1E40AF' },
    { id: 4, color: '#0EA5E9' },
    { id: 5, color: '#65A30D' },
    { id: 6, color: '#EA580C' }
  ];

  const avatars = [
    { id: 1, src: '/avatar1.png' },
    { id: 2, src: '/avatars/2.png' },
    { id: 3, src: '/avatars/3.png' },
    { id: 4, src: '/avatars/4.png' },
    { id: 5, src: '/avatars/5.png' },
    { id: 6, src: '/avatars/6.png' },
    { id: 7, src: '/avatars/7.png' }
  ];

  // Handles the selection of customization options
  const handleSelect = (type, item) => {
    switch (type) {
      case 'gradient':
        setSelectedGradient(item);
        break;
      case 'aurora':
        setSelectedAurora(item);
        break;
      case 'avatar':
        setSelectedAvatar(item);
        break;
      default:
        break;
    }
  };

  // Gets the background style for the preview header
  const getPreviewBackground = () => {
    if (selectedGradient) {
      return `linear-gradient(135deg, ${selectedGradient.colors[0]} 0%, ${selectedGradient.colors[1]} 100%)`;
    }
    if (selectedAurora) {
      return selectedAurora.color;
    }
    return 'linear-gradient(135deg, #FF6B00 0%, #1E40AF 100%)';
  };

  // Handles saving the customization changes
  const handleSave = () => {
    onSave({
      gradient: selectedGradient,
      aurora: selectedAurora,
      avatar: selectedAvatar
    });
  };

  return (
    <div className="modal-edit">
      <div className="modal-edit__header" style={{ background: getPreviewBackground() }}>
        <div className="modal-edit__preview">
          {selectedAvatar ? (
            <img src={selectedAvatar.src} alt="Selected avatar" />
          ) : (
            <img src="/logo test.png" alt="Default logo" />
          )}
        </div>
      </div>

      <div className="modal-edit__content">
        <div className="modal-edit__section">
          <h3>Gradients</h3>
          <div className="modal-edit__grid">
            {gradients.map(gradient => (
              <button
                key={gradient.id}
                className={`modal-edit__option ${selectedGradient?.id === gradient.id ? 'modal-edit__option--selected' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`
                }}
                onClick={() => handleSelect('gradient', gradient)}
              />
            ))}
          </div>
        </div>

        <div className="modal-edit__section">
          <h3>Aurora</h3>
          <div className="modal-edit__grid">
            {auroras.map(aurora => (
              <button
                key={aurora.id}
                className={`modal-edit__option ${selectedAurora?.id === aurora.id ? 'modal-edit__option--selected' : ''}`}
                style={{ background: aurora.color }}
                onClick={() => handleSelect('aurora', aurora)}
              />
            ))}
          </div>
        </div>

        <div className="modal-edit__section">
          <h3>Avatar</h3>
          <div className="modal-edit__grid">
            {avatars.map(avatar => (
              <button
                key={avatar.id}
                className={`modal-edit__option modal-edit__option--avatar ${selectedAvatar?.id === avatar.id ? 'modal-edit__option--selected' : ''}`}
                onClick={() => handleSelect('avatar', avatar)}
              >
                <img src={avatar.src} alt={`Avatar option ${avatar.id}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-edit__actions">
        <button className="modal-edit__button modal-edit__button--save" onClick={handleSave}>
          Save Changes
        </button>
        <button className="modal-edit__button modal-edit__button--cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
} 