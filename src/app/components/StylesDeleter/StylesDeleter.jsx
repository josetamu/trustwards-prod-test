import './StylesDeleter.css';

import React from 'react';

export const StylesDeleter = (applyGlobalCSSChange, applyGlobalJSONChange) => {
    return (
        <div className="tw-builder__settings-deleter">
                <div className="tw-builder__settings-deleter-point"></div>
                <span className="tw-builder__settings-deleter-cross">X</span>
        </div>
    )
}