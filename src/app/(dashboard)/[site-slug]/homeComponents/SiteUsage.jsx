import { useDashboard } from '@dashboard/layout';
import { SiteUsageSkeleton } from '@components/Skeletons/SiteUsageSkeleton';


export const SiteUsage = ({ siteSlug, setModalType, setIsModalOpen, noInstalled }) => {
    const {allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <SiteUsageSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null; 

    const site = webs.find(web => web.id === siteSlug);
    const isInstalled = site?.Verified;

   
//variables for the usages
const usages = [
    {
        title: 'Pages',
        current: 6,
        total: 12,
        percentage: 6 / 12,
    },
    {
        title: 'Monthly scans',
        current: 2,
        total: 3,
        percentage: 2 / 3,
    },
    
    {
        title: 'Monthly Visitors',
        current: 217,
        total: 1000,
        percentage: 217 / 1000,
    },
]

    return (
        <div className="home__info-card">
        <div className="home__info-card-header">
            <span className="home__info-card-title">Site Usage</span>
            <span className="home__info-card-plan" onClick={() => {
                setModalType('Plan');
                setIsModalOpen(true);
            }}>{site?.Plan || 'Free'}</span>
        </div>
        {noInstalled()}
        <div className="home__info-card-content">
            {(site?.Plan === 'Free' || !site?.Plan) && (
            <div className="home__info-card-upgrade">
                <span className="home__info-card-enjoy">Enjoy unlimited usage. <span className="home__info-card-enjoy--upgrade" onClick={() => {
                    setModalType('Plan');
                    setIsModalOpen(true);
                }}>Upgrade</span> this site to pro</span>
            </div>
            )}
            <div className="home__usages">
                <div className="home__usage">
                    <div className="home__usage-header">
                        <span className="home__usage-title">Pages</span>
                        <span className="home__usage-value">{usages[0].current}/{usages[0].total}</span>
                    </div>
                    <div className="home__pages-bar">
                        <div className="home__pages-bar-fill"></div>
                        <div className="home__pages-bar-fill--color" style={{width: `${usages[0].percentage * 100}%`}}></div>
                    </div>
                </div>
                <div className="home__usage">
                <div className="home__usage-header">
                        <span className="home__usage-title">Monthly scans</span>
                        <span className="home__usage-value">{usages[1].current}/{usages[1].total}</span>
                    </div>
                    <div className="home__pages-bar">
                        <div className="home__pages-bar-fill"></div>
                        <div className="home__pages-bar-fill--color" style={{width: `${usages[1].percentage * 100}%`}}></div>
                    </div>
                </div>
                <div className="home__usage">
                    <div className="home__usage-header">
                            <span className="home__usage-title">Monthly Visitors</span>
                            <span className="home__usage-value">{usages[2].current}/{usages[2].total}</span>
                    </div>
                    <div className="home__pages-bar">
                        <div className="home__pages-bar-fill"></div>
                        <div className="home__pages-bar-fill--color" style={{width: `${usages[2].percentage * 100}%`}}></div>
                    </div>
                </div>
            </div>
            {(site?.Plan === 'Free' || !site?.Plan) && (
                <div className="home__button-upgrade">
                    <span className="home__button-upgrade-text" onClick={() => {
                        setModalType('Plan');
                        setIsModalOpen(true);
                    }}>Upgrade</span>
                </div>
            )}
        </div>
    </div>
    )
}