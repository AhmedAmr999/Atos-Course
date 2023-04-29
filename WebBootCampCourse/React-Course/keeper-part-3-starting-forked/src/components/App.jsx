import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  // const [fullNote, setFullNote] = useState({
  //   title: "",
  //   content: ""
  // });

  const [notes, setNotes] = useState([]);

  function addNote(fullNote) {
    setNotes((prevValues) => {
      return [...prevValues, fullNote];
    });
    //console.log(fullNote);
    //setFullNote("");
  }

  function deleteNote(id) {
    console.log("deleted was triggered with id ", id);
    setNotes((prevValues) => {
      return prevValues.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }
  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((note, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={note.title}
            content={note.content}
            onDelete={deleteNote}
          />
        );
      })}
      {/* <Note key={1} title="Note title" content="Note content" /> */}
      <Footer />
    </div>
  );
}

export default App;
