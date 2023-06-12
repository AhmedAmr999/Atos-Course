import React from "react";
import Input from "../../Shared/Components/Input";
import "../../Users/Pages/auth.css";

const AddQuestionForm = ({
  questionInfo,
  answers,
  correctAnswers,
  handleStaticFieldChange,
  handleButtonClick,
  handleCorrectAnswerChange,
  handleAnswerChange,
  handleSubmit,
}) => {
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
        <Input
          id="expectedTime"
          element="text"
          onChange={handleStaticFieldChange}
          type="text"
          placeholder="Add Your expectedTime?"
          name="expectedTime"
          value={questionInfo.expectedTime}
          required
          minLength={2}
        />
        <Input
          id="mark"
          element="text"
          onChange={handleStaticFieldChange}
          type="text"
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
          </div>
        ))}
        <button
          className="login-button"
          type="button"
          onClick={handleButtonClick}
        >
          Add Answer
        </button>
        <button className="custom-button" type="submit">
          Add Question
        </button>
      </form>
  );
};
export default AddQuestionForm;
