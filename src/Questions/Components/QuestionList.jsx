import React from "react";
import Card from "../../Shared/Components/Card";
import QuestionItem from "./QuestionItem";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "./QuestionItem.css";
const QuestionList = (props) => {
  if (props.questions.length === 0) {
    return (
      <div>
        <Card className="center-warning">
          <h2>No Questions Found!!</h2>
          {localStorage.getItem("userType") === "TEACHER" && (
            <NavLink to="/questions/addQuestion">Add Question</NavLink>
          )}
        </Card>
      </div>
    );
  }
  return (
    <ul>
      {props.questions.map((question) => (
        <QuestionItem
          key={question._id}
          id={question._id}
          questionName={question.questionName}
          mark={question.mark}
          creatorId={question.creatorId}
        />
      ))}
    </ul>
  );
};

export default QuestionList;
