import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Card from "../../Shared/Components/Card";
import {
  fetchSingleQuestion,
  fetchAnswers,
  updateQuestion,
} from "../../Shared/APIS/QuestionsAPI";
import EditQuestionForm from "../Forms/EditQuestionForm";
import "../../Users/Pages/auth.css";

const EditQuestion = (props) => {
  const [loadedSingleQuestion, setLoadedSingleQuestion] = useState(null);
  const { qid } = useParams();
  const history = useHistory();
  const [answers, setAnswers] = useState([]); // Define 'answers' state
  const [loadedCorrectAnswers, setLoadedCorrectAnswers] = useState([]);
  const [answerId, setAnswerId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const question = await fetchSingleQuestion(qid);
        setLoadedSingleQuestion(question);
        const { answers, correctAnswers } = await fetchAnswers(qid);
        setAnswers(answers); // Set 'answers' state
        setLoadedCorrectAnswers(correctAnswers);
        setAnswerId(question.answersId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [qid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateQuestion(
        qid,
        loadedSingleQuestion,
        localStorage.getItem("userId"),
        answers, // Pass 'answers' state
        loadedCorrectAnswers
      );
      history.push("/questions");
      alert("Question updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoadedSingleQuestion((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCorrectAnswersChange = (event, index) => {
    const { value } = event.target;
    setLoadedCorrectAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  const handleAnswersChange = (event, index) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
    setLoadedCorrectAnswers((prevCorrectAnswers) => {
      if (prevCorrectAnswers.includes(value)) {
        return prevCorrectAnswers.filter((answer) => answer !== value);
      } else {
        return [...prevCorrectAnswers, value];
      }
    });
  };

  const removeAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    const updatedCorrectAnswers = loadedCorrectAnswers.filter(
      (_, i) => i !== index
    );

    setAnswers(updatedAnswers);
    setLoadedCorrectAnswers(updatedCorrectAnswers);
  };

  return (
    <Card className="addQuestionForm">
      {loadedSingleQuestion && (
        <EditQuestionForm
          loadedSingleQuestion={loadedSingleQuestion}
          loadedAnswers={answers} // Pass 'answers' state
          loadedCorrectAnswers={loadedCorrectAnswers}
          handleInputChange={handleInputChange}
          handleCorrectAnswersChange={handleCorrectAnswersChange}
          handleAnswersChange={handleAnswersChange}
          handleSubmit={handleSubmit}
          userId={localStorage.getItem("userId")}
          answerId={answerId}
          removeAnswer={removeAnswer} // Pass the removeAnswer function
        />
      )}
    </Card>
  );
};

export default EditQuestion;
