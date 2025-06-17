import React, { useState, useEffect } from 'react';
import { gradients, auroras, avatars } from '../ModalContainer/ModalContainer';
import './ModalAvatar.css';

// Función para precargar imágenes
const preloadImages = (items) => {
  items.forEach(item => {
    const img = new Image();
    img.src = item.src;
  });
};

// Precargar todas las imágenes al cargar el módulo
preloadImages([...gradients, ...auroras, ...avatars]);

export function ModalAvatar({ onClose, onSave }) {
  const [selectedGradient, setSelectedGradient] = useState(null);
  const [selectedAurora, setSelectedAurora] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [headerGradient, setHeaderGradient] = useState('linear-gradient(135deg, #FF6B00 0%, #1E40AF 100%)');

  const extractColorsFromImage = (imgSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const MAX_SIZE = 100;
        const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        
        const getPixelColor = (x, y) => {
          const i = (Math.round(y) * width + Math.round(x)) * 4;
          return `rgb(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]})`;
        };

        const colors = {
          top: getPixelColor(width / 2, 2),
          right: getPixelColor(width - 2, height / 2),
          bottom: getPixelColor(width / 2, height - 2),
          left: getPixelColor(2, height / 2),
          center: getPixelColor(width / 2, height / 2)
        };

        resolve(colors);
      };
      img.src = imgSrc;
    });
  };

  const createGradientFromColors = (colors) => {
    return `linear-gradient(135deg, 
      ${colors.top} 0%, 
      ${colors.right} 25%, 
      ${colors.center} 50%,
      ${colors.left} 75%, 
      ${colors.bottom} 100%
    )`;
  };

  const handleSelect = async (type, item) => {
    switch (type) {
      case 'gradient':
        setSelectedGradient(item);
        setSelectedAurora(null);
        setSelectedAvatar(null);
        try {
          const colors = await extractColorsFromImage(item.src);
          const gradient = createGradientFromColors(colors);
          setHeaderGradient(gradient);
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
        break;
      case 'aurora':
        setSelectedAurora(item);
        setSelectedGradient(null);
        setSelectedAvatar(null);
        try {
          const colors = await extractColorsFromImage(item.src);
          const gradient = createGradientFromColors(colors);
          setHeaderGradient(gradient);
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
        break;
      case 'avatar':
        setSelectedAvatar(item);
        setSelectedGradient(null);
        setSelectedAurora(null);
        try {
          const colors = await extractColorsFromImage(item.src);
          const gradient = createGradientFromColors(colors);
          setHeaderGradient(gradient);
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
        break;
      default:
        break;
    }
  };

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

  const handleSave = () => {
    const selectedImage = selectedAvatar || selectedGradient || selectedAurora;
    onSave({
      avatar: selectedImage || { src: '/logo test.png' },
      headerGradient: headerGradient
    });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc, { capture: true });
    return () => document.removeEventListener('keydown', handleEsc, { capture: true });
  }, [onClose]);

  return (
    <div className="modal-avatar">
      <div className="modal-avatar__header" style={{ background: headerGradient }}>
        <div className="modal-avatar__preview">
          {getPreviewLogo()}
        </div>
      </div>

      <div className="modal-avatar__content">
        <div className="modal-avatar__section">
          <h3>Gradients</h3>
          <div className="modal-avatar__divider"></div>
          <div className="modal-avatar__grid">
            {gradients.map(gradient => (
              <button
                key={gradient.id}
                className={`modal-avatar__option ${selectedGradient?.id === gradient.id ? 'modal-avatar__option--selected' : ''}`}
                onClick={() => handleSelect('gradient', gradient)}
              >
                <span className="modal-avatar__option-img">
                  <img src={gradient.src} alt={`Gradient option ${gradient.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <hr className="modal-avatar__divider" />
        <div className="modal-avatar__section">
          <h3>Aurora</h3>
          <div className="modal-avatar__divider"></div>
          <div className="modal-avatar__grid">
            {auroras.map(aurora => (
              <button
                key={aurora.id}
                className={`modal-avatar__option ${selectedAurora?.id === aurora.id ? 'modal-avatar__option--selected' : ''}`}
                onClick={() => handleSelect('aurora', aurora)}
              >
                <span className="modal-avatar__option-img">
                  <img src={aurora.src} alt={`Aurora option ${aurora.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <hr className="modal-avatar__divider" />
        <div className="modal-avatar__section">
          <h3>Avatar</h3>
          <div className="modal-avatar__divider"></div>
          <div className="modal-avatar__grid">
            {avatars.map(avatar => (
              <button
                key={avatar.id}
                className={`modal-avatar__option modal-avatar__option--avatar ${selectedAvatar?.id === avatar.id ? 'modal-avatar__option--selected' : ''}`}
                onClick={() => handleSelect('avatar', avatar)}
              >
                <span className="modal-avatar__option-img">
                  <img src={avatar.src} alt={`Avatar option ${avatar.id}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-avatar__actions modal-avatar__actions--horizontal">
      <button className="modal-avatar__button modal-avatar__button--cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="modal-avatar__button modal-avatar__button--save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
} 