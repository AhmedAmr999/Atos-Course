import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import useAuth from "../hooks/useAuth";

const NavLinks = ({ User_Type, logout }) => {
  //const [, , , , , logout] = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <ul className="nav-links">
        <li>
          <NavLink to="/users/userProfile">PROFILE PAGE</NavLink>
        </li>

        {User_Type === "TEACHER" && (
          <li>
            <NavLink to="/exams/assignExam">ASSIGN EXAM PAGE</NavLink>
          </li>
        )}

        {User_Type === "TEACHER" && localStorage.getItem("token") && (
          <li>
            <NavLink to="/exams/addExam">ADD EXAM PAGE</NavLink>
          </li>
        )}

        {User_Type === "SUPER_ADMIN" && (
          <li>
            <NavLink to="/users/addAdmin">ADD ADMIN PAGE</NavLink>
          </li>
        )}
        {User_Type === "TEACHER" && localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/questions/addQuestion">ADD QUESTION PAGE</NavLink>
          </li>
        )}

        {User_Type === "STUDENT" && localStorage.getItem("token") !== null && (
          <li>
            <NavLink to={`/exams/student/:examdefinition_id`}>
              Student Questions
            </NavLink>
          </li>
        )}

        {localStorage.getItem("token") !== null && (
          <li>
            <NavLink to="/" onClick={handleLogout}>
              LOGOUT
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavLinks;
