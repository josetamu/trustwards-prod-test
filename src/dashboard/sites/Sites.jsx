import { useState } from 'react';
import { Site } from '../site/Site';
import { Modal } from '../modal/Modal';
import './Sites.css'

export const Sites = ({ sites, isModalOpen, setIsModalOpen }) => {
  const [siteList, setSiteList] = useState(sites);

  // Añadir un nuevo site
  const handleAddSite = (newText, newDomain) => {
    const newSite = {
      id: crypto.randomUUID(),
      text: newText,
      domain: newDomain,
    };
    setSiteList(prev => [...prev, newSite]);
    setIsModalOpen(false);
  };

  return (
    <div className="sites__wrapper">
      <div className="sites__header">
        <h2 className="sites__title">Sites</h2>
        <div className="sites__header-actions">
          <button 
            onClick={() => {
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
            onUpdate={(updatedText, updatedDomain) => {
              setSiteList(prev => prev.map(s => s.id === site.id ? { ...s, text: updatedText, domain: updatedDomain } : s));
            }}
            onRemove={() => {
              setSiteList(prev => prev.filter(s => s.id !== site.id));
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal
          onSave={handleAddSite}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
