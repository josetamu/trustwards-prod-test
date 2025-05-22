import { useState } from 'react';
import { Site } from './Site';
import { Modal } from './Modal';
import { DeleteModal } from './DeleteModal';

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
    <div className="sites-wrapper">
      <button onClick={() => {
        setEditingSite(null);
        setIsModalOpen(true);
      }} className="sites-button">
        Add Site
      </button>

      <div className="sites-list">
        <div className="sites-list-header">
          <h2>Sites</h2>
          <div className="sites-list-headings">
            <h4>Edit</h4>
            <h4>Delete</h4>
          </div>
        </div>
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
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setSiteToDelete(null)}
        />
      )}

    </div>
  );
};
