import React, { useState } from "react";
import Card from "../../Shared/Components/Card";
import { addQuestion } from "../../Shared/APIS/QuestionsAPI";
import AddQuestionForm from "../Forms/AddQuestionForm";
import "../../Users/Pages/auth.css";

const AddQuestion = () => {


  return (
    <React.Fragment>
      <h1 className="authentication">Lets Torture The Students!!!!</h1>
      <Card className="addQuestionForm">
        <AddQuestionForm />
      </Card>
    </React.Fragment>
  );
};

export default AddQuestion;
