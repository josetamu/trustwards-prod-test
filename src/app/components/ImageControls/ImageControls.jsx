import BuilderControl from '@components/BuilderControl/BuilderControl';
import { LayoutControl, SpacingControl, SizeControl, BackgroundControl, TextControl, StylesControl } from '../ControlComponents/ControlComponents';

function ImageControls({selectedId}) {
    const controls = [
        {
            label: 'Layout',
            control: <LayoutControl />,
        },
        {
            label: 'Spacing',
            control: <SpacingControl />,
        },
        {
            label: 'Size',
            control: <SizeControl />,
        },
        {
            label: 'Background',
            control: <BackgroundControl />,
        },
        {
            label: 'Text',
            control: <TextControl />,
        },
        {
            label: 'Styles',
            control: <StylesControl />,
        },
    ]
    return (
        <div className="tw-builder__settings">
            <div className="tw-builder__settings-header">
                <div className="tw-builder__settings-classes">
                    <span className="tw-builder__settings-id">#{selectedId}</span>
                </div>
            </div>
            <div className="tw-builder__settings-body">
                {controls.map((control) => (
                    <BuilderControl
                        key={control.label}
                        label={control.label}
                        control={control.control}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageControls;