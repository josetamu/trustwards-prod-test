import './DividerControls.css';
import { DividerControl } from '@components/ControlComponents/ControlComponents';

function DividerControls({selectedId}) {
    return (
        <div className="tw-builder__settings">
            <div className="tw-builder__settings-body">
                <div className="tw-builder__control-header">
                    <span className="tw-builder__control-label">Divider</span>
                </div>
                <div className="tw-builder__control-content">
                    <DividerControl />
                </div>
            </div>
        </div>
    )
}

export default DividerControls;