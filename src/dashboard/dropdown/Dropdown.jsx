import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export function Dropdown({ onEdit, onDelete, openOnHover = false }) {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside (only if not openOnHover)
  useEffect(() => {
    if (!openOnHover) {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, openOnHover]);

  // Mouse enter and leave events
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (openOnHover) setOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (openOnHover) setOpen(false);
  };

  const showDots = isHovering || open;

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="dropdown__toggle"
        onClick={!openOnHover ? () => setOpen((v) => !v) : undefined}
        aria-label="Open menu"
        type="button"
      >
        <span className={`dropdown__label ${showDots ? 'is-hidden' : ''}`}>Pro</span>
        <span className={`dropdown__dots ${showDots ? 'is-visible' : ''}`}>&hellip;</span>
      </button>

      {open && (
        <div className="dropdown__menu">
          <button className="dropdown__item" onClick={() => { setOpen(false); onEdit(); }}>Edit</button>
          <button className="dropdown__item dropdown__item--delete" onClick={() => { setOpen(false); onDelete(); }}>Delete</button>
        </div>
      )}
    </div>
  );
}
