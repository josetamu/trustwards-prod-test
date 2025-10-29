import './BuilderSave.css';
import { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { useCanvas } from '@contexts/CanvasContext';
import { supabase } from '@supabase/supabaseClient';
import { createCDN } from '@contexts/CDNsContext';

export default function BuilderSave({showNotification, siteSlug}) {
    const [isLoading, setIsLoading] = useState(false);
    const {JSONtree, markClean} = useCanvas();

    // Function to save the changes. This function is used by the button and the keyboard shortcut(Ctrl+S or Cmd+S)
    const save = useCallback(async () => {
        setIsLoading(true);
        try {

            //Update the site with the new JSONtree in supabase
            const {data, error} = await supabase
                .from('Site')
                .update({JSON: JSONtree})
                .eq('id', siteSlug);

            //If the changes are saved successfully, mark the current state as saved
            if(!error){
                markClean();
            }
            //Show a notification if the changes are saved successfully
            showNotification('Changes saved successfully');

            createCDN(siteSlug); //Finally, update the CDN

            Promise.all([
                captureCanvas().catch(error => console.error('Error capturing canvas:', error)),
            ]);

            
        } catch (error) {
            showNotification('Error saving changes');
        } finally {
            setIsLoading(false);
        }
    }, [JSONtree, siteSlug, showNotification, markClean]);

    



    // Function to capture canvas and save to Supabase storage
const captureCanvas = useCallback(async () => {
    try {
        // Get the canvas element
        const canvasElement = document.querySelector('.tw-builder__canvas');
        if (!canvasElement) {
            console.error('Canvas element not found');
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        

        // Use html2canvas to capture the canvas element - try different import approaches
        let html2canvas;
        try {
            // Try the standard dynamic import first
            const module = await import('html2canvas');
            html2canvas = module.default || module;
        } catch (importError) {
            console.error('Failed to import html2canvas:', importError);
            // Fallback: try to access from window if it's loaded globally
            if (typeof window !== 'undefined' && window.html2canvas) {
                html2canvas = window.html2canvas;
            } else {
                throw new Error('html2canvas is not available');
            }
        }

        if (!html2canvas || typeof html2canvas !== 'function') {
            throw new Error('html2canvas is not a valid function');
        }
        //Make the capture of the canvas without shadows and always in desktop size
        const canvas = await html2canvas(canvasElement, {
            backgroundColor: null,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            //Clone the canvas and set the width and max-width to 1440px and remove the box-shadow(box-shadow cause errors in the capture)
            onclone: (clonedDoc, element) => {
                // Remove box-shadow from the cloned canvas to avoid shadow in capture
                const clonedCanvas = clonedDoc.querySelector('.tw-builder__canvas');
                if (clonedCanvas) {
                    clonedCanvas.style.setProperty('box-shadow', 'none', 'important');
                    clonedCanvas.style.setProperty('border', 'none', 'important');
                }
            
                if(element && element.style){
                    element.style.width = '1440px';
                    element.style.maxWidth = '1440px';
                    element.style.height = '1080px';
                    element.style.maxHeight = '1080px';
                   

                }
            }
        });

        // Convert canvas to blob(image)
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });

        
        // Get the current user to include in the file path
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        // Create file path
        const filePath = `${user.id}/${siteSlug}.png`;

        // Upload to Supabase storage bucket "Canvas capture"
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('Canvas capture')
            .upload(filePath, blob, {
                contentType: 'image/png',
                upsert: true,
                cacheControl: '0'
            });

        if (uploadError) {
            console.error('Error uploading canvas capture:', uploadError);
            return;
        }

        
    } catch (error) {
        console.error('Error capturing canvas:', error);
    }
}, [siteSlug]);

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
            className={`builder-save ${isLoading ? ' builder-save--loading' : ''}`} 
            onClick={!isLoading ? save : undefined}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                    e.preventDefault();
                    save();
                }
            }}
            tabIndex={isLoading ? -1 : 0}
            aria-label={isLoading ? "Saving changes..." : "Save changes"}
            aria-disabled={isLoading}
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