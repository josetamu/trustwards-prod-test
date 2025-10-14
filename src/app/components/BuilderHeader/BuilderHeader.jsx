import { useState, useRef, useEffect } from 'react';
import { supabase } from '@supabase/supabaseClient';
import './BuilderHeader.css';
import { useCanvas } from '@contexts/CanvasContext';
import { Tooltip } from '@components/tooltip/Tooltip';
export default function BuilderHeader({site, setSite, setModalType, setIsModalOpen, checkSitePicture, SiteStyle, openChangeModalSettings}) {
    const [errors, setErrors] = useState({});
   /*  const fileInputRef = useRef(null); */
    const [breakpoint, setBreakpoint] = useState('desktop');
    const [showTooltip, setShowTooltip] = useState(false);
    const [editingBreakpoint, setEditingBreakpoint] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const inputRef = useRef(null);
    
    const { undo, redo, canUndo, canRedo, setJSONtree, JSONtree} = useCanvas();


    // Determine active breakpoint based on current canvas width
    useEffect(() => {
      if (JSONtree?.canvasMaxWidth && JSONtree?.breakpoints) {
          const canvasWidth = parseInt(JSONtree.canvasMaxWidth);
          const { tablet, mobile } = JSONtree.breakpoints;
          //take the number of the breakpoints
          const tabletWidth = parseInt(tablet);
          const mobileWidth = parseInt(mobile);
          
          //compare the canvas width with the breakpoints
          //if the canvas width is greater than the tablet width, set the breakpoint to desktop
          if (canvasWidth > tabletWidth) {
              setBreakpoint('desktop');
          //set the canvas width to the tablet width, if the canvas width is greater than the mobile width
          } else if (canvasWidth > mobileWidth) {
              setBreakpoint('tablet');
          } else {
              //set the canvas width to the mobile width, if the canvas width is less than the tablet width
              setBreakpoint('mobile');
          }
      }
  }, [JSONtree?.canvasMaxWidth, JSONtree?.breakpoints]);

  // Focus input when editing mode starts
  useEffect(() => {
    if (editingBreakpoint && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingBreakpoint]);

//this function is used to change the breakpoint and update the JSONtree
const handleBreakpointChange = (newBreakpoint) => {
    setBreakpoint(newBreakpoint);
    if (!JSONtree?.breakpoints) {
      return;
  }
    const updated = { ...JSONtree, canvasMaxWidth: JSONtree.breakpoints[newBreakpoint] };
    setJSONtree(updated);

};



//open the tooltip
const handleMouseEnter = (id) => {
  setShowTooltip(id);
};

//close the tooltip
const handleMouseLeave = () => {
  if (showTooltip) {
    setShowTooltip('');
    setEditingBreakpoint(null);
    setEditingValue('');
  }
  setEditingBreakpoint(null);
  setEditingValue('');
};


//parse the value to px
const toPxString = (val) => {
  //if the value is a number, return the value with px
  if (typeof val === 'number' && !isNaN(val)) return `${val}px`;
  //if the value is a string, check if it is a number with px. If it is, return the value with px. (So users cant write letters or symbols)
  if (typeof val === 'string') {
    //check if the value is a number with px
    const match = val.trim().match(/^(\d+)\s*(px)?$/i);
    //if the value is a number with px, return the value with px
    if (match) return `${parseInt(match[1], 10)}px`;
  }
  //if the value is not a number or a string, return null
  return null;
};

//start editing the breakpoint
const startEditing = (key) => {
  //get the current value of the breakpoint
  const current = JSONtree?.breakpoints?.[key] || '';
  const num = parseInt(current, 10);
  //set the editing breakpoint to the key(desktop, tablet, mobile)
  setEditingBreakpoint(key);
  //set the editing value to the current value
  setEditingValue(isNaN(num) ? '' : String(num));
  //open the tooltip
  setShowTooltip(key);
};

//cancel editing the breakpoint
const cancelEditing = () => {
  //set the editing breakpoint to null
  setEditingBreakpoint(null);
  setEditingValue('');
  //close the tooltip
  setShowTooltip('');
};

const commitEditing = (key) => {
  //convert the value to px
  const px = toPxString(editingValue);
  if (!px) { cancelEditing(); return; }

  //convert the value to a number
  let newNum = parseInt(px, 10);
  //get the current value of the tablet and mobile breakpoints
  const tabletNum = parseInt(JSONtree?.breakpoints?.tablet || '0', 10);
  const mobileNum = parseInt(JSONtree?.breakpoints?.mobile || '0', 10);

  //clamp the breakpoints so Mobile < Tablet, no warnings
  //if the breakpoint is mobile and the new value is greater than the tablet value, set the new value to the tablet value - 1
  if (key === 'mobile' && newNum >= tabletNum) newNum = Math.max(0, tabletNum - 1);
  //if the breakpoint is tablet and the new value is less than the mobile value, set the new value to the mobile value + 1
  if (key === 'tablet' && newNum <= mobileNum) newNum = mobileNum + 1;

  //set the new value of the breakpoint in the JSONtree using handleBreakpointEdit function
  const finalPx = `${newNum}px`;
  handleBreakpointEdit(key, finalPx);
  
  // Keep editing mode open and focus on input for further changes
  setEditingValue(String(newNum));
  setShowTooltip(key);
};

//Save the new value of the breakpoint in the JSONtree
const handleBreakpointEdit = (breakpointKey, newValue) => {
  //update the JSONtree with the new value of the breakpoint
  const updated = {
    ...JSONtree,
    breakpoints: { ...JSONtree.breakpoints, [breakpointKey]: newValue }
  };

  //if the breakpoint is the active one, update the canvasMaxWidth
  if (breakpoint === breakpointKey) {
    updated.canvasMaxWidth = newValue;
  }

  //set the new value of the breakpoint in the JSONtree
  setJSONtree(updated);
};

//render the tooltip. Desktop is just the text, the other ones have a divider and an input to edit the value
const renderTooltip = (id) => (
  <div className="tw-builder__header-tooltip">
    <span>{id === 'desktop' ? 'Desktop' : id === 'tablet' ? 'Tablet' : 'Mobile'}</span>
    {id !== 'desktop' && (
      <>
        <span className="tw-builder__header-tooltip-divider">|</span>

        {editingBreakpoint === id ? (
          //if the breakpoint is being edited, show the input to edit the value
          <span className="tw-builder__header-tooltip-span">
            <input
              ref={inputRef}
              className="tw-builder__header-tooltip-input"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value.replace(/[^\d]/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  commitEditing(id);
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelEditing();
                }
              }}
              onBlur={() => commitEditing(id)}
              autoFocus
              style={{ width: Math.max(3, (editingValue || '').length) + 'ch' }}
            />
            <span>px</span>
          </span>
        ) : (
          //if the breakpoint is not being edited, show the value
          <span
            className="tw-builder__header-tooltip-span"
            onClick={(e) => { e.stopPropagation(); startEditing(id); }}
          >
            {JSONtree?.breakpoints?.[id] || ''}
          </span>
        )}

        <svg
          //edit icon
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => { e.stopPropagation(); startEditing(id); }}
          className="tw-builder__header-tooltip-edit" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.77443 0.920991C5.72967 0.916961 5.6846 0.916961 5.63983 0.920991C5.48187 0.935221 5.35453 1.00753 5.23947 1.09801C5.1315 1.1829 5.01227 1.30216 4.87393 1.44052L4.5 1.81443L6.1869 3.5013L6.5608 3.12742C6.69917 2.98907 6.81843 2.86981 6.9033 2.76187C6.9938 2.6468 7.0661 2.51944 7.08033 2.36148C7.08437 2.31671 7.08437 2.27167 7.08033 2.22691C7.0661 2.06894 6.9938 1.94159 6.9033 1.82652C6.81843 1.71857 6.69917 1.59932 6.5608 1.46097C6.42247 1.32261 6.28277 1.1829 6.1748 1.09801C6.05973 1.00753 5.9324 0.935221 5.77443 0.920991Z" fill="#FFFFFF"/>
          <path d="M5.83269 3.85486L4.14582 2.16797L1.54143 4.77232C1.28492 5.02859 1.10666 5.20669 1.0112 5.43716C0.915737 5.66762 0.915857 5.91959 0.91603 6.28219L0.916047 6.83462C0.916047 6.97269 1.02797 7.08462 1.16605 7.08462H1.71849C2.08108 7.08482 2.33306 7.08492 2.56352 6.98946C2.79398 6.89402 2.97207 6.71575 3.22834 6.45922L5.83269 3.85486Z" fill="#999999"/>
        </svg>
      </>
    )}
  </div>
);

    return (
      <div className="tw-builder__header">
        <div className="tw-builder__header-settings">
          <div className="tw-builder__header-breakpoints">
            <div 
              className="tw-builder__header-breakpoint" 
              onClick={() => handleBreakpointChange('desktop')} 
              onMouseEnter={() => handleMouseEnter('desktop')} 
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleBreakpointChange('desktop');
                } else if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  startEditing('desktop');
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEditing();
                }
              }}
              tabIndex={0}
              aria-label="Switch to desktop breakpoint"
            >
              <span className={`tw-builder__header-breakpoint-icon ${breakpoint === 'desktop' ? 'tw-builder__header-breakpoint-icon--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33398 13.9987H10.6673M9.33398 13.9987C8.78172 13.9987 8.33398 13.551 8.33398 12.9987V11.332H8.00065M9.33398 13.9987H6.66732M8.00065 11.332H7.66732V12.9987C7.66732 13.551 7.21958 13.9987 6.66732 13.9987M8.00065 11.332V13.9987M6.66732 13.9987H5.33398" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.6673 2H5.33398C3.44836 2 2.50556 2 1.91977 2.58579C1.33398 3.17157 1.33398 4.11438 1.33398 6V7.33333C1.33398 9.21893 1.33398 10.1617 1.91977 10.7475C2.50556 11.3333 3.44836 11.3333 5.33398 11.3333H10.6673C12.5529 11.3333 13.4957 11.3333 14.0815 10.7475C14.6673 10.1617 14.6673 9.21893 14.6673 7.33333V6C14.6673 4.11438 14.6673 3.17157 14.0815 2.58579C13.4957 2 12.5529 2 10.6673 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <Tooltip
                message={renderTooltip('desktop')}
                open={showTooltip === 'desktop'}
                responsivePosition={{ desktop: 'bottom', mobile: 'bottom' }}
                width="auto"
              />

            </div>
            <div 
              className="tw-builder__header-breakpoint" 
              onClick={() => handleBreakpointChange('tablet')} 
              onMouseEnter={() => handleMouseEnter('tablet')} 
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleBreakpointChange('tablet');
                } else if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  startEditing('tablet');
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEditing();
                }
              }}
              tabIndex={0}
              aria-label="Switch to tablet breakpoint"
            >
              <span className={`tw-builder__header-breakpoint-icon ${breakpoint === 'tablet' ? 'tw-builder__header-breakpoint-icon--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.66732 1.33203H6.33398C4.44836 1.33203 3.50556 1.33203 2.91977 1.91782C2.33398 2.5036 2.33398 3.44641 2.33398 5.33203V10.6654C2.33398 12.551 2.33398 13.4938 2.91977 14.0796C3.50556 14.6654 4.44836 14.6654 6.33398 14.6654H9.66732C11.5529 14.6654 12.4957 14.6654 13.0815 14.0796C13.6673 13.4938 13.6673 12.551 13.6673 10.6654V5.33203C13.6673 3.44641 13.6673 2.5036 13.0815 1.91782C12.4957 1.33203 11.5529 1.33203 9.66732 1.33203Z" stroke="currentColor" strokeLinecap="round"/>
                  <path d="M8 12.668H8.00667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round"/>
                </svg>
              </span>
              <Tooltip
                message={renderTooltip('tablet')}
                open={showTooltip === 'tablet'}
                responsivePosition={{ desktop: 'bottom', mobile: 'bottom' }}
                width="auto"
              />
              </div>
              <div 
                className="tw-builder__header-breakpoint" 
                onClick={() => handleBreakpointChange('mobile')} 
                onMouseEnter={() => handleMouseEnter('mobile')} 
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleBreakpointChange('mobile');
                  } else if (e.key === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    startEditing('mobile');
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEditing();
                  }
                }}
                tabIndex={0}
                aria-label="Switch to mobile breakpoint"
              >
              <span className={`tw-builder__header-breakpoint-icon ${breakpoint === 'mobile' ? 'tw-builder__header-breakpoint-icon--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12.668H8.00667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.99935 1.33203H6.99935C5.428 1.33203 4.64233 1.33203 4.15417 1.82018C3.66602 2.30834 3.66602 3.09402 3.66602 4.66536V11.332C3.66602 12.9034 3.66602 13.689 4.15417 14.1772C4.64233 14.6654 5.428 14.6654 6.99935 14.6654H8.99935C10.5707 14.6654 11.3563 14.6654 11.8445 14.1772C12.3327 13.689 12.3327 12.9034 12.3327 11.332V4.66536C12.3327 3.09402 12.3327 2.30834 11.8445 1.82018C11.3563 1.33203 10.5707 1.33203 8.99935 1.33203Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <Tooltip
                message={renderTooltip('mobile')}
                open={showTooltip === 'mobile'}
                responsivePosition={{ desktop: 'bottom', mobile: 'bottom' }}
                width="auto"
              />
              </div>
          </div>
          <div className="tw-builder__header-divider"></div>
          <div className="tw-builder__header-user">
              <div className='tw-builder__header-avatar'>
                  <span className={`tw-builder__header-color`} 
                          style={SiteStyle(site)} >
                          {site?.Name?.charAt(0)}
                      </span> 
                      
              <span className='tw-builder__header-title' onClick={() => {
                  openChangeModalSettings(site);
              }}>{site?.Name || 'SITE'}</span> 
              </div>
              <span 
                  className={`tw-builder__header-plan ${site?.Plan === 'Pro' ? 'tw-builder__header-plan--pro' : ''}`} 
                  onClick={() => {
                    setModalType('Billing');
                    setIsModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setModalType('Billing');
                      setIsModalOpen(true);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Current plan: ${site?.Plan || 'Free'}. Click to change plan`}
              >
                  {site?.Plan || 'Free'}
              </span>
          </div>
          <div className="tw-builder__header-divider"></div>
          <div className="tw-builder__header-controls">
          <div 
            className="tw-builder__header-setting" 
            onClick={() => {
              setModalType('Builder');
              setIsModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setModalType('Builder');
                setIsModalOpen(true);
              }
            }}
            tabIndex={0}
            aria-label="Open builder settings modal"
          >
            <div className="tw-builder__header-setting-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.80009 1.33846C5.61049 1.31307 5.45065 1.36792 5.34183 1.4154C5.24179 1.45906 5.12893 1.52278 5.01945 1.5846L3.52001 2.4436C3.42281 2.51236 3.29145 2.62184 3.21606 2.79898C3.13375 2.99238 3.16031 3.1873 3.17986 3.30004C3.20102 3.42204 3.24491 3.59 3.28692 3.75074C3.55108 4.76195 2.9058 5.84976 1.86122 6.12971L1.84282 6.13464C1.68478 6.17698 1.53669 6.21665 1.42088 6.2584C1.31253 6.29747 1.13145 6.3708 1.00385 6.53635C0.88658 6.68847 0.855494 6.85527 0.84326 6.97327C0.83198 7.08214 0.832007 7.21234 0.832034 7.339V8.65847C0.832007 8.78514 0.83198 8.91534 0.84326 9.0242C0.855494 9.1422 0.886574 9.30894 1.00383 9.46107C1.13143 9.6266 1.31251 9.69994 1.42085 9.739C1.53666 9.7808 1.86119 9.86774 1.86119 9.86774C2.90539 10.1477 3.55024 11.2353 3.28591 12.2466C3.28591 12.2466 3.19998 12.5753 3.17881 12.6973C3.15925 12.81 3.13268 13.0049 3.21497 13.1983C3.29036 13.3755 3.42172 13.485 3.51893 13.5538L5.01838 14.4128C5.12783 14.4746 5.24078 14.5383 5.3408 14.582C5.44963 14.6295 5.60949 14.6843 5.79909 14.6589C6.00521 14.6313 6.15799 14.5137 6.24585 14.4402C6.33913 14.3622 6.57369 14.1295 6.57369 14.1295C6.96263 13.7437 7.48063 13.5507 7.9987 13.5506C8.51677 13.5507 9.03477 13.7437 9.4237 14.1295C9.4237 14.1295 9.6583 14.3622 9.75157 14.4402C9.83943 14.5137 9.99217 14.6313 10.1983 14.6589C10.3879 14.6843 10.5478 14.6295 10.6566 14.582C10.7566 14.5383 10.8695 14.4746 10.979 14.4128L12.4784 13.5538C12.5757 13.485 12.707 13.3755 12.7824 13.1983C12.8647 13.0049 12.8382 12.81 12.8186 12.6973C12.7974 12.5753 12.7115 12.2466 12.7115 12.2466C12.4472 11.2353 13.092 10.1477 14.1362 9.86774C14.1362 9.86774 14.4608 9.7808 14.5766 9.739C14.6849 9.69994 14.866 9.6266 14.9936 9.46107C15.1108 9.30894 15.1419 9.1422 15.1542 9.0242C15.1654 8.91534 15.1654 8.78514 15.1654 8.65847V7.339C15.1654 7.21234 15.1654 7.08214 15.1542 6.97327C15.1419 6.85527 15.1108 6.68847 14.9936 6.53635C14.866 6.3708 14.6849 6.29747 14.5765 6.2584C14.4607 6.21665 14.3126 6.17698 14.1546 6.13464L14.1362 6.12971C13.0916 5.84976 12.4463 4.76195 12.7105 3.75074C12.7525 3.59 12.7964 3.42204 12.8176 3.30004C12.8371 3.1873 12.8636 2.99238 12.7814 2.79898C12.706 2.62184 12.5746 2.51236 12.4774 2.4436L10.978 1.5846C10.8684 1.52278 10.7556 1.45906 10.6556 1.4154C10.5468 1.36792 10.3869 1.31307 10.1973 1.33846C9.99123 1.36606 9.83843 1.48369 9.75057 1.55714C9.6573 1.63512 9.4227 1.8678 9.4227 1.8678C9.03397 2.25323 8.51637 2.44602 7.9987 2.44616C7.48103 2.44602 6.96343 2.25323 6.57473 1.8678C6.57473 1.8678 6.34012 1.63512 6.24684 1.55714C6.15899 1.48369 6.00619 1.36606 5.80009 1.33846ZM7.9987 10.332C9.28737 10.332 10.332 9.28734 10.332 7.99867C10.332 6.71 9.28737 5.66536 7.9987 5.66536C6.71003 5.66536 5.66537 6.71 5.66537 7.99867C5.66537 9.28734 6.71003 10.332 7.9987 10.332Z" fill="#999999"/>
              </svg>
            </div>
          </div>
            <div 
              className="tw-builder__header-control" 
              onClick={canUndo ? undo : () => {}} 
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && canUndo) {
                  e.preventDefault();
                  undo();
                }
              }}
              tabIndex={canUndo ? 0 : -1}
              aria-label="Undo last action"
              aria-disabled={!canUndo}
              style={{opacity: canUndo ? 1 : 0.5}}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.11803 1.59802C3.35624 1.41705 3.40265 1.07724 3.22168 0.83903C3.04072 0.600816 2.70091 0.554411 2.46269 0.735377L1.83772 1.21016L1.80526 1.23482C1.31908 1.60413 0.907954 1.91643 0.623644 2.20443C0.324741 2.50722 0.0820312 2.86504 0.0820312 3.33336C0.0820312 3.80169 0.324741 4.15951 0.623644 4.46228C0.907954 4.75028 1.31907 5.06261 1.80526 5.43191L2.46269 5.93133C2.70091 6.1123 3.04072 6.06593 3.22168 5.82771C3.40265 5.58948 3.35624 5.2497 3.11803 5.06873L2.49306 4.5939C2.09413 4.29087 1.79801 4.06496 1.58079 3.875H7.1237C8.61946 3.875 9.83203 5.08758 9.83203 6.58333C9.83203 8.07909 8.61946 9.29167 7.1237 9.29167H4.95703C4.65787 9.29167 4.41536 9.53417 4.41536 9.83333C4.41536 10.1325 4.65787 10.375 4.95703 10.375H7.1237C9.21778 10.375 10.9154 8.67742 10.9154 6.58333C10.9154 4.48925 9.21778 2.79167 7.1237 2.79167H1.58086C1.79807 2.60172 2.09418 2.37583 2.49306 2.0728L3.11803 1.59802Z" fill="#999999"/>
              </svg>
            </div>
            <div 
              className="tw-builder__header-control" 
              onClick={canRedo ? redo : () => {}} 
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && canRedo) {
                  e.preventDefault();
                  redo();
                }
              }}
              tabIndex={canRedo ? 0 : -1}
              aria-label="Redo last undone action"
              aria-disabled={!canRedo}
              style={{opacity: canRedo ? 1 : 0.5}}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.88197 1.59802C7.64376 1.41705 7.59735 1.07724 7.77832 0.83903C7.95928 0.600816 8.29909 0.554411 8.53731 0.735377L9.16228 1.21016L9.19474 1.23482C9.68092 1.60413 10.092 1.91643 10.3764 2.20443C10.6753 2.50722 10.918 2.86504 10.918 3.33336C10.918 3.80169 10.6753 4.15951 10.3764 4.46228C10.092 4.75028 9.68093 5.06261 9.19474 5.43191L8.53731 5.93133C8.29909 6.1123 7.95928 6.06593 7.77832 5.82771C7.59735 5.58948 7.64376 5.2497 7.88197 5.06873L8.50694 4.5939C8.90587 4.29087 9.20199 4.06496 9.41921 3.875H3.8763C2.38054 3.875 1.16797 5.08758 1.16797 6.58333C1.16797 8.07909 2.38054 9.29167 3.8763 9.29167H6.04297C6.34213 9.29167 6.58464 9.53417 6.58464 9.83333C6.58464 10.1325 6.34213 10.375 6.04297 10.375H3.8763C1.78222 10.375 0.0846367 8.67742 0.0846367 6.58333C0.0846367 4.48925 1.78222 2.79167 3.8763 2.79167H9.41914C9.20193 2.60172 8.90582 2.37583 8.50694 2.0728L7.88197 1.59802Z" fill="#999999"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
}