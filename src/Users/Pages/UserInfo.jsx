import React from "react";
import Card from "../../Shared/Components/Card";

const UserInfo = ({ username, User_Type }) => {
  return (
    <div>
      <Card className="authentication">
        <h2>User Info</h2>
        <p>Username: {username}</p>
        <p>User Type: {User_Type}</p>
      </Card>
    </div>
  );
};

export default UserInfo;
