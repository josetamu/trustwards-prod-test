import './BuilderSave.css';
import { useState, useEffect, useCallback } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { supabase } from '../../../supabase/supabaseClient';

export default function BuilderSave({showNotification, siteSlug}) {
    const [isLoading, setIsLoading] = useState(false);
    const {JSONtree} = useCanvas();

    const save = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simular delay de guardado (reemplazar)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const {data, error} = await supabase
                .from('Site')
                .update({JSON: JSONtree})
                .eq('id', siteSlug);
            showNotification('Changes saved successfully');
        } catch (error) {
            showNotification('Error saving changes');
        } finally {
            setIsLoading(false);
        }
    }, [JSONtree, siteSlug, showNotification]);

        // Add keyboard shortcut for Ctrl+S or Cmd+S
        useEffect(() => {
            const handleKeyDown = (e) => {
                const isCtrlOrCmd = e.ctrlKey || e.metaKey;
                
                if (isCtrlOrCmd && e.key === 's') {
                    e.preventDefault();
                    if (!isLoading) {
                        save();
                    }
                }
            };
    
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [isLoading, save]); // Include isLoading to prevent saving while already saving
    

    return (
        <div 
            className={`builder-save ${isLoading ? 'builder-save--loading' : ''}`} 
            onClick={!isLoading ? save : undefined}
        >
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