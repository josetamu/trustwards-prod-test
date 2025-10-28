import './StylesDeleter.css';

import React, { useCallback } from 'react';
//This component is used to delete the styles of the selected element.(Point with ancent color)
export const StylesDeleter = ({ applyGlobalCSSChange, applyGlobalJSONChange, getGlobalCSSValue, getGlobalJSONValue, value, cssProperty, JSONProperty, cssPropertyGroup, jsonEmptyValue, cssDeleteBatch, onDelete, defaultValue, notDelete, isPlaceholder}) => {
    

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
    if (notDelete || isPlaceholder) return;
    //If jsonProperty is set, apply the empty marker to it
    if (JSONProperty && applyGlobalJSONChange) applyGlobalJSONChange(JSONProperty, effectiveEmptyMarker);

    //If cssDeleteBatch is set, apply the cssDeleteBatch to the cssProperty and call onDelete. This is used for the border width, radius, etc. Because they have multiple properties.(border-width, border-radius, border-top-width, border-top-radius, etc.)
    if (cssDeleteBatch && applyGlobalCSSChange) {
        applyGlobalCSSChange(cssDeleteBatch);
        onDelete?.();
        return;
    }

    // Single property: call prop, val so it works even if the handler doesn't support batch
    if (cssProperty && !cssPropertyGroup && applyGlobalCSSChange) {
        applyGlobalCSSChange(cssProperty, defaultValue || '');
        onDelete?.();
        return;
    }

    // Group or mixed: build a batch
    const batch = {};
    if (cssPropertyGroup) {
        batch[cssPropertyGroup] = '';
        ['top','right','bottom','left'].forEach(side => {
            batch[`${cssPropertyGroup}-${side}`] = '';
        });
    }
    if (cssProperty) {
        batch[cssProperty] = defaultValue || '';
    }

    if (Object.keys(batch).length && applyGlobalCSSChange) {
        applyGlobalCSSChange(batch);
    }
    onDelete?.();
}, [JSONProperty, cssProperty, cssPropertyGroup, applyGlobalCSSChange, applyGlobalJSONChange, effectiveEmptyMarker, cssDeleteBatch, onDelete, defaultValue, notDelete, isPlaceholder]);

    // Determine the class: if it's a placeholder, show as placeholder style
    const deleterClass = isPlaceholder 
        ? 'tw-builder__settings-deleter--placeholder' 
        : (hasValue && jsonRaw !== effectiveEmptyMarker ? 'tw-builder__settings-deleter--active' : '');

    return (
        <div 
        className={`tw-builder__settings-deleter ${deleterClass}`}

        onClick={handleDelete}>
                <div className='tw-builder__settings-deleter-point' onClick={handleDelete}
                        tabIndex={0}
                        role="button"
                        aria-label="Delete style"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleDelete();
                            }
                        }}>

                </div>
                <span className={`tw-builder__settings-deleter-cross ${notDelete || isPlaceholder ? 'tw-builder__settings-deleter-cross--not-delete' : ''}`} onClick={handleDelete}>X</span>
        </div>
    )
}