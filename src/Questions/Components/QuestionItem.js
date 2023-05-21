import React, { useState, useEffect } from "react";
import Card from "../../Shared/Components/Card";
import "./QuestionItem.css";
import { NavLink } from "react-router-dom";

const QuestionItem = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadedAnswers, setLoadedAnswers] = useState([]);
  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.id));
    console.log("selected option is = ", e.target.value);
  };

  useEffect(() => {
    fetchAnswers();
    //deleteQuestionAndAnswers();
  }, [loadedAnswers]);

  const fetchAnswers = async () => {
    try {
      const responseData = await fetch(
        `http://localhost:3000/questions/${props.id}/Answers`
      );
      const jsonData = await responseData.json();
      setLoadedAnswers(jsonData.answers[0].answers);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestionAndAnswers = async () => {
    try {
      await fetch(
        `http://localhost:3000/questions/deleteQuestion/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <li className="question-item">
        <Card className="question-item__content ">
          <div className="top-right">
            <p>{props.mark}</p>
          </div>
          <h1>{props.questionName}</h1>
          {localStorage.getItem("userId") === props.creatorId  && (
              <NavLink to={`/${props.id}/editQuestion`}>Edit Question</NavLink>
            )}
          {localStorage.getItem("userId") === props.creatorId && (
            <button type="button" onClick={deleteQuestionAndAnswers}>
              Delete Question
            </button>
          )}
          {loadedAnswers.map((answer, index) => (
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
      </li>
    </div>
  );
};

export default QuestionItem;
