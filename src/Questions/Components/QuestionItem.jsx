import React, { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
// import "./QuestionItem.css";
import { NavLink } from "react-router-dom";
import {
  fetchAnswers,
  deleteQuestionAndAnswers,
} from "../../Shared/APIS/QuestionsAPI";
import "../../Exams/Pages/AllExamInstances.css";

const QuestionItem = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadedAnswers, setLoadedAnswers] = useState([]);

  useEffect(() => {
    const getAnswers = async () => {
      try {
        const response = await fetchAnswers(props.id);
        const answers = response.answers;
        setLoadedAnswers(answers);
      } catch (error) {
        console.error("Failed to fetch answers:", error);
      }
    };

    getAnswers();
  }, [props.id]);

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.id));
  };

  const isCurrentUserCreator =
    localStorage.getItem("userId") === props.creatorId;

  const handleDeleteQuestion = async () => {
    await deleteQuestionAndAnswers(props.id);
    window.location.reload();
  };

  return (
    <Card className="card">
      <h1 className="exam-name">{props.questionName}</h1>
      {isCurrentUserCreator && (
        <NavLink to={`/${props.id}/editQuestion`} className="view-link">
          Edit Question
        </NavLink>
      )}
      {localStorage.getItem("userType") === "ADMIN" && (
        <button type="button" onClick={handleDeleteQuestion}>
          Delete Question
        </button>
      )}
      {loadedAnswers.length > 0 &&
        loadedAnswers.map((answer, index) => (
          <React.Fragment key={`answer_${index}`}>
            <ol key={`answer_${index}`} className="answer-item">
              <input
                id={index}
                type="radio"
                value={answer}
                onChange={handleOptionChange}
                checked={selectedOption === index}
              />
              <label htmlFor={index}>{answer}</label>
            </ol>
          </React.Fragment>
        ))}
    </Card>
  );
};

export default QuestionItem;
