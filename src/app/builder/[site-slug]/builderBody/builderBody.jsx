import './builderBody.css'

function BuilderBody() {
    return (
        <div className="tw-builder__body">
            <div className="tw-builder__header">
                <span>Untitled</span>
            </div>
            <div className="tw-builder__canvas"></div>
            <div className="tw-builder__toolbar"></div>
        </div>
    )
}

export default BuilderBody;