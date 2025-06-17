import React, { useEffect, useCallback, useRef, useId } from 'react';
import './ModalContainer.css';

// Constantes de imágenes que serán usadas por ModalAvatar
export const gradients = [
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

export const auroras = [
  { id: 1, src: '/aurora1.png' },
  { id: 2, src: '/aurora2.png' },
  { id: 3, src: '/aurora3.png' },
  { id: 4, src: '/aurora4.png' },
  { id: 5, src: '/aurora5.png' },
  { id: 6, src: '/aurora6.png' }
];

export const avatars = [
  { id: 1, src: '/avatar1.png' },
  { id: 2, src: '/avatar2.png' },
  { id: 3, src: '/avatar3.png' },
  { id: 4, src: '/avatar2.png' },
  { id: 5, src: '/avatar1.png' },
  { id: 6, src: '/avatar1.png' },
  { id: 7, src: '/avatar3.png' }
];

// Función para precargar imágenes
const preloadImages = (items) => {
  items.forEach(item => {
    const img = new Image();
    img.src = item.src;
  });
};

// Precargar todas las imágenes al cargar el módulo
preloadImages([...gradients, ...auroras, ...avatars]);

export function ModalContainer({ isOpen, onClose, children, isSidebarOpen, handleCreate}) {
  const modalRef = useRef(null);
  const modalId = useId();


  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('modal__backdrop')) {
      onClose();
    }
  }, [onClose]);

  // Press Escape (global)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
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