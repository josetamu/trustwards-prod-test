import './NewSite.css';
import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';

export function NewSite({openChangeModal, showNotification, setIsModalOpen, setModalType}) {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <PlanSkeleton />;

    const {webs, user} = allUserDataResource.read();
    

    return (
        <div 
            className="new-site__button" 
            onClick={() => {
                if(user.Plan === 'Free' && webs.length >= 3) {
                    showNotification('You have reached the maximum number of sites for your plan.', 'top', false);
                    setIsModalOpen(true);
                    setModalType('Billing');
                } else {
                    openChangeModal('newsite');
                }
            }}
            aria-label="Create new site"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if(user.Plan === 'Free' && webs.length >= 3) {
                        showNotification('You have reached the maximum number of sites for your plan.', 'top', false);
                        setIsModalOpen(true);
                        setModalType('Billing');
                    } else {
                        openChangeModal('newsite');
                    }
                }
            }}
        >
            New
        </div>
    )
}

