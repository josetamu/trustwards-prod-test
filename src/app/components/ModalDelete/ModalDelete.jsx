import './ModalDelete.css';

import React from 'react';
import { supabase } from '@supabase/supabaseClient';

// ModalDelete: Confirmation for deleting a site
export const ModalDelete = ({ onClose, siteData, setIsModalOpen, setSiteData }) => {

  const handleDelete = async () => {
    try {
    // Redirect to / only if currently inside a site page (e.g., /[siteId])
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Matches /anything (but not exactly /, and excluding paths like /login, /api, etc)
      if (/^\/[a-zA-Z0-9-]+/.test(path) && !path.startsWith('/login') && !path.startsWith('/api') && !path.startsWith('/builder')) {
        window.location.href = '/';
      }
    }
    // Delete the site from Supabase
      const { error } = await supabase
        .from('Site')
        .delete()
        .eq('id', siteData.id);

      if (error) {
        alert(`Error deleting site: ${error.message}`);
        throw error;
      }


      // Close modal and clean up 
      setIsModalOpen(false);
      setSiteData(null);

      // Call the global onDeleteSite function to update the UI realtime
      if (window.onDeleteSite) {
        window.onDeleteSite(siteData.id);
      }


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
