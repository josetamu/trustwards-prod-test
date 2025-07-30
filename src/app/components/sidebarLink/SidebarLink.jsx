import { useId } from 'react';
import './SidebarLink.css';

// SidebarLink component
export const SidebarLink = ({ icon, text, onClick, className, children}) => {
    const sidebarLinkId = useId();      
    return (
        <a 
            className={`${className || 'sidebar__link'}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            id={sidebarLinkId}
        >
            {icon && <span className={className ? `${className}__icon` : 'sidebar__link-icon'}>{icon}</span>}
            {text && <span className={className ? `${className}__text` : 'sidebar__link-text'}>{text}</span>}
            {children}
        </a>
    );
};