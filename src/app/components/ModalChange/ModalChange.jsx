import './ModalChange.css';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';

import { Tooltip } from '../tooltip/Tooltip';

export function ModalChange({ changeType, onClose, user, setUser, showNotification, siteData, setSiteData, createNewSite, setWebs, allUserDataResource }) {

    const [newName, setNewName] = useState(user?.Name);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newSiteName, setNewSiteName] = useState(siteData?.Name);
    const [newSiteDomain, setNewSiteDomain] = useState(siteData?.Domain);
    const [createSiteName, setCreateSiteName] = useState('');
    const [createSiteDomain, setCreateSiteDomain] = useState('');
    const [errors, setErrors] = useState({});
    
    //Use modalChange in the different cases we need it: to change name, email or password... The function bellow render the content of the modal based on the changeType.
    const renderContent = () => {
        switch(changeType){
            case 'name':
                return (
                    <>
                        <div className='modal-change__body'>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    className='modal-change__input' 
                                    type='text' 
                                    value={newName} 
                                    onChange={e => {
                                        setNewName(e.target.value);
                                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New name"
                                />
                                <Tooltip
                                    message={errors.name}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.name}
                                />
                            </div>
                        </div>
                        <div className='modal-change__actions modal-change__actions--right'>
                            <button className='modal-change__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                );
    
            case 'email':
                return (
                    <>
                        <div className='modal-change__body'>
                            <span className='modal-change__advice'>We'll send an email to your new adress to confirm the change.</span>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    className='modal-change__input' 
                                    type='email' 
                                    value={newEmail} 
                                    onChange={e => {
                                        setNewEmail(e.target.value);
                                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                placeholder="New email"
                                />
                                <Tooltip
                                    message={errors.email}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.email}
                                />
                            </div>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    type="password" 
                                    className='modal-change__input' 
                                    placeholder='Current password' 
                                    value={currentPassword}
                                    onChange={e => {
                                        setCurrentPassword(e.target.value);
                                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Tooltip
                                    message={errors.password}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.password}
                                />
                            </div>
                        </div>
                        <div className='modal-change__actions'>
                            <a href="#" className='modal-change__forgot'>Forgot password?</a>
                            <button className='modal-change__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                );
            
            case 'password':
                return (
                    <>
                        <div className='modal-change__body'>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    type="password" 
                                    className='modal-change__input' 
                                    placeholder='Current password' 
                                    value={currentPassword}
                                    onChange={e => {
                                        setCurrentPassword(e.target.value);
                                        if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Tooltip
                                    message={errors.currentPassword}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.currentPassword}
                                />
                            </div>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    className='modal-change__input' 
                                    type='password' 
                                    value={newPassword} 
                                    onChange={e => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New password"
                                />
                                <Tooltip
                                    message={errors.newPassword}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.newPassword}
                                />
                            </div>
                           
                            <div className='modal-change__input__wrapper'>
                            <input 
                                type="password" 
                                className='modal-change__input' 
                                placeholder='Confirm password' 
                                value={confirmPassword}
                                onChange={e => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                }}
                                onKeyDown={handleKeyDown}
                            />
                            <Tooltip
                                message={errors.confirmPassword}
                                responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                open={!!errors.confirmPassword}
                                />
                            </div>
                        </div>
                        <div className='modal-change__actions'>
                            <a href="#" className='modal-change__forgot'>Forgot password?</a>
                            <button className='modal-change__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                );
        
            case 'newsite':
                return (
                    <>
                        <div className='modal-change__body'>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    className='modal-change__input' 
                                    type='text'  
                                    onChange={(e) => {
                                        setCreateSiteName(e.target.value);
                                        if (errors.createSiteName) setErrors(prev => ({ ...prev, createSiteName: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New site name"
                                />
                                <Tooltip
                                    message={errors.createSiteName}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    open={!!errors.createSiteName}
                                />
                            </div>
                            <div className='modal-change__input__wrapper'>
                                <input 
                                    type="text" 
                                    className='modal-change__input' 
                                    placeholder='example.com' 
                                    onChange={(e) => {
                                        setCreateSiteDomain(e.target.value);
                                        if (errors.createSiteDomain) setErrors(prev => ({ ...prev, createSiteDomain: undefined }));
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Tooltip
                                    message={errors.createSiteDomain}
                                    responsivePosition={{ desktop: 'left', mobile: 'left' }}
                                    open={!!errors.createSiteDomain}
                                />
                            </div>
                        </div>
                        <div className='modal-change__actions modal-change__actions--right'>
                            <button className='modal-change__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                ); 
                case 'settings':
                    return (
                        <>
                            <div className='modal-change__body'>
                                <div className='modal-change__input__wrapper'>
                                    <input 
                                        className='modal-change__input' 
                                        type='text'  
                                        value={newSiteName || ""}
                                        onChange={(e) => {
                                            setNewSiteName(e.target.value);
                                            if (errors.newSiteName) setErrors(prev => ({ ...prev, newSiteName: undefined }));
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Site name"
                                    />
                                    <Tooltip
                                        message={errors.newSiteName}
                                        responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                        open={!!errors.newSiteName}
                                    />
                                </div>
                                <div className='modal-change__input__wrapper'>
                                    <input 
                                        type="text" 
                                        className='modal-change__input' 
                                        placeholder='example.com' 
                                        value={newSiteDomain || ""}
                                        onChange={(e) => {
                                            setNewSiteDomain(e.target.value);
                                            if (errors.newSiteDomain) setErrors(prev => ({ ...prev, newSiteDomain: undefined }));
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Tooltip
                                        message={errors.newSiteDomain}
                                        responsivePosition={{ desktop: 'left', mobile: 'left' }}
                                        open={!!errors.newSiteDomain}
                                    />
                                </div>
                            </div>
                            <div className='modal-change__actions modal-change__actions--right'>
                                <button className='modal-change__button' onClick={handleSave}>Save</button>
                            </div>
                        </>
                    );
    }
}

    //Handle key down Enter to save the changes
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }
    
    //Function to save the changes uploading the data to the database
    const handleSave = async () => {
        // Validate input based on different change types
        const validationErrors = {};
        //validations for each change type:

        if (changeType === 'name' && (!newName || newName.trim() === '')) {
            validationErrors.name = 'Name is required';
        }
        
        if (changeType === 'email') {
            if (!newEmail || newEmail.trim() === '') {
                validationErrors.email = 'Email is required';
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(newEmail)) {
                    validationErrors.email = 'Please enter a valid email';
                }
            }
            if (!currentPassword) {
                validationErrors.password = 'Current password is required';
            }  
        }
        
        if (changeType === 'password') {
            if (!currentPassword) {
                validationErrors.currentPassword = 'Current passwordrequired';
            }
            if (!newPassword || newPassword.length < 6) {
                validationErrors.newPassword = 'New password must be at least 6 characters';
            }
            if (!confirmPassword) {
                validationErrors.confirmPassword = 'Please confirm your password';
            } else if (newPassword !== confirmPassword) {
                validationErrors.confirmPassword = 'Passwords do not match';
            }
        }
        if(changeType === 'newsite'){
            if (!createSiteName || createSiteName.trim() === '') {
                validationErrors.createSiteName = 'Site name is required';
            }
            if (!createSiteDomain || createSiteDomain.trim() === '') {
                validationErrors.createSiteDomain = 'Site domain is required';
                console.log(validationErrors.createSiteDomain);
            } else if (!createSiteDomain.includes('.')) {
                validationErrors.createSiteDomain = 'Site domain must contain a dot (.)';
            }else {
                // Check if domain already exists in the database
                try {
                    const { data: existingSites, error } = await supabase
                        .from('Site')
                        .select('Domain')
                        .eq('Domain', createSiteDomain.trim());
                    
                    if (error) {
                        console.error('Error checking domain:', error);
                        validationErrors.createSiteDomain = 'Error checking domain availability';
                    } else if (existingSites && existingSites.length > 0) {
                        validationErrors.createSiteDomain = 'This domain is already in use';
                    }
                } catch (error) {
                    console.error('Error checking domain:', error);
                    validationErrors.createSiteDomain = 'Error checking domain availability';
                }
            }
        } 
        if (changeType === 'settings') {
            if (!newSiteName || newSiteName.trim() === '') {
                validationErrors.newSiteName = 'Site name is required';
            }
            if (!newSiteDomain || newSiteDomain.trim() === '') {
                validationErrors.newSiteDomain = 'Site domain is required';
            } else if (!newSiteDomain.includes('.')) {
                validationErrors.newSiteDomain = 'Site domain must contain a dot (.)';
            } else {
                // Check if domain already exists (excluding current site)
                try {
                    const { data: existingSites, error } = await supabase
                        .from('Site')
                        .select('Domain')
                        .eq('Domain', newSiteDomain.trim())
                        .neq('id', siteData?.id); // Exclude current site from check
                    
                    if (error) {
                        console.error('Error checking domain:', error);
                        validationErrors.newSiteDomain = 'Error checking domain availability';
                    } else if (existingSites && existingSites.length > 0) {
                        validationErrors.newSiteDomain = 'This domain is already in use';
                    }
                } catch (error) {
                    console.error('Error checking domain:', error);
                    validationErrors.newSiteDomain = 'Error checking domain availability';
                }
            }
        }


        //Check if the object validationErrors has any key, if it has, show the errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        //Try to update the data in the database
        try {
            let updateData = {};
            //Update the data based on the change type and save in the object updateData
            if (changeType === 'name') {
                updateData = { Name: newName.trim() };
            } else if (changeType === 'email') {
                updateData = { Email: newEmail.trim() };
            } else if (changeType === 'password') {
                // For password changes, you might want to use Supabase Auth
                // This is a simplified version - in production you'd want proper password hashing
                updateData = { Password: newPassword };
            }
            if (changeType === 'settings') {
                // Get all sites to check for unique names
                const { data: allSites, error: sitesError } = await supabase
                    .from('Site')
                    .select('Name, id')
                    .eq('userid', user?.id);
                
                if (sitesError) {
                    console.error('Error fetching sites:', sitesError);
                    setErrors({ [changeType]: 'Failed to fetch sites. Please try again.' });
                    return;
                }
                
                const generateUniqueSiteName = (newSiteName) => {
                    const existingNames = allSites
                        .filter(site => site.id !== siteData?.id) // Exclude current site
                        .map(site => site.Name);
                    
                    let newName = newSiteName;
                    let counter = 1;
                    
                    while (existingNames.includes(newName)) {
                        newName = `${newSiteName} (${counter})`;
                        counter++;
                    }
                    
                    return newName;
                };
                
                const uniqueSiteName = generateUniqueSiteName(newSiteName.trim() || 'Untitled');
                updateData = { Name: uniqueSiteName, Domain: newSiteDomain.trim() };
                
                const { data, error } = await supabase
                    .from('Site')
                    .update(updateData)
                    .eq('id', siteData?.id);
                
                if (error) {
                    console.error('Error updating site:', error);
                    setErrors({ [changeType]: 'Failed to update. Please try again.' });
                    return;
                }
                
                const updatedSite = { ...siteData, ...updateData };
                setSiteData(updatedSite);
                if (setWebs) {
                    setWebs(prevWebs =>
                      prevWebs.map(site =>
                        site.id === updatedSite.id ? { ...site, ...updateData } : site
                      )
                    );
                  }
                  if (allUserDataResource) {
                    const currentData = allUserDataResource.read();
                    currentData.webs = currentData.webs.map(web =>
                        web.id === updatedSite.id ? { ...web, ...updateData } : web
                    );
                }
                
                if (showNotification) {
                    showNotification('Site settings updated successfully!', 'top', true);
                }
                onClose();
                return;
            }
            if (changeType === 'newsite') {
                createNewSite(createSiteName, createSiteDomain);
            }

            //Update the data in the database using the object updateData
            const { data, error } = await supabase
                .from('User')
                .update(updateData)
                .eq('id', user?.id);

            if (error) {
                console.error('Error updating user:', error);
                setErrors({ [changeType]: 'Failed to update. Please try again.' });
               
                return;
            }

            // Update local user state
            const updatedUser = { ...user, ...updateData };
            setUser(updatedUser);
            if (allUserDataResource) {
                allUserDataResource.read().user = updatedUser;
            }


            
            // Show success notification
            if (showNotification) {
                let successMessage = '';
                switch (changeType) {
                    case 'name':
                        successMessage = 'Name updated successfully!';
                        break;
                    case 'email':
                        successMessage = 'We\'ve sent instructions to your new email to reset your password!';
                        break;
                    case 'password':
                        successMessage = 'We\'ve sent instructions to your new email to reset your password!';
                        break;
                    case 'newsite':
                        successMessage = 'Site created successfully!';
                        break;
                    case 'settings':
                        successMessage = 'Site settings updated successfully!';
                        break;
                    default:
                        successMessage = 'Updated successfully!';
                }
                if (changeType === 'newsite') {
                    showNotification(successMessage, 'top', true);
                } else {
                    showNotification(successMessage, 'top', false);
                }
            }
            
            // Close the modal
            onClose();
            
        } catch (error) {
            console.error('Error updating user:', error);
            setErrors({ [changeType]: 'An unexpected error occurred. Please try again.' });
        }
    }

    // Handle ESC key to close this modal specifically(it is independent of the modalUser)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc, { capture: true });
        return () => document.removeEventListener('keydown', handleEsc, { capture: true });
    }, [onClose]);

    // Handle click outside to close modal
    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-change') {
            onClose();
        }
    };

    return (
        <div className='modal-change' onClick={handleBackdropClick}>
            <div className='modal-change__content' onClick={(e) => e.stopPropagation()}>
                <div className='modal-change__header'>
                    <h2 className='modal-change__title'>{`${changeType === 'newsite' ? 'Create new site' : `Change ${changeType}`}`}</h2>
                </div>
                <div className='modal-change__divider'></div>
                {renderContent()}
            </div>
        </div>
    )
}
    