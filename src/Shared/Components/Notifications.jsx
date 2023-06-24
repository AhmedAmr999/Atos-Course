import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newGetUserInfo } from "../APIS/AuthenticationAPI";

const Notifications = ({ notifications, User_Type }) => {
  useEffect(() => {
    const displayNotification = async () => {
      // Display a notification for each fetched notification
      if (User_Type === "STUDENT") {
        notifications.forEach((notification) => {
          const { examDefinitionName, generated_link, startedtime, testTaken } =
            notification;
          try {
            if (testTaken === "non-taken") {
              toast.info(
                <div>
                  <h3>{examDefinitionName}</h3>
                  <a href={generated_link}>View Exam</a>
                  <p>Started Time: {new Date(startedtime).toLocaleString()}</p>
                </div>,
                { autoClose: false }
              );
            }
          } catch (error) {
            console.log("Cannot fetch userinfo data");
          }
        });
      } else if (User_Type === "TEACHER") {
        notifications.forEach(async (notification) => {
          const {
            examDefinitionName,
            startedtime,
            studentId,
            testTaken,
            creatorId,
          } = notification;
          try {
            const username = await userData(studentId);
            if (
              testTaken === "taken" &&
              creatorId === localStorage.getItem("userId")
            ) {
              toast.info(
                <div>
                  <h3>{examDefinitionName}</h3>
                  <p>Started Time: {new Date(startedtime).toLocaleString()}</p>
                  <p>Student: {username} has taken the exam</p>
                </div>,
                { autoClose: false }
              );
            }
          } catch (error) {
            console.log("Cannot fetch userinfo data");
          }
        });
      }
    };

    displayNotification();
  }, [notifications, User_Type]);

  const userData = async (userId) => {
    try {
      const response = await newGetUserInfo(userId);
      return response.user[0].username;
    } catch (error) {
      console.log("cannot fetch userinfo data");
    }
  };

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
