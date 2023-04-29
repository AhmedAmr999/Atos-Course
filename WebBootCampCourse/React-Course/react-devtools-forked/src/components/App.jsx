import React from "react";
import Card from "./Card";
import contacts from "../contacts";
import AvatarImage from "./Avatar";

function createCard(contact) {
  return (
    <Card
      id={contact.id}
      key={contact.id}
      name={contact.name}
      img={contact.imgURL}
      tel={contact.phone}
      email={contact.email}
    />
  );
}
function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      <AvatarImage img="data:image/jpeg;base64,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" />

      {contacts.map(createCard)}
      {/* <Card
        name={contacts[0].name}
        img={contacts[0].imgURL}
        tel={contacts[0].phone}
        email={contacts[0].email}
      />
      <Card
        name={contacts[1].name}
        img={contacts[1].imgURL}
        tel={contacts[1].phone}
        email={contacts[1].email}
      />
      <Card
        name={contacts[2].name}
        img={contacts[2].imgURL}
        tel={contacts[2].phone}
        email={contacts[2].email}
      /> */}
    </div>
  );
}

export default App;
