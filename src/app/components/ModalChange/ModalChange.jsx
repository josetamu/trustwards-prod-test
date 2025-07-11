import './ModalChange.css';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';

import { Tooltip } from '../tooltip/Tooltip';

export function ModalChange({ changeType, onClose, user, setUser, showNotification }) {

    const [newName, setNewName] = useState(user?.Name);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    
    //Use modalChange in the different cases we need it: to change name, email or password... The function bellow render the content of the modal based on the changeType.
    const renderContent = () => {
        switch(changeType){
            case 'name':
                return (
                    <>
                        <div className='modalChange__body'>
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    className='modalChange__input' 
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
                        <div className='modalChange__actions modalChange__actions--name'>
                            <button className='modalChange__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                );
    
            case 'email':
                return (
                    <>
                        <div className='modalChange__body'>
                            <span className='modalChange__advice'>We'll send an email to your new adress to confirm the change.</span>
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    className='modalChange__input' 
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
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    type="password" 
                                    className='modalChange__input' 
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
                        <div className='modalChange__actions'>
                            <a href="#" className='modalChange__forgot'>Forgot password?</a>
                            <button className='modalChange__button' onClick={handleSave}>Save</button>
                        </div>
                    </>
                );
            
            case 'password':
                return (
                    <>
                        <div className='modalChange__body'>
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    type="password" 
                                    className='modalChange__input' 
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
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    className='modalChange__input' 
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
                           
                            <div className='modalChange__input__wrapper'>
                            <input 
                                type="password" 
                                className='modalChange__input' 
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
                        <div className='modalChange__actions'>
                            <a href="#" className='modalChange__forgot'>Forgot password?</a>
                            <button className='modalChange__button' onClick={handleSave}>Save</button>
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
                    default:
                        successMessage = 'Updated successfully!';
                }
                showNotification(successMessage);
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
        if (e.target.className === 'modalChange') {
            onClose();
        }
    };

    return (
        <div className='modalChange' onClick={handleBackdropClick}>
            <div className='modalChange__content' onClick={(e) => e.stopPropagation()}>
                <div className='modalChange__header'>
                    <h2 className='modalChange__title'>Change {changeType}</h2>
                </div>
                <div className='modalChange__divider'></div>
                {renderContent()}
            </div>
        </div>
    )
}
