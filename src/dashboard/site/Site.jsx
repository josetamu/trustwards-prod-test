import './Site.css';
import { Dropdown } from '../dropdown/Dropdown';
import { Modal } from '../modal/Modal';
import { useState } from 'react';

const ProButton = ({ onClick, isHovering }) => {
  return (
    <button
      className="site__pro-toggle"
      onClick={onClick}
      aria-label="Open menu"
      type="button"
    >
      <div className="site__pro-content">
        <span className={`site__pro-label ${isHovering ? 'is-hidden' : ''}`}>Pro</span>
        <div className={`site__pro-dots ${isHovering ? 'is-visible' : ''}`}>
          <img className="site__pro-dots-item" src="/dots.svg" alt="dots" />
        </div>
      </div>
    </button>
  );
};

const SiteMenu = ({ onEdit, onDelete }) => {
  return (
    <>
      <button className="site__menu-item site__menu-item--edit" onClick={onEdit}>Edit</button>
      <button className="site__menu-item site__menu-item--delete" onClick={onDelete}>Delete</button>
    </>
  );
};

export const Site = ({ id, text, domain, onUpdate, onRemove }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  return (
    <div className="site">
      <div className="site__gradient-header">
        <div className="site__avatar">
            <img src="/logo test.png" alt="logo" />
        </div>
      </div>
      <div className="site__content">
        <div className="site__name">{text}</div>
        <div className="site__domain">{domain}</div>
      </div>
      <div className="site__actions">
        <div className="site__button-wrapper">
          <Dropdown
            position="bottom-left"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            trigger={<ProButton isHovering={isHovering} />}
            menu={<SiteMenu onEdit={handleEdit} onDelete={handleDelete} />}
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
