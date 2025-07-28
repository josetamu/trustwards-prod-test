import './Skeletons.css';


export const SidebarSiteSkeleton = ({isSidebarOpen}) => {
    return (
        <>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''} skeleton-animate-pulse`}>
                <div className="sidebar-skeleton__avatar"></div>
                <div className="sidebar-skeleton__name"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''} skeleton-animate-pulse`}>
                <div className="sidebar-skeleton__avatar"></div>
                <div className="sidebar-skeleton__name"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''} skeleton-animate-pulse`}>
                <div className="sidebar-skeleton__avatar"></div>
                <div className="sidebar-skeleton__name"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''} skeleton-animate-pulse`}>
                <div className="sidebar-skeleton__avatar"></div>
                <div className="sidebar-skeleton__name"></div>
            </div>
        </>
    )
}
export default SidebarSiteSkeleton;