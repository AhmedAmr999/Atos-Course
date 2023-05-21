import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      {localStorage.getItem("token") === null ? (
        <li>
          <NavLink to="/auth">AUTH</NavLink>
        </li>
      ) : null}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/">
            <button
              style={{ color: "black" }}
              onClick={() => {
                localStorage.removeItem("userType");
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userData");
                window.location.reload();
              }}
            >
              LOGOUT
            </button>
          </NavLink>
        </li>
      )}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/questions">Questions</NavLink>
        </li>
      )}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/users/profileInfo">PROFILE PAGE</NavLink>
        </li>
      )}

      {localStorage.getItem("userType") === "TEACHER" &&
        localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/questions/addQuestion">ADD QUESTION PAGE</NavLink>
          </li>
        )}

      {localStorage.getItem("userType") === "SUPER_ADMIN" && (
        <li>
          <NavLink to="/users/addAdmin">ADD ADMIN PAGE</NavLink>
        </li>
      )}

      {localStorage.getItem("userType") === "SUPER_ADMIN" && (
        <li>
          <NavLink to="/questions/addQuestions">ADD QUESTIONS PAGE</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
