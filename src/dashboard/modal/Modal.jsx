import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from '../alert/Alert';
import './Modal.css'

export function Modal({ onSave, onCancel, initialData = null, type = 'create' }) {
  const [inputValue, setInputValue] = useState(initialData?.text?.trim() || '');
  const [domainValue, setDomainValue] = useState(initialData?.domain?.trim() || '');
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  // Close modal without saving
  const closeModal = useCallback(() => {
    onCancel();
    setInputValue('');
    setDomainValue('');
    setErrors({});
  }, [onCancel]);

  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className === 'modal__backdrop') {
      closeModal();
    }
  }, [closeModal]);

  // Press Escape or Enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Enter' && type === 'create') {
      handleCreate();
    }
  }, [inputValue, domainValue, type]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!inputValue.trim()) {
      newErrors.input = 'Please enter a domain name';
    }
    if (!domainValue.trim()) {
      newErrors.domain = 'Please enter a domain URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input blur
  const handleInputBlur = (field) => {
    if (field === 'input' && !inputValue.trim()) {
      setErrors(prev => ({ ...prev, input: 'Please enter a domain name' }));
    }
    if (field === 'domain' && !domainValue.trim()) {
      setErrors(prev => ({ ...prev, domain: 'Please enter a domain URL' }));
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    if (field === 'input') {
      setInputValue(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, input: undefined }));
      }
    } else {
      setDomainValue(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, domain: undefined }));
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Focus trap
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleTabKey);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      modalRef.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [handleKeyDown]);

  // Save the new site when "Save" button is clicked or Enter is pressed
  const handleCreate = () => {
    if (validateInputs()) {
      onSave(inputValue.trim(), domainValue.trim());
      setInputValue('');
      setDomainValue('');
      setErrors({});
    }
  };

  useEffect(() => {
    setInputValue(initialData?.text?.trim() || '');
    setDomainValue(initialData?.domain?.trim() || '');
    setErrors({});
  }, [initialData]);

  // Delete verification modal
  if (type === 'delete') {
    return (
      <div className="modal__backdrop" onClick={onCancel}>
        <div className="modal" onClick={(e) => e.stopPropagation()} ref={modalRef} role="dialog" aria-modal="true">
          <h2 className="modal__title" id="modal-title">Are you sure you want to delete this site?</h2>
          <div className="modal__actions">
            <button onClick={onCancel} className="modal__button modal__button--cancel">
              Cancel
            </button>
            <button onClick={() => onSave()} className="modal__button modal__button--delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 className="modal__title" id="modal-title">New site</h2>
        <div className="modal__inputs">
          <div className="modal__input-wrapper">
            <input
              ref={firstInputRef}
              type="text"
              value={inputValue}
              placeholder="Type here the name of the domain"
              onChange={(e) => handleInputChange('input', e.target.value)}
              onBlur={() => handleInputBlur('input')}
              className="modal__input"
              autoFocus
              aria-invalid={!!errors.input}
              aria-describedby={errors.input ? 'input-error' : undefined}
            />
            {errors.input && (
              <Alert message={errors.input} id="input-error" />
            )}
          </div>
          <div className="modal__input-wrapper">
            <input
              ref={secondInputRef}
              type="text"
              value={domainValue}
              placeholder="Domain URL"
              onChange={(e) => handleInputChange('domain', e.target.value)}
              onBlur={() => handleInputBlur('domain')}
              className="modal__input"
              aria-invalid={!!errors.domain}
              aria-describedby={errors.domain ? 'domain-error' : undefined}
            />
            {errors.domain && (
              <Alert message={errors.domain} id="domain-error" />
            )}
          </div>
        </div>
        <button 
          className="modal__button modal__button--save"
          onClick={handleCreate}
        >
          Save
        </button>
      </div>
    </div>
  );
}
