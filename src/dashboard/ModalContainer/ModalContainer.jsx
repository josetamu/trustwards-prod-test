import React, { useEffect, useCallback, useRef } from 'react';
import './ModalContainer.css';

export function ModalContainer({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Set initial focus when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className === 'modal__backdrop') {
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
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
} 