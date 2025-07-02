import React from 'react';
import './ModalDelete.css';
import { supabase } from '../../../supabase/supabaseClient';

// ModalDelete: Confirmation for deleting a site
export const ModalDelete = ({ onClose, siteData, setIsModalOpen, setSiteData }) => {
  // Handle site delete
  const handleDelete = async () => {
    try {
      // Delete the site from Supabase
      const { error } = await supabase
        .from('Site')
        .delete()
        .eq('id', siteData.id);
      if (error) throw error;
      // Close modal and clean up
      setIsModalOpen(false);
      setSiteData(null);
      // Update UI globally
      if (window.onDeleteSite) window.onDeleteSite(siteData.id);
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  return (
    <div className="modal-delete__content">
      <div className="modal-delete__top-wrapper">
        <h2 className="modal-delete__title">Delete site</h2>
        <div className="modal-delete__divider"></div>
        <p className="modal-delete__paragraph">This will delete your site and remove your cookie scripts</p>
      </div>
      <div className="modal-delete__actions">
        <button className="modal-delete__cancel" onClick={onClose}>Cancel</button>
        <button className="modal-delete__confirm" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};
