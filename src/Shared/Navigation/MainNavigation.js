import React from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import './MainNavigation.css';
const MainNavigation = (props) => {
  return (
      <MainHeader>
        <h1 className="main-navigation__title">
          <Link to="/"> Exams App</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
  );
};

export default MainNavigation;
