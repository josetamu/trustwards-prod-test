import { input } from 'framer-motion/client';
import './ModalChange.css';
import { useState, useEffect } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { supabase } from '../../supabase/supabaseClient';

export function ModalChange({ changeType, onClose, user, setUser, setIsModalOpen }) {

    const [newName, setNewName] = useState(user?.Name);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    


    const handleClose = () => {
        onClose();
    }

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
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New name"
                                />
                            {errors[changeType] && (
                                <Tooltip
                                message={errors[changeType]}
                                responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                />
                            )}
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
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    className='modalChange__input' 
                                    type='email' 
                                    value={newEmail} 
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                placeholder="New email"
                                />
                                {errors.email && (
                                    <Tooltip
                                    message={errors.email}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    />
                                )}
                            </div>
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    type="password" 
                                    className='modalChange__input' 
                                    placeholder='Current password' 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                {errors.password && (
                                    <Tooltip
                                    message={errors.password}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    />
                                )}
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
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                {errors.currentPassword && (
                                    <Tooltip
                                    message={errors.currentPassword}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    />
                                )}
                            </div>
                            <div className='modalChange__input__wrapper'>
                                <input 
                                    className='modalChange__input' 
                                    type='password' 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="New password"
                                />
                                {errors.newPassword && (
                                    <Tooltip
                                    message={errors.newPassword}
                                    responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                    />
                                )}
                            </div>
                           
                            <div className='modalChange__input__wrapper'>
                            <input 
                                type="password" 
                                className='modalChange__input' 
                                placeholder='Confirm password' 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            {errors.confirmPassword && (
                                <Tooltip
                                message={errors.confirmPassword}
                                responsivePosition={{ desktop: 'left', mobile: 'top' }}
                                />
                            )}
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }

    const handleSave = async () => {
        // Validate input based on change type
        const validationErrors = {};
        
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
                validationErrors.currentPassword = 'Current password is required';
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

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            let updateData = {};
            
            if (changeType === 'name') {
                updateData = { Name: newName.trim() };
            } else if (changeType === 'email') {
                updateData = { Email: newEmail.trim() };
            } else if (changeType === 'password') {
                // For password changes, you might want to use Supabase Auth
                // This is a simplified version - in production you'd want proper password hashing
                updateData = { Password: newPassword };
            }

            // Update user data in Supabase
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
            
            // Close the modal
            onClose();
            
        } catch (error) {
            console.error('Error updating user:', error);
            setErrors({ [changeType]: 'An unexpected error occurred. Please try again.' });
        }
    }

    // Handle ESC key to close this modal specifically
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

    return (
        <div className='modalChange'>
            <div className='modalChange__content'>
                <div className='modalChange__header'>
                    <h2 className='modalChange__title'>Change {changeType}</h2>
                </div>
                <div className='modalChange__divider'></div>
                {renderContent()}
            </div>
        </div>
    )
}
