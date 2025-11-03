import './SidebarLink.css';

// SidebarLink component
export const SidebarLink = ({ icon, text, onClick, className, children}) => {
    return (
        <a 
            className={`${className || 'sidebar__link'}`}
            onClick={onClick}
            aria-label={text}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick && onClick();
                }
            }}
        >
            {icon && <span className={className ? `${className}__icon` : 'sidebar__link-icon'}>{icon}</span>}
            {text && <span className={className ? `${className}__text` : 'sidebar__link-text'}>{text}</span>}
            {children}
        </a>
    );
};