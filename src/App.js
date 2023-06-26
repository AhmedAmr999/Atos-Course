import React, { useEffect, useState } from "react";
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
import "react-toastify/dist/ReactToastify.css";
import Notifications from "./Shared/Components/Notifications";
import AllExamInstances from "./Exams/Pages/AllExamInstances";
import SingleExamInstance from "./Exams/Pages/SingleExamInstance";

function App() {
  const [islogin, token, User_Type, username, userId, logout] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationShown, setNotificationShown] = useState(
    localStorage.getItem("notificationShown") === "false"
  );

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(
          `http://localhost:3456/notifications/getUserNotification/${userId}`
        );
        console.log(response.status);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notification);
        } else if (response.status === 404) {
          console.log("Cannot find notification with the given user ID...");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (
      islogin &&
      User_Type === "STUDENT" &&
      !window.location.pathname.startsWith("/exams/student/")
    ) {
      console.log("entred Not");
      fetchNotifications();
    } else if (
      islogin &&
      User_Type === "TEACHER" &&
      window.location.pathname.startsWith("/users/userProfile")
    ) {
      console.log("entred Not");
      fetchNotifications();
    }
  }, [islogin, User_Type, userId, window.location.pathname]);

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("userType", User_Type);

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

          <Route path="/exams/student/:examdefinition_id" exact>
            {islogin && User_Type === "STUDENT" && <StudentExam />}
          </Route>

          <Route path="/questions" exact>
            {islogin && User_Type === "TEACHER" && <Questions />}
          </Route>

          <Route path="/questions/addQuestion" exact>
            {islogin && User_Type === "TEACHER" && <AddQuestion />}
          </Route>
          <Route path="/examInstances/getAll">
            {islogin && User_Type === "TEACHER" && <AllExamInstances />}
          </Route>

          <Route path="/examInstances/:examInsatnceId">
            {islogin && User_Type === "TEACHER" && <SingleExamInstance />}
          </Route>
        </Switch>
        {!window.location.pathname.startsWith("/exams/student/") && islogin ? (
          <Notifications notifications={notifications} User_Type={User_Type} />
        ) : null}
      </Router>
    )
  );
}

export default App;
