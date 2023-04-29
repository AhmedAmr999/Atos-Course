import React, { useState } from "react";

function App() {
  setInterval(UpdateTime, 1000);
  const now = new Date().toLocaleTimeString();
  console.log(now);

  const [time, setTime] = useState(now);
  function UpdateTime() {
    const newTime = new Date().toLocaleTimeString();
    setTime(newTime);
  }

  return (
    <div className="container">
      <h1>{time}</h1>
      <button onClick={UpdateTime}>Get Time</button>
    </div>
  );
}

export default App;
