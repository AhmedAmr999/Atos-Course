import React from "react";
import Card from "../../Shared/Components/Card";
import QuestionItem from "./QuestionItem";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

const QuestionList = (props) => {
  console.log(props.answers);

  if (props.questions.length === 0) {
    return (
      <div>
        <Card>
          <h2>No Questions Found!!</h2>
          {localStorage.getItem("userType") === "TEACHER" && (
            <NavLink to="/questions/addQuestions">Add Question</NavLink>
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
