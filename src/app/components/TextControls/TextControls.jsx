function TextControls({selectedId}) {
    return (
        <div className="tw-builder__settings">
            <div className="tw-builder__settings-header">
                <span className="tw-builder__settings-id">{selectedId}</span>
                <div className="tw-builder__settings-tag">
                    <span className="tw-builder__settings-subtitle">Tag</span>
                    <select className="tw-builder__settings-select">
                        <option className="tw-builder__right-settings__option" value="h1">H1</option>
                        <option className="tw-builder__right-settings__option" value="h2">H2</option>
                        <option className="tw-builder__right-settings__option" value="h3">H3</option>
                        <option className="tw-builder__right-settings__option" value="h4">H4</option>
                        <option className="tw-builder__right-settings__option" value="h5">H5</option>
                        <option className="tw-builder__right-settings__option" value="h6">H6</option>
                    </select>
                </div>
                <div className="tw-builder__settings-link">
                    <span className="tw-builder__settings-subtitle">Link to</span>
                    <input type="text" className="tw-builder__settings-input" placeholder="URL..." />
                </div>
            </div>
        </div>
    )
}

export default TextControls;    