import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.scss'; // Import the SCSS file

interface MultiSelectProps {
  options: string[]; // Array of options to display
  placeholder?: string; // Placeholder text for the input
  maxLines?: number; // Maximum number of lines for the selected values
  allowCustomOptions?: boolean; // Allow users to add custom options
  initialValue?: string[]; // Initial selected values
  onChange?: (selectedValues: string[]) => void; // Callback when selected values change
  className?: string; // Custom class name for the root container
  keepOptionsOnSelect?: boolean; // Keep original options in the dropdown after selection
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder,
  maxLines = 1,
  allowCustomOptions = false, // Default to false
  initialValue = [], // Default to empty array
  onChange,
  className = '', // Default to empty string
  keepOptionsOnSelect = false, // Default to false
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValue);
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1); // Track focused position for input
  const [inputWidth, setInputWidth] = useState<number>(2); // Initial width of the input
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState<number>(-1); // Track highlighted option in dropdown
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedValuesRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for dropdown options

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true); // Keep the dropdown open while typing
    setHighlightedOptionIndex(-1); // Reset highlighted option when typing
  };

  // Update input width based on its content
  useEffect(() => {
    if (hiddenSpanRef.current && inputRef.current) {
      // Measure the width of the input's value using a hidden span
      hiddenSpanRef.current.textContent = inputValue || placeholder || '';
      const newWidth = hiddenSpanRef.current.offsetWidth + 4; // Add some padding
      setInputWidth(newWidth);
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [inputValue, placeholder]);

  // Handle selecting an option
  const handleSelect = (option: string) => {
    const newSelectedValues = [...selectedValues];
    if (focusedIndex !== -1) {
      // Insert the new option at the focused index + 1
      newSelectedValues.splice(focusedIndex + 1, 0, option);
      setFocusedIndex(focusedIndex + 1); // Move focus to the newly inserted option
    } else {
      // Add the new option to the end
      newSelectedValues.push(option);
      setFocusedIndex(newSelectedValues.length - 1); // Move focus to the newly added option
    }
    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(newSelectedValues); // Notify parent component of the change
    }
    setInputValue('');
    setIsOpen(true); // Keep the dropdown open
    if (inputRef.current) {
      inputRef.current.focus(); // Keep the input focused
    }
  };

  // Handle removing a selected option
  const handleRemove = (index: number) => {
    const newSelectedValues = selectedValues.filter((_, i) => i !== index);
    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(newSelectedValues); // Notify parent component of the change
    }
    if (focusedIndex >= newSelectedValues.length) {
      setFocusedIndex(newSelectedValues.length - 1); // Adjust focus if removed item was last
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      // Move input to the left
      if (focusedIndex > -1) {
        setFocusedIndex(focusedIndex - 1);
      }
    } else if (e.key === 'ArrowRight') {
      // Move input to the right
      if (focusedIndex < selectedValues.length - 1) {
        setFocusedIndex(focusedIndex + 1);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && focusedIndex !== -1) {
      // Remove the selected option to the left of the input
      handleRemove(focusedIndex);
      setFocusedIndex(focusedIndex - 1); // Move focus left after removal
    } else if (e.key === 'Enter') {
      if (isOpen && filteredOptions.length > 0) {
        // Select the highlighted option or the first option on Enter
        const optionToSelect =
          highlightedOptionIndex !== -1
            ? filteredOptions[highlightedOptionIndex]
            : filteredOptions[0];
        handleSelect(optionToSelect);
      } else if (inputValue.trim() !== '' && allowCustomOptions && !options.includes(inputValue)) {
        // Add the custom option to the selected values
        handleSelect(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      // Move highlight to the next option in the dropdown
      if (isOpen && filteredOptions.length > 0) {
        e.preventDefault(); // Prevent default scroll behavior
        const newIndex =
          highlightedOptionIndex < filteredOptions.length - 1
            ? highlightedOptionIndex + 1
            : 0;
        setHighlightedOptionIndex(newIndex);
        // Scroll the dropdown if the highlighted option is not visible
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      // Move highlight to the previous option in the dropdown
      if (isOpen && filteredOptions.length > 0) {
        e.preventDefault(); // Prevent default scroll behavior
        const newIndex =
          highlightedOptionIndex > 0
            ? highlightedOptionIndex - 1
            : filteredOptions.length - 1;
        setHighlightedOptionIndex(newIndex);
        // Scroll the dropdown if the highlighted option is not visible
        optionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  // Handle mouse click to move the input
  const handleMouseClick = (index: number) => {
    setFocusedIndex(index);
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input when clicking on a selected option
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Use setTimeout to check the active element after the blur event
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false); // Hide the dropdown if focus is outside the component
      }
    }, 0);
  };

  // Focus the input when it moves
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedIndex]);

  // Filter options based on input value and already selected values
  const filteredOptions = options.filter(
    (option) =>
      (keepOptionsOnSelect || !selectedValues.includes(option)) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`multi-select ${className}`} ref={dropdownRef}>
      {/* Hidden span to measure the width of the input's value */}
      <span
        ref={hiddenSpanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: 'inherit',
          fontFamily: 'inherit',
        }}
      />
      <div
        className={`selected-values ${maxLines === 1 ? 'single-line' : ''}`}
        ref={selectedValuesRef}
      >
        {/* Render the input before the first selected option if focusedIndex is -1 */}
        {focusedIndex === -1 && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
            className="small-input"
            style={{ width: `${inputWidth}px` }} // Set dynamic width
          />
        )}
        {selectedValues.map((value, index) => (
          <React.Fragment key={index}>
            <div
              className={`selected-value ${index === focusedIndex ? 'focused' : ''}`}
              onClick={() => handleMouseClick(index)}
            >
              {value}
              <button onClick={() => handleRemove(index)}>&times;</button>
            </div>
            {index === focusedIndex && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                placeholder={placeholder}
                onFocus={() => setIsOpen(true)}
                className="small-input"
                style={{ width: `${inputWidth}px` }} // Set dynamic width
              />
            )}
          </React.Fragment>
        ))}
        {/* Render the input after the last selected option if focusedIndex is equal to the length */}
        {focusedIndex === selectedValues.length && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
            className="small-input"
            style={{ width: `${inputWidth}px` }} // Set dynamic width
          />
        )}
      </div>
      {isOpen && (
        <div className="options-list">
          {filteredOptions.map((option, index) => (
            <div
              key={option}
              ref={(el) => (optionRefs.current[index] = el)} // Assign ref to each option
              className={`option ${index === highlightedOptionIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
          {allowCustomOptions &&
            inputValue.trim() !== '' &&
            !options.includes(inputValue) && (
              <div
                ref={(el) => (optionRefs.current[filteredOptions.length] = el)} // Assign ref to custom option
                className={`option custom-option ${
                  highlightedOptionIndex === filteredOptions.length ? 'highlighted' : ''
                }`}
                onClick={() => handleSelect(inputValue)}
              >
                Add "{inputValue}"
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;