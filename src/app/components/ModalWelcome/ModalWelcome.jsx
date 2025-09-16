import './ModalWelcome.css';

import { useState, useEffect } from 'react';
import { supabase } from '@supabase/supabaseClient';

export function ModalWelcome({ onClose, setUser, allUserDataResource }) {
    const [newName, setNewName] = useState('');
    const [errors, setErrors] = useState({});

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }

    //Function to save the changes uploading the data to the database
    const handleSave = async () => {
        // Validate input
        const validationErrors = {};
        
        if (!newName || newName.trim() === '') {
            validationErrors.name = 'Name is required';
        }

        // Check if there are validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Get current user data
            const userData = allUserDataResource.read();
            const user = userData.user;

            // Update the user's name in the database
            const { data, error } = await supabase
                .from('User')
                .update({ Name: newName.trim() })
                .eq('id', user?.id);

            if (error) {
                console.error('Error updating user:', error);
                setErrors({ name: 'Failed to update. Please try again.' });
                return;
            }

            // Update local user state in the resource
            const updatedUser = { ...user, Name: newName.trim() };
            setUser(updatedUser);
            if (allUserDataResource) {
                allUserDataResource.read().user = updatedUser;
            }

            // Close the modal
            onClose();

        } catch (error) {
            console.error('Error updating user:', error);
            setErrors({ name: 'An unexpected error occurred. Please try again.' });
        }
    }

    return (
        <div className='modal-welcome'>
            <div className='modal-welcome__content'>
                <div className='modal-welcome__logo'></div>
                <div className='modal-welcome__blur'></div>
            </div>
            <div className='modal-welcome__divider'></div>
            <div className='modal-welcome__body'>
                <span className='modal-welcome__welcome'>Welcome to Trustwards</span>

                <input 
                    className={`modal-welcome__input ${errors.name ? 'modal-welcome__input--warning' : ''}`}
                    type='text' 
                    value={newName} 
                    onChange={e => {
                        setNewName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Your name"
                />

                <div className="modal-welcome__bottom-actions">
                    <a href="#" className='modal-welcome__intro-to-trustwards'>Intro to Trustwards</a>
                    <button className='modal-welcome__button' onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    )
}