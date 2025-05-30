import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export function Dropdown({ onEdit, onDelete, openOnHover = false, label = "Pro", position = "bottom-right", }) {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(position);

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

  // Close dropdown and call the callback function when clicking edit or delete
  const closeDropdown = (callback) => {
    setOpen(false);
    setIsHovering(false);
    if (callback) callback();
  };  

  const showDots = isHovering || open;

  // Menu alignment
  useEffect(() => {
    if (open && dropdownRef.current && menuRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
  
      // Default position
      let newPos = position;
  
      // Check horizontal overflow (right side)
      const overflowsRight = dropdownRect.left + menuRect.width > vw;
      const overflowsLeft = dropdownRect.right - menuRect.width < 0;
  
      // Right overflow then switch to left, left overflow then switch to right
      if (newPos.includes('right') && overflowsRight) {
        newPos = newPos.replace('right', 'left');
      } else if (newPos.includes('left') && overflowsLeft) {
        newPos = newPos.replace('left', 'right');
      }
  
       // Check vertical overflow (bottom side)
      const overflowsBottom = dropdownRect.bottom + menuRect.height > vh;
      const overflowsTop = dropdownRect.top - menuRect.height < 0;
  
      // Bottom overflow then switch to top, top overflow then switch to bottom
      if (newPos.startsWith('bottom') && overflowsBottom) {
        newPos = newPos.replace('bottom', 'top');
      } else if (newPos.startsWith('top') && overflowsTop) {
        newPos = newPos.replace('top', 'bottom');
      }
  
      setCurrentPosition(newPos);
    }
  }, [open, position]);
  

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-position={currentPosition}
    >
      <button
        className="dropdown__toggle"
        onClick={!openOnHover ? () => setOpen((v) => !v) : undefined}
        aria-label="Open menu"
        type="button"
      >
        <div className="dropdown__content">
          <span className={`dropdown__label ${showDots ? 'is-hidden' : ''}`}>{label}</span>
          <div className={`dropdown__dots ${showDots ? 'is-visible' : ''}`}>
            <img className="dropdown__dots-item" src="/dots.svg" alt="dots" />
          </div>
        </div>
      </button>

      {open && (
        <div className={`dropdown__menu dropdown__menu--${currentPosition}`} ref={menuRef}>
          <button className="dropdown__item dropdown__item--edit" onClick={() => { closeDropdown(onEdit) }}>Edit</button>
          <button className="dropdown__item dropdown__item--delete" onClick={() => { closeDropdown(onDelete) }}>Delete</button>
        </div>
      )}
    </div>
  );
}
