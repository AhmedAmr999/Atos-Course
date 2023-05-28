import React, { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
import { useHistory } from "react-router-dom";
import { login, signup } from "../../Shared/APIS/AuthenticationAPI";
import "./auth.css";
import AuthForm from "../Components/AuthForm";
import AddAdminForm from "../Components/AddAdminForm";

const Auth = ({ onLogin, isSuperAdmin }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    userType: selectedOption,
  });

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const switchModeHandler = () => {
    setIsLoggedIn((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!isSuperAdmin) {
        history.replace("/users/userInfo");
      } else {
        history.replace("/users/addAdmin");
      }
    }
  }, [history, isSuperAdmin]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isLoggedIn) {
        await login(userInfo.username, userInfo.password);
        alert("Logged In Successfully");
        onLogin();
      } else {
        await signup(userInfo.username, userInfo.password, selectedOption);
        alert("Signed Up Successfully");
        onLogin();
      }

      if (isSuperAdmin) {
        history.replace("/users/addAdmin");
      } else {
        history.replace("/users/userInfo");
      }
    } catch (error) {
      console.log(error);
      alert("Please check your credentials.");
      history.push("/auth");
    }
  };

  const handleAddAdmin = async (event) => {
    event.preventDefault();

    try {
      await signup(userInfo.username, userInfo.password, selectedOption);
      alert("Admin added successfully");
      history.push("/users/addAdmin");
    } catch (error) {
      console.log(error);
      alert("Please check your credentials.");
      history.push("/");
    }
  };

  return (
    <Card className="authentication">
      {isSuperAdmin && (
        <React.Fragment>
          <h2>Add Admin</h2>
          <AddAdminForm
            onSubmit={handleAddAdmin}
            selectedOption={selectedOption}
            handleOptionChange={handleOptionChange}
            handleChange={handleChange}
            userInfo={userInfo}
          />
        </React.Fragment>
      )}

      {!localStorage.getItem("token") && !isSuperAdmin && (
        <AuthForm
          onSubmit={handleSubmit}
          selectedOption={selectedOption}
          handleOptionChange={handleOptionChange}
          handleChange={handleChange}
          userInfo={userInfo}
          isLoggedIn={isLoggedIn}
          onClick={switchModeHandler}
        />
      )}
    </Card>
  );
};

export default Auth;
