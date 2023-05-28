import React from "react";
import Input from "../../Shared/Components/Input";

const AuthForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <h2> {!props.isLoggedIn ? "SIGNUP" : "LOGIN"} Required!!</h2>
      <Input
        id="username"
        element="text"
        onChange={props.handleChange}
        type="text"
        placeholder="Username"
        name="username"
        value={props.userInfo.username}
        required
      />

      <Input
        id="password"
        element="password"
        onChange={props.handleChange}
        placeholder="Password"
        name="password"
        value={props.userInfo.password}
        required
      />

      {!props.isLoggedIn && (
        <Input
          id="userType"
          element="radio"
          label="Student"
          type="radio"
          value="STUDENT"
          checked={props.selectedOption === "STUDENT"}
          onChange={props.handleOptionChange}
          required
        />
      )}

      {!props.isLoggedIn && (
        <Input
          id="userType"
          element="radio"
          label="Teacher"
          type="radio"
          value="TEACHER"
          checked={props.selectedOption === "TEACHER"}
          onChange={props.handleOptionChange}
          required
        />
      )}

      <button className="login-button" type="submit">
        {props.isLoggedIn ? "LOGIN" : "SIGNUP"}
      </button>

      <button type="button" className="signup-button" onClick={props.onClick}>
        SWITCH TO {props.isLoggedIn ? "SIGNUP" : "LOGIN"}
      </button>
    </form>
  );
};

export default AuthForm;
