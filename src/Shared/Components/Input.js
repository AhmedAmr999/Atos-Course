import React from "react";
import "./Input.css";
const Input = (props) => {
  let element;
  if (
    props.element === "text" ||
    props.element === "password" ||
    props.element === "number" ||
    props.element === "datetime-local"
  ) {
    element = (
      <React.Fragment>
        <label htmlFor={props.id}>{props.label}</label>
        <input
          id={props.id}
          type={props.element}
          placeholder={props.element && props.placeholder}
          onChange={props.onChange}
          value={props.value}
          name={props.name}
          required={props.required}
          minLength={props.minLength}
          disabled={props.disabled}
        />
      </React.Fragment>
    );
  } else if (props.element === "radio" || props.element === "checkbox") {
    element = (
      <React.Fragment>
        <input
          id={props.id}
          type={props.element}
          onChange={props.onChange}
          checked={props.checked}
          value={props.value}
          required={props.required}
        />
        <label htmlFor={props.id}>{props.label}</label>
      </React.Fragment>
    );
  }

  return <div className="form-control">{element}</div>;
};

export default Input;
