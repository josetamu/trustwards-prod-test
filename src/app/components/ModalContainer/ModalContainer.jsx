import React, {useCallback, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimTypes } from '@animations/animations';
import './ModalContainer.css';


export function ModalContainer({ isOpen, onClose, children, onBackdropClick, modalType }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Function to get all focusable elements within the modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    // Standard focusable elements
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'summary',
      '[role="button"]:not([disabled])',
      '[role="menuitem"]',
      '[role="tab"]',
      '[role="option"]',
      '[role="switch"]',
      '[role="checkbox"]',
      '[role="radio"]'
    ];
    
    const elements = modalRef.current.querySelectorAll(focusableSelectors.join(', '));
    
    // Filter out elements that have tabIndex={-1} or are not visible
    return Array.from(elements).filter(el => {
      const style = window.getComputedStyle(el);
      return el.tabIndex !== -1 &&
             style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             !el.disabled &&
             el.offsetParent !== null;
    });
  }, []);

  // Function to trap focus within the modal
  const trapFocus = useCallback((e) => {
    if (!isOpen || !modalRef.current) return;
    
    // Only handle Tab key
    if (e.key !== 'Tab') return;
    
    // Check if this is the topmost modal by comparing z-index or DOM order
    const allModals = document.querySelectorAll('[role="dialog"]');
    const currentModalIndex = Array.from(allModals).indexOf(modalRef.current);
    const isTopmostModal = currentModalIndex === allModals.length - 1;
    
    // Only handle focus trap for the topmost modal
    if (!isTopmostModal) return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    
    
    // Check if the active element is within the modal
    const isActiveElementInModal = modalRef.current.contains(activeElement);
    
    if (!isActiveElementInModal) {
      // If focus is outside the modal, move it to the first element
      e.preventDefault();
      firstElement.focus();
      return;
    }
    
    if (e.shiftKey) {
      // Shift + Tab: move backwards
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: move forwards
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isOpen, getFocusableElements]);

  // Effect to handle focus management when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Add event listener for focus trapping
      document.addEventListener('keydown', trapFocus);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Small delay to ensure modal content is rendered
      const timeoutId = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
      };
      
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      // Remove event listener
      document.removeEventListener('keydown', trapFocus);
      
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, trapFocus]);

//Function to handle the backdrop click, to close the modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('modal__backdrop')) {
      // Prevent sidebar from closing when clicking on modal backdrop
      e.stopPropagation();
      onBackdropClick?.(e) || onClose();
    }
  }, [onBackdropClick, onClose]);

  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...getAnimTypes().find(anim => anim.name === 'OVERLAY_FADE')} 
          className="modal__backdrop" 
          onClick={modalType !== 'Welcome' ? handleBackdropClick : undefined}
        >
          <motion.div
            {...getAnimTypes().find(anim => anim.name === 'SCALE_TOP')}
            className="modal"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

 