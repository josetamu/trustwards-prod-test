export const ANIM_TYPES = [
  {
    name: 'SCALE_TOP',
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  {
    name: 'SCALE_BOTTOM', 
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  }
];