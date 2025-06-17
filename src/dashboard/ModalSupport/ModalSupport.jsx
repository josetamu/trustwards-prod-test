import './ModalSupport.css';
import { useState, useEffect } from 'react';
import { Tooltip } from '../tooltip/Tooltip';





export const ModalSupport = ({user, setUser, setIsModalOpen}) => {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [name, setName] = useState(user?.["First Name"] + " " + user?.["Second Name"]);
    const [email, setEmail] = useState(user?.Email);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if(user){
            setName(user?.["First Name"] + " " + user?.["Second Name"] || 'User Name');
            setEmail(user?.Email || 'User Email');
            setErrors({});
        }
    }, [user]);

    // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') && !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!message?.trim()) {
      newErrors.message = 'Message is required';
    }
    if(selectedChoice === null){
      newErrors.selectedChoice = 'Please select a choice';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateInputs()) {
        return;
    }

    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('type', selectedChoice);
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch('/api/send-support-email', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        // Limpiar el formulario después del envío exitoso
        setName('');
        setEmail('');
        setMessage('');
        setFiles([]);
        setSelectedChoice(null);
        setIsModalOpen(false);

        // Mostrar mensaje de éxito
        alert('Your message has been sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send message. Please try again later.');
    } finally {
        setIsSubmitting(false);
    }
};
  
  // Handle input editing and clear errors when input is valid
  const handleInputEdit = (field, value) => {
    if (field === 'name') {
      setName(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    } else if (field === 'email') {
      setEmail(value);
      if (value.trim() /* && value.includes('@') && value.includes('.') */) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

    const handleFileChange = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };  
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    };
    const removeFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleDropzoneClick = (e) => {
        e.stopPropagation();
        document.getElementById('fileInput').click();
    };

    return (
        <div className="modalSupport__content">
            <div className="modalSupport__header">
                <span className="modalSupport__icon">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H15V3H0V0Z" fill="#A3A3A3"/>
                        <path d="M4 11V5H10L4 11Z" fill="#A3A3A3"/>
                        <path d="M8 11V5H13L8 11Z" fill="#A3A3A3"/>
                    </svg>
                </span>
            </div>
            <form className="modalSupport__form">
                <div className="modalSupport__top">
                    <span className="modalSupport__description">
                        Please be as descriptive as possible. Screenshots and recordings will help us identify better your concerns.
                    </span>
                    <div className="modalSupport__choices">
                        <div className={`modalSupport__choice ${selectedChoice === 'Bug report' ? 'modalSupport__choice--active' : ''}`} onClick={() => setSelectedChoice('Bug report')}>
                            <span className="modalSupport__choice__icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_254_2015)">
                                    <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="#0099FE"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_254_2015">
                                    <rect width="12" height="12" rx="6" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span className="modalSupport__choice__text">
                                Bug report
                            </span>
                        </div>
                        <div className={`modalSupport__choice ${selectedChoice === 'Pre-sale questions' ? 'modalSupport__choice--active' : ''}`} onClick={() => setSelectedChoice('Pre-sale questions')}>
                        <span className="modalSupport__choice__icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_254_2015)">
                                    <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="#0099FE"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_254_2015">
                                    <rect width="12" height="12" rx="6" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span className="modalSupport__choice__text">
                                Pre-sale questions
                            </span>
                        </div>
                        <div className={`modalSupport__choice ${selectedChoice === 'Other' ? 'modalSupport__choice--active' : ''}`} onClick={() => setSelectedChoice('Other')}>
                        <span className="modalSupport__choice__icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_254_2015)">
                                    <rect width="12" height="12" rx="6" fill="#F3F3F3"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.875 11.25C2.90647 11.25 0.5 8.84355 0.5 5.875C0.5 2.90647 2.90647 0.5 5.875 0.5C8.84355 0.5 11.25 2.90647 11.25 5.875C11.25 8.84355 8.84355 11.25 5.875 11.25ZM8.2591 4.69509C8.4359 4.48295 8.40725 4.16767 8.1951 3.99089C7.98295 3.81411 7.66765 3.84276 7.4909 4.0549L5.3414 6.6343L4.22856 5.52145C4.03329 5.3262 3.71671 5.3262 3.52145 5.52145C3.32618 5.7167 3.32618 6.0333 3.52145 6.22855L5.02145 7.72855C5.1208 7.8279 5.2573 7.88085 5.39765 7.8745C5.538 7.8681 5.6692 7.803 5.7591 7.6951L8.2591 4.69509Z" fill="#0099FE"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_254_2015">
                                    <rect width="12" height="12" rx="6" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span className="modalSupport__choice__text">
                                Other
                            </span>
                        </div>
                        {errors.selectedChoice && (
                            <Tooltip 
                                message={errors.selectedChoice} 
                                id="selectedChoice-error"
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                type='alert'
                            />
                        )}
                    </div>
                </div>
                <div className="modalSupport__mid">
                    <div className="modalSupport__input">
                        <span className="modalSupport__input__title">Name</span>
                        <div className="modalSupport__input__container">
                            <input 
                            type="text" 
                            className="modalSupport__input__field" 
                            value={name} 
                            onChange={(e) => handleInputEdit('name', e.target.value)} 
                            aria-invalid={!!errors.name} 
                            aria-describedby={errors.name ? 'name-error' : undefined} 
                            
                            />
                            {errors.name && (
                                <Tooltip 
                                    message={errors.name} 
                                    id="name-error"
                                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                    type='alert'
                                />
                            )}
                        </div>
                        
                    </div>
                    <div className="modalSupport__input">
                        <span className="modalSupport__input__title">Email</span>
                        <div className="modalSupport__input__container">
                            <input 
                            type="text" 
                            className="modalSupport__input__field" 
                            value={email} 
                            onChange={(e) => handleInputEdit('email', e.target.value)} 
                            aria-invalid={!!errors.email} 
                            aria-describedby={errors.email ? 'email-error' : undefined} 
                            />
                        {errors.email && (
                            <Tooltip 
                                message={errors.email} 
                                id="email-error"
                                responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                type='alert'
                            />
                        )}
                        </div>
                    </div>
                    <div className="modalSupport__input">
                        <span className="modalSupport__input__title">Message</span>
                        <div className="modalSupport__input__container">
                            <textarea 
                            type="text-area" 
                            className="modalSupport__input__field modalSupport__input__field--textarea" 
                            placeholder='...' 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            aria-invalid={!!errors.message} 
                            aria-describedby={errors.message ? 'message-error' : undefined} 
                            />
                        {errors.message && (
                            <Tooltip 
                                message={errors.message} 
                                id="message-error"
                                responsivePosition={{ desktop: 'bottom', mobile: 'top' }}
                                type='alert'
                            />
                        )}
                        </div>
                    </div>
                </div>
                <div 
                className="modalSupport__dropZone"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleDropzoneClick}
                style={{ 
                    borderColor: isDragging ? 'rgba(0, 153, 254, 1)' : 'rgba(224, 224, 224, 1)',
                    backgroundColor: isDragging ? 'rgba(0, 153, 254, 0.1)' : 'transparent'
                }}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="modalSupport__dropZone__icon">
                        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 1C2.17155 1 1.5 1.67158 1.5 2.5V3H0.5V2.5C0.5 1.11929 1.61929 0 3 0C4.3807 0 5.5 1.11929 5.5 2.5V8C5.5 9.3807 4.3807 10.5 3 10.5C1.61929 10.5 0.5 9.3807 0.5 8V5.75C0.5 4.7835 1.2835 4 2.25 4C3.2165 4 4 4.7835 4 5.75V7H3V5.75C3 5.3358 2.6642 5 2.25 5C1.83579 5 1.5 5.3358 1.5 5.75V8C1.5 8.82845 2.17155 9.5 3 9.5C3.82845 9.5 4.5 8.82845 4.5 8V2.5C4.5 1.67158 3.82845 1 3 1Z" fill="#666666"/>
                        </svg>
                    </span>
                    <span className="modalSupport__dropZone__span">Select or drop files from your device</span>
                    {files.length > 0 && (
                        <div className="modalSupport__files" onClick={(e) => e.stopPropagation()}>
                            {files.map((file, index) => (
                                <div key={index} className="modalSupport__file">
                                    <span className="modalSupport__file__name">{file.name}</span>
                                    <button 
                                        className="modalSupport__file__remove"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modalSupport__bottom">
                    <button className="modalSupport__button" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send'}</button>
                </div>
            </form>
        </div>
    );
}
