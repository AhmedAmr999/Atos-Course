import React, { useState, useEffect } from "react";
import QuestionList from "../Components/QuestionList";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import ComboBox from "../../Shared/Components/ComboBox";

const Questions = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedQuestions, setLoadedQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const questionsPerPage = 3; // Number of questions to display per page
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const responseData = await fetch(`http://localhost:3000/questions`);
        const jsonData = await responseData.json();
        console.log(jsonData.questions);
        setLoadedQuestions(jsonData.questions);
      } catch (err) {}
    };
    fetchQuestions();
  }, []);

  const currentQuestions = loadedQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const filteredOptions = selectedOption
    ? currentQuestions.filter((item) => item.category === selectedOption)
    : currentQuestions;
  return (
    <div>
      <React.Fragment>
        {currentQuestions.length !== 0 && (
          <ComboBox options={currentQuestions} onChange={handleSelectChange} />
        )}
        <QuestionList questions={filteredOptions} />

        <ReactPaginate
          pageCount={Math.ceil(filteredOptions.length / questionsPerPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
          previousLabel="Previous"
          nextLabel="Next"
        />
      </React.Fragment>
    </div>
  );
};

export default Questions;
