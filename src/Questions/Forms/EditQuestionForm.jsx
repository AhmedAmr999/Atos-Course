import React, { useState } from "react";
import Input from "../../Shared/Components/Input";
import "../../Users/Pages/auth.css";

const EditQuestionForm = (props) => {
  const {
    loadedSingleQuestion,
    loadedAnswers,
    loadedCorrectAnswers,
    handleInputChange,
    handleCorrectAnswersChange,
    handleAnswersChange,
    handleSubmit,
    userId,
    removeAnswer, 
  } = props;

  const [newAnswer, setNewAnswer] = useState("");

  const addAnswer = () => {
    handleAnswersChange({ target: { value: newAnswer } }, loadedAnswers.length);
    setNewAnswer("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 style={{ textAlign: "center" }}>Edit Question Page</h1>
      <Input
        type="text"
        element="text"
        id="questionName"
        name="questionName"
        label="Question Name"
        value={loadedSingleQuestion.questionName}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        element="text"
        id="category"
        name="category"
        label="Category"
        value={loadedSingleQuestion.category}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        element="text"
        id="subcategory"
        name="subcategory"
        label="Subcategory"
        value={loadedSingleQuestion.subcategory}
        onChange={handleInputChange}
      />
      <Input
        element="text"
        type="text"
        id="expectedTime"
        name="expectedTime"
        label="Expected Time"
        value={loadedSingleQuestion.expectedTime}
        onChange={handleInputChange}
      />
      <Input
        element="text"
        type="text"
        id="mark"
        name="mark"
        label="Mark"
        value={loadedSingleQuestion.mark}
        onChange={handleInputChange}
      />
      <h3>Question Choices</h3>
      {loadedAnswers.map((answer, index) => (
        <div className="answer-item" key={`answer_${index}`}>
          <ul>
            <label htmlFor={`answer_${index}`}>
              <input
                type="checkbox"
                id={`answer_${index}`}
                name={`answer_${index}`}
                value={answer}
                checked={loadedCorrectAnswers.includes(answer)}
                onChange={(event) => handleAnswersChange(event, index)}
              />
              {answer}
              <button
                type="button"
                onClick={() => removeAnswer(index)} // Call removeAnswer function
                style={{ marginLeft: "10px" }}
                className="remove-button"
              >
                Remove
              </button>
            </label>
          </ul>
        </div>
      ))}

      <Input
        element="text"
        type="text"
        value={newAnswer}
        onChange={(event) => setNewAnswer(event.target.value)}
      />
      <button type="button" onClick={addAnswer} className="login-button">
        Add Answer
      </button>
      <h3>Correct Answers</h3>
      {loadedCorrectAnswers.map((answer, index) => (
        <ol key={`answer_${index}`} className="answer-item">
          <label htmlFor={`correctAnswer_${index}`}>
            <input
              type="checkbox"
              id={`correctAnswer_${index}`}
              name={`correctAnswer_${index}`}
              value={answer}
              checked={true}
              onChange={(event) => handleCorrectAnswersChange(event, index)}
            />
            {answer}
          </label>
        </ol>
      ))}

      <button type="submit" className="custom-button">
        Edit Question
      </button>

      <input
        type="hidden"
        name="creatorId"
        value={userId}
        className="custom-button"
      />
    </form>
  );
};

export default EditQuestionForm;
