import React from 'react';

export function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure you want to delete this site?</h2>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-button cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-button delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
