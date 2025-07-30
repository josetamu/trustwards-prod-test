import './Skeletons.css';


export const ComplyHealthSkeleton = () => {
    return (
        <div className="skeleton-comply-health skeleton-animate-pulse">
            <div className="skeleton-comply-health__header">
                <span className="skeleton-comply-health__title"></span>
            </div>
            <div className="skeleton-comply-health__content">
                <div className="skeleton-comply-health__circle"></div>
                <span className="skeleton-comply-health__item"></span>
                <span className="skeleton-comply-health__item"></span>
                <span className="skeleton-comply-health__item"></span>
                <span className="skeleton-comply-health__item"></span>
                <span className="skeleton-comply-health__item"></span>
                <span className="skeleton-comply-health__item"></span>
            </div>
        </div>
    )
}