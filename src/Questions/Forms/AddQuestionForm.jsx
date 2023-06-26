import React, { useState } from "react";
import Input from "../../Shared/Components/Input";
import "../../Users/Pages/auth.css";
import { addQuestion } from "../../Shared/APIS/QuestionsAPI";

const AddQuestionForm = () => {
  const [questionInfo, setQuestionInfo] = useState({
    questionName: "",
    category: "",
    subcategory: "",
    expectedTime: "",
    timeUnit: "min",
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

  const handleUnitChange = (event) => {
    const { value } = event.target;
    setQuestionInfo((prevQuestionInfo) => ({
      ...prevQuestionInfo,
      timeUnit: value,
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

  const handleDeleteAnswer = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.splice(index, 1);
    setAnswers(updatedAnswers);

    const updatedCorrectAnswers = correctAnswers.filter(
      (answer) => answer !== answers[index]
    );
    setCorrectAnswers(updatedCorrectAnswers);
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const isAddQuestionVisible =
    answers.length >= 2 && correctAnswers.length >= 1;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedExpectedTime = `${questionInfo.expectedTime}${questionInfo.timeUnit}`;

    await addQuestion(
      { ...questionInfo, expectedTime: formattedExpectedTime },
      answers,
      correctAnswers
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Please Add Question</h2>
      <Input
        id="questionName"
        element="text"
        onChange={handleStaticFieldChange}
        type="text"
        placeholder="Add Your Question?"
        name="questionName"
        value={questionInfo.questionName}
        required
        minLength={6}
      />
      <Input
        id="category"
        element="text"
        onChange={handleStaticFieldChange}
        type="text"
        placeholder="Add Your category?"
        name="category"
        value={questionInfo.category}
        required
        minLength={3}
      />
      <Input
        id="subcategory"
        element="text"
        onChange={handleStaticFieldChange}
        type="text"
        placeholder="Add Your subcategory?"
        name="subcategory"
        value={questionInfo.subcategory}
        required
        minLength={4}
      />
      <div className="expected-time-container">
        <Input
          element="number"
          id="expectedTime"
          type="number"
          placeholder="Add Your expectedTime?"
          name="expectedTime"
          value={questionInfo.expectedTime}
          onChange={handleStaticFieldChange}
          required
          min={1}
        />
        <select
          name="timeUnit"
          value={questionInfo.timeUnit}
          onChange={handleUnitChange}
        >
          <option value="min">min</option>
          <option value="sec">sec</option>
        </select>
      </div>
      <Input
        id="mark"
        element="number"
        onChange={handleStaticFieldChange}
        type="number"
        placeholder="Add Your Mark?"
        name="mark"
        value={questionInfo.mark}
        required
      />
      {answers.map((answer, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={correctAnswers.includes(answer)}
            onChange={(e) => handleCorrectAnswerChange(e, answer)}
          />
          <input
            id={index}
            type="text"
            value={answer}
            placeholder="Add Your Answer?"
            name="answers"
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required
          />
          <span
            className="delete-icon"
            onClick={() => handleDeleteAnswer(index)}
          >
            <i class="material-icons">delete</i>
          </span>
        </div>
      ))}
      <button
        className="login-button"
        type="button"
        onClick={handleButtonClick}
      >
        Add Answer
      </button>
      {isAddQuestionVisible && (
        <button className="custom-button" type="submit">
          Add Question
        </button>
      )}
    </form>
  );
};
export default AddQuestionForm;
