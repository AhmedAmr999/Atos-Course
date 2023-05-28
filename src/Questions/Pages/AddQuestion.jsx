import React, { useState } from "react";
import Card from "../../Shared/Components/Card";
import { addQuestion } from "../../Shared/APIS/QuestionsAPI";
import AddQuestionForm from "../Forms/AddQuestionForm";
import "../../Users/Pages/auth.css";

const AddQuestion = () => {
  const [questionInfo, setQuestionInfo] = useState({
    questionName: "",
    category: "",
    subcategory: "",
    expectedTime: "",
    mark: "",
  });
  const [answers, setAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleStaticFieldChange = (event) => {
    const { name, value } = event.target;
    setQuestionInfo((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    setAnswers([...answers, ""]);
  };

  const handleCorrectAnswerChange = (event, value) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setCorrectAnswers([...correctAnswers, value]);
    } else {
      const updatedCorrectAnswers = correctAnswers.filter(
        (answer) => answer !== value
      );
      setCorrectAnswers(updatedCorrectAnswers);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addQuestion(questionInfo, answers, correctAnswers);
  };

  return (
    <React.Fragment>
      <h1 className="authentication">Lets Torture The Students!!!!</h1>
      <Card className="addQuestionForm">
        <AddQuestionForm
          questionInfo={questionInfo}
          answers={answers}
          correctAnswers={correctAnswers}
          handleStaticFieldChange={handleStaticFieldChange}
          handleButtonClick={handleButtonClick}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAnswerChange={handleAnswerChange}
          handleSubmit={handleSubmit}
        />
      </Card>
    </React.Fragment>
  );
};

export default AddQuestion;
