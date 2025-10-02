import { useState, useMemo, useCallback } from 'react';
import './BuilderControl.css';
import {Tooltip} from '@components/tooltip/Tooltip';
import { StylesDeleter } from '@components/StylesDeleter/StylesDeleter';

// Component to render the control(label with + and -) Pass the label(title) and the control to render
export default function BuilderControl({label, controls, whatType, activeRoot, globalControlProps}) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTooltip, setActiveTooltip] = useState(null);

	const applyGlobalCSSChange = globalControlProps?.applyGlobalCSSChange;
	const getGlobalCSSValue = globalControlProps?.getGlobalCSSValue;
	const applyGlobalJSONChange = globalControlProps?.applyGlobalJSONChange;
	const getGlobalJSONValue = globalControlProps?.getGlobalJSONValue;

	//get the name of the active root to show in the tooltip
	const activeRootName = {
		'tw-root--banner': 'Banner',
		'tw-root--modal': 'Modal',
	}

	// Helper to check if a value is non-empty
	const isNonEmpty = (v) => {
		if (v == null) return false;
		if (typeof v === 'string') return v.trim() !== '';
		return Boolean(v);
	};

	// Compute if any nested control has a value and prepare CSS/JSON batches to clear
	const { hasAnyValue, selectorBatches, jsonProps } = useMemo(() => {
		if (!Array.isArray(controls) || controls.length === 0) {
			return { hasAnyValue: false, selectorBatches: new Map(), jsonProps: new Set() };
		}

		const batches = new Map(); // selector -> { cssKey: '' }
		const jsonSet = new Set();
		let any = false;

		const ensureBatchFor = (selector) => {
			if (!batches.has(selector)) batches.set(selector, {});
			return batches.get(selector);
		};

		const hasCSS = (prop, selector) => {
			if (!getGlobalCSSValue || !prop) return false;
			const v = getGlobalCSSValue(prop, selector);
			return isNonEmpty(v);
		};

		const checkGroup = (group, selector) => {
			if (!group) return false;
			// group itself or any side
			if (hasCSS(group, selector)) return true;
			return ['top','right','bottom','left'].some(side => hasCSS(`${group}-${side}`, selector));
		};

		const addGroupToBatch = (batch, group) => {
			batch[group] = '';
			['top','right','bottom','left'].forEach(side => {
				batch[`${group}-${side}`] = '';
			});
		};

		const borderKeys = [
			'border-width',
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
			'border-style',
			'border-color',
			'border-radius',
			'border-top-left-radius',
			'border-top-right-radius',
			'border-bottom-right-radius',
			'border-bottom-left-radius'
		];

		for (const ctrl of controls) {
			const selector = ctrl?.selector;
			const batch = ensureBatchFor(selector);

			// JSON
			if (ctrl?.JSONProperty) {
				jsonSet.add(ctrl.JSONProperty);
				if (getGlobalJSONValue) {
					const v = getGlobalJSONValue(ctrl.JSONProperty);
					if (isNonEmpty(v)) any = true;
				}
			}

			// CSS by property group
			if (ctrl?.cssPropertyGroup) {
				if (checkGroup(ctrl.cssPropertyGroup, selector)) any = true;
				addGroupToBatch(batch, ctrl.cssPropertyGroup);
			}

			// CSS by single property
			if (ctrl?.cssProperty) {
				if (hasCSS(ctrl.cssProperty, selector)) any = true;
				batch[ctrl.cssProperty] = '';
			}

			// Type-specific aggregates
			if (ctrl?.type === 'border') {
				// If any border-related exists
				if (borderKeys.some(k => hasCSS(k, selector))) any = true;
				borderKeys.forEach(k => { batch[k] = ''; });
			}
			if (ctrl?.type === 'box-shadow') {
				if (hasCSS('box-shadow', selector)) any = true;
				batch['box-shadow'] = '';
			}
		}

		return { hasAnyValue: any, selectorBatches: batches, jsonProps: jsonSet };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controls, getGlobalCSSValue, getGlobalJSONValue]);

	const handleSectionClear = useCallback(() => {
		// Apply CSS clears grouped by selector
		if (applyGlobalCSSChange && selectorBatches && selectorBatches.size > 0) {
			for (const [selector, batch] of selectorBatches.entries()) {
				const keys = Object.keys(batch || {});
				if (keys.length > 0) {
					applyGlobalCSSChange(batch, undefined, selector);
				}
			}
		}
		// Apply JSON clears
		if (applyGlobalJSONChange && jsonProps && jsonProps.size > 0) {
			for (const key of jsonProps.values()) {
				applyGlobalJSONChange(key, '');
			}
		}
	}, [applyGlobalCSSChange, applyGlobalJSONChange, selectorBatches, jsonProps]);

	return (
		<div className="tw-builder__control">
			<div className="tw-builder__control-header" onClick={() => setIsOpen(!isOpen)}>
                {/* Section deleter: stop click from toggling accordion */}
                <span  className="tw-builder__control-deleter" onClick={(e) => e.stopPropagation()}>
						<StylesDeleter
							value={hasAnyValue}
							onDelete={handleSectionClear}
						/>
					</span>
				<span className="tw-builder__control-label">{label}
					{/*if the label is Enter Animation, show the tooltip */}
					{label === 'Enter Animation' && isOpen && (
						<span className="tw-builder__control-info" onMouseEnter={() => setActiveTooltip('enter-animation')} onMouseLeave={() => setActiveTooltip(null)}>
							i
							<Tooltip
							message={`The following properties will be applied when “${activeRootName[activeRoot]}” shows up.`}
							open={activeTooltip === 'enter-animation'}
							responsivePosition={{ desktop: 'top', mobile: 'top' }}
							width="auto"
							/>
						</span>
					)}
				</span>
				<div className="tw-builder__control-icons">

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