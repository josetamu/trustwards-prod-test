import React, { useState } from 'react';
import './ModalEdit.css';

export function ModalEdit({ onClose, onSave }) {
  const [selectedGradient, setSelectedGradient] = useState(null);
  const [selectedAurora, setSelectedAurora] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const gradients = [
    { id: 1, src: '/gradient1.png' },
    { id: 2, src: '/gradient2.png' },
    { id: 3, src: '/gradient3.png' },
    { id: 4, src: '/gradient4.png' },
    { id: 5, src: '/gradient5.png' },
    { id: 6, src: '/gradient6.png' },
    { id: 7, src: '/gradient7.png' },
    { id: 8, src: '/gradient8.png' },
    { id: 9, src: '/gradient9.png' },
    { id: 10, src: '/gradient10.png' },
    { id: 11, src: '/gradient11.png' }
  ];

  const auroras = [
    { id: 1, src: '/aurora1.png' },
    { id: 2, src: '/aurora2.png' },
    { id: 3, src: '/aurora3.png' },
    { id: 4, src: '/aurora4.png' },
    { id: 5, src: '/aurora5.png' },
    { id: 6, src: '/aurora6.png' }
  ];

  const avatars = [
    { id: 1, src: '/avatar1.png' },
    { id: 2, src: '/avatar2.png' },
    { id: 3, src: '/avatar3.png' },
    { id: 4, src: '/avatar2.png' },
    { id: 5, src: '/avatar1.png' },
    { id: 6, src: '/avatar1.png' },
    { id: 7, src: '/avatar3.png' }
  ];

  // Handles the selection of customization options
  const handleSelect = (type, item) => {
    switch (type) {
      case 'gradient':
        setSelectedGradient(item);
        setSelectedAurora(null);
        setSelectedAvatar(null);
        break;
      case 'aurora':
        setSelectedAurora(item);
        setSelectedGradient(null);
        setSelectedAvatar(null);
        break;
      case 'avatar':
        setSelectedAvatar(item);
        setSelectedGradient(null);
        setSelectedAurora(null);
        break;
      default:
        break;
    }
  };

  // Gets the logo for the preview header
  const getPreviewLogo = () => {
    if (selectedAvatar) {
      return <img src={selectedAvatar.src} alt="Selected avatar" />;
    }
    if (selectedGradient) {
      return <img src={selectedGradient.src} alt="Selected gradient" />;
    }
    if (selectedAurora) {
      return <img src={selectedAurora.src} alt="Selected aurora" />;
    }
    return <img src="/logo test.png" alt="Default logo" />;
  };

  // The header background is always the same now
  const getPreviewBackground = () => {
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
          {getPreviewLogo()}
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
                onClick={() => handleSelect('gradient', gradient)}
              >
                <span className="modal-edit__option-img">
                  <img src={gradient.src} alt={`Gradient option ${gradient.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <hr className="modal-edit__divider" />
        <div className="modal-edit__section">
          <h3>Aurora</h3>
          <div className="modal-edit__grid">
            {auroras.map(aurora => (
              <button
                key={aurora.id}
                className={`modal-edit__option ${selectedAurora?.id === aurora.id ? 'modal-edit__option--selected' : ''}`}
                onClick={() => handleSelect('aurora', aurora)}
              >
                <span className="modal-edit__option-img">
                  <img src={aurora.src} alt={`Aurora option ${aurora.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <hr className="modal-edit__divider" />
        <div className="modal-edit__section">
          <h3>Avatar</h3>
          <div className="modal-edit__grid">
            {avatars.map(avatar => (
              <button
                key={avatar.id}
                className={`modal-edit__option modal-edit__option--avatar ${selectedAvatar?.id === avatar.id ? 'modal-edit__option--selected' : ''}`}
                onClick={() => handleSelect('avatar', avatar)}
              >
                <span className="modal-edit__option-img">
                  <img src={avatar.src} alt={`Avatar option ${avatar.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-edit__actions modal-edit__actions--horizontal">
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