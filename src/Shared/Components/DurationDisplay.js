import React from "react";

const DurationDisplay = ({ duration }) => {
  const minutes = parseInt(duration);
  let formattedDuration;

  if (minutes === 1) {
    formattedDuration = "1 minute";
  } else {
    formattedDuration = `${minutes} minutes`;
  }

  return <span>{formattedDuration}</span>;
};

export default DurationDisplay;
