const getAnimationDuration = (duration) => {
  if (typeof document === 'undefined') return duration;
  return document.documentElement.getAttribute('data-reduced-motion') === 'true' ? 0 : duration;
};

// Getter function that returns animations with current reduced motion settings
export const getAnimTypes = () => [
  // General scales
  {
    name: 'SCALE_TOP',
    initial: { opacity: 0, transform: 'scale(0.9) translateY(-20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateY(-20px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },
  {
    name: 'SCALE_BOTTOM', 
    initial: { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },
  {
    name: 'SCALE_TOOLTIP_TOP',
    initial: { opacity: 0, transform: 'scale(0.7) translateY(-5px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.7) translateY(-5px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },
  {
    name: 'SCALE_TOOLTIP_BOTTOM',
    initial: { opacity: 0, transform: 'scale(0.7) translateY(5px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.7) translateY(5px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },

  // Side tooltip animations
  {
    name: 'SCALE_LEFT',
    initial: { opacity: 0, transform: 'scale(0.9) translateX(-20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateX(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateX(-20px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },
  {
    name: 'SCALE_RIGHT',
    initial: { opacity: 0, transform: 'scale(0.9) translateX(20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateX(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateX(20px)' },
    transition: { 
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  },

  // Overlay fade animation
  {
    name: 'OVERLAY_FADE',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: getAnimationDuration(0.2), 
      ease: "easeOut" 
    }
  }
];

// Mantener compatibilidad hacia atrás con el nombre anterior
export const ANIM_TYPES = getAnimTypes();