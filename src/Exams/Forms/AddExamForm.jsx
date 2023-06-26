import React, { useState, useEffect } from "react";
import { addExam } from "../../Shared/APIS/ExamsDefinitionAPI";
import { getAllQuestions } from "../../Shared/APIS/QuestionsAPI";
import Input from "../../Shared/Components/Input";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./addExamForm.css";

const AddExamPage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const history = useHistory();
  const [examInfo, setExamInfo] = useState({
    passing_score: "",
    examdefinition_name: "",
  });

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setLoadedQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleOptionChange = (e) => {
    const optionId = e.target.value;
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(optionId)) {
        return prevSelectedOptions.filter((id) => id !== optionId);
      } else {
        return [...prevSelectedOptions, optionId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamInfo((prevExamInfo) => ({
      ...prevExamInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOptions.length < 2) {
      alert("Please choose at least two questions");
      return;
    }
    const formData = {
      passing_score: examInfo.passing_score,
      examdefinition_name: examInfo.examdefinition_name,
    };
    try {
      const response = await addExam(formData, selectedOptions);
      history.push("/exams/assignExam");
    } catch (error) {
      console.error("Failed to add exam:", error);
    }
  };

  return (
    <div className="add-exam-container">
      <form className="add-exam-form" onSubmit={handleSubmit}>
        <h2>Please Add Exam</h2>
        <Input
          type="number"
          element="number"
          label="Add Passing Score"
          placeholder="Add Passing Score"
          name="passing_score"
          value={examInfo.passing_score}
          onChange={handleInputChange}
          required
          min="0"
          max="100"
        />
        <Input
          type="text"
          element="text"
          label="Add examDefinition Name"
          placeholder="Add examDefinition Name"
          name="examdefinition_name"
          value={examInfo.examdefinition_name}
          onChange={handleInputChange}
          required
          minLength={5}
        />

        <h3>Choose Questions</h3>
        {loadedQuestions.length > 0 &&
          loadedQuestions.map((question, index) => (
            <React.Fragment key={`question_${index}`}>
              <ol key={`question_${index}`}>
                <Input
                  element="checkbox"
                  id={index}
                  label={question.questionName}
                  type="checkbox"
                  value={question._id}
                  onChange={handleOptionChange}
                  checked={selectedOptions.includes(question._id)}
                />
              </ol>
            </React.Fragment>
          ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddExamPage;
