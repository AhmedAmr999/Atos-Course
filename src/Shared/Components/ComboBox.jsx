import React from "react";
import "./ComboBox.css";

const ComboBox = ({ options, onChange, selectedOption, comboBoxName }) => {
  return (
    <div className="combobox">
      <select
        className="combobox-select"
        value={selectedOption}
        onChange={onChange}
      >
        <option value="" disabled>
          {comboBoxName}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBox;
