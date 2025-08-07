import './DividerControls.css';
import { DividerMainControl, StylesControl } from '@components/ControlComponents/ControlComponents';
import BuilderControl from '@components/BuilderControl/BuilderControl';



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
function DividerControls() {
    return (
            <div className="tw-builder__settings-body">
                {controls.map((control, index) => (
                    <BuilderControl key={index} label={control.label} control={control.control} />
                ))}
            </div>
    )
}

export default DividerControls;