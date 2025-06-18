import React, { useEffect, useCallback, useRef, useId } from 'react';
import './ModalContainer.css';

import gradient1 from '../../assets/gradient1.png';
import gradient2 from '../../assets/gradient2.png';
import gradient3 from '../../assets/gradient3.png';
import gradient4 from '../../assets/gradient4.png';
import gradient5 from '../../assets/gradient5.png';
import gradient6 from '../../assets/gradient6.png';
import gradient7 from '../../assets/gradient7.png';
import gradient8 from '../../assets/gradient8.png';
import gradient9 from '../../assets/gradient9.png';
import gradient10 from '../../assets/gradient10.png';
import gradient11 from '../../assets/gradient11.png';

import aurora1 from '../../assets/aurora1.png';
import aurora2 from '../../assets/aurora2.png';
import aurora3 from '../../assets/aurora3.png';
import aurora4 from '../../assets/aurora4.png';
import aurora5 from '../../assets/aurora5.png';
import aurora6 from '../../assets/aurora6.png';

import avatar1 from '../../assets/avatar1.png';
import avatar2 from '../../assets/avatar2.png';
import avatar3 from '../../assets/avatar3.png';


// Constants of images that will be used by ModalAvatar
export const gradients = [
  { id: 1, src: gradient1 },
  { id: 2, src: gradient2 },
  { id: 3, src: gradient3 },
  { id: 4, src: gradient4 },
  { id: 5, src: gradient5 },
  { id: 6, src: gradient6 },
  { id: 7, src: gradient7 },
  { id: 8, src: gradient8 },
  { id: 9, src: gradient9 },
  { id: 10, src: gradient10 },
  { id: 11, src: gradient11 }
];

export const auroras = [
  { id: 1, src: aurora1 },
  { id: 2, src: aurora2 },
  { id: 3, src: aurora3 },
  { id: 4, src: aurora4 },
  { id: 5, src: aurora5 },
  { id: 6, src: aurora6 }
];

export const avatars = [
  { id: 1, src: avatar1 },
  { id: 2, src: avatar2 },
  { id: 3, src: avatar3 },
  { id: 4, src: avatar2 },
  { id: 5, src: avatar1 },
  { id: 6, src: avatar1 },
  { id: 7, src: avatar3 }
];

// Function to preload images
const preloadImages = (items) => {
  items.forEach(item => {
    const img = new Image();
    img.src = item.src;
  });
};

// Preload all images when the module is loaded
preloadImages([...gradients, ...auroras, ...avatars]);

// Function to generate default gradient
export const generateDefaultGradient = async () => {
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

      const gradient = `linear-gradient(135deg, 
        ${colors.top} 0%, 
        ${colors.right} 25%, 
        ${colors.center} 50%,
        ${colors.left} 75%, 
        ${colors.bottom} 100%
      )`;

      resolve(gradient);
    };
    img.src = gradient1;
  });
};

// Default logo
export let defaultGradient = 'linear-gradient(135deg, #FF6B00 0%, #1E40AF 100%)';

// Initialize default gradient
generateDefaultGradient().then(gradient => {
  defaultGradient = gradient;
});

export function ModalContainer({ isOpen, onClose, children, isSidebarOpen, handleCreate}) {
  const modalRef = useRef(null);
  const modalId = useId();

  // Function to detect if there are nested modals
  const hasNestedModal = () => {
    if (!modalRef.current) return false;
    // Search for elements with class modal-avatar inside the current modal
    const nestedModals = modalRef.current.querySelectorAll('.modal-avatar');
    return nestedModals.length > 0;
  };

  // Function to close the nested modal
  const closeNestedModal = () => {
    if (!modalRef.current) return;
    const nestedModals = modalRef.current.querySelectorAll('.modal-avatar');
    if (nestedModals.length > 0) {
      // Hide the close button of the nested modal
      const closeButton = nestedModals[nestedModals.length - 1].querySelector('[data-close-modal]');
      if (closeButton) {
        closeButton.click();
      }
    }
  };

  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('modal__backdrop')) {
      if (hasNestedModal()) {
        closeNestedModal();
      } else {
        onClose();
      }
    }
  }, [onClose]);

  // Press Escape (global)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (hasNestedModal()) {
        closeNestedModal();
      } else {
        onClose();
      }
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Focus trap
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If there are no focusable elements, prevent tabbing
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        // If focus is not within the modal, focus the first element
        if (!modalRef.current.contains(document.activeElement)) {
          firstElement.focus();
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleTabKey);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      modalRef.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={`modal__backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={handleBackdropClick}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" id={modalId}>
        {children}
      </div>
    </div>
  );
} 