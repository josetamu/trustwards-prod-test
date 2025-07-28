export const ScannerOverviewSkeleton = () => {
    return (
        <div className="scannerOverviewSkeleton">
            <div className="scannerOverviewSkeleton__header">
                <span className="scannerOverviewSkeleton__title"></span>
                <span className="scannerOverviewSkeleton__button"></span>
            </div>
            <div className="scannerOverviewSkeleton__content">
                <span className="scannerOverviewSkeleton__item"></span>
                <span className="scannerOverviewSkeleton__item"></span>
                <span className="scannerOverviewSkeleton__item"></span>
                <span className="scannerOverviewSkeleton__item"></span>
            </div>
            <div className="scannerOverviewSkeleton__footer">
                <span className="scannerOverviewSkeleton__scanner"></span>
            </div>
        </div>
    )
}