import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from '../alert/Alert';
import { supabase } from '../../supabase/supabaseClient';
import { InputWithValidation } from '../logic/InputWithValidation';
import './Modal.css'

export function Modal({ onSave, onCancel, initialData = null, type = 'create' }) {
  const [formValues, setFormValues] = useState({
    input: initialData?.text?.trim() || '',
    domain: initialData?.domain?.trim() || ''
  });
  const [formErrors, setFormErrors] = useState({});

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  // ALERT
  // Validate inputs
  // (name)
  const validateInput = (value) => {
    if (!value.trim()) {
      return 'Please enter a domain name';
    }
    return null;
  };

  // (domain)
  const validateDomain = (value) => {
    if (!value.trim()) {
      return 'Please enter a domain URL';
    }
    return null;
  };

  // Function to validate the entire form (clicked Save button)
  const validateForm = () => {
    const inputError = validateInput(formValues.input);
    const domainError = validateDomain(formValues.domain);
    const newErrors = { input: inputError, domain: domainError };
    setFormErrors(newErrors);
    return !inputError && !domainError;
  };

  // Handler for value changes from InputWithValidation components
  // This function receives the field name dynamically ('input' or 'domain'(in this case))
  const handleValueChange = (field) => (value, error) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };
  // ALERT

  // Close modal without saving
  const closeModal = useCallback(() => {
    onCancel();
    setFormValues({ input: '', domain: '' });
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
          .insert([{ Name: formValues.input.trim(), Domain: formValues.domain.trim(), userid: authenticatedUser.id }]);

        if (error) throw error;

        onSave(formValues.input.trim(), formValues.domain.trim());
        setFormValues({ input: '', domain: '' });
        setFormErrors({});
      } catch (error) {
        console.error('Modal.jsx: Error saving site during insert:', error);
        setFormErrors(prev => ({ ...prev, general: 'Error saving site. Please try again.' }));
      }
    }
  };

  // Accessibility
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
  }, [handleKeyDown]); // <-- handleKeyDown está en las dependencias

    // Update values when editing
    useEffect(() => {
      setFormValues({
        input: initialData?.text?.trim() || '',
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
            <div className="modal__input-wrapper" ref={firstInputRef}>
              <InputWithValidation
                type="text"
                placeholder="Type here the name of the domain"
                initialValue={formValues.input}
                validation={validateInput}
                onValueChange={handleValueChange('input')}
                position="right"
                autoFocus
                id="domain-name-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreate();
                  }
                }}
                containerClassName="modal__input-wrapper"
                inputClassName="modal__input"
                errorMessage={formErrors.input}
                containerRef={firstInputRef}
              />
            </div>
            <div className="modal__input-wrapper" ref={secondInputRef}>
              <InputWithValidation
                type="text"
                placeholder="Domain URL"
                initialValue={formValues.domain}
                validation={validateDomain}
                onValueChange={handleValueChange('domain')}
                position="right"
                id="domain-url-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreate();
                  }
                }}
                containerClassName="modal__input-wrapper"
                inputClassName="modal__input"
                errorMessage={formErrors.domain}
                containerRef={secondInputRef}
              />
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
