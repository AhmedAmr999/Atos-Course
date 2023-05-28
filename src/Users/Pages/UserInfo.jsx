import React, { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
import LoadingSpinner from "../../Shared/Components/LoadingSpinner";
import { fetchUserInfo } from "../../Shared/APIS/AuthenticationAPI";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchUserInfo();
      setUserInfo(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner overlay />;
  }

  if (!userInfo) {
    return <h1>User Info Not Found</h1>;
  }

  return (
    <div>
      <Card className="authentication">
        <h2>User Info</h2>
        <p>Username: {userInfo.username}</p>
        <p>User Type: {userInfo.userType}</p>
      </Card>
    </div>
  );
};

export default UserInfo;
