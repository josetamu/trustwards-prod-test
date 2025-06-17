import React, { useState, useEffect, useId } from 'react';
import { Tooltip } from '../tooltip/Tooltip';
import { supabase } from '../../supabase/supabaseClient';
import { ModalAvatar } from '../ModalAvatar/ModalAvatar';
import './ModalEditSite.css'

export function ModalEditSite({ onSave, onCancel, setIsModalOpen, siteData, setSiteData }) {
const modalEditSiteId = useId();
const [formValues, setFormValues] = useState({
    name: siteData?.Name?.trim() || '',
    domain: siteData?.Domain?.trim() || ''
      });
const [formErrors, setFormErrors] = useState({});
// Validate inputs
const validateName = (value) => {
    if (!value.trim()) {
        return 'Name is required';
    }
    if (value.trim().length > 12) {
        return 'Name must be 12 characters or less';
    }
    return null;
    };
const validateDomain = (value) => {
    if (!value.trim()) {
        return 'Domain is required';
    }
    if (!value.includes('.')) {
        return 'Domain must include a dot (.)';
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

      const handleSave = async () => {
        if (validateForm()) {
          try {
            // Actualizar la base de datos
            const { error } = await supabase
              .from('Site')
              .update({
                Name: formValues.name,
                Domain: formValues.domain
              })
              .eq('id', siteData.id); // Usar el ID del sitio que se está editando

            if (error) {
              throw error;
            }

            // Si la actualización fue exitosa, cerrar el modal y limpiar los datos
            onSave(formValues);
            setIsModalOpen(false);
            setSiteData(null);
          } catch (error) {
            console.error('Error updating site:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
            setFormErrors(prev => ({
              ...prev,
              submit: 'Error updating site. Please try again.'
            }));
          }
        }
      };

return (
  <>
    <div className="modal__header modal__header-editSite" id={modalEditSiteId}>
      <div className="modal__avatar">
        <img src="/logo test.png" alt="logo" />
        <button 
          className="modal__avatar-edit"
          onClick={() => setShowEdit(true)}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.07202 1.99478L5.53925 1.52753C5.79732 1.26947 6.21572 1.26947 6.47378 1.52753C6.73182 1.78558 6.73182 2.20398 6.47378 2.46203L6.00652 2.92929M5.07202 1.99478L2.32739 4.73942C1.97896 5.08785 1.80474 5.26205 1.68611 5.47435C1.56747 5.68665 1.44812 6.18795 1.33398 6.66732C1.81335 6.55318 2.31465 6.43382 2.52695 6.31518C2.73925 6.19655 2.91346 6.02235 3.2619 5.67392L6.00652 2.92929M5.07202 1.99478L6.00652 2.92929" stroke="#696969" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path opacity="0.4" d="M3.66602 6.66602H5.66602" stroke="#696969" strokeWidth="1.5" strokeLinecap="round"/>
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
              className="modal__input"
              id="domain-name-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <Tooltip
                message={formErrors.name}
                responsivePosition={{ desktop: 'left', mobile: 'top' }}
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
              className="modal__input"
              id="domain-url-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                 handleSave();
                }
              }}
              aria-invalid={!!formErrors.domain}
              aria-describedby={formErrors.domain ? 'domain-error' : undefined}
            />
            {formErrors.domain && (
              <Tooltip
                message={formErrors.domain}
                responsivePosition={{ desktop: 'right', mobile: 'bottom' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    <div className="modal__actions-edit">
      <button
        className="modal__button modal__button--save"
        onClick={handleSave}
        type="button"
      >
        Save
      </button>
    </div>
  </>
);
}
