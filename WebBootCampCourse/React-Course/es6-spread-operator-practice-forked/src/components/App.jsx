import React, { useState } from "react";

function App() {
  const [addList, setAddList] = useState("");
  const [items, setItems] = useState([]);
  function handleLists(event) {
    const newValue = event.target.value;
    setAddList(newValue);
  }

  function handleSubmit() {
    console.log("submitted");
    setItems((prevItems) => {
      return [...prevItems, addList];
    });
    setAddList("");
  }
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input type="text" onChange={handleLists} value={addList} name="list" />
        <button onClick={handleSubmit}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {items.map((todoItem) => (
            <li>{todoItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
