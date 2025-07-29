import './NewSite.css';
import { useDashboard } from '../../dashboard/layout';
import PlanSkeleton from '../Skeletons/PlanSkeleton';

export function NewSite({openChangeModal, showNotification, setIsModalOpen, setModalType}) {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <PlanSkeleton />;

    const {webs, user} = allUserDataResource.read();
    

    return (
        <div className="newSite__button" onClick={() => {
            if(user.Plan === 'Free' && webs.length >= 3) {
                showNotification('You have reached the maximum number of sites for your plan.', 'top', false);
                setIsModalOpen(true);
                setModalType('Plan');
            } else {
                openChangeModal('newsite');
            }
        }}>
            New
        </div>
    )
}

