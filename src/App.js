import React from "react";
import Questions from "./Questions/Pages/Questions";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import MainNavigation from "./Shared/Navigation/MainNavigation";
import Auth from "./User/Pages/auth";
import UserInfo from "./User/Pages/UserInfo";
import AddQuestion from "./Questions/Pages/AddQuestion";
import EditQuestion from "./Questions/Pages/EditQuestion";

function App() {
  let routes;
  if (localStorage.getItem("token")) {
    routes = (
      <Switch>
        <Route path="/questions" exact>
          <Questions />
        </Route>
        <Route path="/users/profileInfo" exact>
          <UserInfo />
        </Route>
        {localStorage.getItem("userType") === "TEACHER" && (
          <Route path="/questions/addQuestion" exact>
            <AddQuestion />
          </Route>
        )}
        {localStorage.getItem("userType") === "SUPER_ADMIN" && (
          <Route path="/users/addAdmin" exact>
            <Auth />
          </Route>
        )}
        <Route path="/questions/addQuestions" exact>
          <AddQuestion />
        </Route>
        <Route path="/:qid/editQuestion">
          <EditQuestion />
        </Route>
        <Redirect to="/users/profileInfo" />
      </Switch>
    );
  } else {
    //setRefresh(refresh + 1);
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <Router>
      <MainNavigation />
      <main>{routes}</main>
    </Router>
  );
}

export default App;
