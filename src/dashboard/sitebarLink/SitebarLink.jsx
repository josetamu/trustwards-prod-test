import { useId } from 'react';

// SidebarLink component
export const SidebarLink = ({ icon, text, onClick, className, children }) => {
    const sidebarLinkId = useId();      
    return (
        <a 
            className={` ${className || 'sidebar__link'}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            id={sidebarLinkId}
        >
            {icon && <span>{icon}</span>}
            {text && <span>{text}</span>}
            {children}
        </a>
    );
};