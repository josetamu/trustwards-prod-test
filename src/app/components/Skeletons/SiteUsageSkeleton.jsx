import './Skeletons.css';


export const SiteUsageSkeleton = () => {
    return (
        <div className="siteUsageSkeleton skeleton-animate-pulse">
            <div className="siteUsageSkeleton__header">
                <span className="siteUsageSkeleton__title"></span>
                <span className="siteUsageSkeleton__button"></span>
            </div>
            <div className="siteUsageSkeleton__content">
                <div className="siteUsageSkeleton__content-header">
                    <span className="siteUsageSkeleton__subtitle"></span>
                    <span className="siteUsageSkeleton__subtitle"></span>
                </div>
                <div className="siteUsageSkeleton__usage">
                    <span className="siteUsageSkeleton__item"></span>
                    <span className="siteUsageSkeleton__item"></span>
                    <span className="siteUsageSkeleton__item"></span>
                </div>
                <div className="siteUsageSkeleton__footer"></div>
            </div>
        </div>
    )
}