import React, { useState, useEffect, useCallback } from 'react';

export function Modal({ onSave, onCancel, initialData = null }) {
  const [inputValue, setInputValue] = useState(initialData?.text || '');
  const [domainValue, setDomainValue] = useState(initialData?.domain || '');

  // Close modal without saving
  const closeModal = useCallback(() => {
    onCancel();
    setInputValue('');
    setDomainValue('');
  }, [onCancel]);

  // Click outside modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className === 'modal-backdrop') {
      closeModal();
    }
  }, [closeModal]);

  // Press Escape or Enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Enter') {
      if (inputValue.trim() && domainValue.trim()) {
        handleCreate();
      }
    }
  }, [inputValue, domainValue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Save the new site when "Save" button is clicked or Enter is pressed
  const handleCreate = () => {
    if (inputValue.trim() && domainValue.trim()) {
      onSave(inputValue.trim(), domainValue.trim());
      setInputValue('');
      setDomainValue('');
    }
  };

  useEffect(() => {
    setInputValue(initialData?.text || '');
    setDomainValue(initialData?.domain || '');
  }, [initialData]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>New site</h2>
        <div className='modal-inputs'>
          <input
            type="text"
            value={inputValue}
            placeholder="Type here the name of the domain"
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            value={domainValue}
            placeholder="Domain URL"
            onChange={(e) => setDomainValue(e.target.value)}
          />
        </div>
          <button className="modal-button"
            onClick={handleCreate}
            disabled={!inputValue.trim() || !domainValue.trim()}
          >
            Save
          </button>
      </div>
    </div>
  );
}
