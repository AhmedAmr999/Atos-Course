import React from "react";
import "./Input.css";
const Input = (props) => {
  let element;
  if (props.element === "text" || props.element === "password") {
    element = (
      <input
        id={props.id}
        type={props.element}
        placeholder={props.element && props.placeholder}
        onChange={props.onChange}
        value={props.value}
        name={props.name}
        required={props.required}
        minLength={props.minLength}
      />
    );
  } else if (props.element === "radio" || props.element === "checkbox") {
    element = (
      <input
        id={props.id}
        type={props.element}
        onChange={props.onChange}
        checked={props.checked}
        value={props.value}
        required={props.required}
      />
    );
  }

  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
