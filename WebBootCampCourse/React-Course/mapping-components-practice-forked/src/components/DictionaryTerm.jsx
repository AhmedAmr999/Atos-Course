import React from "react";

function DictionaryTerm(props) {
  return (
    <div className="term">
      <dt>
        <span className="emoji" role="img" aria-label="Tense Biceps">
          {props.emoji}
        </span>
        <span>{props.name}</span>
      </dt>
      <dd>
        {/* “You can do that!” or “I feel strong!” Arm with tense biceps. Also used
        in connection with doing sports, e.g. at the gym. */}
        {props.meaning}
      </dd>
    </div>
  );
}

export default DictionaryTerm;
