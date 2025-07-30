import './builderBody.css'

import { CanvasProvider } from '@contexts/CanvasContext';
import { Toolbar } from './Toolbar/Toolbar';
import { Canvas } from './Canvas/Canvas';

function BuilderBody() {
    return (
        <div className="tw-builder__body">
            <div className="tw-builder__header">
                <span>Untitled</span>
            </div>

            <CanvasProvider>
                <Canvas/>
                <Toolbar/>
            </CanvasProvider>
        </div>
    )
}

export default BuilderBody;