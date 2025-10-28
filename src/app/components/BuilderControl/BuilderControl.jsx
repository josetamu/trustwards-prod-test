import { useState, useMemo, useCallback, useEffect } from 'react';
import './BuilderControl.css';
import {Tooltip} from '@components/tooltip/Tooltip';
import { StylesDeleter } from '@components/StylesDeleter/StylesDeleter';

// Component to render the control(label with + and -) Pass the label(title) and the control to render
export default function BuilderControl({label, controls, whatType, activeRoot, globalControlProps, setBwUnified, setBrUnified, styleDeleter, getEnterAnimationProps, clearAllEnterAnimations, required, checkRequired, allControls, getEnterAnimationPlaceholder}) 	{
	const [isOpen, setIsOpen] = useState(false);
	const [activeTooltip, setActiveTooltip] = useState(null);
	
	// State to track if this group should be shown based on required condition
	const [shouldShow, setShouldShow] = useState(() => {
		if (!required || !checkRequired) return true;
		return checkRequired(required);
	});

	//Get the global control props to know when a group of controls has a value and show the delete button.
	const applyGlobalCSSChange = globalControlProps?.applyGlobalCSSChange;
	const getGlobalCSSValue = globalControlProps?.getGlobalCSSValue;
	const applyGlobalJSONChange = globalControlProps?.applyGlobalJSONChange;
	const getGlobalJSONValue = globalControlProps?.getGlobalJSONValue;
	const selectedElementData = globalControlProps?.selectedElementData;
	const getPlaceholderValue = globalControlProps?.getPlaceholderValue;
	const applyMultipleGlobalJSONChanges = globalControlProps?.applyMultipleGlobalJSONChanges;

	//get the name of the active root to show in the tooltip
	const activeRootName = {
		'tw-root--banner': 'Banner',
		'tw-root--modal': 'Modal',
	}

	// Get the control name from required condition
	const getRequiredControlName = (required) => {
		if (!required) return null;
		if (typeof required === 'string') {
			return required.split('=')[0].trim();
		} else if (typeof required === 'object') {
			return required.control;
		}
		return null;
	};

	const requiredControlName = getRequiredControlName(required);

	// Find the control that this group depends on
	const dependentControl = useMemo(() => {
		if (!requiredControlName || !allControls) return null;
		return allControls.find(ctrl => ctrl?.name === requiredControlName);
	}, [requiredControlName, allControls]);

	// Get the current value of the dependent control
	const dependentJsonValue = dependentControl?.JSONProperty ? getGlobalJSONValue?.(dependentControl.JSONProperty) : null;
	const dependentAttrValue = dependentControl?.dataAttribute ? getGlobalJSONValue?.(`attributes.${dependentControl.dataAttribute}`) : null;
	const dependentCssValue = dependentControl?.cssProperty ? getGlobalCSSValue?.(dependentControl.cssProperty) : null;
	const elementId = selectedElementData?.id;

	// Listen to changes in the dependent control's value
	useEffect(() => {
		if (!required || !checkRequired) {
			setShouldShow(true);
			return;
		}

		// Re-evaluate the required condition
		const isConditionMet = checkRequired(required);
		setShouldShow(isConditionMet);
	}, [dependentJsonValue, dependentAttrValue, dependentCssValue, elementId, required, checkRequired]);

	//check if a value is non-empty
	const isNonEmpty = (v) => {
		if (v == null) return false;
		if (typeof v === 'string') return v.trim() !== '';
		return Boolean(v);
	};

		// Compute if any control has a value and prepare CSS/JSON 
		const { hasAnyValue, selectorBatches, jsonProps, hasDeletableValue, hasPlaceholderOnly} = useMemo(() => {
			// Return empty state if no controls are provided
			if (!Array.isArray(controls) || controls.length === 0) {
				return { hasAnyValue: false, selectorBatches: new Map(), jsonProps: new Set(), hasDeletableValue: false, hasPlaceholderOnly: false };
			}
	
			const batches = new Map(); // Map of selector -> { cssKey: '' }
			const jsonSet = new Set(); // Set of JSON properties 
			let hasAnyValue = false;  // Flag to track if any control has a value
			let foundAnyPlaceholder = false;
	
			// Function to ensure a batch exists for a selector
			const ensureBatchFor = (selector) => {
				if (!batches.has(selector)) batches.set(selector, {});
				return batches.get(selector);
			};
	
			//check if a css property has a value
			const hasCSS = (prop, selector) => {
				if (!getGlobalCSSValue || !prop) return false;
				const v = getGlobalCSSValue(prop, selector);
				return isNonEmpty(v);
			};
	
			//check if a group of css properties has a value
			const checkGroup = (group, selector) => {
				if (!group) return false;
				if (hasCSS(group, selector)) return true;
				return ['top','right','bottom','left'].some(side => hasCSS(`${group}-${side}`, selector));
			};
	
			//add a group of css properties to the batch
			const addGroupToBatch = (batch, group) => {
				batch[group] = '';
				['top','right','bottom','left'].forEach(side => {
					batch[`${group}-${side}`] = '';
				});
			};
	
			const borderKeys = [
				'border-width','border-top-width','border-right-width','border-bottom-width','border-left-width',
				'border-style','border-color','border-radius',
				'border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius'
			];

			// Function to check if a CSS property has a placeholder
			const hasCssPlaceholderValue = (prop, selector) => {
				if (!getPlaceholderValue || !prop) return false;
				const v = getPlaceholderValue(prop, selector ? { nestedSelector: selector } : {});
				return isNonEmpty(v);
			};

			// Function to check if a group has placeholders
			const hasGroupPlaceholder = (group, selector) => {
				if (!group) return false;
				if (hasCssPlaceholderValue(group, selector)) return true;
				return ['top','right','bottom','left'].some(side => hasCssPlaceholderValue(`${group}-${side}`, selector));
			};

			//iterate through the controls
			let hasDeletableValue = false; // if there is any value present that is deletable
			for (const ctrl of controls) {
				const selector = ctrl?.selector;
				const batch = ensureBatchFor(selector);

				// Special controls like enter-animation
				if (ctrl?.type === 'enter-animation') {
					if (getEnterAnimationProps) {
						const enterProps = getEnterAnimationProps() || {};
						const hasEnterProps = Object.keys(enterProps).length > 0;
						if (hasEnterProps) {
							hasAnyValue = true;
							hasDeletableValue = true;
						} else if (typeof getEnterAnimationPlaceholder === 'function') {
							const scope = activeRoot === 'tw-root--modal' ? 'modal' : 'banner';
							const placeholders = getEnterAnimationPlaceholder(scope) || {};
							const hasPairs = Object.keys(placeholders).length > 0;
							if (hasPairs) {
								// Solo mostrar punto gris si hay pares definidos
								foundAnyPlaceholder = true;
							}
						}
					}
					continue;
				}
			
							// JSON properties: count value, add to deletion only if notDelete is false
							if (ctrl?.JSONProperty) {
								if (getGlobalJSONValue) {
									const v = getGlobalJSONValue(ctrl.JSONProperty);
									const hasVal = isNonEmpty(v);
									if (hasVal) hasAnyValue = true;
									if (!ctrl?.notDelete && hasVal) hasDeletableValue = true;

									if (!hasVal && getPlaceholderValue) {
										const ph = getPlaceholderValue(ctrl.JSONProperty);
										if (isNonEmpty(ph)) foundAnyPlaceholder = true;
									  }
								}
								if (!ctrl?.notDelete) {
									jsonSet.add(ctrl.JSONProperty);
								}
							}
	
							
							//dataAttribute properties (stored under attributes.<name>)
							if (ctrl?.dataAttribute) {
								const attrKey = `attributes.${ctrl.dataAttribute}`;
								if (getGlobalJSONValue) {
									const v = getGlobalJSONValue(attrKey);
									const hasVal = isNonEmpty(v);
									if (hasVal) hasAnyValue = true;
									if (!ctrl?.notDelete && hasVal) hasDeletableValue = true;

									if (!hasVal && getPlaceholderValue) {
										const ph = getPlaceholderValue(attrKey);
										if (isNonEmpty(ph)) foundAnyPlaceholder = true;
									}
								}
								if (!ctrl?.notDelete) {
									jsonSet.add(attrKey);
								}
							}

							// CSS by group
							if (ctrl?.cssPropertyGroup) {
								const hasGroupVal = checkGroup(ctrl.cssPropertyGroup, selector);
								if (hasGroupVal) hasAnyValue = true;
								if (!ctrl?.notDelete) {
									addGroupToBatch(batch, ctrl.cssPropertyGroup);
									if (hasGroupVal) hasDeletableValue = true;
								}
								if (!hasGroupVal && hasGroupPlaceholder(ctrl.cssPropertyGroup, selector)) {
									foundAnyPlaceholder = true;
								  }
							}
							if(ctrl?.type === 'panel') {
								const hasPanelGroup = checkGroup(ctrl.cssProperty, selector);
								if (hasPanelGroup) hasAnyValue = true;
								if (!ctrl?.notDelete) {
									addGroupToBatch(batch, ctrl.cssProperty);
									if (hasPanelGroup) hasDeletableValue = true;
								}
								if (!hasPanelGroup && hasGroupPlaceholder(ctrl.cssProperty, selector)) {
									foundAnyPlaceholder = true;
								  }
							}
			
							// CSS by property
							if (ctrl?.cssProperty) {
								const hasPropVal = hasCSS(ctrl.cssProperty, selector);
								if (hasPropVal) hasAnyValue = true;
								if (!ctrl?.notDelete) {
									batch[ctrl.cssProperty] = '';
									if (hasPropVal) hasDeletableValue = true;
								}
								if (!hasPropVal && hasCssPlaceholderValue(ctrl.cssProperty, selector)) {
									foundAnyPlaceholder = true;
								  }
							}
			
							// Added by type
							if (ctrl?.type === 'border') {
								const anyBorderVal = borderKeys.some(k => hasCSS(k, selector));
								if (anyBorderVal) hasAnyValue = true;
								if (!ctrl?.notDelete) {
									borderKeys.forEach(k => { batch[k] = ''; });
									if (anyBorderVal) hasDeletableValue = true;
								}
								if (!anyBorderVal) {
									const hasBorderPh = borderKeys.some(k => hasCssPlaceholderValue(k, selector));
									if (hasBorderPh) foundAnyPlaceholder = true;
								  }
							}
							if (ctrl?.type === 'box-shadow') {
								const hasBox = hasCSS('box-shadow', selector);
								if (hasBox) hasAnyValue = true;
								if (!ctrl?.notDelete) {
									batch['box-shadow'] = '';
									if (hasBox) hasDeletableValue = true;
								}
								if (!hasBox && hasCssPlaceholderValue('box-shadow', selector)) {
									foundAnyPlaceholder = true;
								  }
							}

						}
	

					const groupHasPlaceholderOnly = !hasAnyValue && foundAnyPlaceholder;

			// check if there is any deletable value (not by possible keys)
			return { hasAnyValue: hasAnyValue, selectorBatches: batches, jsonProps: jsonSet, hasDeletableValue, hasPlaceholderOnly: groupHasPlaceholderOnly };
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [controls, getGlobalCSSValue, getGlobalJSONValue, getPlaceholderValue, getEnterAnimationProps, getEnterAnimationPlaceholder, activeRoot]);


		const handleSectionClear = useCallback(() => {
			// Debug: log what we're about to clear
			console.log('🗑️ Clearing section - selectorBatches:', selectorBatches);
			
			// Apply CSS clears grouped by selector
			if (applyGlobalCSSChange && selectorBatches && selectorBatches.size > 0) {
				for (const [selector, batch] of selectorBatches.entries()) {
					const keys = Object.keys(batch || {});
					console.log(`  Selector: "${selector}", Properties:`, keys, batch);
					
					if (keys.length > 0) {
						// Pass selector correctly (it can be undefined, null, or a string)
						applyGlobalCSSChange(batch, undefined, selector || undefined);
					}
				}
			}
			
			// Apply JSON clears (batch preferred to avoid last-write-wins)
			if (jsonProps && jsonProps.size > 0) {
				console.log('  JSON props to clear:', Array.from(jsonProps));
				if (applyMultipleGlobalJSONChanges) {
					const batch = {};
					for (const key of jsonProps.values()) batch[key] = '';
					applyMultipleGlobalJSONChanges(batch);
				} else if (applyGlobalJSONChange) {
					for (const key of jsonProps.values()) {
						applyGlobalJSONChange(key, '');
					}
				}
			}
		}, [applyGlobalCSSChange, applyGlobalJSONChange, applyMultipleGlobalJSONChanges, selectorBatches, jsonProps]);
	

	// Check if required condition is met for this group (after all hooks)
	if (!shouldShow) {
		return null; // Don't render the group if required condition is not met
	}

	return (
		<div className="tw-builder__control">
			<div className="tw-builder__control-header" onClick={() => setIsOpen(!isOpen)}>
                {/* Section deleter: stop click from toggling accordion */}
                <span  className="tw-builder__control-deleter" onClick={(e) => e.stopPropagation()}>
					<StylesDeleter
							value={hasAnyValue || hasPlaceholderOnly}
							notDelete={hasAnyValue && !hasDeletableValue}
							isPlaceholder={hasPlaceholderOnly}
							onDelete={() => {
								if (clearAllEnterAnimations) {
									
									// For Enter Animation, delete all properties at once
									clearAllEnterAnimations();
								} else {
									console.log('Clearing section');
									// For other sections, use handleSectionClear
									handleSectionClear();
								}
								setBwUnified('');
								setBrUnified('');
							}}
						/>
				</span>
				<span className="tw-builder__control-label">{label}
					{/*if the label is Enter Animation, show the tooltip */}
					{label === 'Enter Animation' && (
						<span className="tw-builder__control-info" onMouseEnter={() => setActiveTooltip('enter-animation')} onMouseLeave={() => setActiveTooltip(null)}>
							i
							<Tooltip
							message={`The following properties will be applied when “${activeRootName[activeRoot]}” shows up.`}
							open={activeTooltip === 'enter-animation'}
							responsivePosition={{ desktop: 'top', mobile: 'top' }}
							width="auto"
							animationType='SCALE_TOOLTIP_BOTTOM'
							showArrows={false}
							/>
						</span>
					)}
				</span>
				<div className="tw-builder__control-icons" tabIndex={0} role="button" aria-label="Toggle control" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsOpen(!isOpen); } }}>

					<span className={`tw-builder__control-icon ${!isOpen ? 'tw-builder__control-icon--active' : ''}`}>
						<svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
							<line y1="3.5" x2="7" y2="3.5" stroke="currentColor"/>
							<line x1="3.5" x2="3.5" y2="7" stroke="currentColor"/>
						</svg>
					</span>
					<span className={`tw-builder__control-icon ${isOpen ? 'tw-builder__control-icon--active' : ''}`}>
						<svg width="7" height="1" viewBox="0 0 7 1" fill="none" xmlns="http://www.w3.org/2000/svg">
						<line y1="0.5" x2="7" y2="0.5" stroke="currentColor" strokeWidth="1"/>
						</svg>
					</span>
				</div>
			</div>
			{/* If the control is open, show the content */}
			{isOpen && (
				<div className="tw-builder__control-content">
					{/* Map the controls and show the correct inputs */}
					{controls.map((control, index) => whatType(control, index))}
				</div>
			)}
		</div>
	)
}