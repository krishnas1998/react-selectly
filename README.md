# React Selectly 🚀

A highly customizable multi-select dropdown component for React. This component allows users to select multiple options from a dropdown list, add custom options, and navigate through options using the keyboard.

![MultiSelect Demo](demo.gif) <!-- Add a demo GIF if available -->

## Features

- **Multi-select functionality**: Select multiple options from a dropdown list.
- **Custom options**: Allow users to add custom options not present in the list.
- **Keyboard navigation**: Navigate through options using the keyboard (up/down arrows, Enter, Backspace).
- **Dynamic input width**: The input width adjusts dynamically based on the content.
- **Dropdown scrolling**: Automatically scrolls to keep the highlighted option visible.
- **Styling**: Fully customizable using SCSS.

## Installation

To use the `MultiSelect` component in your project, install it via npm:

```bash
npm install react-selectly
```

## Usage 🛠️
Multi-Select Component
```typescript
import React from 'react';
import MultiSelect from 'multi-select-react-component';
import './MultiSelect.scss'; // Import the SCSS file

const options: string[] = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
];
const [selectedValues, setSelectedValues] = useState<string[]>(['Apple', 'Banana']); // Initial values
  const handleChange = (newSelectedValues: string[]) => {
    console.log('Selected Values:', newSelectedValues);
    setSelectedValues(newSelectedValues);
}
;
const App: React.FC = () => {
  return (
    <div className="App">
      <h1>MultiSelect Example</h1>
      <MultiSelect
        options={options}
        placeholder="Select fruits..."
        maxLines={1}
        allowCustomOptions={true} // Enable custom options
        initialValue={selectedValues} // Pass initial values
        onChange={handleChange} // Handle changes
        className="custom-multi-select" // Custom class name
        keepOptionsOnSelect={true} // Keep original options in the dropdown
      />
    </div>
  );
};

export default App;
```

## Props 📋
### MultiSelect Props

| Prop               | Type            | Default       | Description                                      |
|--------------------|-----------------|---------------|--------------------------------------------------|
| `options`          | `string[]`      | `[]`          | Array of options to display.                    |
| `placeholder`      | `string`        | `''`          | Placeholder text for the input.                 |
| `allowCustomOptions` | `boolean`     | `false`       | Allow users to add custom options.              |
| `initialValue`         | `string[]`        | `[]`           | Maximum number of lines for selected values.    |
| `onChange`         | `(selectedValues: string[]) => void` | `undefined`           | Handle changes.   |
| `className`         | `string`        | ``           | Custom class name    |
| `keepOptionsOnSelect`  | `boolena`    | `1`           | Keep original options in the dropdown   |
