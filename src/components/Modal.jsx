import React, { useState } from 'react';

export function Modal({ onSave}) {
  const [inputValue, setInputValue] = useState('');

  // creation of a new card
  const handleCreate = () => {
    if (inputValue.trim()) {
      onSave(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>New domain</h2>
        <input
          type="text"
          value={inputValue}
          placeholder="Type here the name of the domain"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <input
          type="text"
          value={inputValue}
          placeholder="Domain"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleCreate}>Save</button>
        </div>
      </div>
    </div>
  );
}
