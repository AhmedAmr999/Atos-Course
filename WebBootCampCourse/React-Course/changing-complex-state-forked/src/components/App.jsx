import React, { useState } from "react";

function App() {
  const [fullName, setFullName] = useState({
    fName: "",
    lName: ""
  });
  //const [LastName, setLastName] = useState("");

  function handleChange(event) {
    //console.log(event.target.value);
    // const newValue = event.target.value;
    // const inputName = event.target.name;
    const { value, name } = event.target;
    //setFullName();
    console.log(name);
    console.log(value);
    setFullName((prevValue) => {
      if (name === "fName") {
        return {
          fName: value,
          lName: prevValue.lName
        };
      } else if (name === "lName") {
        return {
          fName: prevValue.fName,
          lName: value
        };
      }
    });
  }

  // function handleLastName(event) {
  //   console.log(event.target.value);
  //   setLastName(event.target.value);
  // }
  return (
    <div className="container">
      <h1>
        Hello {fullName.fName} {fullName.lName}
      </h1>
      <form>
        <input
          name="fName"
          placeholder="First Name"
          onChange={handleChange}
          value={fullName.fName}
        />
        <input
          name="lName"
          placeholder="Last Name"
          onChange={handleChange}
          value={fullName.lName}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
