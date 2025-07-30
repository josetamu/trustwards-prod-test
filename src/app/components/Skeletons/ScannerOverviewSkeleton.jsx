export const ScannerOverviewSkeleton = () => {
    return (
        <div className="skeleton-scanner-overview skeleton-animate-pulse">
            <div className="skeleton-scanner-overview__header">
                <span className="skeleton-scanner-overview__title"></span>
                <span className="skeleton-scanner-overview__button"></span>
            </div>
            <div className="skeleton-scanner-overview__content">
                <span className="skeleton-scanner-overview__item"></span>
                <span className="skeleton-scanner-overview__item"></span>
                <span className="skeleton-scanner-overview__item"></span>
                <span className="skeleton-scanner-overview__item"></span>
            </div>
            <div className="skeleton-scanner-overview__footer">
                <span className="skeleton-scanner-overview__scanner"></span>
            </div>
        </div>
    )
}