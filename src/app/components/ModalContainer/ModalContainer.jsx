import React, {useCallback} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '@animations/animations';
import './ModalContainer.css';


export function ModalContainer({ isOpen, onClose, children, onBackdropClick, modalType }) {
  
  

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
          className="modal__backdrop" 
          onClick={modalType !== 'Welcome' ? handleBackdropClick : undefined}
        >
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
            className="modal"
            onClick={(e) => e.stopPropagation()}
            
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

 