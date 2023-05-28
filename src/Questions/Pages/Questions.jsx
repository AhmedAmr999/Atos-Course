import React, { useState, useEffect } from "react";
import QuestionList from "../Components/QuestionList";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import ComboBox from "../../Shared/Components/ComboBox";
import { getAllQuestions } from "../../Shared/APIS/QuestionsAPI";
import { getAllUsers } from "../../Shared/APIS/AuthenticationAPI";
import LoadingSpinner from "../../Shared/Components/LoadingSpinner";

const Questions = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUsersOption, setSelectedUsersOption] = useState("");
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const questionsPerPage = 3;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    getQuestions();
    getUsers();
  }, []);

  const getQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setLoadedQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const data = await getAllUsers();
      setLoadedUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSelectChange = (event) => {
    const selectedUsername = event.target.value;
    setSelectedOption(selectedUsername);
    setCurrentPage(0);
  };

  const allCategories = [
    ...new Set(loadedQuestions.map((item) => item.category)),
  ];

  const handleUserChange = (event) => {
    const selectedUsername = event.target.value;
    const selectedUser = loadedUsers.find(
      (user) => user.username === selectedUsername
    );
    if (selectedUser) {
      const filteredQuestions = loadedQuestions.filter(
        (question) => question.creatorId === selectedUser._id
      );
      setSelectedUsersOption(selectedUser._id);
      setLoadedQuestions(filteredQuestions);
    }
  };

  const filteredData = loadedQuestions.filter((item) => {
    const categoryMatch = !selectedOption || item.category === selectedOption;
    const userMatch =
      !selectedUsersOption ||
      (item.creatorId && item.creatorId === selectedUsersOption);
    return categoryMatch && userMatch;
  });

  const offset = currentPage * questionsPerPage;
  const currentQuestions = filteredData.slice(
    offset,
    offset + questionsPerPage
  );

  const filteredUsers = loadedUsers
    .filter((user) => user.userType === "TEACHER")
    .map((user) => user.username);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <React.Fragment>
        {loadedQuestions.length !== 0 &&
          localStorage.getItem("userType") !== "STUDENT" && (
            <ComboBox
              options={allCategories}
              selectedOption={selectedOption}
              onChange={handleSelectChange}
              comboBoxName="Select a category"
            />
          )}
        {loadedQuestions.length !== 0 &&
          localStorage.getItem("userType") !== "STUDENT" && (
            <ComboBox
              options={filteredUsers}
              selectedOption={selectedUsersOption}
              onChange={handleUserChange}
              comboBoxName="Select a teacher"
            />
          )}
        <QuestionList questions={currentQuestions} />
        {loadedQuestions.length !== 0 && (
          <ReactPaginate
            pageCount={Math.ceil(filteredData.length / questionsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="Previous"
            nextLabel="Next"
          />
        )}
      </React.Fragment>
    </div>
  );
};

export default Questions;
