import React from 'react';
import './ModalDelete.css';

export const ModalDelete = ({ onClose, onDelete }) => {
  return (
    <div className="modal-delete__content">
      <div className="modal-delete__top-wrapper">
        <h2 className="modal-delete__title">Delete site</h2>
        <div className="modal-delete__divider"></div>
        <p className="modal-delete__paragraph">This will delete our site and remove your cookie scripts</p>
      </div>
      <div className="modal-delete__actions">
        <button className="modal-delete__cancel" onClick={onClose}>Cancel</button>
        <button className="modal-delete__confirm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
