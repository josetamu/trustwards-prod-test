export const ANIM_TYPES = [
  {
    name: 'SCALE_TOP',
    style: { transformOrigin: 'top' },
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  {
    name: 'SCALE_BOTTOM', 
    style: { transformOrigin: 'bottom' },
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  {
    name: 'SCALE_LEFT',
    style: { transformOrigin: 'left' },
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  {
    name: 'SCALE_RIGHT',
    style: { transformOrigin: 'right' },
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    exit: { opacity: 0, transform: 'scale(0.9)' },
    transition: { duration: 0.2, ease: "easeOut" }
  }
];