import React from "react";
import Card from "../../Shared/Components/Card";
import "./UserInfo.css";
const UserInfo = ({ username, User_Type }) => {
  return (
    <div className="userInfo-container">
      <Card className="userInfo-card">
        <h2>User Info</h2>
        <p>Username: {username}</p>
        <p>User Type: {User_Type}</p>
      </Card>
    </div>
  );
};

export default UserInfo;
