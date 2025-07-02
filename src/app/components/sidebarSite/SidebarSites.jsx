import "./SidebarSites.css";
import "../../components/dropdown/Dropdown.css";

import { useId, useState, useEffect, useRef } from "react";
import { Dropdown } from "../dropdown/Dropdown";
import { Tooltip } from "../tooltip/Tooltip";
import Link from "next/link";
import { supabase } from "../../../supabase/supabaseClient";
import { useDashboard } from "../../dashboard/layout";

export function SidebarSites ({avatar, name, isSidebarOpen, setIsModalOpen, setModalType, siteData, setSiteData, toggleSidebar, toggleDropdown, setIsSidebarOpen, modalType, globalSiteData, setSelectedSite, setIsSiteOpen}) {
    const sidebarSitesId = useId();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const inputRef = useRef(null);
    const { fetchSites, user, webs } = useDashboard();
    
    // If name is already taken, generate a unique name adding a number to the end (name(1), name(2), etc.)
    const generateUniqueSiteName = (baseName, currentSiteId) => {
        const existingNames = webs
            .filter(site => site.id !== currentSiteId) // Exclude current site from check
            .map(site => site.Name);
        
        let newName = baseName;
        let counter = 1;
        
        while (existingNames.includes(newName)) {
            newName = `${baseName}(${counter})`;
            counter++;
        }
        
        return newName;
    };
    
    // function to initialize the edit mode
    const handleEdit = () => {
        setIsEditing(true);
        setEditedName(name);
        setIsDropdownOpen(false);
    };

    // function to save the edited name in the database
    const handleSave = async () => {
        try {
            // Trim whitespace from the edited name
            const trimmedName = editedName.trim();
            
            // If the name is empty, set it to "untitled"
            const finalName = trimmedName === '' ? 'Untitled' : trimmedName;
            
            // Generate unique name if needed
            const uniqueName = generateUniqueSiteName(finalName, siteData.id);
            
            // Update the site in the database
            const { error } = await supabase
                .from('Site')
                .update({ Name: uniqueName })
                .eq('id', siteData.id);

            if (error) {
                console.error('Error updating site name:', error);
                // Revert to original name if update fails
                setEditedName(name);
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
            setEditedName(name);
            setIsEditing(false);
        }
    };

    // if click outside the input, save the edited name in the database
    const handleBlur = async () => {
        await handleSave();
    };

    // if press enter, save the edited name in the database. If press escape, revert to the original name.
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await handleSave();
        } else if (e.key === 'Escape') {
            setEditedName(name);
            setIsEditing(false);
        }
    };

    // When we enter edit mode, select the text
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.select();
        }
    }, [isEditing]);
    
    //This is the dropdown menu
    const SiteMenu = ({ setIsModalOpen, setModalType, isModalOpen, setSiteData, siteData, setIsDropdownOpen, modalType}) => {
      return (
        <>
          <button className="dropdown__item" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <span className="dropdown__icon">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H14V2.72727H0V0Z" fill="currentColor"/>
                <path d="M3.73333 10V4.54545H9.33333L3.73333 10Z" fill="currentColor"/>
                <path d="M7.46667 10V4.54545H12.1333L7.46667 10Z" fill="currentColor"/>
              </svg>
    </span>
            Builder
          </button>
          <button className="dropdown__item" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <span className="dropdown__icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.08398 8.58398C5.08398 6.93408 5.08398 6.10913 5.59655 5.59655C6.10913 5.08398 6.93408 5.08398 8.58398 5.08398H9.16732C10.8172 5.08398 11.6422 5.08398 12.1547 5.59655C12.6673 6.10913 12.6673 6.93408 12.6673 8.58398V9.16732C12.6673 10.8172 12.6673 11.6422 12.1547 12.1547C11.6422 12.6673 10.8172 12.6673 9.16732 12.6673H8.58398C6.93408 12.6673 6.10913 12.6673 5.59655 12.1547C5.08398 11.6422 5.08398 10.8172 5.08398 9.16732V8.58398Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.74994 5.08333C9.74854 3.35836 9.72247 2.46487 9.22033 1.85308C9.12338 1.73494 9.01506 1.6266 8.89693 1.52964C8.25153 1 7.29271 1 5.375 1C3.4573 1 2.49845 1 1.85308 1.52964C1.73494 1.6266 1.6266 1.73494 1.52964 1.85308C1 2.49845 1 3.4573 1 5.375C1 7.29271 1 8.25153 1.52964 8.89693C1.6266 9.01506 1.73494 9.12338 1.85308 9.22033C2.46487 9.72247 3.35836 9.74854 5.08333 9.74994" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </span>
            Copy script
          </button>
          <button 
            className="dropdown__item" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEdit();
            }}
          >
            <span className="dropdown__icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.29734 9.11365L1.75 12.25L4.88653 11.7025C5.12307 11.6613 5.34111 11.548 5.5109 11.3782L11.9937 4.89533C12.3354 4.55362 12.3354 3.99959 11.9936 3.65789L10.342 2.00627C10.0003 1.66457 9.44628 1.66458 9.10456 2.00628L2.62168 8.48931C2.45189 8.65906 2.33862 8.87711 2.29734 9.11365Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.16602 3.5L10.4993 5.83333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Rename
          </button>
          <div className="dropdown__divider"></div>
          <button 
            className="dropdown__item dropdown__item--delete" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if(modalType === 'DeleteSite' && isModalOpen) {
                setIsModalOpen(false);
              } else {
                setIsModalOpen(true);
                setModalType('DeleteSite');
                setIsDropdownOpen(false);
                setSiteData(siteData);
              }
                
            }}
          >
            <span className="dropdown__icon dropdown__icon--delete">
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.625 3.20898L10.1081 11.7379C10.0708 12.3537 9.56047 12.834 8.94354 12.834H3.55644C2.93951 12.834 2.42922 12.3537 2.3919 11.7379L1.875 3.20898" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 3.20768H3.91667M3.91667 3.20768L4.64015 1.51956C4.73207 1.30508 4.94297 1.16602 5.17632 1.16602H7.32368C7.55702 1.16602 7.76795 1.30508 7.85982 1.51956L8.58333 3.20768M3.91667 3.20768H8.58333M11.5 3.20768H8.58333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.79102 9.625V6.125" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.70898 9.625V6.125" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Delete
          </button>
        </>
      );
    };

    //This function returns the site name in lowercase and replaces spaces with hyphens(-)
    const getSiteName = () => {
      return siteData.Name.replace(/\s+/g, '-');
    };
    return(
        <Link 
            href={`/dashboard/${getSiteName()}`}
            className={`sidebarSites__site ${isSidebarOpen ? 'sidebarSites__site--open' : ''}`} 
            id={sidebarSitesId}
            onClick={(e) => {
                // Prevent navigation if in editing mode
                if (isEditing) {
                    e.preventDefault();
                    return;
                }
                setSelectedSite(siteData);
                setIsSiteOpen(true);
            }}
            
        >
            <div className="sidebarSites__header">
                <span className="sidebarSites__header-avatar">
                    {/* <span 
                        className="sidebarSites__header-avatar" 
                        style={{
                            backgroundColor: arrayDePrueba[siteData['Avatar Color']]?.backgroundColor || '#000000',
                            color: arrayDePrueba[siteData['Avatar Color']]?.color || '#FFFFFF'
                        }}>
                          {name.charAt(0)}
                    </span> */}
                    <img className="sidebarSites__header-avatar-img" src={avatar}/>
                </span>
                <span className="sidebarSites__header-name">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            autoFocus
                            className="sidebarSites__header-name-input"
                            ref={inputRef}
                        />
                    ) : (
                        name
                    )}
                </span> 
            </div>
            {!isSidebarOpen && window.innerWidth > 767 && (
                <Tooltip 
                  message={name} 
                  id={siteData.id}
                  responsivePosition={{ desktop: 'sidebar', mobile: 'bottom' }}
                  type='default'
                />
            )} 
            
            <Dropdown
                className="sidebarSites-dropdown"
                open={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                menu={<SiteMenu setIsModalOpen={setIsModalOpen} setModalType={setModalType} setIsDropdownOpen={setIsDropdownOpen} siteData={siteData} setSiteData={setSiteData} toggleSidebar={toggleSidebar} toggleDropdown={toggleDropdown} setIsSidebarOpen={setIsSidebarOpen} modalType={modalType} globalSiteData={globalSiteData} setIsEditing={setIsEditing} setEditedName={setEditedName} name={name} />}
            >
                <div className="sidebarSites__edit" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropdownOpen(v => !v);
                }}>
                    <svg width="9" height="2" viewBox="0 0 9 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.49563 1H4.50437M1 1H1.00874M7.99126 1H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </Dropdown>
        </Link>
    );
}

    


