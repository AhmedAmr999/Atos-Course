import React, { useEffect, useState } from "react";
import {
  fetchSingleQuestion,
  fetchAnswers,
} from "../../Shared/APIS/QuestionsAPI";
import { getUserExamInstances } from "../../Shared/APIS/ExamsInstanceAPI";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Card from "../../Shared/Components/Card";
import "./StudentExam.css";
const StudentExam = () => {
  const [examInstances, setExamInstances] = useState([]);
  const [examDefinitionName, setExamDefinitionName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalExamMark, setTotalExamMark] = useState(0);
  const [totalStudentMark, setTotalStudentMark] = useState(0);
  const [studentMarks, setStudentMarks] = useState([]);
  const [examPercentage, setExamPercentage] = useState(0);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [passingScore, setPassingScore] = useState(0);
  const [finishedExam, setFinishedExam] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [handleSubmitButton, setHandleSubmitButton] = useState(false);
  const [takeExam, setTakeExam] = useState(false);
  const [updatedQuestions, setUpdatedQuestions] = useState([]);

  const [examTimeIsUp, setExamTimeIsUp] = useState(false);
  const [endTime, setEndTime] = useState();

  const userId = localStorage.getItem("userId");
  const { examdefinition_id } = useParams();
  const [examInsatnceId, setExamInsatnceId] = useState("");
  const [showTakeExamButton, setShowTakeExamButton] = useState(false);
  const [isPass, setIsPass] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getUserExamInstances(userId, examdefinition_id);
      setExamInstances(data.examInsatnceId[0].questions);
      setExamDefinitionName(data.examDefinitionName);
      setExamInsatnceId(data.examInsatnceId[0].examinstance_id);
      setPassingScore(data.passing_score);
      setShowTakeExamButton(
        checkStartedTime(data.examInsatnceId[0].startedtime)
      );
      setEndTime(data.examInsatnceId[0].endtime);
    } catch (error) {
      console.error("Failed to fetch exam instances:", error.message);
    }
  };

  const checkStartedTime = (startedTime) => {
    const startedTimeObj = new Date(startedTime);
    const currentDate = new Date();
    startedTimeObj.setSeconds(0, 0);
    currentDate.setSeconds(0, 0);

    const startedHours = startedTimeObj.getHours();
    const startedMinutes = startedTimeObj.getMinutes();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    return startedHours === currentHours && startedMinutes === currentMinutes;
  };

  const convertDisplayTimeToSeconds = (displayTime) => {
    if (displayTime.endsWith("min")) {
      const minutes = parseInt(displayTime);
      if (!isNaN(minutes)) {
        return minutes * 60;
      }
    } else if (displayTime.endsWith("sec")) {
      const seconds = parseInt(displayTime);
      if (!isNaN(seconds)) {
        return seconds;
      }
    }

    console.error("Invalid displayTime format:", displayTime);
    return 0;
  };

  const handleNext = async () => {
    const currentQuestion = currentQuestions[currentPage];
    const selectedOption = selectedOptions.sort().join("");
    const correctAnswer = currentQuestion.correctAnswers.sort().join("");

    const isCorrect = selectedOption === correctAnswer;

    const updatedStudentMarks = studentMarks.map((mark, index) => {
      if (index === currentPage) {
        return isCorrect ? currentQuestion.questionMark : mark;
      }
      return mark;
    });

    const totalStudentMark = updatedStudentMarks.reduce(
      (total, mark) => total + mark,
      0
    );

    setSelectedOptions([]);
    setStudentMarks(updatedStudentMarks);
    setTotalStudentMark(totalStudentMark);

    if (currentPage === currentQuestions.length - 1) {
      setFinishedExam(true);
      setShowSubmitButton(true);
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
      setSelectedOptions([]);
      setTimeIsUp(false);
      setOptionsDisabled(false);
    }

    const selectedAnswerID = selectedOptions.length > 0 ? selectedOptions : [];

    const displayTimeInSeconds = convertDisplayTimeToSeconds(
      currentQuestion.displayTime
    );
    const remainingTime = displayTimeInSeconds - countdown;

    let remainingTimeString = "";
    if (remainingTime >= 60) {
      const minutes = Math.floor(remainingTime / 60);
      remainingTimeString = `${minutes}min`;
    } else {
      remainingTimeString = `${remainingTime}sec`;
    }

    const updatedQuestion = {
      ...currentQuestion,
      answerTime: remainingTimeString,
      selectedAnswerID: selectedAnswerID,
    };

    const updatedQuestionsCopy = [...updatedQuestions];
    updatedQuestionsCopy[currentPage] = updatedQuestion;
    setUpdatedQuestions(updatedQuestionsCopy);
  };

  const handleSubmit = async () => {
    const percentage = Math.floor((totalStudentMark / totalExamMark) * 100);
    setHandleSubmitButton(true);
    setExamPercentage(percentage);
    const questionArray = Array.isArray(currentQuestions)
      ? currentQuestions
      : [];

    const updateExamInstance = async (status, studentGrade, completiontime) => {
      try {
        const response = await fetch(
          `http://localhost:3122/exams/examIntsance/${userId}/updateExamInstance/${examInsatnceId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status,
              questions: updatedQuestions,
              studentscore: parseInt(examPercentage),
              studentgrade: studentGrade,
              completiontime,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to update exam instance:", response.status);
        }
      } catch (error) {
        console.error("Failed to update exam instance:", error);
      }
    };

    if (parseInt(examPercentage) >= passingScore) {
      setFinishedExam(true);
      alert("You Passed the Exam Successfully");
      const currentTime = new Date();
      const currentTimeString = currentTime.toISOString();

      console.log(currentTimeString); // Output: 2023-06-22T12:25:00.000Z
      await updateExamInstance("taken", "Pass", currentTimeString);
      setIsPass("You Passed Successfully...");
    } else {
      setFinishedExam(true);
      alert("You Failed The Exam");
      const currentTime = new Date();
      const currentTimeString = currentTime.toISOString();

      console.log(currentTimeString); // Output: 2023-06-22T12:25:00.000Z
      await updateExamInstance("taken", "Fail", currentTimeString);
      setIsPass("You Failed Better Luck In Next Exam...");
    }
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:3456/notifications/getUser/${userId}/examInstance/${examInsatnceId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch notifications:", response.status);
        } else {
          const data = await response.json();
          console.log("Fetched notifications:", data);
          // Process the fetched notifications as needed
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    await fetchNotifications();
  };

  useEffect(() => {
    let totalMark = 0;

    const fetchQuestions = async () => {
      const questions = await Promise.all(
        examInstances.map(async (question) => {
          const fetchedQuestion = await fetchSingleQuestion(
            question.questionId
          );
          const answers = await fetchAnswers(question.questionId);
          totalMark += fetchedQuestion.mark;

          return {
            ...question,
            questionName: fetchedQuestion.questionName,
            questionMark: fetchedQuestion.mark,
            answers: answers.answers,
            correctAnswers: answers.correctAnswers,
            displayTime: fetchedQuestion.expectedTime,
          };
        })
      );
      setCurrentQuestions(questions);
      setTotalExamMark(totalMark);
      setStudentMarks(new Array(questions.length).fill(0));
    };

    if (examInstances.length > 0) {
      fetchQuestions();
    }
  }, [examInstances]);

  useEffect(() => {
    const storedCountdown = localStorage.getItem("countdown");

    if (currentQuestions.length > 0) {
      const startCountdown = () => {
        if (currentQuestions.length === 0) {
          console.error("No questions found");
          return;
        }

        const currentQuestion = currentQuestions[currentPage];
        if (!currentQuestion) {
          console.error("Current question not found");
          return;
        }

        const displayTime = currentQuestion.displayTime;
        if (!displayTime) {
          console.error("Display time not defined for current question");
          return;
        }

        if (displayTime.endsWith("min")) {
          const minutes = parseInt(displayTime);
          if (!isNaN(minutes)) {
            let countdownInSeconds = minutes * 60;

            if (storedCountdown && currentPage === 0) {
              countdownInSeconds = parseInt(storedCountdown);
              localStorage.removeItem("countdown");
            }

            setCountdown(countdownInSeconds);

            const interval = setInterval(() => {
              countdownInSeconds--;
              setCountdown(countdownInSeconds);
              localStorage.setItem("countdown", countdownInSeconds);

              if (countdownInSeconds === 0) {
                clearInterval(interval);
                setTimeIsUp(true);
              }
            }, 1000);

            return () => {
              clearInterval(interval);
              setCountdown(0);
            };
          } else {
            console.error("Invalid minutes value in displayTime:", displayTime);
          }
        } else if (displayTime.endsWith("sec")) {
          const seconds = parseInt(displayTime);
          if (!isNaN(seconds)) {
            let countdownInSeconds = seconds;

            if (storedCountdown && currentPage === 0) {
              countdownInSeconds = parseInt(storedCountdown);
              localStorage.removeItem("countdown");
            }

            setCountdown(countdownInSeconds);

            const interval = setInterval(() => {
              countdownInSeconds--;
              setCountdown(countdownInSeconds);
              localStorage.setItem("countdown", countdownInSeconds);

              if (countdownInSeconds === 0) {
                clearInterval(interval);
                setTimeIsUp(true);
              }
            }, 1000);

            return () => {
              clearInterval(interval);
              setCountdown(0);
            };
          } else {
            console.error("Invalid seconds value in displayTime:", displayTime);
          }
        } else {
          console.error("Invalid displayTime format:", displayTime);
        }
      };

      return startCountdown();
    }
  }, [currentQuestions, currentPage]);

  useEffect(() => {
    const percentage = (totalStudentMark / totalExamMark) * 100;
    setExamPercentage(percentage);
  }, [totalStudentMark, totalExamMark]);

  const currentQuestion = currentQuestions[currentPage];

  const handleOptionChange = (e, answer, question) => {
    if (timeIsUp || optionsDisabled) {
      return;
    }

    const value = e.target.value;
    if (question.answers.length === 2) {
      setSelectedOptions([value]);
    } else {
      const selectedOptionsCopy = [...selectedOptions];
      const index = selectedOptionsCopy.indexOf(value);

      if (index === -1) {
        selectedOptionsCopy.push(value);
      } else {
        selectedOptionsCopy.splice(index, 1);
      }
      setSelectedOptions(selectedOptionsCopy);
    }
  };

  const handleTakeExam = async () => {
    setTakeExam(true);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentTimeString = currentTime.toISOString();
      if (currentTimeString >= endTime) {
        setFinishedExam(true);
        setShowSubmitButton(true);
        setExamTimeIsUp(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {!takeExam ? (
        showTakeExamButton ? (
          <>
            <Card className="container" style={{}}>
              <h2>Start {examDefinitionName}</h2>
              <button
                style={{ alignItems: "center", marginTop: "10rem" }}
                onClick={handleTakeExam}
              >
                Take Exam
              </button>
            </Card>
          </>
        ) : (
          <Card className="container">
            <h4 style={{ color: "red", alignItems: "center" }}>
              This is not the right time of the exam please Re-check the right
              time of the exam...
            </h4>
          </Card>
        )
      ) : (
        <>
          <div style={{ margin: "5rem" }}>
            {handleSubmitButton && (
              <>
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      Show Result {examPercentage}%
                    </div>
                    <div className="flip-card-back">
                      <h1>
                        Score {totalStudentMark}/{totalExamMark}
                      </h1>
                      <p>{isPass}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {!finishedExam && <p>Current Page: {currentPage + 1}</p>}

            {!finishedExam && (
              <>
                <p>student Mark :{totalStudentMark}</p>
                <p>
                  Countdown: {Math.floor(countdown / 60)}:{countdown % 60}
                </p>
                {timeIsUp && (
                  <p style={{ color: "red" }}>
                    Time is up! You cannot choose an answer for this question.
                  </p>
                )}
                {currentQuestion && (
                  <div>
                    <h3>{currentQuestion.questionName}</h3>
                    <ol>
                      {currentQuestion.answers.map((answer, index) => (
                        <li key={index}>
                          <input
                            type={
                              currentQuestion.answers.length === 2
                                ? "radio"
                                : "checkbox"
                            }
                            name={`question${index}`}
                            value={answer}
                            checked={selectedOptions.includes(answer)}
                            onChange={(e) =>
                              handleOptionChange(e, answer, currentQuestion)
                            }
                            disabled={timeIsUp}
                          />
                          <label>{answer}</label>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}

            {finishedExam ? (
              <>
                <p>You finished the exam.</p>
                {!handleSubmitButton && (
                  <button onClick={handleSubmit}>Submit Exam</button>
                )}{" "}
              </>
            ) : (
              <>
                <button
                  onClick={handleNext}
                  disabled={selectedOptions.length === 0 && !timeIsUp}
                  style={{ display: showSubmitButton ? "none" : "block" }}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentExam;
