import './ModalDelete.css';

import React from 'react';
import { supabase } from '../../../supabase/supabaseClient';

// ModalDelete: Confirmation for deleting a site
export const ModalDelete = ({ onClose, siteData, setIsModalOpen, setSiteData }) => {

  const handleDelete = async () => {
    try {
    // Redirect to /dashboard only if currently inside a site page (e.g., /dashboard/[siteId])
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      // Matches /dashboard/anything (but not exactly /dashboard)
      if (/^\/dashboard\/[^/]+$/.test(path)) {
        window.location.href = '/dashboard';
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
