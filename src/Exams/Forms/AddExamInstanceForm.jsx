import React, { useState, useEffect } from "react";
import { getAllExams } from "../../Shared/APIS/ExamsDefinitionAPI";

import { newGetAllUsers } from "../../Shared/APIS/AuthenticationAPI";
import {
  fetchAnswers,
  fetchSingleQuestion,
} from "../../Shared/APIS/QuestionsAPI";
import { addExamInstance } from "../../Shared/APIS/ExamsInstanceAPI";
import Input from "../../Shared/Components/Input";
import "./addExamInstanceForm.css";
import Card from "../../Shared/Components/Card";

const AddExamInstanceForm = () => {
  const [loadedNewUsers, setLoadedNewUsers] = useState([]);
  const [loadedExams, setLoadedExams] = useState([]);
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [startedTime, setStartedTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [selectedExamDefinition, setSelectedExamDefinition] = useState(
    loadedExams.length > 0 ? loadedExams[0].examdefinition_id : ""
  );
  const [selectedUsersOption, setSelectedUsersOption] = useState("");
  const [loadedAnswers, setLoadedAnswers] = useState([]);

  const status = "absent";
  let selectedExam;

  useEffect(() => {
    // getUsers();
    getExams();
    getNewUsers();
    //getQuestions();
  }, []);

  const getNewUsers = async () => {
    try {
      const data = await newGetAllUsers();
      setLoadedNewUsers(data.users);
    } catch (error) {}
  };

  const getExams = async () => {
    try {
      const data = await getAllExams();
      setLoadedExams(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // const getQuestions = async () => {
  //   try {
  //     const data = await getAllQuestions();
  //     setLoadedQuestions(data);
  //   } catch (error) {}
  // };

  const handleStartedTimeChange = (event) => {
    setStartedTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSelectUserChange = (event) => {
    const userId = event.target.id;
    const isChecked = event.target.checked;

    setSelectedUsersOption((prevOptions) => {
      if (isChecked && !prevOptions.includes(userId)) {
        return [...prevOptions, userId];
      } else if (!isChecked && prevOptions.includes(userId)) {
        return prevOptions.filter((option) => option !== userId);
      }
      return prevOptions;
    });
  };

  const handleExamDefinitionChange = async (event) => {
    const selectedExamId = parseInt(event.target.value);
    setSelectedExamDefinition(selectedExamId);

    selectedExam = loadedExams.find((exam) => {
      return exam.examdefinition_id === selectedExamId;
    });

    if (selectedExam) {
      const questionsIds = selectedExam.questions_ids;

      const answers = [];
      const questionData = [];
      for (const questionId of questionsIds) {
        try {
          const response = await fetchSingleQuestion(questionId);
          questionData.push({
            answerTime: "",
            questionId: response._id,
            displayTime: response.expectedTime,
            selectedAnswerID: [],
          });
        } catch (error) {}
        try {
          const response = await fetchAnswers(questionId);
          if (response && response.answers) {
            answers.push({
              questionId: questionId,
              answersId: response._id,
            });
          } else {
            console.error(`Invalid response for question ${questionId}`);
          }
        } catch (error) {
          console.error(
            `Failed to fetch answers for question ${questionId}:`,
            error
          );
        }
      }
      setLoadedQuestions(questionData);
      setLoadedAnswers(answers);
    } else {
      console.log("Selected exam not found");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedUsersOption.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    if (new Date(endtime) <= new Date(startedTime)) {
      alert("End Time should be greater than Start Time...");
      return;
    }
    if (!selectedExamDefinition) {
      alert("Please select an exam definition.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found in local storage.");
      return;
    }
    const baseURL = "http://localhost:3001/exams/student/";
    localStorage.getItem("token");
    const url = `${baseURL}${selectedExamDefinition}`;

    try {
      for (const userOption of selectedUsersOption) {
        const result = await addExamInstance(
          selectedExamDefinition,
          startedTime,
          endtime,
          userOption,
          userId,
          status,
          loadedQuestions,
          url,
          localStorage.getItem("token")
        );
        if (result === "Exam already assigned to this user") {
          alert(result);
        } else {
          alert("Exam Instances added successfully");
        }
      }

      setStartedTime("");
      setEndTime("");
      setSelectedExamDefinition("");
      setSelectedUsersOption("");
      setLoadedAnswers([]);
    } catch (error) {
      console.error("Failed to add exam:", error);
    }
  };
  return (
    <Card className="add-exam-instance-card">
      <form onSubmit={handleSubmit} className="add-exam-instance-form">
        <h1 className="authentication-form">Create Exam Instance</h1>
        <div className="form-group">
          <h3>Taken By</h3>
          {loadedNewUsers.map((user) => (
            <div key={`user_${user.id}`} className="user-item">
              <Input
                element="checkbox"
                id={user.id}
                type="checkbox"
                value={user.id}
                label={user.username}
                onChange={handleSelectUserChange}
                checked={selectedUsersOption.includes(user.id)}
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <h3>Add Exam Definition</h3>
          {loadedExams.map((examdefinition) => (
            <div className="user-item" key={examdefinition.examdefinition_id}>
              <Input
                element="radio"
                id={examdefinition.examdefinition_id}
                type="radio"
                value={examdefinition.examdefinition_id}
                onChange={handleExamDefinitionChange}
                label={examdefinition.examdefinition_name}
                checked={
                  selectedExamDefinition === examdefinition.examdefinition_id
                }
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <Input
            element="datetime-local"
            type="datetime-local"
            name="startedTime"
            id="startedTime"
            label="Started Time"
            onChange={handleStartedTimeChange}
            value={startedTime}
            required
          />
        </div>
        <div className="form-group">
          <Input
            element="datetime-local"
            type="datetime-local"
            name="endtime"
            id="endtime"
            label="End Time"
            onChange={handleEndTimeChange}
            value={endtime}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </Card>
  );
};
export default AddExamInstanceForm;
