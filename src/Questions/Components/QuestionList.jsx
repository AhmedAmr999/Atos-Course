import React from "react";
import Card from "../../Shared/Components/Card";
import QuestionItem from "./QuestionItem";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
const QuestionList = (props) => {
  if (props.questions.length === 0) {
    return (
      <div>
        <Card className="center-warning">
          <h2>No Questions Found!!</h2>
        </Card>
      </div>
    );
  }
  return (
    <div className="question-list">
      {props.questions.map((question) => (
        <QuestionItem
          key={question._id}
          id={question._id}
          questionName={question.questionName}
          mark={question.mark}
          creatorId={question.creatorId}
        />
      ))}
    </div>
  );
};

export default QuestionList;
