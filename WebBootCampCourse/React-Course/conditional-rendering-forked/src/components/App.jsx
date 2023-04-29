import React from "react";
import Login from "./Login";

var isLoggedIn = false;
// function renderConditionally() {
//   if (isLoggedIn === true) {
//     return <h1>Hello</h1>;
//   } else {
//     return <Login />;
//   }
// }
const currentTime = new Date().getHours();
console.log(currentTime);
function App() {
  return (
    <div className="container">
      {isLoggedIn ? <h1>Hello</h1> : <Login />}
      {currentTime > 12 ? (
        <h1>Why Are You still working?</h1>
      ) : (
        <h1>Good Job!!</h1>
      )}
    </div>
  );
}

export default App;
