import './BuilderSave.css';
import { useState } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { supabase } from '../../../supabase/supabaseClient';

export default function BuilderSave({showNotification, siteSlug}) {
    const [isLoading, setIsLoading] = useState(false);
    const {JSONtree} = useCanvas();

    const save = async () => {
        setIsLoading(true);
        try {
            // Simular delay de guardado (reemplazar)
            await new Promise(resolve => setTimeout(resolve, 2000));
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
    }

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