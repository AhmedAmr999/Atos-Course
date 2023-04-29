import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


// const ahmed = "ahmed";
// const currentTime = new Date(2019, 1, 1, 12).getHours();
// var greeting;

// const customStyle={
//   color:""
// }
// if (currentTime < 12) {
//   greeting = "Good Morning";
//   customStyle.color="red";
// } else if (currentTime < 18) {
//   greeting = "Good AfterNoon";
//   customStyle.color="green";
// } else {
//   greeting = "Good Night";
//   customStyle.color="blue";
// }



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
