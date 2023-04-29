import React from "react";
import AvatarImage from "./Avatar";
import DetailInfo from "./Detail";

function Card(props) {
  return (
    <div className="card">
      <div className="top">
        <p>{props.id}</p>
        <h2 className="name">{props.name}</h2>
        <AvatarImage img={props.img} />
      </div>
      <div className="bottom">
        <DetailInfo detailInfo={props.tel} />
        <DetailInfo detailInfo={props.email} />
      </div>
    </div>
  );
}

export default Card;
