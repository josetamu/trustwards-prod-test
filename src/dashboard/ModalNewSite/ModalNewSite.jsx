import React, { useState, useEffect } from 'react';
import { Tooltip } from '../tooltip/Tooltip';
import { supabase } from '../../supabase/supabaseClient';
import './ModalNewSite.css'

export function ModalNewSite({ onSave, initialData = null, type = 'create' }) {
  const [formValues, setFormValues] = useState({
    name: initialData?.text?.trim() || '',
    domain: initialData?.domain?.trim() || ''
  });
  const [formErrors, setFormErrors] = useState({});

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
      <div className="modal__content">
        <h2 className="modal__title" id="modal-title">Are you sure you want to delete this site?</h2>
        <div className="modal__actions">
          <button onClick={() => onSave()} className="modal__button modal__button--delete">
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modal__header">
        <div className="modal__avatar">
          <img src="/logo test.png" alt="logo" />
          <button className="modal__avatar-edit">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.07202 1.99478L5.53925 1.52753C5.79732 1.26947 6.21572 1.26947 6.47378 1.52753C6.73182 1.78558 6.73182 2.20398 6.47378 2.46203L6.00652 2.92929M5.07202 1.99478L2.32739 4.73942C1.97896 5.08785 1.80474 5.26205 1.68611 5.47435C1.56747 5.68665 1.44812 6.18795 1.33398 6.66732C1.81335 6.55318 2.31465 6.43382 2.52695 6.31518C2.73925 6.19655 2.91346 6.02235 3.2619 5.67392L6.00652 2.92929M5.07202 1.99478L6.00652 2.92929" stroke="#696969" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path opacity="0.4" d="M3.66602 6.66602H5.66602" stroke="#696969" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          </button>
        </div>
      </div>
      <div className="modal__content">
        <div className="modal__inputs">
          <div className="modal__input-wrapper">
            <label className="modal__input-label" htmlFor="domain-name-input">
              Name
            </label>
            <div className="modal__input-container">
              <input
                type="text"
                placeholder="Next Bricks"
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
                  position="left"
                  type="alert"
                />
              )}
            </div>
          </div>
          <div className="modal__input-wrapper">
            <label className="modal__input-label" htmlFor="domain-url-input">
              Domain
            </label>
            <div className="modal__input-container">
              <input
                type="text"
                placeholder="www.nextbricks.io"
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
                  type="alert"
                />
              )}
            </div>
          </div>
        </div>
        <div className="modal__plan">
          <span className="modal__input-label">Jose Tamu's Plan</span>
          <div className="modal__plan-toggle">
            <span className="modal__plan-option modal__plan-option--active">Free</span>
            <span className="modal__plan-option">Pro</span>
          </div>
        </div>
        <div className='modal__plan-wrapper'>
            <div className="modal__plan-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99934 2.16536C6.71067 2.16536 5.66602 3.21004 5.66602 4.4987V5.5H10.3327V4.4987C10.3327 3.21004 9.288 2.16536 7.99934 2.16536ZM4.33268 4.4987V5.5H3.99935C2.98676 5.5 2.16592 6.32092 2.16602 7.33348L2.16657 13.3335C2.16666 14.346 2.98745 15.1667 3.9999 15.1667H11.9992C13.0117 15.1667 13.8325 14.3459 13.8325 13.3334V7.33335C13.8325 6.32081 13.0117 5.5 11.9992 5.5H11.666V4.4987C11.666 2.47366 10.0244 0.832031 7.99934 0.832031C5.97431 0.832031 4.33268 2.47366 4.33268 4.4987ZM11.3327 10.3268C11.3327 9.95862 11.0342 9.66015 10.666 9.66015C10.2978 9.66015 9.99934 9.95862 9.99934 10.3268V10.3335C9.99934 10.7017 10.2978 11.0002 10.666 11.0002C11.0342 11.0002 11.3327 10.7017 11.3327 10.3335V10.3268ZM7.99934 9.66015C8.36754 9.66015 8.666 9.95862 8.666 10.3268V10.3335C8.666 10.7017 8.36754 11.0002 7.99934 11.0002C7.63114 11.0002 7.33267 10.7017 7.33267 10.3335V10.3268C7.33267 9.95862 7.63114 9.66015 7.99934 9.66015ZM5.99935 10.3268C5.99935 9.95862 5.70088 9.66015 5.33268 9.66015C4.9645 9.66015 4.66602 9.95862 4.66602 10.3268V10.3335C4.66602 10.7017 4.9645 11.0002 5.33268 11.0002C5.70088 11.0002 5.99935 10.7017 5.99935 10.3335V10.3268Z" fill="#686B74"/>
            </svg>
              <span className="modal__plan-sites">0/3 free sites remaining</span>
            </div>
            <button className="modal__plan-upgrade">
              Upgrade
            </button>
          </div>
        <div className="modal__actions-bar">
          <button
            className="modal__button modal__button--save"
            onClick={handleCreate}
            type="button"
          >
            Add Site
          </button>
        </div>
      </div>
    </>
  );
}