import './NewSite.css';

export function NewSite({openChangeModal, user, webs, showNotification, setIsModalOpen, setModalType}) {
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

