import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './Notification.css';

const Notification = ({ 
  open = false,
  onClose,
  children,
  autoClose = 1000 // milliseconds - 1s
}) => {
  const notificationRef = useRef(null);

  // Auto close notification after a few seconds
  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, onClose]);



  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
          className={`notification`}
          ref={notificationRef}
        >
          <div className="notification__content">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
