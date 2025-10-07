import { useState, useEffect } from 'react';
import './View.css';
import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { supabase } from '@supabase/supabaseClient';

// View: Toggle component for switching between grid and list view
export const View = ({ isGridView, onViewChange }) => {
  const {allUserDataResource, setAppearanceSettings} = useDashboard();
  if(!allUserDataResource) return <PlanSkeleton/>;
  const {appearance, user} = allUserDataResource.read();
  const userView = appearance['View Sites'] || 'grid'; // Default to grid if not set
  
  // Function to update appearance settings in database
  const updateAppearanceSettings = async (settings) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('Appearance')
      .update(settings)
      .eq('userid', user.id);
    
    if (error) {
      console.error('Error updating appearance settings:', error);
    }
  };

 

  // Handle view toggle between grid and list
  const handleView = async (view) => {
    const viewValue = view==='grid' ? 'grid' : 'list';

    // Update local appearance settings state
    setAppearanceSettings(prev => ({ 
      ...prev, 
      'View Sites': viewValue 
    }));


    if(allUserDataResource) {
      const currentData = allUserDataResource.read();
      currentData.appearance['View Sites'] = viewValue;
    }
    
    // Persist to database
    await updateAppearanceSettings({ 'View Sites': viewValue });

  };

  return (
    <div className="view__toggle">
      <button
        className={`view__option ${userView === 'grid' ? 'active' : ''}`}
        onClick={() => handleView('grid')}
        aria-label="Grid view"
        type="button"
      >
        {/* Grid view icon */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 3C0 1.34315 1.34315 0 3 0H6V6H0V3Z" fill="currentColor" fillOpacity="0.6"/>
          <path d="M7 0H10C11.6569 0 13 1.34315 13 3V6H7V0Z" fill="currentColor" fillOpacity="0.6"/>
          <path d="M0 10C0 11.6569 1.34315 13 3 13H6V7H0V10Z" fill="currentColor" fillOpacity="0.6"/>
          <path d="M7 13H10C11.6569 13 13 11.6569 13 10V7H7V13Z" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      </button>
      <button
        className={`view__option ${userView === 'list' ? 'active' : ''}`}
        onClick={() => handleView('list')}
        aria-label="List view"
        type="button"
      >
        {/* List view icon */}
        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0H11.5C12.3284 0 13 0.671573 13 1.5C13 2.32843 12.3284 3 11.5 3H1.5C0.671573 3 0 2.32843 0 1.5Z" fill="currentColor" fillOpacity="0.6"/>
          <path d="M0 5.5C0 4.67157 0.671573 4 1.5 4H11.5C12.3284 4 13 4.67157 13 5.5C13 6.32843 12.3284 7 11.5 7H1.5C0.671573 7 0 6.32843 0 5.5Z" fill="currentColor" fillOpacity="0.45"/>
          <path d="M0 9.5C0 8.67157 0.671573 8 1.5 8H11.5C12.3284 8 13 8.67157 13 9.5C13 10.3284 12.3284 11 11.5 11H1.5C0.671573 11 0 10.3284 0 9.5Z" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      </button>
    </div>
  );
};
