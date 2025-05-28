import './Site.css';
import { Dropdown } from '../dropdown/Dropdown';
import { Modal } from '../modal/Modal';
import { useState } from 'react';

export const Site = ({ id, text, domain, onUpdate, onRemove }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="site">
      <div className="site__gradient-header">
        <div className="site__avatar" />
      </div>
      <div className="site__main-content">
        <div className="site__name">{text}</div>
        <div className="site__domain">{domain}</div>
      </div>
      <div className="site__actions">
        <div className="site__button-wrapper">
          <Dropdown
            onEdit={() => setEditModalOpen(true)}
            onDelete={() => setDeleteModalOpen(true)}
          />
        </div>
        <div className="site__button-wrapper">
          <button className="site__cdn-btn" aria-label="CDN">CDN</button>
          <button className="site__builder-btn">Builder</button>
        </div>
      </div>
      {editModalOpen && (
        <Modal
          type="edit"
          initialData={{ id, text, domain }}
          onSave={(newText, newDomain) => {
            onUpdate(newText, newDomain);
            setEditModalOpen(false);
          }}
          onCancel={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <Modal
          type="delete"
          onSave={() => {
            onRemove();
            setDeleteModalOpen(false);
          }}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};
