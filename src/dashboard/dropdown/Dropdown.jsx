import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export function Dropdown({ onEdit, onDelete, openOnHover = false, label = "Pro" }) {
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

  // Close dropdown and call the callback function when clicking edit or delete
  const closeDropdown = (callback) => {
    setOpen(false);
    setIsHovering(false);
    if (callback) callback();
  };  

  const showDots = isHovering || open;

  // Menu alignment
  const [menuAlignRight, setMenuAlignRight] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    if (open && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
  
      // Left alignment
      if (menuRect.right > viewportWidth) {
        setMenuAlignRight(false);
      } else {
        setMenuAlignRight(true);
      }
    }
  }, [open]);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-align={menuAlignRight ? 'right' : 'left'}
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
        <div className={`dropdown__menu ${menuAlignRight ? '' : 'dropdown__menu--left'}`} ref={menuRef}>
          <button className="dropdown__item dropdown__item--edit" onClick={() => { closeDropdown(onEdit) }}>Edit</button>
          <button className="dropdown__item dropdown__item--delete" onClick={() => { closeDropdown(onDelete) }}>Delete</button>
        </div>
      )}
    </div>
  );
}
