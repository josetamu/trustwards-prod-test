'use client'

import './home.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../layout';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import ScriptCopy from '../../components/ScriptCopy/ScriptCopy';
// If name is already taken, generate a unique name adding a number to the end (name(1), name(2), etc.)
const generateUniqueSiteName = (baseName, currentSiteId, webs) => {
    const existingNames = webs
        .filter(site => site.id !== currentSiteId) // Exclude current site from check
        .map(site => site.Name);
    
    let newName = baseName;
    let counter = 1;
    
    while (existingNames.includes(newName)) {
        newName = `${baseName} (${counter})`;
        counter++;
    }
    
    return newName;
};

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, checkSitePicture, SiteStyle, user, fetchSites, showNotification } = useDashboard();
    const selectedSite = webs.find(site => site.id === siteSlug);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(selectedSite?.Name);
    const [siteData, setSiteData] = useState(selectedSite);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    // When we enter edit mode, select the text
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.select();
        }
    }, [isEditing]);

    // Update siteData when selectedSite changes
    useEffect(() => {
        if (selectedSite) {
            setSiteData(selectedSite);
            setEditedName(selectedSite.Name);
        }
    }, [selectedSite]);

    // if webs is empty return waiting for the webs to load. Here we could add a loading spinner or a message to the user
    if (!webs || webs.length === 0) {
        return // Añadir un loading state
    }

    if (!selectedSite) {
        notFound();
    }

    const handleImgEditClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Open local files
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Handle file upload logic here
        console.log('File selected:', file);
        // Add your file upload logic here
      }
    };

        // function to initialize the edit mode
        const handleEdit = () => {
            setIsEditing(true);
            setEditedName(siteData?.Name);
        };
    
        // function to save the edited name in the database
       const handleSave = async () => {
            try {
                // Trim whitespace from the edited name
                const trimmedName = editedName.trim();
                
                // If the name is empty, set it to "untitled"
                const finalName = trimmedName === '' ? 'Untitled' : trimmedName;
                
                // Generate unique name if needed
                const uniqueName = generateUniqueSiteName(finalName, siteData.id, webs);
                
                // Update the site in the database
                const { error } = await supabase
                    .from('Site')
                    .update({ Name: uniqueName })
                    .eq('id', siteData.id);
    
                if (error) {
                    console.error('Error updating site name:', error);
                    // Revert to original name if update fails
                    setEditedName(siteData?.Name);
                    setIsEditing(false);
                    return;
                }
    
                // Update local state
                const updatedSiteData = { ...siteData, Name: uniqueName };
                setSiteData(updatedSiteData);
                
                // Refresh the global sites list
                if (user && fetchSites) {
                    await fetchSites(user.id);
                }
                
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating site name:', error);
                // Revert to original name if update fails
                setEditedName(siteData?.Name);
                setIsEditing(false);
            }
        };
    
        // if click outside the input, save the edited name in the database
        const handleBlur = async () => {
            setIsEditing(false);
            await handleSave();
        };
    
        // if press enter, save the edited name in the database. If press escape, revert to the original name.
        const handleKeyDown = async (e) => {
            if (e.key === 'Enter') {
                await handleSave();
            } else if (e.key === 'Escape') {
                setEditedName(siteData?.Name);
                setIsEditing(false);
            }
        };



    return (
        <div className='siteView'>
            <div className='siteView__header'>
                <div className='siteView__avatar'>
                <span className={`siteView__color ${checkSitePicture(siteData) === '' ? '' : 'siteView__color--null'}`} 
                        style={SiteStyle(siteData)} onClick={handleImgEditClick}>
                          {siteData?.Name?.charAt(0)}
                    </span> 
                    <img className={`siteView__img ${checkSitePicture(siteData) === '' ? 'siteView__img--null' : ''}`} src={siteData?.["Avatar URL"]} alt={siteData?.Name} onClick={handleImgEditClick}/> 
                    <span className='siteView__title' onClick={handleEdit}>
                    {isEditing ? (
                        <input className="siteView__input"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            autoFocus
                            ref={inputRef}
                        />
                    ) : (
                        siteData?.Name
                    )}
                        
                    </span>
                </div>
                <span className={`siteView__plan ${siteData?.Plan === 'Pro' ? 'siteView__plan--pro' : ''}`}>{siteData?.Plan}</span>
                {/* Hidden input to open file selector */}
                <input className='siteView__fileInput'
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                
            />
                

            </div>
            <div className='siteView__content'>
                <div className='siteView__content-header'>
                    <h1 style={{color: 'var(--body-strong-color)'}}>{siteData?.Name}</h1>
                    <ScriptCopy showNotification={showNotification}/>
                </div>
                <div className='home__installation-container'>
                    <div className='home__installation-header'>
                        <h2>Installation</h2>
                        <div className='home__verify'>
                            <span>Verify</span>
                        </div>
                    </div>
                    <h2>Installation</h2>
                    <p>Copy and paste the following code into the head section of your website:</p>
                    <ScriptCopy showNotification={showNotification}/>
                </div>
            </div>
        </div>
    );
}

export default Home;