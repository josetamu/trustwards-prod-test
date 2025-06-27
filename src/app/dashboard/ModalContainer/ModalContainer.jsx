import React, { useEffect, useCallback, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard_animations';
import './ModalContainer.css';


export function ModalContainer({ isOpen, onClose, children, isSidebarOpen, onBackdropClick }) {
  const modalRef = useRef(null);
  const modalId = useId();



  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('modal__backdrop')) {
      onBackdropClick?.(e) || onClose();
    }
  }, [onBackdropClick, onClose]);

 


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`modal__backdrop`} 
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
            className="modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            id={modalId}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

 