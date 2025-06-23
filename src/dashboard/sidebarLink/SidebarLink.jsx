import { useId } from 'react';


// SidebarLink component
export const SidebarLink = ({ icon, text, onClick, className, children}) => {
    const sidebarLinkId = useId();      
    return (
        <a 
            className={` ${className || 'sidebar__link'}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            id={sidebarLinkId}
        >
            {icon && <span className={`${className}__icon`}>{icon}</span>}
            {text && <span className={`${className}__text`}>{text}</span>}
            {children}
        </a>
    );
};