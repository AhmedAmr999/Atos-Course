import React, { useState } from "react";
import "./ComboBox.css";

const ComboBox = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const filteredOptions = selectedOption
    ? options.filter((item) => item.category === selectedOption)
    : options;

  return (
    <div className="combobox">
      <select
        className="combobox-select"
        value={selectedOption}
        onChange={onChange}
      >
        <option value="" disabled>
          Select a category
        </option>
        {filteredOptions.map((option) => (
          <option key={option.category} value={option.category}>
            {option.category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBox;
