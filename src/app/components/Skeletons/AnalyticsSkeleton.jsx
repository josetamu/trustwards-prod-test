import './Skeletons.css';


export const AnalyticsSkeleton = () => {
    return (
        <div className="analyticsSkeleton skeleton-animate-pulse">
            <div className="analyticsSkeleton__header">
                <span className="analyticsSkeleton__title"></span>
            </div>
            <div className="analyticsSkeleton__content">
                <div className="analyticsSkeleton__analytics">
                <div className="analyticsSkeleton__circle"></div>
                </div>
                <div className="analyticsSkeleton__cookies">
                    <span className="analyticsSkeleton__item"></span>
                    <span className="analyticsSkeleton__item"></span>
                    <span className="analyticsSkeleton__item"></span>
                    <span className="analyticsSkeleton__item"></span>
                </div>
            </div>
        </div>

    )
}   