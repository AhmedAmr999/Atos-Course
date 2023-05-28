import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = (props) => {
  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    window.location.href = "/auth";
  };
  return (
    <ul className="nav-links">
      {localStorage.getItem("token") === null ? (
        <li>
          <NavLink to="/auth">AUTH</NavLink>
        </li>
      ) : null}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/" onClick={handleLogout}>
            LOGOUT
          </NavLink>
        </li>
      )}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/questions">Questions</NavLink>
        </li>
      )}

      {localStorage.getItem("userType") === "STUDENT" &&
        localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/questions/student">Student Questions</NavLink>
          </li>
        )}

      {localStorage.getItem("token") !== null && (
        <li>
          <NavLink to="/users/userInfo">PROFILE PAGE</NavLink>
        </li>
      )}

      {localStorage.getItem("userType") === "TEACHER" &&
        localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/questions/addQuestion">ADD QUESTION PAGE</NavLink>
          </li>
        )}

      {localStorage.getItem("userType") === "TEACHER" &&
        localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/exams/examEngine/addExam">ADD EXAM PAGE</NavLink>
          </li>
        )}

      {localStorage.getItem("token") !== null &&
        localStorage.getItem("userType") === "SUPER_ADMIN" && (
          <li>
            <NavLink to="/users/addAdmin">ADD ADMIN PAGE</NavLink>
          </li>
        )}
    </ul>
  );
};

export default NavLinks;
