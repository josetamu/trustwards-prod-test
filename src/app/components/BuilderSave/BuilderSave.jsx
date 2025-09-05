import './BuilderSave.css';
import { useState, useEffect, useCallback } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { supabase } from '../../../supabase/supabaseClient';
import { createCDN } from '@contexts/CDNsContext';

export default function BuilderSave({showNotification, siteSlug}) {
    const [isLoading, setIsLoading] = useState(false);
    const {JSONtree} = useCanvas();

    // Function to save the changes. This function is used by the button and the keyboard shortcut(Ctrl+S or Cmd+S)
    const save = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simulate a delay of saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            //Update the site with the new JSONtree in supabase
            const {data, error} = await supabase
                .from('Site')
                .update({JSON: JSONtree})
                .eq('id', siteSlug);
            //Show a notification if the changes are saved successfully
            showNotification('Changes saved successfully');

            createCDN(siteSlug); //Finally, update the CDN
        } catch (error) {
            showNotification('Error saving changes');
        } finally {
            setIsLoading(false);
        }
    }, [JSONtree, siteSlug, showNotification]);

    // Add keyboard shortcut for Ctrl+S or Cmd+S to save the changes
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            // Check if the user is pressing Ctrl+S or Cmd+S
            if (isCtrlOrCmd && e.key === 's') {
                e.preventDefault();
                if (!isLoading) {
                    save();
                }
            }
        };
        // Add the event listener to the window
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLoading, save]); // Include isLoading to prevent saving while already saving
    

    return (
        <div 
            className={`builder-save${isLoading ? ' builder-save--loading' : ''}`} 
            onClick={!isLoading ? save : undefined}
        >
            {/* If the changes are being saved, show the spinner */}
            {isLoading ? (
                <>
                    <div className="builder-save__spinner">
                        <svg className="builder-save__svg" viewBox="0 0 50 50">
                        <circle className="builder-save__circle" cx="25" cy="25" r="20" />
                        </svg>
                    </div>
                    
                </>
            ) : (
                <span className="builder-save__text">Save</span>
            )}
        </div>
    )
}