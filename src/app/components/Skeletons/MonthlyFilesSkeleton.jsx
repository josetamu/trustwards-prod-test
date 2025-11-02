import './Skeletons.css';

export const MonthlyFilesSkeleton = () => {
    return (
        <div className="monthly-files-skeleton">
            <div className="monthly-files-skeleton__wrapper">
                <div className="monthly-files-skeleton__label"></div>
                <div className="monthly-files-skeleton__count"></div>
            </div>
            <div className="monthly-files-skeleton__bar">
                <div className="monthly-files-skeleton__bar-fill"></div>
            </div>
        </div>
    )
}
export default MonthlyFilesSkeleton;