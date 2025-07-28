import './Skeletons.css';


export const ComplyHealthSkeleton = () => {
    return (
        <div className="complyHealthSkeleton">
            <div className="complyHealthSkeleton__header">
                <span className="complyHealthSkeleton__title"></span>
            </div>
            <div className="complyHealthSkeleton__content">
                <div className="complyHealthSkeleton__circle"></div>
                <span className="complyHealthSkeleton__item"></span>
                <span className="complyHealthSkeleton__item"></span>
                <span className="complyHealthSkeleton__item"></span>
                <span className="complyHealthSkeleton__item"></span>
                <span className="complyHealthSkeleton__item"></span>
                <span className="complyHealthSkeleton__item"></span>
            </div>
        </div>
    )
}