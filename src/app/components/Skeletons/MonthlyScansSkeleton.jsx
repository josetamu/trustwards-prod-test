import './Skeletons.css';

export const MonthlyScansSkeleton = () => {
    return (
        <div className="monthlyScansSkeleton skeleton-animate-pulse">
            <div className="monthlyScansSkeleton__item"></div>
            <div className="monthlyScansSkeleton__item"></div>
        </div>
    )
}