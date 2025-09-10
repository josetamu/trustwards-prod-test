import './StylesDeleter.css';

import React, { useCallback } from 'react';
//This component is used to delete the styles of the selected element.(Point with ancent color)
export const StylesDeleter = ({ applyGlobalCSSChange, applyGlobalJSONChange, getGlobalCSSValue, getGlobalJSONValue, value, cssProperty, JSONProperty, cssPropertyGroup, jsonEmptyValue, checkProps = [], cssDeleteBatch, onDelete, defaultValue}) => {
    //Check if the control has any group side(padding, margin, etc.)
    const hasAnyGroupSide = cssPropertyGroup
        ? (Boolean(getGlobalCSSValue?.(cssPropertyGroup)) ||
           ['top','right','bottom','left'].some(side => {
                const v = getGlobalCSSValue?.(`${cssPropertyGroup}-${side}`);
                return typeof v === 'string' ? v.trim() !== '' : Boolean(v);
            }))
        : false;

    //Store the json value
    const jsonRaw = JSONProperty ? getGlobalJSONValue?.(JSONProperty) : null;
    //Use jsonEmptyValue if it is a string, otherwise use empty string
    const effectiveEmptyMarker = (typeof jsonEmptyValue === 'string' ? jsonEmptyValue : '');
    //If the json value is the same as the empty marker, set it to empty string. This is used for the json defaults like 'New Text 2' or the source of an empty image.
    const jsonAsEmpty = (jsonRaw === effectiveEmptyMarker) ? '' : jsonRaw;


    //Check if the control has any value. This is used to show the delete button.
    //The values can be: a direct value, the cssProperty, the jsonProperty, or the group we checked in hasAnyGroupSide.
    const hasValue = (() => {
        const hasDirectValue = (typeof value === 'string') ? value.trim() !== '' : Boolean(value);
        const hasCSS = cssProperty ? Boolean(getGlobalCSSValue?.(cssProperty)) : false;
        const hasJSON = JSONProperty ? (typeof jsonAsEmpty === 'string' ? jsonAsEmpty.trim() !== '' : Boolean(jsonAsEmpty)) : false;
        return hasDirectValue || hasCSS || hasJSON || hasAnyGroupSide;
    })();

    //Function to delete the styles
    const handleDelete = useCallback(() => {
        //If jsonProperty is set, apply the empty marker to it
        if (JSONProperty && applyGlobalJSONChange) applyGlobalJSONChange(JSONProperty, effectiveEmptyMarker);

        //If cssDeleteBatch is set, apply the cssDeleteBatch to the cssProperty and call onDelete. This is used for the border width, radius, etc. Because they have multiple properties.(border-width, border-radius, border-top-width, border-top-radius, etc.)
        if (cssDeleteBatch && applyGlobalCSSChange) {
            applyGlobalCSSChange(cssDeleteBatch);
            onDelete?.();
            return;
        }

        //Permit restore the default value if defaultValue is set,if not just set the cssProperty to empty string.
        const batch = {};
        if (cssProperty) batch[cssProperty] = defaultValue || '';
        if (cssPropertyGroup) {
            batch[cssPropertyGroup] = '';
            ['top','right','bottom','left'].forEach(side => {
                batch[`${cssPropertyGroup}-${side}`] = '';
            });
        }
        if (Object.keys(batch).length && applyGlobalCSSChange) {
            applyGlobalCSSChange(batch);
        }
        onDelete?.();
    }, [JSONProperty, cssProperty, cssPropertyGroup, applyGlobalCSSChange, applyGlobalJSONChange, effectiveEmptyMarker, cssDeleteBatch, onDelete]);

    return (
        <div className={`tw-builder__settings-deleter ${hasValue ? 'tw-builder__settings-deleter--active' : ''}`}>
                <div className='tw-builder__settings-deleter-point' onClick={handleDelete}></div>
                <span className="tw-builder__settings-deleter-cross" onClick={handleDelete}>X</span>
        </div>
    )
}