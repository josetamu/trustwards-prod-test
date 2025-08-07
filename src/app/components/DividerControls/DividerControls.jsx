import './DividerControls.css';
import { DividerMainControl, StylesControl } from '@components/ControlComponents/ControlComponents';
import BuilderControl from '@components/BuilderControl/BuilderControl';


//Determine the controls used for the divider. controls are got from the ControlComponents component
const controls = [
    {
        label: 'Divider',
        control: <DividerMainControl />,
    },
    {
        label: 'Style',
        control: <StylesControl />,
    },

];

function DividerControls({selectedId}) {
    return (
        <div className="tw-builder__settings">
             <div className="tw-builder__settings-header">
                <div className="tw-builder__settings-classes">
                    <span className="tw-builder__settings-id">#{selectedId}</span>
                </div>
            </div>
            <div className="tw-builder__settings-body">
                {/* Map the controls */}
                {controls.map((control, index) => (
                    <BuilderControl key={index} label={control.label} control={control.control} />
                ))}
            </div>
        </div>
    )
}

export default DividerControls;