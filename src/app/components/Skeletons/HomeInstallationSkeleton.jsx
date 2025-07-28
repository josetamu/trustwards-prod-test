import './Skeletons.css';

export const HomeInstallationSkeleton = () => {
    return (

        <div className='installationSkeleton__container skeleton-animate-pulse'>
            <div className='installationSkeleton__header'>
                <span className='installationSkeleton__title'></span>
                <span className='installationSkeleton__button'></span>
            </div>
            <div className='installationSkeleton__subtitle'></div>
            <div className='installationSkeleton__script'></div>
            <div className='installationSkeleton__divider'></div>
            <div className='installationSkeleton__footer'>
                <span className='installationSkeleton__card'></span>
                <span className='installationSkeleton__card'></span>
            </div>
        </div>

    );
}