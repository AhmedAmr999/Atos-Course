import React, { useState } from "react";
import Card from "../../Shared/Components/Card";
import "../../Shared/Components/Input.css";
import Input from "../../Shared/Components/Input";
import { useHistory } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import "./auth.css";

const Auth = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const history = useHistory();
  //const navigate = useNavigate();
  let data, responseData;
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    userType: selectedOption,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevValues) => {
      if (name === "username") {
        return {
          username: value,
          password: prevValues.password,
          userType: prevValues.userType,
        };
      } else if (name === "password") {
        return {
          username: prevValues.username,
          password: value,
          userType: prevValues.userType,
        };
      } else if (name === "userType") {
        return {
          username: prevValues.username,
          password: prevValues.password,
          userType: value,
        };
      }
    });
  };

  const switchModeHandler = () => {
    setIsLoggedIn((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userInfo.username);
    console.log(userInfo.password);
    console.log(selectedOption);

    if (isLoggedIn) {
      try {
        responseData = await fetch("http://localhost:3001/users/login", {
          method: "POST",
          body: JSON.stringify({
            username: userInfo.username,
            password: userInfo.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        data = await responseData.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.userId);
        if (data.message === "success") {
          alert(`Logged In Successfully `);
          history.replace("/users/profileInfo");
          window.location.reload();
        } else {
          alert("please check your credentials....");
          history.push("/auth");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        responseData = await fetch("http://localhost:3001/users/signup", {
          method: "POST",
          body: JSON.stringify({
            username: userInfo.username,
            password: userInfo.password,
            userType: selectedOption,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        data = await responseData.json();
        console.log("SIGNUP");
        console.log(data, " in signup");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.userId);
        if (data.message === "success") {
          alert(`Signed Up Successfully `);
          history.replace("/users/profileInfo");
          window.location.reload();
        } else {
          history.push("/auth");
          alert("please check Your Credentials");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const AddAdmin = async (event) => {
    responseData = await fetch("http://localhost:3001/users/signup", {
      method: "POST",
      body: JSON.stringify({
        username: userInfo.username,
        password: userInfo.password,
        userType: selectedOption,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await responseData.json();
    if (data.message === "success") {
      history.push("/users/addAdmin");
      alert("admin added Successfully");
    } else {
      history.push("/");
      alert("please check Your Credentials");
    }
  };

  return (
    <Card className="authentication">
      {localStorage.getItem("token") === null && (
        <h2> {!isLoggedIn ? "SIGNUP" : "LOGIN"} Required!!</h2>
      )}
      {localStorage.getItem("userType") === "SUPER_ADMIN" && <h2>Add Admin</h2>}
      {localStorage.getItem("userType") === "SUPER_ADMIN" && (
        <form action="" onSubmit={AddAdmin}>
          <Input
            id="username"
            element="text"
            onChange={handleChange}
            type="text"
            placeholder="What's Admin username?"
            name="username"
            value={userInfo.username}
            required
            minLength={5}
          />

          <Input
            id="password"
            element="password"
            onChange={handleChange}
            placeholder="What's Admin password?"
            name="password"
            value={userInfo.password}
            required
            minLength={6}
          />
          <Input
            id="ADMIN"
            element="radio"
            label="ADMIN"
            type="radio"
            value="ADMIN"
            checked={selectedOption === "ADMIN"}
            onChange={handleOptionChange}
            required
          />
          <button className="login-button" type="submit">
            Add Admin
          </button>
        </form>
      )}
      {!localStorage.getItem("token") && (
        <form onSubmit={handleSubmit}>
          <Input
            id="username"
            element="text"
            onChange={handleChange}
            type="text"
            placeholder="What's your username?"
            name="username"
            value={userInfo.username}
            required
            minLength={5}
          />

          <Input
            id="password"
            element="password"
            onChange={handleChange}
            placeholder="What's your password?"
            name="password"
            value={userInfo.password}
            required
            minLength={6}
          />
          {!isLoggedIn && (
            <Input
              id="STUDENT"
              element="radio"
              label="STUDENT"
              value="STUDENT"
              checked={selectedOption === "STUDENT"}
              onChange={handleOptionChange}
              required
            />
          )}

          {!isLoggedIn && (
            <Input
              id="TEACHER"
              element="radio"
              label="TEACHER"
              type="radio"
              value="TEACHER"
              checked={selectedOption === "TEACHER"}
              onChange={handleOptionChange}
              required
            />
          )}

          <button className="login-button" type="submit">
            {isLoggedIn ? "LOGIN" : "SIGNUP"}
          </button>

          <button
            type="button"
            className="signup-button "
            onClick={switchModeHandler}
          >
            SWITCH TO {isLoggedIn ? "SIGNUP" : "LOGIN"}
          </button>
        </form>
      )}
    </Card>
  );
};

export default Auth;
