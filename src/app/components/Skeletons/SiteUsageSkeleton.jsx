import './Skeletons.css';


export const SiteUsageSkeleton = () => {
    return (
        <div className="skeleton-site-usage skeleton-animate-pulse">
            <div className="skeleton-site-usage__header">
                <span className="skeleton-site-usage__title"></span>
                <span className="skeleton-site-usage__button"></span>
            </div>
            <div className="skeleton-site-usage__content">
                <div className="skeleton-site-usage__content-header">
                    <span className="skeleton-site-usage__subtitle"></span>
                    <span className="skeleton-site-usage__subtitle"></span>
                </div>
                <div className="skeleton-site-usage__usage">
                    <span className="skeleton-site-usage__item"></span>
                    <span className="skeleton-site-usage__item"></span>
                    <span className="skeleton-site-usage__item"></span>
                </div>
                <div className="skeleton-site-usage__footer"></div>
            </div>
        </div>
    )
}