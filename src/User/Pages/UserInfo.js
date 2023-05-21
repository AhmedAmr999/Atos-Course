import { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
import "./auth.css";
import LoadingSpinner from '../../Shared/Components/LoadingSpinner';
const UserInfo = () => {
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log(localStorage.getItem("token"));
      try {
        const response = await fetch(
          `http://localhost:3001/users/profileInfo`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        localStorage.setItem("userId", data.userId);
        setUserInfo(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner overlay/>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div>
        <h1>User Info Not Found</h1>
      </div>
    );
  }

  return (
    <div>
      <Card className="authentication">
        <h2>User Info</h2>
        <p>Username: {userInfo.username}</p>
        <p>userType: {userInfo.userType}</p>
      </Card>
    </div>
  );
};

export default UserInfo;
