import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tooltip } from '../tooltip/Tooltip';
import { supabase } from '../../supabase/supabaseClient';
import './Modal.css'

export function Modal({ onSave, onCancel, initialData = null, type = 'create', isSidebarOpen}) {
  const [formValues, setFormValues] = useState({
    name: initialData?.text?.trim() || '',
    domain: initialData?.domain?.trim() || ''
  });
  const [formErrors, setFormErrors] = useState({});

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  const domainInputRef = useRef(null);

  // Validate inputs
  const validateName = (value) => {
    if (!value.trim()) {
      return 'Please enter a domain name';
    }
    return null;
  };
  const validateDomain = (value) => {
    if (!value.trim()) {
      return 'Please enter a domain URL';
    }
    return null;
  };

  // Function to validate the entire form
  const validateForm = () => {
    const nameError = validateName(formValues.name);
    const domainError = validateDomain(formValues.domain);
    const newErrors = { name: nameError, domain: domainError };
    setFormErrors(newErrors);
    return !nameError && !domainError;
  };

  // Handle input editing and clear errors when input is valid
  const handleInputEdit = (field) => (e) => {
    const value = e.target.value;
    setFormValues(prev => ({ ...prev, [field]: value }));

    if (field === 'name' && value.trim()) {
      setFormErrors(prev => ({ ...prev, name: null }));
    } else if (field === 'domain' && value.trim()) {
      setFormErrors(prev => ({ ...prev, domain: null }));
    }
  };

  // Handle input blur
  const handleInputBlur = (field) => {
    if (field === 'name') {
      const error = validateName(formValues.name);
      setFormErrors(prev => ({ ...prev, name: error }));
    } else if (field === 'domain') {
      const error = validateDomain(formValues.domain);
      setFormErrors(prev => ({ ...prev, domain: error }));
    }
  };

  // Save the new site when "Save" button is clicked or Enter is pressed
  const handleCreate = async () => {
    if (validateForm()) {
      const { data: { user: authenticatedUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authenticatedUser) {
        console.error('Authentication check failed or user not found:', authError);
        setFormErrors(prev => ({ ...prev, general: 'You must be logged in to save a site.' }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('Site')
          .insert([{ Name: formValues.name.trim(), Domain: formValues.domain.trim(), userid: authenticatedUser.id }]);

        if (error) throw error;

        onSave(formValues.name.trim(), formValues.domain.trim());
        setFormValues({ name: '', domain: '' });
        setFormErrors({});
      } catch (error) {
        console.error('Modal.jsx: Error saving site during insert:', error);
        setFormErrors(prev => ({ ...prev, general: 'Error saving site. Please try again.' }));
      }
    }
  };
  
  // Update values when editing
  useEffect(() => {
    setFormValues({
      name: initialData?.text?.trim() || '',
      domain: initialData?.domain?.trim() || ''
    });
    setFormErrors({});
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

    // Accessibility

  // Close modal without saving
  const closeModal = useCallback(() => {
    onCancel();
    setFormValues({ name: '', domain: '' });
    setFormErrors({});
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


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Focus trap
    const handleTabKey = (e) => {
    };

    modalRef.current.addEventListener('keydown', handleTabKey);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      modalRef.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [handleKeyDown]);

  return (
    <div className={`modal__backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={handleBackdropClick}>
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
            <div className="modal__input-wrapper" ref={nameInputRef}>
              <input
                type="text"
                placeholder="Type here the name of the domain"
                value={formValues.name}
                onChange={handleInputEdit('name')}
                onBlur={() => handleInputBlur('name')}
                className="modal__input"
                id="domain-name-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreate();
                  }
                }}
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && (
                <Tooltip
                  message={formErrors.name}
                  position="top"
                />
              )}
            </div>
            <div className="modal__input-wrapper" ref={domainInputRef}>
              <input
                type="text"
                placeholder="Domain URL"
                value={formValues.domain}
                onChange={handleInputEdit('domain')}
                onBlur={() => handleInputBlur('domain')}
                className="modal__input"
                id="domain-url-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreate();
                  }
                }}
                aria-invalid={!!formErrors.domain}
                aria-describedby={formErrors.domain ? 'domain-error' : undefined}
              />
              {formErrors.domain && (
                <Tooltip
                  message={formErrors.domain}
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
