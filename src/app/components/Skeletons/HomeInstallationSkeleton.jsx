import './Skeletons.css';

export const HomeInstallationSkeleton = () => {
    return (
        <div className='skeleton-installation skeleton-animate-pulse'>
            <div className='skeleton-installation__script'>
            </div>
            <div className='skeleton-installation__builder'></div>
        </div>
    );
}