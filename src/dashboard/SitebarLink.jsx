// SidebarLink component
export const SidebarLink = ({ icon, text, onClick, className, children }) => {
    return (
        <a 
            className={` ${className || 'sidebar__link'}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            {icon && <span>{icon}</span>}
            {text && <span>{text}</span>}
            {children}
        </a>
    );
};