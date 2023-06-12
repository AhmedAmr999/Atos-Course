import React from "react";
import UserInfo from "./Users/Pages/UserInfo";
import MainNavigation from "./Shared/Navigation/MainNavigation";
import Questions from "./Questions/Pages/Questions";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddQuestion from "./Questions/Pages/AddQuestion";
import EditQuestion from "./Questions/Pages/EditQuestion";
import AddExamPage from "./Exams/Pages/AddExamPage";
import StudentExam from "./Exams/Pages/StudentExam";
import AddExamInstance from "./Exams/Pages/AddExamInstance";
import useAuth from "./Shared/hooks/useAuth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
function App() {
  const [islogin, token, User_Type, username, userId, logout] = useAuth();
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);

  return (
    islogin && (
      <Router>
        <MainNavigation User_Type={User_Type} logout={logout} />
        <Switch>
          <Route path="/users/userProfile">
            {islogin && <UserInfo username={username} User_Type={User_Type} />}
          </Route>
          <Route path="/:qid/editQuestion" exact>
            {islogin && User_Type === "TEACHER" && <EditQuestion />}
          </Route>

          <Route path="/exams/addExam" exact>
            {islogin && User_Type === "TEACHER" && <AddExamPage />}
          </Route>

          <Route path="/exams/assignExam" exact>
            {islogin && User_Type === "TEACHER" && <AddExamInstance />}
          </Route>

          <Route path="/exams/student/:examdefinition_id/:examInsatnceId" exact>
            {islogin && User_Type === "STUDENT" && <StudentExam />}
          </Route>

          <Route path="/questions" exact>
            {islogin && User_Type !== "STUDENT" && <Questions />}
          </Route>

          <Route path="/questions/addQuestion" exact>
            {islogin && User_Type === "TEACHER" && <AddQuestion />}
          </Route>
        </Switch>
      </Router>
    )
  );
}

export default App;
