import './Skeletons.css';


export const SidebarSiteSkeleton = ({isSidebarOpen}) => {
    return (
        <>
            <div className={`skeleton-sidebar ${isSidebarOpen ? 'skeleton-sidebar--open' : ''} skeleton-animate-pulse`}>
                <div className="skeleton-sidebar__avatar"></div>
                <div className="skeleton-sidebar__name"></div>
            </div>
            <div className={`skeleton-sidebar ${isSidebarOpen ? 'skeleton-sidebar--open' : ''} skeleton-animate-pulse`}>
                <div className="skeleton-sidebar__avatar"></div>
                <div className="skeleton-sidebar__name"></div>
            </div>
            <div className={`skeleton-sidebar ${isSidebarOpen ? 'skeleton-sidebar--open' : ''} skeleton-animate-pulse`}>
                <div className="skeleton-sidebar__avatar"></div>
                <div className="skeleton-sidebar__name"></div>
            </div>
            <div className={`skeleton-sidebar ${isSidebarOpen ? 'skeleton-sidebar--open' : ''} skeleton-animate-pulse`}>
                <div className="skeleton-sidebar__avatar"></div>
                <div className="skeleton-sidebar__name"></div>
            </div>
        </>
    )
}
export default SidebarSiteSkeleton;