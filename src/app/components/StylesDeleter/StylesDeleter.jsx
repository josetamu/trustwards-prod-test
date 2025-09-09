import './StylesDeleter.css';

import React, { useCallback } from 'react';

export const StylesDeleter = ({ applyGlobalCSSChange, applyGlobalJSONChange, getGlobalCSSValue, getGlobalJSONValue, value, cssProperty, JSONProperty, cssPropertyGroup, jsonEmptyValue, checkProps = [], cssDeleteBatch }) => {
    const hasAnyGroupSide = cssPropertyGroup
        ? (Boolean(getGlobalCSSValue?.(cssPropertyGroup)) ||
           ['top','right','bottom','left'].some(side => {
                const v = getGlobalCSSValue?.(`${cssPropertyGroup}-${side}`);
                return typeof v === 'string' ? v.trim() !== '' : Boolean(v);
            }))
        : false;

    const jsonRaw = JSONProperty ? getGlobalJSONValue?.(JSONProperty) : null;
    const effectiveEmptyMarker = (typeof jsonEmptyValue === 'string' ? jsonEmptyValue : '');
    const jsonAsEmpty = (jsonRaw === effectiveEmptyMarker) ? '' : jsonRaw;

    const hasAnyFromList = checkProps.length
        ? checkProps.some(p => {
            const v = getGlobalCSSValue?.(p);
            return typeof v === 'string' ? v.trim() !== '' : Boolean(v);
        })
        : false;

    const hasValue = (() => {
        const hasDirectValue = (typeof value === 'string') ? value.trim() !== '' : Boolean(value);
        const hasCSS = cssProperty ? Boolean(getGlobalCSSValue?.(cssProperty)) : false;
        const hasJSON = JSONProperty ? (typeof jsonAsEmpty === 'string' ? jsonAsEmpty.trim() !== '' : Boolean(jsonAsEmpty)) : false;
        return hasDirectValue || hasCSS || hasJSON || hasAnyGroupSide || hasAnyFromList;
    })();

    const handleDelete = useCallback(() => {
        if (JSONProperty && applyGlobalJSONChange) applyGlobalJSONChange(JSONProperty, effectiveEmptyMarker);

        if (cssDeleteBatch && applyGlobalCSSChange) {
            applyGlobalCSSChange(cssDeleteBatch);
            return;
        }

        const batch = {};
        if (cssProperty) batch[cssProperty] = '';
        if (cssPropertyGroup) {
            batch[cssPropertyGroup] = '';
            ['top','right','bottom','left'].forEach(side => {
                batch[`${cssPropertyGroup}-${side}`] = '';
            });
        }
        if (Object.keys(batch).length && applyGlobalCSSChange) {
            applyGlobalCSSChange(batch);
        }
    }, [JSONProperty, cssProperty, cssPropertyGroup, applyGlobalCSSChange, applyGlobalJSONChange, effectiveEmptyMarker, cssDeleteBatch]);

    return (
        <div className={`tw-builder__settings-deleter ${hasValue ? 'tw-builder__settings-deleter--active' : ''}`}>
                <div className='tw-builder__settings-deleter-point' onClick={handleDelete}></div>
                <span className="tw-builder__settings-deleter-cross" onClick={handleDelete}>X</span>
        </div>
    )
}