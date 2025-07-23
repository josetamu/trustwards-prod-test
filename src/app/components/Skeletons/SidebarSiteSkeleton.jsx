export const SidebarSiteSkeleton = ({isSidebarOpen}) => {
    return (
        <>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''}`}>
                <div className="user__avatar-skeleton"></div>
                <div className="user__name-skeleton"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''}`}>
                <div className="user__avatar-skeleton"></div>
                <div className="user__name-skeleton"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''}`}>
                <div className="user__avatar-skeleton"></div>
                <div className="user__name-skeleton"></div>
            </div>
            <div className={`sidebar-skeleton ${isSidebarOpen ? 'sidebar-skeleton--open' : ''}`}>
                <div className="user__avatar-skeleton"></div>
                <div className="user__name-skeleton"></div>
            </div>
        </>
    )
}
export default SidebarSiteSkeleton;