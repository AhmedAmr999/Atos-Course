import React, { useState, useEffect } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Card from "../../Shared/Components/Card";
import Input from "../../Shared/Components/Input";

const EditQuestion = (props) => {
  const [loadedSingleQuestion, setLoadedSingleQuestion] = useState("");
  const questionId = useParams().qid;
  const history = useHistory();
  const [loadedAnswers, setLoadedAnswers] = useState([]);
  const [loadedCorrectAnswers, setLoadedCorrectAnswers] = useState([]);
  let responseData, jsonData;
  useEffect(() => {
    fetchSingleQuestion();
    fetchAnswers();
  }, []);

  const fetchSingleQuestion = async () => {
    try {
      responseData = await fetch(
        `http://localhost:3000/questions/${questionId}`
      );
      jsonData = await responseData.json();
      if (jsonData.message === "Found Question Successfully") {
        setLoadedSingleQuestion(jsonData.question);
      } else {
        return <h1>CouldNot Find Question</h1>;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAnswers = async () => {
    try {
      const responseData = await fetch(
        `http://localhost:3000/questions/${questionId}/Answers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await responseData.json();
      setLoadedCorrectAnswers(jsonData.answers[0].correctAnswers);
      setLoadedAnswers(jsonData.answers[0].answers);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const respoonseUpdateQuestion = await fetch(
        `http://localhost:3000/questions/updateQuestion/${questionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            questionName: loadedSingleQuestion.questionName,
            category: loadedSingleQuestion.category,
            subcategory: loadedSingleQuestion.subcategory,
            expectedTime: loadedSingleQuestion.expectedTime,
            mark: loadedSingleQuestion.mark,
            answers: loadedAnswers,
            correctAnswers: loadedCorrectAnswers,
            creatorId: localStorage.getItem("userId"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await respoonseUpdateQuestion.json();
      history.push("/questions");
      alert("Question updated Successfully");
    } catch (error) {}
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoadedSingleQuestion((prevValues) => {
      if (name === "questionName") {
        return {
          questionName: value,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          mark: prevValues.mark,
        };
      } else if (name === "category") {
        return {
          questionName: prevValues.questionName,
          category: value,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          mark: prevValues.mark,
        };
      } else if (name === "subcategory") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: value,
          expectedTime: prevValues.expectedTime,
          mark: prevValues.mark,
        };
      } else if (name === "expectedTime") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: value,
          mark: prevValues.mark,
        };
      } else if (name === "mark") {
        return {
          questionName: prevValues.questionName,
          category: prevValues.category,
          subcategory: prevValues.subcategory,
          expectedTime: prevValues.expectedTime,
          mark: value,
        };
      }
    });
  };
  const handleCorrectAnswersChange = (event, index) => {
    const { name, value } = event.target;
    setLoadedCorrectAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };
  const handleAnswersChange = (event, index) => {
    const { value } = event.target;
    setLoadedAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  return (
    <Card>
      <h1 style={{ textAlign: "center" }}>Edit Question Page</h1>
      <form onSubmit={handleSubmit}>
        <Input
          element="text"
          id="questionName"
          name="questionName"
          label="questionName"
          type="text"
          value={loadedSingleQuestion.questionName}
          onChange={handleChange}
        />
        <Input
          element="text"
          id="category"
          name="category"
          label="Category"
          type="text"
          value={loadedSingleQuestion.category}
          onChange={handleChange}
        />
        <Input
          element="text"
          id="subcategory"
          name="subcategory"
          label="Subcategory"
          type="text"
          value={loadedSingleQuestion.subcategory}
          onChange={handleChange}
        />
        <Input
          element="text"
          id="expectedTime"
          name="expectedTime"
          label="ExpectedTime"
          type="text"
          value={loadedSingleQuestion.expectedTime}
          onChange={handleChange}
        />
        <Input
          element="text"
          id="mark"
          name="mark"
          label="Mark"
          type="text"
          value={loadedSingleQuestion.mark}
          onChange={handleChange}
        />
        <h3>Question Choices</h3>
        {loadedAnswers.map((answer, index) => (
          <React.Fragment key={`answer_${index}`}>
            <ol key={`answer_${index}`} className="answer-item">
              <Input
                element="text"
                id={index}
                type="text"
                value={answer}
                onChange={(event) => handleAnswersChange(event, index)}
              />
            </ol>
          </React.Fragment>
        ))}
        <h3>Correct Answers</h3>
        {loadedCorrectAnswers.map((answer, index) => (
          <React.Fragment key={`answer_${index}`}>
            <ol key={`answer_${index}`} className="answer-item">
              <Input
                element="text"
                id={index}
                type="text"
                value={answer}
                name="correctAnswers"
                onChange={(event) => handleCorrectAnswersChange(event, index)}
              />
            </ol>
          </React.Fragment>
        ))}

        <button type="submit">Edit Question</button>
      </form>
    </Card>
  );
};
export default EditQuestion;
