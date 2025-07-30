import './Skeletons.css';


export const AnalyticsSkeleton = () => {
    return (
        <div className="skeleton-analytics skeleton-animate-pulse">
            <div className="skeleton-analytics__header">
                <span className="skeleton-analytics__title"></span>
            </div>
            <div className="skeleton-analytics__content">
                <div className="skeleton-analytics__analytics">
                <div className="skeleton-analytics__circle"></div>
                </div>
                <div className="skeleton-analytics__cookies">
                    <span className="skeleton-analytics__item"></span>
                    <span className="skeleton-analytics__item"></span>
                    <span className="skeleton-analytics__item"></span>
                    <span className="skeleton-analytics__item"></span>
                </div>
            </div>
        </div>

    )
}   