import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Alert } from '../alert/Alert';
import './InputWithValidation.css';

export const InputWithValidation = ({
  type = 'text',
  placeholder,
  position = 'right',
  validation,
  onValueChange,
  initialValue = '',
  errorMessage = null,
  alertClassName = '',
  inputClassName = '',
  containerClassName = '',
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [localError, setLocalError] = useState(null);
  const inputContainerRef = useRef(null); // Ref for Alert positioning

  // Effect to update value if initialValue changes
  useEffect(() => {
    setValue(initialValue);
    setLocalError(null);
  }, [initialValue]);

  // Effect to show alert if errorMessage prop changes to a non-null value
  useEffect(() => {
      if (errorMessage !== null) {
          setLocalError(errorMessage);
      } else {
          setLocalError(null);
      }
  }, [errorMessage]);

  // Function to execute validation function
  const runValidation = useCallback((currentValue) => {
    if (validation) {
      return validation(currentValue);
    }
    return null;
  }, [validation]);

  // Handles input value changes
  const handleEdit = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const currentError = runValidation(newValue);
    if (onValueChange) {
      onValueChange(newValue, currentError);
    }
  };

  // Handles input blur
  const handleBlur = () => {
    const currentError = runValidation(value);
    setLocalError(currentError);
  };

  const errorToDisplay = errorMessage || localError;

  return (
    <div ref={inputContainerRef} className={`input-validation-wrapper ${containerClassName}`}>
      <input
        type={type}
        value={value}
        onChange={handleEdit}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`input-validation-field ${inputClassName}`}
        {...props}
        // Accessibility props
        aria-invalid={!!errorToDisplay}
        aria-describedby={errorToDisplay ? `alert-${props.id || placeholder || 'input'}` : undefined} // Generates ID for accessibility
      />

      {errorToDisplay && (
        <Alert
          message={errorToDisplay}
          id={`alert-${props.id || placeholder || 'input'}`} // ID for accessibility
          position={position}
          containerRef={inputContainerRef}
          className={alertClassName}
        />
      )}
    </div>
  );
}; 