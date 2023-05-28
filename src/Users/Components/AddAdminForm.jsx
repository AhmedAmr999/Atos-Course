import React from "react";
import Input from "../../Shared/Components/Input";

const AddAdminForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <Input
        id="username"
        element="text"
        onChange={props.handleChange}
        type="text"
        placeholder="Admin Username"
        name="username"
        value={props.userInfo.username}
        required
      />

      <Input
        id="password"
        element="password"
        onChange={props.handleChange}
        placeholder="Admin Password"
        name="password"
        value={props.userInfo.password}
        required
      />

      <Input
        id="ADMIN"
        element="radio"
        label="ADMIN"
        type="radio"
        value="ADMIN"
        checked={props.selectedOption === "ADMIN"}
        onChange={props.handleOptionChange}
        required
      />

      <button className="login-button" type="submit">
        Add Admin
      </button>
    </form>
  );
};

export default AddAdminForm;
