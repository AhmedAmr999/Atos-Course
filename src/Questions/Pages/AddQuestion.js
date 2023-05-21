import React, { useState } from "react";
import Card from "../../Shared/Components/Card";
import Input from "../../Shared/Components/Input";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../../User/Pages/auth.css";
const AddQuestion = () => {
  let responseData;
  let data;
  const history = useHistory();
  const [questionInfo, setQuestionInfo] = useState({
    questionName: "",
    category: "",
    subcategory: "",
    expectedTime: "",
    mark: "",
    correctAnswers: [],
    answers: [],
  });
  const [textFields, setTextFields] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleStaticFieldChange = (event) => {
    const { name, value } = event.target;
    setQuestionInfo((prevValues) => {
      if (name === "questionName") {
        return {
          questionName: value,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          answers: prevValues.answers,
          mark: prevValues.mark,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "category") {
        return {
          questionName: prevValues.questionName,
          category: value,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          answers: prevValues.answers,
          mark: prevValues.mark,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "subcategory") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: value,
          expectedTime: prevValues.expectedTime,
          answers: prevValues.answers,
          mark: prevValues.mark,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "expectedTime") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: value,
          answers: prevValues.answers,
          mark: prevValues.mark,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "answers") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          answers: value,
          mark: prevValues.mark,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "mark") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          answers: prevValues.answers,
          mark: value,
          correctAnswers: prevValues.correctAnswers,
        };
      } else if (name === "correctAnswers") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          answers: value,
          mark: prevValues.mark,
          correctAnswers: value,
        };
      }
    });
  };
  const handleButtonClick = () => {
    setTextFields([...textFields, ""]);
  };

  const handleCorrectAnswerButtonClick = () => {
    setCorrectAnswers([...correctAnswers, ""]);
  };

  const handleCorrectAnswerFieldChange = (index, value) => {
    const updatedTextFields = [...correctAnswers];
    updatedTextFields[index] = value;
    setCorrectAnswers(updatedTextFields);
  };

  const handleTextFieldChange = (index, value) => {
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = value;
    setTextFields(updatedTextFields);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(questionInfo.questionName);
    console.log(questionInfo.category);
    console.log(questionInfo.subcategory);
    console.log(questionInfo.expectedTime);
    console.log(textFields);
    console.log(correctAnswers);
    try {
      responseData = await fetch(
        "http://localhost:3000/questions/addQuestion",
        {
          method: "POST",
          body: JSON.stringify({
            questionName: questionInfo.questionName,
            category: questionInfo.category,
            subcategory: questionInfo.subcategory,
            expectedTime: questionInfo.expectedTime,
            mark: questionInfo.mark,
            answers: textFields,
            correctAnswers: correctAnswers,
            creatorId: localStorage.getItem("userId"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      data = await responseData.json();
      console.log(data.message);
      if (data.message === "success") {
        history.push("/users/profileInfo");
        alert("Question Added Successfully");
      } else {
        history.push("/");
        alert("please check Your Credentials");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Lets Torture The Students!!!!</h1>
      <Card className="authentication">
        <h2> Please Add Question</h2>
        <form onSubmit={handleSubmit}>
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
            onChan
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

          {textFields.map((value, index) => (
            <Input
              key={index}
              id={index}
              element="text"
              type="text"
              value={value}
              placeholder="Add Your Answer?"
              username="answers"
              onChange={(e) => handleTextFieldChange(index, e.target.value)}
              required
            />
          ))}

          {correctAnswers.map((value, index) => (
            <Input
              key={index}
              id={index}
              element="text"
              type="text"
              value={value}
              placeholder="Add Your CorrectAnswers?"
              username="correctAnswers"
              onChange={(e) =>
                handleCorrectAnswerFieldChange(index, e.target.value)
              }
              required
            />
          ))}
          <button
            className="login-button"
            type="button"
            onClick={handleButtonClick}
          >
            Add Answer
          </button>

          <button
            className="signup-button "
            type="button"
            onClick={handleCorrectAnswerButtonClick}
          >
            Add Correct Answers
          </button>
          <button className="custom-button" type="submit">
            Add Question
          </button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default AddQuestion;
