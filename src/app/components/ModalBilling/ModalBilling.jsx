import './ModalBilling.css';

import { Tooltip } from '@components/tooltip/Tooltip';

import { useState } from 'react';
const ModalBilling = ({ userPlan }) => {
    const [yearly, setYearly] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    
    const plan = userPlan || 'Free';
    
    return (
        <div className="modal-billing">
            <div className="modal-billing__header">
                <span className="modal-billing__header-title">Billing</span>
            </div>
        </div>
    )
}
export default ModalBilling;
