export const ANIM_TYPES = [
  // General scales
  {
    name: 'SCALE_TOP',
    initial: { opacity: 0, transform: 'scale(0.9) translateY(-20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateY(-20px)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  {
    name: 'SCALE_BOTTOM', 
    initial: { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Sidebar tooltip animation
  {
    name: 'SCALE_LEFT',
    initial: { opacity: 0, transform: 'scale(0.9) translateX(-20px)' },
    animate: { opacity: 1, transform: 'scale(1) translateX(0px)' },
    exit: { opacity: 0, transform: 'scale(0.9) translateX(-20px)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Overlay fade animation
  {
    name: 'OVERLAY_FADE',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  }
];