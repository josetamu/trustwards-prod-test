import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OffcanvasContainer.css';

export function OffcanvasContainer({ isOpen, onClose, children, position = 'right' }) {
  const offcanvasRef = useRef(null);
 
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