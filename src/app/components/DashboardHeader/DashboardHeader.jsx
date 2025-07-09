import './DashboardHeader.css';
import { useDashboard } from '../../dashboard/layout';
import { useState, useRef, useEffect } from 'react';


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



function DashboardHeader() {
    const { siteData, checkSitePicture, SiteStyle, webs, supabase, user, fetchSites, setSiteData, setModalType, setIsModalOpen, setUserSettings } = useDashboard();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Update editedName when siteData changes
    useEffect(() => {
        if (siteData?.Name) {
            setEditedName(siteData.Name);
        }
    }, [siteData?.Name]);

    // When we enter edit mode, select the text
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.select();
        }
    }, [isEditing]); 
const handleImgEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open local files
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      //file upload logic here
      console.log('File selected:', file);
      // file upload logic here
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
    // Don't render if siteData is not available
    if (!siteData) {
        return null;
    }
    
    return (  
        <div className='dashboardHeader'>
            <div className='dashboardHeader__header'>
                <div className='dashboardHeader__avatar'>
                <span className={`dashboardHeader__color ${checkSitePicture(siteData) === '' ? '' : 'dashboardHeader__color--null'}`} 
                        style={SiteStyle(siteData)} onClick={handleImgEditClick} >
                        {siteData?.Name?.charAt(0)}
                    </span> 
                    <img className={`dashboardHeader__img ${checkSitePicture(siteData) === '' ? 'dashboardHeader__img--null' : ''}`} src={siteData?.["Avatar URL"]} alt={siteData?.Name} onClick={handleImgEditClick}/> 
                    <span className='dashboardHeader__title' onClick={handleEdit}>
                    {isEditing ? (
                        <input className="dashboardHeader__input"
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
                    )
                    }
                    </span>
                </div>
                <span className={`dashboardHeader__plan ${siteData?.Plan === 'Pro' ? 'dashboardHeader__plan--pro' : ''}`} onClick={() => {
                    setModalType('Plan');
                    setIsModalOpen(true);
                }}>
                    {siteData?.Plan || 'Free'}
                </span>
                {/* Hidden input to open file selector */}
                <input className='dashboardHeader__fileInput'
                type="file"
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                
            />
            </div>
        </div>
    );
}
export default DashboardHeader;





