import React, { useEffect, useState, useCallback } from "react";
import Auth from "./Users/Pages/Auth";
import UserInfo from "./Users/Pages/UserInfo";
import MainNavigation from "./Shared/Navigation/MainNavigation";
import Questions from "./Questions/Pages/Questions";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoadingSpinner from "./Shared/Components/LoadingSpinner";
import AddQuestion from "./Questions/Pages/AddQuestion";
import EditQuestion from "./Questions/Pages/EditQuestion";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const expirationDate = new Date().getTime() + 3600 * 1000;
    localStorage.setItem("expirationDate", expirationDate.toString());
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    alert("Session Time Ended");
  }, []);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const expirationDate = localStorage.getItem("expirationDate");
      if (token && expirationDate) {
        const now = new Date();
        if (now.getTime() > +expirationDate) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
          const remainingTime = +expirationDate - now.getTime();
          setTimeout(() => {
            handleLogout();
          }, remainingTime);
        }
      }
      setLoading(false);
    };

    checkAuthentication();
  }, [handleLogout, localStorage.getItem("expirationDate")]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <MainNavigation onLogout={handleLogout} />
      <Switch>
        <Route path="/users/addAdmin" exact>
          {isLoggedIn && localStorage.getItem("userType") === "SUPER_ADMIN" ? (
            <Auth onLogin={handleLogin} isSuperAdmin={true} />
          ) : (
            <Redirect to="/auth" />
          )}
        </Route>

        <Route path="/:qid/editQuestion" exact>
          {isLoggedIn && localStorage.getItem("userType") === "TEACHER" && (
            <EditQuestion />
          )}
        </Route>

        <Route path="/questions" exact>
          {isLoggedIn && localStorage.getItem("userType") !== "STUDENT" && (
            <Questions />
          )}
        </Route>

        <Route path="/questions/addQuestion" exact>
          {isLoggedIn && localStorage.getItem("userType") === "TEACHER" && (
            <AddQuestion />
          )}
        </Route>
        <Route path="/auth">
          {!isLoggedIn ? (
            <Auth onLogin={handleLogin} isSuperAdmin={false} />
          ) : (
            <Redirect
              to={
                localStorage.getItem("userType") === "SUPER_ADMIN"
                  ? "/users/addAdmin"
                  : "/users/userInfo"
              }
            />
          )}
        </Route>
        <Route path="/users/userInfo">
          {isLoggedIn ? (
            <UserInfo onLogout={handleLogout} />
          ) : (
            <Redirect to="/auth" />
          )}
        </Route>
        <Redirect to="/auth" />
      </Switch>
    </Router>
  );
}

export default App;
