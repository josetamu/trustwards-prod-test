import { useState } from 'react';
import { Site } from '../site/Site';
import { Modal } from '../modal/Modal';
import './Sites.css'

export const Sites = ({ sites, isModalOpen, setIsModalOpen }) => {
  const [siteList, setSiteList] = useState(sites);
  const [editingSite, setEditingSite] = useState(null);
  const [siteToDelete, setSiteToDelete] = useState(null);

   // Handles both adding a new site and editing an existing one
  const handleAddOrEditSite = (newText, newDomain) => {
    if (editingSite) {
      // Edit an existing site
      setSiteList(prev =>
        prev.map(site =>
          site.id === editingSite.id ? { ...site, text: newText, domain: newDomain } : site
        )
      );
      setEditingSite(null);
    } else {
      // Add a new site
      const newSite = {
        id: crypto.randomUUID(),
        text: newText,
        domain: newDomain,
      };
      setSiteList(prev => [...prev, newSite]);
    }

    setIsModalOpen(false);
  };

  // Delete the site
  const handleDeleteSite = (id) => {
    setSiteToDelete(id);
  };
  const confirmDelete = () => {
    setSiteList(prev => prev.filter(site => site.id !== siteToDelete));
    setSiteToDelete(null);
  };
  

  // Open the modal to edit the site
  const handleEditSite = (id) => {
    const siteToEdit = siteList.find(c => c.id === id);
    if (siteToEdit) {
      setEditingSite(siteToEdit);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="sites__wrapper">
      <div className="sites__header">
        <h2 className="sites__title">Sites</h2>
        <div className="sites__header-actions">
          <button 
            onClick={() => {
              setEditingSite(null);
              setIsModalOpen(true);
            }} 
            className="sites__new-button"
          >
            New
          </button>
        </div>
      </div>

      <div className="sites__grid">
        {siteList.map((site) => (
          <Site
            key={site.id}
            id={site.id}
            text={site.text}
            domain={site.domain}
            onEdit={handleEditSite}
            onDelete={handleDeleteSite}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal
          onSave={(text, domain) => handleAddOrEditSite(text, domain)}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSite(null);
          }}
          initialData={editingSite}
        />
      )}

      {siteToDelete && (
        <Modal
          type="delete"
          onSave={confirmDelete}
          onCancel={() => setSiteToDelete(null)}
        />
      )}

    </div>
  );
};
