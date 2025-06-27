/* import React, { useState, useEffect, useId } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { supabase } from '../../supabase/supabaseClient';
import logoDefault from '../../assets/logo default.png';
import { ModalAvatar } from '../ModalAvatar/ModalAvatar';

import './ModalNewSite.css'

export function ModalNewSite({ onSave, setIsModalOpen, userSites = 0, userPlan = 'free' }) {
  const modalNewSiteId = useId();
  const [activePlan, setActivePlan] = useState(userPlan === 'Pro' ? 'pro' : 'free');
  const [showEdit, setShowEdit] = useState(false);
  const FREE_PLAN_LIMIT = 3;

  // Update activePlan when userPlan changes
  useEffect(() => {
    if (userPlan === 'Pro') {
      setActivePlan('pro');
    }
  }, [userPlan]);

  const [formValues, setFormValues] = useState({
    name: '',
    domain: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Validate inputs
  const validateName = (value) => {
    if (!value.trim()) {
      return 'Name is required';
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

      // Check if user has reached the free plan limit (only for free users)
      if (userPlan !== 'Pro' && activePlan === 'free' && userSites >= FREE_PLAN_LIMIT) {
        setFormErrors(prev => ({ ...prev, general: 'You have reached the maximum number of sites for the free plan.' }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('Site')
          .insert([{ 
            Name: formValues.name.trim(), 
            Domain: formValues.domain.trim(), 
            "Avatar URL": customHeader.avatar?.src || logoDefault, 
            userid: authenticatedUser.id 
          }]);

        if (error) throw error;

        onSave(formValues.name.trim(), formValues.domain.trim());
        setFormValues({ name: '', domain: '' });
        setFormErrors({});
        setIsModalOpen(false);
      } catch (error) {
        console.error('Modal.jsx: Error saving site during insert:', error);
        setFormErrors(prev => ({ ...prev, general: 'Error saving site. Please try again.' }));
      }
    }
  };

  // Avatar and header state
  const [customHeader, setCustomHeader] = useState({
    avatar: null,
    headerGradient: defaultGradient
  });

  // Avatar changes logic
  const handleEditSave = (editData) => {
    setCustomHeader({
      avatar: editData.avatar,
      headerGradient: editData.headerGradient
    });
    setShowEdit(false);
  };

  // Conditional render of the modal avatar
  if (showEdit) {
    return <ModalAvatar 
      onClose={() => setShowEdit(false)} 
      onSave={handleEditSave}
      initialState={{
        avatar: customHeader.avatar,
        headerGradient: customHeader.headerGradient
      }}
    />;
  }

  return (
    <>
      <div className="modal__header" id={modalNewSiteId} style={{ background: customHeader.headerGradient }}>
        <div className="modal__avatar">
          {customHeader.avatar
            ? <img src={customHeader.avatar.src} alt="avatar" />
            : <img src={logoDefault} alt="logo" />
          }
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
                  responsivePosition={{ desktop: 'right', mobile: 'bottom' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="modal__divider"></div>
        <div className="modal__plan">
          <span className="modal__input-label">Jose Tamu's Plan</span>
          {userPlan === 'Pro' ? (
            <>
              <div className="modal__pro-card">
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H15V3H0V0Z" fill="currentColor"/>
                  <path d="M4 11V5H10L4 11Z" fill="currentColor"/>
                  <path d="M8 11V5H13L8 11Z" fill="currentColor"/>
                </svg>
                <span className="modal__pro-card-text">PRO</span>
              </div>
              <button
                className="modal__button"
                onClick={handleCreate}
                type="button"
              >
                Add Site
              </button>
            </>
          ) : (
            <>
              <div className="modal__plan-toggle">
                <span 
                  className={`modal__plan-option ${activePlan === 'free' ? 'modal__plan-option--active' : ''}`}
                  onClick={() => setActivePlan('free')}
                >
                  Free
                </span>
                <span 
                  className={`modal__plan-option ${activePlan === 'pro' ? 'modal__plan-option--active' : ''}`}
                  onClick={() => setActivePlan('pro')}
                >
                  Pro
                </span>
              </div>
              {activePlan === 'free' ? (
                <>
                {userSites >= FREE_PLAN_LIMIT ? (
                  <>
                  <div className='modal__plan-lock-wrapper'>
                    <div className='modal__plan-lock'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.99934 2.16536C6.71067 2.16536 5.66602 3.21004 5.66602 4.4987V5.5H10.3327V4.4987C10.3327 3.21004 9.288 2.16536 7.99934 2.16536ZM4.33268 4.4987V5.5H3.99935C2.98676 5.5 2.16592 6.32092 2.16602 7.33348L2.16657 13.3335C2.16666 14.346 2.98745 15.1667 3.9999 15.1667H11.9992C13.0117 15.1667 13.8325 14.3459 13.8325 13.3334V7.33335C13.8325 6.32081 13.0117 5.5 11.9992 5.5H11.666V4.4987C11.666 2.47366 10.0244 0.832031 7.99934 0.832031C5.97431 0.832031 4.33268 2.47366 4.33268 4.4987ZM11.3327 10.3268C11.3327 9.95862 11.0342 9.66015 10.666 9.66015C10.2978 9.66015 9.99934 9.95862 9.99934 10.3268V10.3335C9.99934 10.7017 10.2978 11.0002 10.666 11.0002C11.0342 11.0002 11.3327 10.7017 11.3327 10.3335V10.3268ZM7.99934 9.66015C8.36754 9.66015 8.666 9.95862 8.666 10.3268V10.3335C8.666 10.7017 8.36754 11.0002 7.99934 11.0002C7.63114 11.0002 7.33267 10.7017 7.33267 10.3335V10.3268C7.33267 9.95862 7.63114 9.66015 7.99934 9.66015ZM5.99935 10.3268C5.99935 9.95862 5.70088 9.66015 5.33268 9.66015C4.9645 9.66015 4.66602 9.95862 4.66602 10.3268V10.3335C4.66602 10.7017 4.9645 11.0002 5.33268 11.0002C5.70088 11.0002 5.99935 10.7017 5.99935 10.3335V10.3268Z"/>
                        </svg>
                        <span className="modal__plan-stat-value">{FREE_PLAN_LIMIT}/{FREE_PLAN_LIMIT} free sites remaining</span>
                    </div>
                    <button
                      className="modal__button modal__button--upgrade"
                      type="button"
                    >
                      Upgrade
                    </button>
                  </div>
                    <button
                      className="modal__button modal__button--save"
                      onClick={handleCreate}
                      type="button"
                      disabled={userSites >= FREE_PLAN_LIMIT}
                    >
                      Add Site
                    </button>
                  </>
                ) : (
                  <>
                    <div className='modal__plan-stats'>
                      <div className="modal__plan-background">
                      <svg width="164" height="120" viewBox="0 0 164 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <path d="M0 0H164V32.7273H0V0Z" fill="currentColor"/>
                          <path d="M43.7333 120V54.5455H109.333L43.7333 120Z" fill="currentColor"/>
                          <path d="M87.4667 120V54.5455H142.133L87.4667 120Z" fill="currentColor"/>
                        </g>
                      </svg>
                      </div>
                      <div className="modal__plan-stat">
                        <span className="modal__plan-stat-label">Free sites remaining</span>
                        <span className="modal__plan-stat-value">{userSites}/{FREE_PLAN_LIMIT}</span>
                      </div>
                      <div className="modal__plan-stat">
                        <span className="modal__plan-stat-label">Pages per site</span>
                        <span className="modal__plan-stat-value">12</span>
                      </div>
                      <div className="modal__plan-stat">
                        <span className="modal__plan-stat-label">
                          <span className="modal__plan-stat-label--underline">Scans</span> per site
                          <span className="modal__plan-stat-monthly">monthly</span>
                        </span>
                        <span className="modal__plan-stat-value">3</span>
                      </div>
                      <div className="modal__plan-stat">
                        <span className="modal__plan-stat-label">
                          Visitors per site
                          <span className="modal__plan-stat-monthly">monthly</span>
                        </span>
                        <span className="modal__plan-stat-value">1000</span>
                      </div>
                    </div>
                    <button
                      className="modal__button modal__button--save"
                      onClick={handleCreate}
                      type="button"
                    >
                      Add Site
                    </button>
                  </>
                )}
                </>
              ) : (
                <>
                  <div className='modal__plan-stats'>
                    <div className="modal__plan-background">
                    <svg width="164" height="120" viewBox="0 0 164 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path d="M0 0H164V32.7273H0V0Z" fill="currentColor"/>
                        <path d="M43.7333 120V54.5455H109.333L43.7333 120Z" fill="currentColor"/>
                        <path d="M87.4667 120V54.5455H142.133L87.4667 120Z" fill="currentColor"/>
                      </g>
                    </svg>
                    </div>
                    <div className="modal__plan-stat">
                      <span className="modal__plan-stat-label">Sites</span>
                      <span className="modal__plan-stat-value modal__plan-stat-value--unlimited">unlimited</span>
                    </div>
                    <div className="modal__plan-stat">
                      <span className="modal__plan-stat-label">Pages per site</span>
                      <span className="modal__plan-stat-value modal__plan-stat-value--unlimited">unlimited</span>
                    </div>
                    <div className="modal__plan-stat">
                      <span className="modal__plan-stat-label">
                        <span className="modal__plan-stat-label--underline">Scans</span> per site
                        <span className="modal__plan-stat-monthly">monthly</span>
                      </span>
                      <span className="modal__plan-stat-value">50</span>
                    </div>
                    <div className="modal__plan-stat">
                      <span className="modal__plan-stat-label">
                        Visitors per site
                        <span className="modal__plan-stat-monthly">monthly</span>
                      </span>
                      <span className="modal__plan-stat-value modal__plan-stat-value--unlimited">unlimited</span>
                    </div>
                  </div>
                  <button className="modal__button modal__button--save">
                    Upgrade to Pro
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} */