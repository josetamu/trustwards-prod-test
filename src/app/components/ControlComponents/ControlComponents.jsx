
export const DisplayControl = () => (
    <>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Direction</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Align</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Justify</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Wrap</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Gap</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    </>
);

export const SpacingControl = () => (
    <>
    <div className="tw-builder__settings-tag tw-builder__settings-tag--column">
        <span className="tw-builder__settings-subtitle">Margin</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    <div className="tw-builder__settings-tag tw-builder__settings-tag--column">
        <span className="tw-builder__settings-subtitle">Padding</span>
        <div className="tw-builder__settings-select-container">
            <select className="tw-builder__settings-select">
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
            </select>
        </div>
    </div>
    </>
);

export const SizeControl = () => (
    <>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Width</span>
        <input type="text" />
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Max. width</span>
        <input type="text" />
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Height</span>
        <input type="text"/>
    </div>
    <div className="tw-builder__settings-tag">
        <span className="tw-builder__settings-subtitle">Max. height</span>
        <input type="text" />
    </div>
    </>
);

export const BackgroundControl = () => (
    <div>
        <label>Background Color:</label>
        <input type="color" />
        <label>Background Image:</label>
        <input type="url" placeholder="URL..." />
    </div>
);

export const TextControl = () => (
    <div>
        <label>Font Size:</label>
        <input type="number" placeholder="16" />
        <label>Font Weight:</label>
        <select>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
        </select>
    </div>
);

export const StylesControl = () => (
    <div>
        <label>Border Radius:</label>
        <input type="number" placeholder="0" />
        <label>Box Shadow:</label>
        <input type="text" placeholder="0 2px 4px rgba(0,0,0,0.1)" />
    </div>
);