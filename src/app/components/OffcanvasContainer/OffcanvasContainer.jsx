import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OffcanvasContainer.css';

export function OffcanvasContainer({ isOpen, onClose, children, position = 'right' }) {
  const offcanvasRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management and accessibility
  useEffect(() => {
    if (isOpen) {
      // Guardar el elemento que tenía el foco antes de abrir
      previousActiveElement.current = document.activeElement;
      
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
      
      // Enfocar el offcanvas después de la animación
      const timer = setTimeout(() => {
        if (offcanvasRef.current) {
          offcanvasRef.current.focus();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        
        // Restaurar el foco al elemento anterior
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen]);
 
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

  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = offcanvasRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

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
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

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
           aria-hidden="true" 
        >
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            // Usamos type: "tween" para evitar rebote/bounce
            transition={{ type: 'tween', duration: 0.32, ease: "easeInOut" }}
            className={`offcanvas offcanvas--${position}`}
            onClick={(e) => e.stopPropagation()}
            ref={offcanvasRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offcanvas-title"
            aria-describedby="offcanvas-description"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}