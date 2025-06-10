import React from 'react';
import './ModalDelete.css';

export const ModalDelete = ({ onClose, onDelete }) => {
  return (
    <div className="modal-delete__content">
      <h2 className="modal-delete__title">Delete site</h2>
      <p className="modal-delete__desc">This will delete our site and remove your cookie scripts</p>
      <div className="modal-delete__actions">
        <button className="modal-delete__cancel" onClick={onClose}>Cancel</button>
        <button className="modal-delete__confirm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
