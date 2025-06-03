import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from '../alert/Alert';
import { supabase } from '../../supabase/supabaseClient';
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

  // Press Escape (global)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

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

  // Handle input editing and clear errors when input is valid
  const handleInputEdit = (field, value) => {
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

  // Save the new site when "Save" button is clicked or Enter is pressed
  const handleCreate = async () => {
    if (validateInputs()) {
      // Verificar la autenticación justo antes de la inserción
      const { data: { user: authenticatedUser }, error: authError } = await supabase.auth.getUser();

      console.log("Modal.jsx: Resultado de supabase.auth.getUser():", authenticatedUser, "Error:", authError);

      

      if (authError || !authenticatedUser) {
        console.error('Authentication check failed or user not found:', authError);
        setErrors(prev => ({
          ...prev,
          general: 'You must be logged in to save a site.'
        }));
        return;
      }

      try {
        console.log("Modal.jsx: Usuario autenticado encontrado. Procediendo con inserción.");
        const { data, error } = await supabase
          .from('Site') // Usamos 'Site' ya que las APIs de Supabase generalmente manejan la capitalización correcta
          .insert([
            { 
              Name: inputValue.trim(), 
              Domain: domainValue.trim(),
              userid: authenticatedUser.id // <-- Incluir el ID del usuario autenticado
            }
          ])
          .select();

        if (error) throw error;

        console.log("Modal.jsx: Inserción exitosa!", data); // Log de éxito
        onSave(inputValue.trim(), domainValue.trim());
        setInputValue('');
        setDomainValue('');
        setErrors({});
      } catch (error) {
        console.error('Modal.jsx: Error saving site during insert:', error); // Log de error específico de inserción
        setErrors(prev => ({
          ...prev,
          general: 'Error saving site. Please try again.'
        }));
      }
    }
  };

  // Accessibility
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

  // Update values when editing
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
        <div className="modal__header">
          <div className="modal__avatar">
            <img src="/logo test.png" alt="logo" />
          </div>
        </div>
        <div className='modal__content'>
          <h2 className="modal__title" id="modal-title">{type === 'edit' ? 'Edit site' : 'New site'}</h2>
          <div className="modal__inputs">
            <div className="modal__input-wrapper">
              <input
                ref={firstInputRef}
                type="text"
                value={inputValue}
                placeholder="Type here the name of the domain"
                onChange={(e) => handleInputEdit('input', e.target.value)}
                onBlur={() => handleInputBlur('input')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim() && domainValue.trim()) {
                    handleCreate();
                  }
                }}
                className="modal__input"
                autoFocus
                aria-invalid={!!errors.input}
                aria-describedby={errors.input ? 'input-error' : undefined}
              />
              {errors.input && (
                <Alert 
                  message={errors.input} 
                  id="input-error"
                  position="right"
                />
              )}
            </div>
            <div className="modal__input-wrapper">
              <input
                ref={secondInputRef}
                type="text"
                value={domainValue}
                placeholder="Domain URL"
                onChange={(e) => handleInputEdit('domain', e.target.value)}
                onBlur={() => handleInputBlur('domain')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim() && domainValue.trim()) {
                    handleCreate();
                  }
                }}
                className="modal__input"
                aria-invalid={!!errors.domain}
                aria-describedby={errors.domain ? 'domain-error' : undefined}
              />
              {errors.domain && (
                <Alert 
                  message={errors.domain} 
                  id="domain-error"
                  position="right"
                />
              )}
            </div>
          </div>
          <div className="modal__actions-bar">
            <button 
              className="modal__button modal__button--cancel"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button 
              className="modal__button modal__button--save"
              onClick={handleCreate}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
