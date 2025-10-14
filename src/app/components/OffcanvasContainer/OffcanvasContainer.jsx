import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OffcanvasContainer.css';

export function OffcanvasContainer({ isOpen, onClose, children, position = 'right' }) {
  const offcanvasRef = useRef(null);
  const previousActiveElement = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!offcanvasRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      '[role="button"]:not([disabled])'
    ];
    
    const elements = offcanvasRef.current.querySelectorAll(focusableSelectors.join(', '));
    
    return Array.from(elements).filter(el => {
      const style = window.getComputedStyle(el);
      return el.tabIndex !== -1 &&
             style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             !el.disabled &&
             el.offsetParent !== null;
    });
  }, []);

  const trapFocus = useCallback((e) => {
    if (!isOpen || !offcanvasRef.current) return;
    
    if (e.key !== 'Tab') return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    
    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isOpen, getFocusableElements]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.addEventListener('keydown', trapFocus);
      
      const timeoutId = setTimeout(() => {
        if (offcanvasRef.current) {
          offcanvasRef.current.focus();
        }
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
      };
      
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      document.removeEventListener('keydown', trapFocus);
    }
    
    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isOpen, trapFocus]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('offcanvas__backdrop')) {
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' }
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="offcanvas__backdrop" 
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`offcanvas offcanvas--${position}`}
            onClick={(e) => e.stopPropagation()}
            ref={offcanvasRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}