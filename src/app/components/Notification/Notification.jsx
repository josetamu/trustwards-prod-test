import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '@animations/animations';

import './Notification.css';

const Notification = ({ 
  open = false,
  onClose,
  notificationMessage,
  position,
  isSidebarOpen,
  autoClose = 1000, // milliseconds - 1s
  contentCenter = false
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

  // Function to determine if notification should be centered based on sidebar state
  const getCenterClass = () => {
    if (contentCenter && isSidebarOpen && window.innerWidth > 767) {
      return 'notification--sidebar';
    }
    return '';
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
          className={`notification notification--${position} ${getCenterClass()}`}
          ref={notificationRef}
        >
          <div className="notification__content">
            <span className={`notification__message`}>
              {notificationMessage}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
