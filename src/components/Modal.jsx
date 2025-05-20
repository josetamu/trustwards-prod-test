import React, { useState } from 'react';

export function Modal({ onClose, onCreate }) {
  const [inputValue, setInputValue] = useState('');

  // creation of a new card
  const handleCreate = () => {
    if (inputValue.trim()) {
      onCreate(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create a new card</h2>
        <input
          type="text"
          value={inputValue}
          placeholder="Type here"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleCreate}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
